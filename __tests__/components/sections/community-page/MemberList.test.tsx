import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import {isMilestoneUnlocked} from "@/lib/milestones/MilestoneEvents";
import {unlockMilestone} from "@/lib/milestones/MilestoneService";
import MemberList from "@/components/sections/community-page/MemberList";
import {Member} from "@/types/Member";

// Mock Next.js dependencies
jest.mock('next/image', () => ({
    __esModule: true,
    default: ({fill, unoptimized, priority, src, alt, ...rest}: any) => {
        // eslint-disable-next-line @next/next/no-img-element
        return ( <img src={src} alt={alt || ""}{...rest} /> );
    },
}));

jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));

jest.mock('next-intl', () => ({
    useTranslations: jest.fn(),
}));

jest.mock('@/lib/milestones/MilestoneEvents', () => ({
    isMilestoneUnlocked: jest.fn(),
}));

jest.mock('@/lib/milestones/MilestoneService', () => ({
    unlockMilestone: jest.fn(),
}));

jest.mock('@/data/milestones', () => ({
    MILESTONES: {
        OLDBOTS: {
            id: 'oldbots-milestone',
            imageKey: 'oldbots-image',
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

jest.mock('@/components/animations/TextReveal', () => ({
    __esModule: true,
    AnimatedTextReveal: ({ text, className }: any) => <div className={className}>{text}</div>,
}));

jest.mock('@/components/elements/grid/MemberCard', () => ({
    __esModule: true,
    MemberCard: ({ member, onRemove }: any) => (
        <div data-testid={`member-card-${member.user_id}`}>
            <span>{member.username}</span>
            <button onClick={onRemove} data-testid={`remove-${member.user_id}`}>Remove</button>
        </div>
    ),
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

describe('MemberList', () => {
    const mockMembers = [
        {user_id: '1', username: 'User One', avatar: 'avatar1.png'},
        {user_id: '2', username: 'User Two', avatar: 'avatar2.png'},
        {user_id: '3', username: 'User Three', avatar: 'avatar3.png'},
    ] as unknown as Member[];

    const mockTranslations: Record<string, string> = {
        infoTagBirthday: 'Birthday Tag',
        titleBirthday: 'Birthday Title',
        description1Birthday: 'Birthday description 1',
        description2Birthday: 'Birthday description 2',
        infoTagLeaders: 'Leaders Tag',
        titleLeaders: 'Leaders Title',
        description1Leaders: 'Leaders description 1',
        description2Leaders: 'Leaders description 2',
        infoTagLevels: 'Levels Tag',
        titleLevels: 'Levels Title',
        description1Levels: 'Levels description 1',
        description2Levels: 'Levels description 2',
        infoTagOldbots: 'Oldbots Tag',
        titleOldbots: 'Oldbots Title',
        description1Oldbots: 'Oldbots description 1',
        description2Oldbots: 'Oldbots description 2',
    };

    const mockRouter = {
        locale: 'de',
        pathname: '/',
        query: {},
        asPath: '/',
    };

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        (isMilestoneUnlocked as jest.Mock).mockResolvedValue(false);
        (unlockMilestone as jest.Mock).mockResolvedValue(undefined);

        (useTranslations as jest.Mock).mockImplementation(() => {
            return Object.assign(
                (key: string) => mockTranslations[key] || key,
                {
                    rich: (key: string, options: any) => {
                        const text = mockTranslations[key] || key;
                        if (options?.code) {
                            return <>{text}</>;
                        }
                        return text;
                    },
                }
            );
        });
    });

    it('should render the section with correct id', () => {
        render(<MemberList members={mockMembers} section_id="test-section" category="Birthday" />);

        const section = document.getElementById('test-section');
        expect(section).toHaveAttribute('id', 'test-section');
    });

    it('should render all member cards', () => {
        render(<MemberList members={mockMembers} section_id="test-section" category="Birthday" />);

        expect(screen.getByTestId('member-card-1')).toBeInTheDocument();
        expect(screen.getByTestId('member-card-2')).toBeInTheDocument();
        expect(screen.getByTestId('member-card-3')).toBeInTheDocument();
    });

    it('should render Birthday category with correct emoji and translations', () => {
        render(<MemberList members={mockMembers} section_id="test-section" category="Birthday" />);

        expect(screen.getByText('Birthday Tag')).toBeInTheDocument();
        expect(screen.getByText(/Birthday Title/)).toBeInTheDocument();
        expect(screen.getByText('🍰')).toBeInTheDocument();
    });

    it('should render Leaders category with correct emoji and translations', () => {
        render(<MemberList members={mockMembers} section_id="test-section" category="Leaders" />);

        expect(screen.getByText('Leaders Tag')).toBeInTheDocument();
        expect(screen.getByText(/Leaders Title/)).toBeInTheDocument();
        expect(screen.getByText('🔥')).toBeInTheDocument();
    });

    it('should render Levels category with correct emoji and translations', () => {
        render(<MemberList members={mockMembers} section_id="test-section" category="Levels" />);

        expect(screen.getByText('Levels Tag')).toBeInTheDocument();
        expect(screen.getByText(/Levels Title/)).toBeInTheDocument();
        expect(screen.getByText('🏆')).toBeInTheDocument();
    });

    it('should render Oldbots category with correct emoji and translations', () => {
        render(<MemberList members={mockMembers} section_id="test-section" category="Oldbots" />);

        expect(screen.getByText('Oldbots Tag')).toBeInTheDocument();
        expect(screen.getByText(/Oldbots Title/)).toBeInTheDocument();
        expect(screen.getByText('👴🏻')).toBeInTheDocument();
    });

    it('should render planet variant 1 decorations for right position', () => {
        render(<MemberList members={mockMembers} section_id="test-section" category="Birthday"
                           position="right" planetVariant={1} />);

        expect(screen.getByAltText(/Moon/)).toBeInTheDocument();
        expect(screen.getByAltText(/Earth/)).toBeInTheDocument();
    });

    it('should render planet variant 2 decorations for left position', () => {
        render(<MemberList members={mockMembers} section_id="test-section" category="Birthday"
                           position="left" planetVariant={2} />);

        expect(screen.getByAltText(/Uranus/)).toBeInTheDocument();
        expect(screen.getByAltText(/Jupiter/)).toBeInTheDocument();
    });

    it('should render planet variant 3 decorations', () => {
        render(<MemberList members={mockMembers} section_id="test-section" category="Birthday"
                           planetVariant={3} />);

        expect(screen.getByAltText(/Mars/)).toBeInTheDocument();
        expect(screen.getByAltText(/Neptune/)).toBeInTheDocument();
    });

    it('should render planet variant 4 decorations', () => {
        render(<MemberList members={mockMembers} section_id="test-section" category="Birthday"
                           planetVariant={4} />);

        expect(screen.getByAltText(/Venus/)).toBeInTheDocument();
        expect(screen.getByAltText(/Pluto/)).toBeInTheDocument();
    });

    it('should remove member when remove button is clicked', async () => {
        render(<MemberList members={mockMembers} section_id="test-section" category="Birthday" />);

        const removeButton = screen.getByTestId('remove-1');
        fireEvent.click(removeButton);

        await waitFor(() => {
            expect(screen.queryByTestId('member-card-1')).not.toBeInTheDocument();
        });

        expect(screen.getByTestId('member-card-2')).toBeInTheDocument();
        expect(screen.getByTestId('member-card-3')).toBeInTheDocument();
    });

    it('should unlock milestone when removing member and milestone not already unlocked', async () => {
        (isMilestoneUnlocked as jest.Mock).mockResolvedValue(false);

        render(<MemberList members={mockMembers} section_id="test-section" category="Birthday" />);

        const removeButton = screen.getByTestId('remove-1');
        fireEvent.click(removeButton);

        await waitFor(() => {
            expect(isMilestoneUnlocked).toHaveBeenCalledWith('oldbots-milestone');
        });

        await waitFor(() => {
            expect(unlockMilestone).toHaveBeenCalledWith('oldbots-milestone', 'oldbots-image', 'de');
        });
    });

    it('should not unlock milestone when already unlocked', async () => {
        (isMilestoneUnlocked as jest.Mock).mockResolvedValue(true);

        render(<MemberList members={mockMembers} section_id="test-section" category="Birthday" />);

        const removeButton = screen.getByTestId('remove-1');
        fireEvent.click(removeButton);

        await waitFor(() => {
            expect(isMilestoneUnlocked).toHaveBeenCalledWith('oldbots-milestone');
        });

        expect(unlockMilestone).not.toHaveBeenCalled();
    });

    it('should use "de" locale when unlocking milestone with "de" router locale', async () => {
        (isMilestoneUnlocked as jest.Mock).mockResolvedValue(false);
        (useRouter as jest.Mock).mockReturnValue({ ...mockRouter, locale: 'de' });

        render(<MemberList members={mockMembers} section_id="test-section" category="Birthday" />);

        const removeButton = screen.getByTestId('remove-1');
        fireEvent.click(removeButton);

        await waitFor(() => {
            expect(unlockMilestone).toHaveBeenCalledWith('oldbots-milestone', 'oldbots-image', 'de');
        });
    });

    it('should use "en" locale when unlocking milestone with "en" router locale', async () => {
        (isMilestoneUnlocked as jest.Mock).mockResolvedValue(false);
        (useRouter as jest.Mock).mockReturnValue({ ...mockRouter, locale: 'en' });

        render(<MemberList members={mockMembers} section_id="test-section" category="Birthday" />);

        const removeButton = screen.getByTestId('remove-1');
        fireEvent.click(removeButton);

        await waitFor(() => {
            expect(unlockMilestone).toHaveBeenCalledWith('oldbots-milestone', 'oldbots-image', 'en');
        });
    });

    it('should default to "de" locale when unlocking milestone with unsupported locale', async () => {
        (isMilestoneUnlocked as jest.Mock).mockResolvedValue(false);
        (useRouter as jest.Mock).mockReturnValue({ ...mockRouter, locale: 'fr' });

        render(<MemberList members={mockMembers} section_id="test-section" category="Birthday" />);

        const removeButton = screen.getByTestId('remove-1');
        fireEvent.click(removeButton);

        await waitFor(() => {
            expect(unlockMilestone).toHaveBeenCalledWith('oldbots-milestone', 'oldbots-image', 'de');
        });
    });

    it('should render AdContainer with AdBanner when section_id is "leaders"', () => {
        render(<MemberList members={mockMembers} section_id="leaders" category="Leaders" />);

        expect(screen.getByTestId('ad-container')).toBeInTheDocument();
        expect(screen.getByTestId('ad-banner')).toBeInTheDocument();
        expect(document.querySelector("[data-slot]")).toBeInTheDocument();
    });

    it('should not render AdContainer when section_id is not "leaders"', () => {
        render(<MemberList members={mockMembers} section_id="birthday" category="Birthday" />);

        expect(screen.queryByTestId('ad-container')).not.toBeInTheDocument();
        expect(screen.queryByTestId('ad-banner')).not.toBeInTheDocument();
    });

    it('should update visibleMembers when members prop changes', () => {
        const { rerender } = render(<MemberList members={mockMembers} section_id="test-section" category="Birthday" />);

        expect(screen.getByTestId('member-card-1')).toBeInTheDocument();
        expect(screen.getByTestId('member-card-2')).toBeInTheDocument();
        expect(screen.getByTestId('member-card-3')).toBeInTheDocument();

        const newMembers = [
            {user_id: '4', username: 'User Four', avatar: 'avatar4.png'},
        ] as unknown as Member[];

        rerender(<MemberList members={newMembers} section_id="test-section" category="Birthday" />);

        expect(screen.queryByTestId('member-card-1')).not.toBeInTheDocument();
        expect(screen.getByTestId('member-card-4')).toBeInTheDocument();
    });

    it('should handle empty members array', () => {
        render(<MemberList members={[]} section_id="test-section" category="Birthday" />);

        expect(screen.queryByTestId(/member-card-/)).not.toBeInTheDocument();
    });

    it('should handle odd number of members', () => {
        const oddMembers = [mockMembers[0], mockMembers[1], mockMembers[2]];
        render(<MemberList members={oddMembers} section_id="test-section" category="Birthday" />);

        expect(screen.getAllByTestId(/member-card-/).length).toBe(3);
    });

    it('should handle even number of members', () => {
        const evenMembers = [mockMembers[0], mockMembers[1]];
        render(<MemberList members={evenMembers} section_id="test-section" category="Birthday" />);

        expect(screen.getAllByTestId(/member-card-/).length).toBe(2);
    });
});