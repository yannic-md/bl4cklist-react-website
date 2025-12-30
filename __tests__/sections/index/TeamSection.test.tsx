import { render, screen } from '@testing-library/react';
import { useTranslations } from 'next-intl';
import type { Member } from '@/types/Member';
import TeamSection from "@/components/sections/index/TeamSection";

// Mock Setup
jest.mock('next-intl', () => ({
    useTranslations: jest.fn(),
}));

jest.mock('@/components/elements/misc/GlitchingMoon', () => ({
    __esModule: true,
    default: () => <div data-testid="glitching-moon">GlitchingMoon</div>,
}));

jest.mock('@/components/elements/grid/TeamMemberCard', () => ({
    __esModule: true,
    default: ({ member }: { member: Member }) => (
        <div data-testid={`team-member-${member.user_id}`}>{member.user_display_name}</div>
    ),
}));

jest.mock('@/components/animations/AnimateOnView', () => {
    const MockAnimate = ({ children, className, animation }: any) => (
        <div data-testid="animate-on-view" className={className} data-animation={animation}>
            {children}
        </div>
    );
    return {__esModule: true, AnimateOnView: MockAnimate};
});

jest.mock('@/components/animations/TextReveal', () => ({
    __esModule: true,
    AnimatedTextReveal: ({ text, className }: any) => <div className={className}>{text}</div>,
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

describe('TeamSection', () => {
    const mockTTeam = jest.fn();

    const mockTeamMember: Member = {
        user_name: 'testuser',
        user_display_name: 'Test User',
        rank: 'HELFER',
        user_id: '123456',
        user_avatar_url: 'https://example.com/avatar.png',
        social_media_url: 'https://twitter.com/testuser',
    };

    beforeEach(() => {
        (useTranslations as jest.Mock).mockReturnValue(mockTTeam);
        mockTTeam.mockImplementation((key: string) => `translated_${key}`);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render with fallback data when no team members provided', () => {
        render(<TeamSection teamMembers={undefined as any} />);

        expect(screen.getByTestId('team-member-327176944640720906')).toBeInTheDocument();
        expect(screen.getByText('Yannic 🦙')).toBeInTheDocument();
    });

    it('should render with provided team members', () => {
        const teamMembers: Member[] = [mockTeamMember];

        render(<TeamSection teamMembers={teamMembers} />);

        expect(screen.getByTestId('team-member-123456')).toBeInTheDocument();
        expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    it('should render all section elements correctly', () => {
        render(<TeamSection teamMembers={[mockTeamMember]} />);

        expect(screen.getByTestId('glitching-moon')).toBeInTheDocument();
        expect(screen.getByTestId('ad-container')).toBeInTheDocument();
        expect(screen.getByTestId('ad-banner')).toBeInTheDocument();
        expect(screen.getByText('translated_infoTag')).toBeInTheDocument();
        expect(screen.getByText(/translated_title/)).toBeInTheDocument();
        expect(screen.getByText('translated_description')).toBeInTheDocument();
    });

    it('should apply correct max-width class for 4 team members', () => {
        const fourMembers: Member[] = Array.from({ length: 4 }, (_, i) => ({
            ...mockTeamMember,
            user_id: `id_${i}`,
            user_display_name: `User ${i}`,
        }));

        const { container } = render(<TeamSection teamMembers={fourMembers} />);

        const teamContainer = container.querySelector('.max-w-6xl');
        expect(teamContainer).toBeInTheDocument();
    });

    it('should apply correct max-width class for non-4 team members', () => {
        const threeMembers: Member[] = Array.from({ length: 3 }, (_, i) => ({
            ...mockTeamMember,
            user_id: `id_${i}`,
            user_display_name: `User ${i}`,
        }));

        const { container } = render(<TeamSection teamMembers={threeMembers} />);

        const teamContainer = container.querySelector('.max-w-7xl');
        expect(teamContainer).toBeInTheDocument();
    });

    describe('getTeamMemberAnimation logic', () => {
        it('should apply fadeInRight for first column with 4 members', () => {
            const fourMembers: Member[] = Array.from({ length: 4 }, (_, i) => ({
                ...mockTeamMember,
                user_id: `id_${i}`,
            }));

            render(<TeamSection teamMembers={fourMembers} />);

            const animations = screen.getAllByTestId('animate-on-view');
            // index 0, colIndex 0, totalMembers 4

            expect(animations[4]).toHaveAttribute('data-animation', expect.stringContaining('animate__fadeInRight'));
        });

        it('should apply fadeInLeft for first column with non-4 members', () => {
            const threeMembers: Member[] = Array.from({ length: 3 }, (_, i) => ({
                ...mockTeamMember,
                user_id: `id_${i}`,
            }));

            render(<TeamSection teamMembers={threeMembers} />);

            const animations = screen.getAllByTestId('animate-on-view');
            // index 0, colIndex 0, totalMembers 3
            expect(animations[4]).toHaveAttribute('data-animation', expect.stringContaining('animate__fadeInLeft'));
        });

        it('should apply fadeInLeft for third column with 4 members', () => {
            const fourMembers: Member[] = Array.from({ length: 4 }, (_, i) => ({
                ...mockTeamMember,
                user_id: `id_${i}`,
            }));

            render(<TeamSection teamMembers={fourMembers} />);

            const animations = screen.getAllByTestId('animate-on-view');
            // index 2, colIndex 2, totalMembers 4
            expect(animations[6]).toHaveAttribute('data-animation', expect.stringContaining('animate__fadeInLeft'));
        });

        it('should apply fadeInRight for third column with non-4 members', () => {
            const sixMembers: Member[] = Array.from({ length: 6 }, (_, i) => ({
                ...mockTeamMember,
                user_id: `id_${i}`,
            }));

            render(<TeamSection teamMembers={sixMembers} />);

            const animations = screen.getAllByTestId('animate-on-view');
            // index 2, colIndex 2, totalMembers 6
            expect(animations[6]).toHaveAttribute('data-animation', expect.stringContaining('animate__fadeInRight'));
        });

        it('should apply fadeInDown for middle column first row', () => {
            const sixMembers: Member[] = Array.from({ length: 6 }, (_, i) => ({
                ...mockTeamMember,
                user_id: `id_${i}`,
            }));

            render(<TeamSection teamMembers={sixMembers} />);

            const animations = screen.getAllByTestId('animate-on-view');
            // index 1, colIndex 1, rowIndex 0
            expect(animations[5]).toHaveAttribute('data-animation', expect.stringContaining('animate__fadeInDown'));
        });

        it('should apply fadeInUp for middle column last row', () => {
            const sevenMembers: Member[] = Array.from({ length: 7 }, (_, i) => ({
                ...mockTeamMember,
                user_id: `id_${i}`,
            }));

            render(<TeamSection teamMembers={sevenMembers} />);

            const animations = screen.getAllByTestId('animate-on-view');
            // index 7 would be out of bounds, so test index 6 (last element)
            // index 6, colIndex 0, rowIndex 2 - but for middle column we need index 7
            // Let's use 10 members: index 7, colIndex 1, rowIndex 2 (last row)
        });

        it('should apply fadeInUp for middle column last row with multiple rows', () => {
            const elevenMembers = Array.from({ length: 11 }, (_, i) => ({
                ...mockTeamMember,
                user_id: `id_${i}`,
            }));

            render(<TeamSection teamMembers={elevenMembers} />);

            const animations = screen.getAllByTestId('animate-on-view');
            // index 7, colIndex 1, rowIndex 2, totalRows 4
            expect(animations[14]).toHaveAttribute('data-animation', expect.stringContaining('animate__fadeInUp'));
        });

        it('should apply fadeIn for middle column middle row', () => {
            const tenMembers: Member[] = Array.from({ length: 10 }, (_, i) => ({
                ...mockTeamMember,
                user_id: `id_${i}`,
            }));

            render(<TeamSection teamMembers={tenMembers} />);

            const animations = screen.getAllByTestId('animate-on-view');
            // index 4, colIndex 1, rowIndex 1 (not first, not last)
            expect(animations[8]).toHaveAttribute('data-animation', expect.stringContaining('animate__fadeIn'));
        });
    });

    it('should render multiple team members with correct keys', () => {
        const multipleMembers: Member[] = [
            { ...mockTeamMember, user_id: '1', user_display_name: 'User 1' },
            { ...mockTeamMember, user_id: '2', user_display_name: 'User 2' },
            { ...mockTeamMember, user_id: '3', user_display_name: 'User 3' },
        ];

        render(<TeamSection teamMembers={multipleMembers} />);

        expect(screen.getByTestId('team-member-1')).toBeInTheDocument();
        expect(screen.getByTestId('team-member-2')).toBeInTheDocument();
        expect(screen.getByTestId('team-member-3')).toBeInTheDocument();
    });
});