// noinspection DuplicatedCode

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import CodingFAQ from "@/components/sections/coding-page/CodingFAQ";
import {useMediaQuery} from "@/hooks/useMediaQuery";
import {unlockMilestone} from "@/lib/milestones/MilestoneService";
import {isMilestoneUnlocked} from "@/lib/milestones/MilestoneEvents";
import { MILESTONES } from "@/data/milestones";

// Mock all dependencies
jest.mock("@/styles/components/index.module.css", () => ({
    __esModule: true,
    default: {
        head_border: "head_border",
        head_border_center: "head_border_center",
    },
}), { virtual: true });

jest.mock('@/styles/util/colors.module.css', () => ({
    __esModule: true,
    default: {
        text_gradient_gray: "text_gradient_gray",
    },
}), { virtual: true });

jest.mock('@/styles/components/coding.module.css', () => ({
    __esModule: true,
    default: {
        feature_grid: "feature_grid",
    },
}), { virtual: true });

jest.mock('@/styles/util/buttons.module.css', () => ({
    __esModule: true,
    default: {
        white_gray: "white_gray",
    },
}), { virtual: true });

jest.mock('@/styles/util/animations.module.css', () => ({
    __esModule: true,
    default: {
        animate_click_slide: "animate-click-slide",
    },
}), { virtual: true });

jest.mock('react-icons/fa', () => ({
    FaDiscord: () => <div data-testid="fa-discord" />,
}));

jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));

jest.mock('next-intl', () => ({
    useTranslations: jest.fn((namespace: string) => {
        const translations: Record<string, any> = {
            WelcomeHero: { joinDiscord: 'Join Discord' },
            CodingFAQ: {
                infoTag: 'FAQ',
                title: 'Frequently Asked Questions',
                description: 'Find answers to common questions',
                'feature1.title': 'Feature 1',
                'feature1.description': 'Description 1',
                'feature2.title': 'Feature 2',
                'feature2.description': 'Description 1',
                'feature3.title': 'Feature 3',
                'feature3.description': 'Description 1',
                'feature4.title': 'Feature 4',
                'feature4.description': 'Description 1',
                'question1.title': 'Question 1',
                'question1.description': 'Answer 1',
                'question2.title': 'Question 2',
                'question2.description': 'Answer 2',
                'question3.title': 'Question 3',
                'question3.description': 'Answer 3',
                'question4.title': 'Question 4',
                'question4.description': 'Answer 4',
                'question5.title': 'Secret Question',
                'question5.description': 'Secret Answer',
            },
        };

        // 1. Create the base translation function
        const t = (key: string) => translations[namespace]?.[key] || key;

        // 2. Attach the .raw method to that function
        t.raw = (key: string) => translations[namespace]?.[key] || key;

        return t;
    }),
}));

jest.mock('@/lib/milestones/MilestoneEvents', () => ({
    isMilestoneUnlocked: jest.fn(),
}));

jest.mock('@/lib/milestones/MilestoneService', () => ({
    unlockMilestone: jest.fn(),
}));

jest.mock('@/hooks/useMediaQuery', () => ({
    useMediaQuery: jest.fn(),
}));

jest.mock('@/data/milestones', () => ({
    MILESTONES: {
        HEROBRINE: {
            id: 'herobrine-milestone',
            imageKey: 'herobrine-image',
        },
    },
}));

jest.mock('next/image', () => ({
    __esModule: true,
    default: ({fill, unoptimized, priority, src, alt, ...rest}: any) => {
        // eslint-disable-next-line @next/next/no-img-element
        return ( <img src={src} alt={alt || ""}{...rest} /> );
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

jest.mock('@/components/animations/TextReveal', () => ({
    __esModule: true,
    AnimatedTextReveal: ({ text, className }: any) => <div className={className}>{text}</div>,
}));

jest.mock('@/components/elements/grid/FeatureItem', () => ({
    __esModule: true,
    default: ({ iconSrc, title, description, altText, link }: any) => (
        <div data-testid="feature-item">
            <img src={iconSrc} alt={altText} />
            <h3>{title}</h3>
            <p>{description}</p>
            {link && <a href={link}>Link</a>}
        </div>
    ),
}));

jest.mock('@/components/elements/grid/FAQItem', () => ({
    __esModule: true,
    default: ({ index, isOpen, title, description, onToggle }: any) => (
        <div data-testid={`faq-item-${index}`} onClick={() => onToggle(index)}>
            <h3>{title}</h3>
            {isOpen && <p>{description}</p>}
        </div>
    ),
}));

jest.mock('@/components/elements/ButtonHover', () => ({
    __esModule: true,
    default: () => <div data-testid="button-hover" />,
}));

jest.mock('@/components/elements/ads/AdWrapper', () => ({
    __esModule: true,
    AdContainer: ({ children }: any) => <div data-testid="ad-container">{children}</div>,
}));

jest.mock('@/components/elements/ads/AdBanner', () => ({
    __esModule: true,
    default: ({ dataAdSlot, dataAdFormat }: any) => (
        <div data-testid="ad-banner" data-slot={dataAdSlot} data-format={dataAdFormat} />
    ),
}));

describe('CodingFAQ', () => {
    const mockRouter = {
        push: jest.fn(),
        replace: jest.fn(),
        pathname: '/',
        query: {},
        asPath: '/',
        locale: 'de',
    };

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        (useMediaQuery as jest.Mock).mockReturnValue(false);
        (isMilestoneUnlocked as jest.Mock).mockResolvedValue(false);
        (unlockMilestone as jest.Mock).mockResolvedValue(undefined);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render the component with all sections', () => {
        render(<CodingFAQ />);

        expect(screen.getByText(/Frequently Asked Questions/i)).toBeInTheDocument();
        expect(screen.getByText('Find answers to common questions')).toBeInTheDocument();
        expect(screen.getAllByTestId('feature-item')).toHaveLength(4);
        expect(screen.getByTestId('faq-item-0')).toBeInTheDocument();
        expect(screen.getByTestId('faq-item-1')).toBeInTheDocument();
        expect(screen.getByTestId('faq-item-2')).toBeInTheDocument();
        expect(screen.getByTestId('faq-item-3')).toBeInTheDocument();
    });

    it('should apply correct heading border class when is2XL is true', () => {
        (useMediaQuery as jest.Mock).mockReturnValue(true);
        const { container } = render(<CodingFAQ />);

        const heading = container.querySelector('h2');
        expect(heading?.className).toContain('head_border');
    });

    it('should apply correct heading border class when is2XL is false', () => {
        (useMediaQuery as jest.Mock).mockReturnValue(false);
        const { container } = render(<CodingFAQ />);

        const heading = container.querySelector('h2');
        expect(heading?.className).toContain('head_border_center');
    });

    it('should toggle FAQ item open and closed', () => {
        render(<CodingFAQ />);

        const faqItem = screen.getByTestId('faq-item-0');

        // Open FAQ
        fireEvent.click(faqItem);
        expect(screen.getByText('Answer 1')).toBeInTheDocument();

        // Close FAQ
        fireEvent.click(faqItem);
        expect(screen.queryByText('Answer 1')).not.toBeInTheDocument();
    });

    it('should close previously opened FAQ when opening a new one', () => {
        render(<CodingFAQ />);

        const faqItem0 = screen.getByTestId('faq-item-0');
        const faqItem1 = screen.getByTestId('faq-item-1');

        // Open first FAQ
        fireEvent.click(faqItem0);
        expect(screen.getByText('Answer 1')).toBeInTheDocument();

        // Open second FAQ
        fireEvent.click(faqItem1);
        expect(screen.queryByText('Answer 1')).not.toBeInTheDocument();
        expect(screen.getByText('Answer 2')).toBeInTheDocument();
    });

    it('should show secret FAQ when Shift key is pressed', () => {
        render(<CodingFAQ />);

        const secretFaq = screen.getByTestId('faq-item-999').parentElement!.parentElement;
        expect(secretFaq?.className).toContain('opacity-0');

        // Press Shift key
        fireEvent.keyDown(window, { key: 'Shift' });
        expect(secretFaq?.className).toContain('opacity-100');

        // Release Shift key
        fireEvent.keyUp(window, { key: 'Shift' });
        expect(secretFaq?.className).toContain('opacity-0');
    });

    it('should not update state when Shift is pressed but isShiftPressed is already true', () => {
        render(<CodingFAQ />);

        // Press Shift first time
        fireEvent.keyDown(window, { key: 'Shift' });

        // Press Shift again (should not trigger state update)
        fireEvent.keyDown(window, { key: 'Shift' });

        const secretFaq = screen.getByTestId('faq-item-999').parentElement!.parentElement;
        expect(secretFaq?.className).toContain('opacity-100');
    });

    it('should keep secret FAQ visible after unlocking', async () => {
        render(<CodingFAQ />);

        const secretFaqItem = screen.getByTestId('faq-item-999');

        // Click secret FAQ to unlock
        fireEvent.click(secretFaqItem);

        await waitFor(() => {
            const secretFaq = secretFaqItem.parentElement!.parentElement;
            expect(secretFaq?.className).toContain('opacity-100');
        });
    });

    it('should unlock milestone when secret FAQ is opened and not already unlocked', async () => {
        (isMilestoneUnlocked as jest.Mock).mockResolvedValue(false);
        render(<CodingFAQ />);

        const secretFaqItem = screen.getByTestId('faq-item-999');
        fireEvent.click(secretFaqItem);

        await waitFor(() => {
            expect(isMilestoneUnlocked).toHaveBeenCalledWith(MILESTONES.HEROBRINE.id);
            expect(unlockMilestone).toHaveBeenCalledWith(
                MILESTONES.HEROBRINE.id,
                MILESTONES.HEROBRINE.imageKey,
                'de'
            );
        });
    });

    it('should not unlock milestone when secret FAQ is opened and already unlocked', async () => {
        (isMilestoneUnlocked as jest.Mock).mockResolvedValue(true);
        render(<CodingFAQ />);

        const secretFaqItem = screen.getByTestId('faq-item-999');
        fireEvent.click(secretFaqItem);

        await waitFor(() => {
            expect(isMilestoneUnlocked).toHaveBeenCalledWith(MILESTONES.HEROBRINE.id);
            expect(unlockMilestone).not.toHaveBeenCalled();
        });
    });

    it('should use "de" locale when router locale is "de"', async () => {
        mockRouter.locale = 'de';
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        (isMilestoneUnlocked as jest.Mock).mockResolvedValue(false);

        render(<CodingFAQ />);

        const secretFaqItem = screen.getByTestId('faq-item-999');
        fireEvent.click(secretFaqItem);

        await waitFor(() => {
            expect(unlockMilestone).toHaveBeenCalledWith(
                MILESTONES.HEROBRINE.id,
                MILESTONES.HEROBRINE.imageKey,
                'de'
            );
        });
    });

    it('should use "en" locale when router locale is "en"', async () => {
        mockRouter.locale = 'en';
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        (isMilestoneUnlocked as jest.Mock).mockResolvedValue(false);

        render(<CodingFAQ />);

        const secretFaqItem = screen.getByTestId('faq-item-999');
        fireEvent.click(secretFaqItem);

        await waitFor(() => {
            expect(unlockMilestone).toHaveBeenCalledWith(
                MILESTONES.HEROBRINE.id,
                MILESTONES.HEROBRINE.imageKey,
                'en'
            );
        });
    });

    it('should fallback to "de" locale when router locale is neither "de" nor "en"', async () => {
        mockRouter.locale = 'fr';
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        (isMilestoneUnlocked as jest.Mock).mockResolvedValue(false);

        render(<CodingFAQ />);

        const secretFaqItem = screen.getByTestId('faq-item-999');
        fireEvent.click(secretFaqItem);

        await waitFor(() => {
            expect(unlockMilestone).toHaveBeenCalledWith(
                MILESTONES.HEROBRINE.id,
                MILESTONES.HEROBRINE.imageKey,
                'de'
            );
        });
    });

    it('should cleanup keyboard event listeners on unmount', () => {
        const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
        const { unmount } = render(<CodingFAQ />);

        unmount();

        expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
        expect(removeEventListenerSpy).toHaveBeenCalledWith('keyup', expect.any(Function));

        removeEventListenerSpy.mockRestore();
    });

    it('should ignore non-Shift key presses', () => {
        render(<CodingFAQ />);

        const secretFaq = screen.getByTestId('faq-item-999').parentElement!.parentElement ;

        // Press other key
        fireEvent.keyDown(window, { key: 'A' });
        expect(secretFaq?.className).toContain('opacity-0');

        fireEvent.keyUp(window, { key: 'A' });
        expect(secretFaq?.className).toContain('opacity-0');
    });
});