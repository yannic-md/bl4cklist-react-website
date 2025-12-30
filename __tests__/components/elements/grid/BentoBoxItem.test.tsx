import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import BentoBoxItem from "@/components/elements/grid/BentoBoxItem";
import {isMilestoneUnlocked} from "@/lib/milestones/MilestoneEvents";
import {unlockMilestone} from "@/lib/milestones/MilestoneService";

// Mock Setup
jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));

jest.mock('next/image', () => ({
    __esModule: true,
    default: ({fill, unoptimized, priority, src, alt, ...rest}: any) => {
        // eslint-disable-next-line @next/next/no-img-element
        return ( <img src={src} alt={alt || ""}{...rest} /> );
    },
}));

jest.mock('@/lib/milestones/MilestoneEvents', () => ({
    isMilestoneUnlocked: jest.fn(),
}));

jest.mock('@/lib/milestones/MilestoneService', () => ({
    unlockMilestone: jest.fn(),
}));

jest.mock('@/data/milestones', () => ({
    MILESTONES: {
        WHATBUG: {
            id: 'whatbug-id',
            imageKey: 'whatbug-image',
        },
    },
}));

jest.mock('@/components/animations/AnimateOnView', () => {
    const MockAnimate = ({ children, className }: any) => (
        <div data-testid="animate-on-view" className={className}>
            {children}
        </div>
    );
    return {__esModule: true, AnimateOnView: MockAnimate};
});

jest.mock('@/styles/animations.module.css', () => ({
    animate_little_shake: 'animate-little-shake',
    animate_squash: 'animate-squash',
}));

describe('BentoBoxItem', () => {
    const mockRouter = {
        push: jest.fn(),
        replace: jest.fn(),
        pathname: '/',
        query: {},
        asPath: '/',
        locale: 'de',
    };

    const defaultProps = {
        animation: 'fade',
        backgroundImage: '/bg.jpg',
        showcaseImage: '/showcase.jpg',
        showcaseAlt: 'Showcase Alt Text',
        showcaseTitle: 'Showcase Title',
        title: 'Test Title',
        description: 'Test Description',
    };

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        jest.clearAllMocks();
        jest.spyOn(Math, 'random').mockReturnValue(0.5);
    });

    it('should render with default props', () => {
        render(<BentoBoxItem {...defaultProps} />);

        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
        expect(screen.getByTitle('Showcase Title')).toBeInTheDocument();
    });

    it('should apply custom maxWidth and minHeight', () => {
        const { container } = render(
            <BentoBoxItem {...defaultProps} maxWidth="w-1/2" minHeight="min-h-[500px]" />
        );

        const wrapper = container.firstChild;
        expect(wrapper).toHaveClass('w-1/2');
        expect(wrapper).toHaveClass('min-h-[500px]');
    });

    it('should apply custom showcaseWidth and showcaseHeight', () => {
        render(<BentoBoxItem {...defaultProps} showcaseWidth={800} showcaseHeight={400} />);

        const showcaseImage = screen.getByTitle('Showcase Title');
        expect(showcaseImage).toHaveAttribute('width', '800');
        expect(showcaseImage).toHaveAttribute('height', '400');
    });

    it('should apply left hover rotation when hoverRotation is "left"', () => {
        const { container } = render(<BentoBoxItem {...defaultProps} hoverRotation="left" />);

        const showcaseWrapper = container.querySelector('.hover\\:-rotate-1');
        expect(showcaseWrapper).toBeInTheDocument();
    });

    it('should apply right hover rotation when hoverRotation is "right"', () => {
        const { container } = render(<BentoBoxItem {...defaultProps} hoverRotation="right" />);

        const showcaseWrapper = container.querySelector('.hover\\:rotate-1');
        expect(showcaseWrapper).toBeInTheDocument();
    });

    it('should apply custom showcaseMaxWidth', () => {
        const { container } = render(
            <BentoBoxItem {...defaultProps} showcaseMaxWidth="max-w-[600px]" />
        );

        const showcaseWrapper = container.querySelector('.max-w-\\[600px\\]');
        expect(showcaseWrapper).toBeInTheDocument();
    });

    it('should not render bug when hasBug is false', () => {
        render(<BentoBoxItem {...defaultProps} hasBug={false} />);

        const bugButton = screen.queryByLabelText('Bug - click to squash!');
        expect(bugButton).not.toBeInTheDocument();
    });

    describe('Bug Feature', () => {
        it('should render bug when hasBug is true', () => {
            render(<BentoBoxItem {...defaultProps} hasBug={true} />);

            const bugButton = screen.getByLabelText('Bug - click to squash!');
            expect(bugButton).toBeInTheDocument();
            expect(bugButton).toHaveTextContent('🐞');
        });

        it('should position bug at top-left corner', () => {
            jest.spyOn(Math, 'random').mockReturnValue(0);
            render(<BentoBoxItem {...defaultProps} hasBug={true} />);

            const bugButton = screen.getByLabelText('Bug - click to squash!');
            expect(bugButton).toHaveStyle({ top: '-16px', left: '-10px', rotate: '-45deg' });
        });

        it('should position bug at top-right corner', () => {
            jest.spyOn(Math, 'random').mockReturnValue(0.125);
            render(<BentoBoxItem {...defaultProps} hasBug={true} />);

            const bugButton = screen.getByLabelText('Bug - click to squash!');
            expect(bugButton).toHaveStyle({ top: '-10px', right: '-8px', rotate: '-135deg' });
        });

        it('should position bug at bottom-left corner', () => {
            jest.spyOn(Math, 'random').mockReturnValue(0.25);
            render(<BentoBoxItem {...defaultProps} hasBug={true} />);

            const bugButton = screen.getByLabelText('Bug - click to squash!');
            expect(bugButton).toHaveStyle({ bottom: '-8px', left: '-8px', rotate: '45deg' });
        });

        it('should position bug at bottom-right corner', () => {
            jest.spyOn(Math, 'random').mockReturnValue(0.375);
            render(<BentoBoxItem {...defaultProps} hasBug={true} />);

            const bugButton = screen.getByLabelText('Bug - click to squash!');
            expect(bugButton).toHaveStyle({ bottom: '-8px', right: '-8px', rotate: '-30deg' });
        });

        it('should position bug at top edge', () => {
            jest.spyOn(Math, 'random').mockReturnValue(0.5);
            render(<BentoBoxItem {...defaultProps} hasBug={true} />);

            const bugButton = screen.getByLabelText('Bug - click to squash!');
            expect(bugButton).toHaveStyle({ top: '-14px', left: '43%', rotate: '180deg' });
        });

        it('should position bug at right edge', () => {
            jest.spyOn(Math, 'random').mockReturnValue(0.625);
            render(<BentoBoxItem {...defaultProps} hasBug={true} />);

            const bugButton = screen.getByLabelText('Bug - click to squash!');
            expect(bugButton).toHaveStyle({ right: '-12px', top: '54%', rotate: '-90deg' });
        });

        it('should position bug at bottom edge', () => {
            jest.spyOn(Math, 'random').mockReturnValue(0.75);
            render(<BentoBoxItem {...defaultProps} hasBug={true} />);

            const bugButton = screen.getByLabelText('Bug - click to squash!');
            expect(bugButton).toHaveStyle({ bottom: '-12px', left: '59%', rotate: '45deg' });
        });

        it('should position bug at left edge', () => {
            jest.spyOn(Math, 'random').mockReturnValue(0.875);
            render(<BentoBoxItem {...defaultProps} hasBug={true} />);

            const bugButton = screen.getByLabelText('Bug - click to squash!');
            expect(bugButton).toHaveStyle({ left: '-12px', top: '47%', rotate: '100deg' });
        });

        it('should handle bug click and squash animation when milestone is already unlocked', async () => {
            (isMilestoneUnlocked as jest.Mock).mockResolvedValue(true);

            render(<BentoBoxItem {...defaultProps} hasBug={true} />);

            const bugButton = screen.getByLabelText('Bug - click to squash!');
            expect(bugButton).toHaveClass('animate-little-shake');

            fireEvent.click(bugButton);

            await waitFor(() => {
                expect(bugButton).toHaveClass('animate-squash');
                expect(bugButton).toHaveClass('pointer-events-none');
            });

            expect(isMilestoneUnlocked).toHaveBeenCalledWith('whatbug-id');
            expect(unlockMilestone).not.toHaveBeenCalled();
        });

        it('should unlock milestone when bug is clicked and milestone not yet unlocked - locale de', async () => {
            (isMilestoneUnlocked as jest.Mock).mockResolvedValue(false);
            (unlockMilestone as jest.Mock).mockResolvedValue(undefined);
            mockRouter.locale = 'de';

            render(<BentoBoxItem {...defaultProps} hasBug={true} />);

            const bugButton = screen.getByLabelText('Bug - click to squash!');
            fireEvent.click(bugButton);

            await waitFor(() => {
                expect(unlockMilestone).toHaveBeenCalledWith('whatbug-id', 'whatbug-image', 'de');
            });
        });

        it('should unlock milestone with locale en when router locale is en', async () => {
            (isMilestoneUnlocked as jest.Mock).mockResolvedValue(false);
            (unlockMilestone as jest.Mock).mockResolvedValue(undefined);
            mockRouter.locale = 'en';
            (useRouter as jest.Mock).mockReturnValue(mockRouter);

            render(<BentoBoxItem {...defaultProps} hasBug={true} />);

            const bugButton = screen.getByLabelText('Bug - click to squash!');
            fireEvent.click(bugButton);

            await waitFor(() => {
                expect(unlockMilestone).toHaveBeenCalledWith('whatbug-id', 'whatbug-image', 'en');
            });
        });

        it('should default to "de" locale when router locale is neither de nor en', async () => {
            (isMilestoneUnlocked as jest.Mock).mockResolvedValue(false);
            (unlockMilestone as jest.Mock).mockResolvedValue(undefined);
            mockRouter.locale = 'fr';
            (useRouter as jest.Mock).mockReturnValue(mockRouter);

            render(<BentoBoxItem {...defaultProps} hasBug={true} />);

            const bugButton = screen.getByLabelText('Bug - click to squash!');
            fireEvent.click(bugButton);

            await waitFor(() => {
                expect(unlockMilestone).toHaveBeenCalledWith('whatbug-id', 'whatbug-image', 'de');
            });
        });
    });
});