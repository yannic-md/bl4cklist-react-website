import { render, screen } from '@testing-library/react';
import { useTranslations } from 'next-intl';
import {Member} from "@/types/Member";
import Community, {getStaticProps} from "@/pages/discord/community";

// Mock all dependencies
jest.mock('next-intl', () => ({
    useTranslations: jest.fn(),
}));

jest.mock('@/components/elements/MetaHead', () => ({
    __esModule: true,
    default: ({ title, description }: any) => (
        <div data-testid="meta-head">
            {title} - {description}
        </div>
    ),
}));

jest.mock('@/components/elements/layout/Header', () => ({
    __esModule: true,
    default: () => <div data-testid="header">Header</div>,
}));

jest.mock('@/components/elements/layout/Footer', () => ({
    __esModule: true,
    default: () => <div data-testid="footer">Footer</div>,
}));

jest.mock('@/components/sections/community-page/ComHero', () => ({
    __esModule: true,
    default: ({ guildStats }: any) => (
        <div data-testid="com-hero">ComHero - {guildStats?.memberCount}</div>
    ),
}));

jest.mock('@/components/sections/community-page/MemberList', () => ({
    __esModule: true,
    default: ({ members, section_id, category }: any) => (
        <div data-testid={`member-list-${section_id}`}>
            {category} - {members?.length}
        </div>
    ),
}));

jest.mock('@/components/sections/TestimonialSection', () => ({
    __esModule: true,
    default: () => <div data-testid="testimonial-section">Testimonials</div>,
}));

jest.mock('@/lib/api', () => ({
    __esModule: true,
    fetchGuildStatistics: jest.fn(),
    fetchCommunityMembers: jest.fn()
}));

// Mock oldBots data
jest.mock('@/types/Member', () => ({
    oldBots: [
        {
            user_name: 'GhostBot#0001',
            user_display_name: 'GhostBot',
            rank: 'EHEM_BOT',
            user_id: '111111111111111111',
            social_media_url: null,
            user_avatar_url: 'https://example.com/ghost.png',
        },
        {
            user_name: 'DeadBot#0002',
            user_display_name: 'DeadBot',
            rank: 'EHEM_BOT',
            user_id: '222222222222222222',
            social_media_url: null,
            user_avatar_url: 'https://example.com/dead.png',
        },
    ],
}));

describe('Community Page', () => {
    const mockGuildStats = {
        memberCount: 1000,
        onlineCount: 500,
        boostCount: 50,
    } as any;

    const mockMember: Member = {
        user_name: 'TestUser#1234',
        user_display_name: 'TestUser',
        rank: 'LEITUNG',
        user_id: '123456789',
        social_media_url: 'https://twitter.com/test',
        user_avatar_url: 'https://example.com/avatar.png',
    } as any;

    const mockApiMembers = {
        birthday: [{ ...mockMember, rank: 'BIRTHDAY' }],
        supporters: [{ ...mockMember, rank: 'SPONSOR' }],
        levels: [{ ...mockMember, rank: 'LVL125' }],
        former: [{ ...mockMember, rank: 'EHEM_LEITUNG' }],
    } as any;

    const mockTranslations = jest.fn((key: string) => `translated_${key}`);

    beforeEach(() => {
        (useTranslations as jest.Mock).mockReturnValue(mockTranslations);
        // Mock Math.random for predictable results
        jest.spyOn(Math, 'random').mockReturnValue(0.5);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should render all core components', () => {
        render(<Community guildStats={mockGuildStats} apiMembers={mockApiMembers} />);

        expect(screen.getByTestId('meta-head')).toBeInTheDocument();
        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('com-hero')).toBeInTheDocument();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
        expect(screen.getByTestId('testimonial-section')).toBeInTheDocument();
    });

    it('should render all MemberList sections with correct data', () => {
        render(<Community guildStats={mockGuildStats} apiMembers={mockApiMembers} />);

        expect(screen.getByTestId('member-list-birthdays')).toHaveTextContent('Birthday - 1');
        expect(screen.getByTestId('member-list-leaders')).toHaveTextContent('Leaders - 1');
        expect(screen.getByTestId('member-list-levels')).toHaveTextContent('Levels - 1');
        expect(screen.getByTestId('member-list-staff')).toHaveTextContent('Staff - 2'); // former + ghost bot
    });

    it('should use fallback data when apiMembers.birthday is undefined', () => {
        const apiMembersWithoutBirthday = { ...mockApiMembers, birthday: undefined };
        render(<Community guildStats={mockGuildStats} apiMembers={apiMembersWithoutBirthday} />);

        expect(screen.getByTestId('member-list-birthdays')).toHaveTextContent('Birthday - 1');
    });

    it('should use fallback data when apiMembers.supporters is undefined', () => {
        const apiMembersWithoutSupporters = { ...mockApiMembers, supporters: undefined };
        render(<Community guildStats={mockGuildStats} apiMembers={apiMembersWithoutSupporters} />);

        expect(screen.getByTestId('member-list-leaders')).toHaveTextContent('Leaders - 1');
    });

    it('should use fallback data when apiMembers.levels is undefined', () => {
        const apiMembersWithoutLevels = { ...mockApiMembers, levels: undefined };
        render(<Community guildStats={mockGuildStats} apiMembers={apiMembersWithoutLevels} />);

        expect(screen.getByTestId('member-list-levels')).toHaveTextContent('Levels - 1');
    });

    it('should use fallback data when apiMembers.former is undefined', () => {
        const apiMembersWithoutFormer = { ...mockApiMembers, former: undefined };
        render(<Community guildStats={mockGuildStats} apiMembers={apiMembersWithoutFormer} />);

        expect(screen.getByTestId('member-list-staff')).toHaveTextContent('Staff - 2');
    });

    it('should inject random ghost bot into former staff list', () => {
        const formerStaff = [
            { ...mockMember, rank: 'EHEM_LEITUNG', user_name: 'Former1' },
            { ...mockMember, rank: 'EHEM_LEITUNG', user_name: 'Former2' },
        ];

        render(<Community guildStats={mockGuildStats} apiMembers={{ ...mockApiMembers, former: formerStaff }} />);

        // Should have 2 former staff + 1 ghost bot = 3
        expect(screen.getByTestId('member-list-staff')).toHaveTextContent('Staff - 3');
    });

    it('should handle empty former staff list without injecting ghost bot', () => {
        render(<Community guildStats={mockGuildStats} apiMembers={{ ...mockApiMembers, former: [] }} />);

        expect(screen.getByTestId('member-list-staff')).toHaveTextContent('Staff - 0');
    });

    it('should re-inject ghost bot when apiMembers.former changes', () => {
        const { rerender } = render(<Community guildStats={mockGuildStats} apiMembers={mockApiMembers} />);

        expect(screen.getByTestId('member-list-staff')).toHaveTextContent('Staff - 2');

        const newApiMembers = {
            ...mockApiMembers,
            former: [
                { ...mockMember, rank: 'EHEM_LEITUNG', user_name: 'NewFormer1' },
                { ...mockMember, rank: 'EHEM_LEITUNG', user_name: 'NewFormer2' },
                { ...mockMember, rank: 'EHEM_LEITUNG', user_name: 'NewFormer3' },
            ],
        };

        rerender(<Community guildStats={mockGuildStats} apiMembers={newApiMembers} />);

        expect(screen.getByTestId('member-list-staff')).toHaveTextContent('Staff - 4');
    });

    it('should pass guildStats to ComHero component', () => {
        render(<Community guildStats={mockGuildStats} apiMembers={mockApiMembers} />);

        expect(screen.getByTestId('com-hero')).toHaveTextContent('1000');
    });

    it('should call useTranslations with ComHero namespace', () => {
        render(<Community guildStats={mockGuildStats} apiMembers={mockApiMembers} />);

        expect(useTranslations).toHaveBeenCalledWith('ComHero');
    });

    it('should pass translated description to MetaHead', () => {
        render(<Community guildStats={mockGuildStats} apiMembers={mockApiMembers} />);

        expect(mockTranslations).toHaveBeenCalledWith('description');
        expect(screen.getByTestId('meta-head')).toHaveTextContent('translated_description');
    });

    it('should handle null apiMembers gracefully', () => {
        render(<Community guildStats={mockGuildStats} apiMembers={null as any} />);

        expect(screen.getByTestId('member-list-birthdays')).toHaveTextContent('Birthday - 1');
        expect(screen.getByTestId('member-list-leaders')).toHaveTextContent('Leaders - 1');
        expect(screen.getByTestId('member-list-levels')).toHaveTextContent('Levels - 1');
        expect(screen.getByTestId('member-list-staff')).toHaveTextContent('Staff - 2');
    });

    it('should handle undefined apiMembers gracefully', () => {
        render(<Community guildStats={mockGuildStats} apiMembers={undefined as any} />);

        expect(screen.getByTestId('member-list-birthdays')).toHaveTextContent('Birthday - 1');
        expect(screen.getByTestId('member-list-leaders')).toHaveTextContent('Leaders - 1');
        expect(screen.getByTestId('member-list-levels')).toHaveTextContent('Levels - 1');
        expect(screen.getByTestId('member-list-staff')).toHaveTextContent('Staff - 2');
    });

    describe('getStaticProps', () => {
        const { fetchGuildStatistics } = require('@/lib/api');
        const { fetchCommunityMembers } = require('@/lib/api');

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('should fetch guild statistics and community members', async () => {
            const mockGuildStats = { memberCount: 1000, onlineCount: 500, boostCount: 50 };
            const mockApiMembers = {
                birthday: [],
                supporters: [],
                levels: [],
                former: [],
            };

            fetchGuildStatistics.mockResolvedValue(mockGuildStats);
            fetchCommunityMembers.mockResolvedValue(mockApiMembers);

            const result = await getStaticProps({ locale: 'en' } as any);

            expect(fetchGuildStatistics).toHaveBeenCalledTimes(1);
            expect(fetchCommunityMembers).toHaveBeenCalledTimes(1);
            expect(result.props.guildStats).toEqual(mockGuildStats);
            expect(result.props.apiMembers).toEqual(mockApiMembers);
        });

        it('should load correct locale messages for en', async () => {
            fetchGuildStatistics.mockResolvedValue({});
            fetchCommunityMembers.mockResolvedValue({});

            const result = await getStaticProps({ locale: 'en' } as any);

            expect(result.props.messages).toBeDefined();
        });

        it('should load correct locale messages for de', async () => {
            fetchGuildStatistics.mockResolvedValue({});
            fetchCommunityMembers.mockResolvedValue({});

            const result = await getStaticProps({ locale: 'de' } as any);

            expect(result.props.messages).toBeDefined();
        });

        it('should return revalidate time of 3600 seconds', async () => {
            fetchGuildStatistics.mockResolvedValue({});
            fetchCommunityMembers.mockResolvedValue({});

            const result = await getStaticProps({ locale: 'en' } as any);

            expect(result.revalidate).toBe(3600);
        });

        it('should handle API fetch errors gracefully', async () => {
            fetchGuildStatistics.mockRejectedValue(new Error('API Error'));
            fetchCommunityMembers.mockResolvedValue({});

            await expect(getStaticProps({ locale: 'en' } as any)).rejects.toThrow('API Error');
        });

        it('should execute both API calls in parallel', async () => {
            const mockGuildStats = { memberCount: 500 };
            const mockApiMembers = { birthday: [] };

            fetchGuildStatistics.mockImplementation(
                () => new Promise((resolve) => setTimeout(() => resolve(mockGuildStats), 100))
            );
            fetchCommunityMembers.mockImplementation(
                () => new Promise((resolve) => setTimeout(() => resolve(mockApiMembers), 100))
            );

            const startTime = Date.now();
            await getStaticProps({ locale: 'en' } as any);
            const endTime = Date.now();

            // Should complete in ~100ms (parallel), not ~200ms (sequential)
            expect(endTime - startTime).toBeLessThan(150);
        });
    });
});