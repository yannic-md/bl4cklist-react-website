import {act, render, screen} from '@testing-library/react';
import Home, { getStaticProps } from '@/pages/index';
import { useTranslations } from 'next-intl';
import {fetchGuildStatistics, fetchTeamMembers} from "@/lib/api";

// Mock all dependencies
jest.mock('next-intl', () => ({
    useTranslations: jest.fn(),
}));

jest.mock('next/image', () => ({
    __esModule: true,
    default: ({fill, unoptimized, priority, src, alt, ...rest}: any) => {
        // eslint-disable-next-line @next/next/no-img-element
        return ( <img src={src} alt={alt || ""}{...rest} /> );
    },
}));

jest.mock('@/components/elements/MetaHead', () => ({
    __esModule: true,
    default: ({ title, description }: any) => (
        <div data-testid="meta-head">
            <span data-testid="meta-title">{title}</span>
            <span data-testid="meta-description">{description}</span>
        </div>
    ),
}));

jest.mock('@/components/elements/layout/Header', () => ({
    __esModule: true,
    default: () => <header data-testid="header">Header</header>,
}));

jest.mock('@/components/sections/index/WelcomeHero', () => ({
    __esModule: true,
    default: ({ guildStats }: any) => (
        <div data-testid="welcome-hero">
            WelcomeHero - Members: {guildStats?.memberCount}
        </div>
    ),
}));

jest.mock('@/components/sections/SingleFeatureSection', () => ({
    __esModule: true,
    default: ({translationNamespace, particlesEnabled, planetDecoration, imagePosition, ctaEnabled, showTopGradients,
               imageSrc, guildFeatures, imageAlt, sectionId, titleEmoji, guildStats,}: any) => (
        <div data-testid="single-feature-section">
            <span data-testid="namespace">{translationNamespace}</span>
            <span data-testid="particles">{String(particlesEnabled)}</span>
            <span data-testid="planet">{planetDecoration}</span>
            <span data-testid="image-position">{imagePosition}</span>
            <span data-testid="cta">{String(ctaEnabled)}</span>
            <span data-testid="gradients">{String(showTopGradients)}</span>
            <span data-testid="image-src">{imageSrc}</span>
            <span data-testid="image-alt">{imageAlt}</span>
            <span data-testid="section-id">{sectionId}</span>
            <span data-testid="emoji">{titleEmoji}</span>
            <span data-testid="features-count">{guildFeatures?.length}</span>
            <span data-testid="guild-members">{guildStats?.memberCount}</span>
        </div>
    ),
}));

jest.mock('@/components/sections/index/TeamSection', () => ({
    __esModule: true,
    default: ({ teamMembers }: any) => (
        <div data-testid="team-section">
            TeamSection - Members: {teamMembers?.length}
        </div>
    ),
}));

jest.mock('@/components/sections/index/HistorySection', () => ({
    __esModule: true,
    default: () => <div data-testid="history-section">HistorySection</div>,
}));

jest.mock('@/components/sections/TestimonialSection', () => ({
    __esModule: true,
    default: () => <div data-testid="testimonial-section">TestimonialSection</div>,
}));

jest.mock('@/components/elements/layout/Footer', () => ({
    __esModule: true,
    default: () => <footer data-testid="footer">Footer</footer>,
}));

jest.mock('@/lib/api', () => ({
    fetchGuildStatistics: jest.fn(),
    fetchTeamMembers: jest.fn(),
}));

describe('Home Page', () => {
    const mockGuildStats = {
        memberCount: 1500,
        onlineCount: 300,
        boostLevel: 3,
    } as any;

    const mockTeamMembers = [
        { id: '1', name: 'Admin1', role: 'Owner' },
        { id: '2', name: 'Mod1', role: 'Moderator' },
    ] as any;

    const mockTranslations = {
        WelcomeHero: jest.fn((key: string) => `WelcomeHero_${key}`),
        SEO: jest.fn((key: string) => `SEO_${key}`),
    };

    beforeEach(() => {
        (useTranslations as jest.Mock).mockImplementation((namespace: string) => {
            return mockTranslations[namespace as keyof typeof mockTranslations];
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render all major sections', async () => {
        await act(async () => {
            render(<Home guildStats={mockGuildStats} teamMembers={mockTeamMembers} messages={undefined} />);
        });

        expect(screen.getByTestId('meta-head')).toBeInTheDocument();
        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('welcome-hero')).toBeInTheDocument();
        expect(screen.getByTestId('team-section')).toBeInTheDocument();
        expect(screen.getByTestId('history-section')).toBeInTheDocument();
        expect(screen.getByTestId('testimonial-section')).toBeInTheDocument();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('should pass correct translations to MetaHead', () => {
        render(<Home guildStats={mockGuildStats} teamMembers={mockTeamMembers} messages={undefined} />);

        expect(screen.getByTestId('meta-title')).toHaveTextContent('SEO_homeTitle');
        expect(screen.getByTestId('meta-description')).toHaveTextContent('WelcomeHero_description');
    });

    it('should pass guildStats to WelcomeHero', () => {
        render(<Home guildStats={mockGuildStats} teamMembers={mockTeamMembers} messages={undefined} />);

        expect(screen.getByTestId('welcome-hero')).toHaveTextContent(`Members: ${mockGuildStats.memberCount}`);
    });

    it('should pass correct props to SingleFeatureSection', () => {
        render(<Home guildStats={mockGuildStats} teamMembers={mockTeamMembers} messages={undefined} />);

        expect(screen.getByTestId('namespace')).toHaveTextContent('IntroSection');
        expect(screen.getByTestId('particles')).toHaveTextContent('true');
        expect(screen.getByTestId('planet')).toHaveTextContent('none');
        expect(screen.getByTestId('image-position')).toHaveTextContent('right');
        expect(screen.getByTestId('cta')).toHaveTextContent('true');
        expect(screen.getByTestId('gradients')).toHaveTextContent('true');
        expect(screen.getByTestId('image-src')).toHaveTextContent('/images/pixel/guild-banner-471w.avif');
        expect(screen.getByTestId('section-id')).toHaveTextContent('discord-server-features');
        expect(screen.getByTestId('emoji')).toHaveTextContent('👋🏻');
        expect(screen.getByTestId('features-count')).toHaveTextContent('2');
        expect(screen.getByTestId('guild-members')).toHaveTextContent(String(mockGuildStats.memberCount));
    });

    it('should pass teamMembers to TeamSection', () => {
        render(<Home guildStats={mockGuildStats} teamMembers={mockTeamMembers} messages={undefined} />);

        expect(screen.getByTestId('team-section')).toHaveTextContent(`Members: ${mockTeamMembers.length}`);
    });

    it('should render decorational grid image in history section', () => {
        render(<Home guildStats={mockGuildStats} teamMembers={mockTeamMembers} messages={undefined} />);

        const gridImage = screen.getByAltText('Grid BG ~ Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server');
        expect(gridImage).toBeInTheDocument();
        expect(gridImage).toHaveAttribute('src', '/images/bg/grid-1916w.avif');
    });

    it('should render with empty guildStats', () => {
        render(<Home guildStats={null as any} teamMembers={mockTeamMembers} messages={undefined} />);

        expect(screen.getByTestId('welcome-hero')).toBeInTheDocument();
        expect(screen.getByTestId('single-feature-section')).toBeInTheDocument();
    });

    it('should render with empty teamMembers', () => {
        render(<Home guildStats={mockGuildStats} teamMembers={[]} messages={undefined} />);

        expect(screen.getByTestId('team-section')).toHaveTextContent('Members: 0');
    });

    describe('getStaticProps', () => {
        const mockGuildStats = {
            memberCount: 1500,
            onlineCount: 300,
            boostLevel: 3,
        };

        const mockTeamMembers = [
            { id: '1', name: 'Admin1', role: 'Owner' },
            { id: '2', name: 'Mod1', role: 'Moderator' },
        ];

        const mockMessages = {
            WelcomeHero: { title: 'Welcome' },
            SEO: { homeTitle: 'Home Page' },
        };

        beforeEach(() => {
            (fetchGuildStatistics as jest.Mock).mockResolvedValue(mockGuildStats);
            (fetchTeamMembers as jest.Mock).mockResolvedValue(mockTeamMembers);

            jest.mock('../../messages/en.json', () => mockMessages, { virtual: true });
            jest.mock('../../messages/de.json', () => mockMessages, { virtual: true });
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should fetch guildStats and teamMembers', async () => {
            const context = { locale: 'en' };
            const result = await getStaticProps(context);

            expect(fetchGuildStatistics).toHaveBeenCalledTimes(1);
            expect(fetchTeamMembers).toHaveBeenCalledTimes(1);
            expect(result.props.guildStats).toEqual(mockGuildStats);
            expect(result.props.teamMembers).toEqual(mockTeamMembers);
        });

        it('should return revalidate time of 3600 seconds', async () => {
            const context = { locale: 'en' };
            const result = await getStaticProps(context);

            expect(result.revalidate).toBe(3600);
        });

        it('should load messages for given locale', async () => {
            const context = { locale: 'de' };
            const result = await getStaticProps(context);

            expect(result.props.messages).toBeDefined();
        });

        it('should handle fetch errors gracefully', async () => {
            (fetchGuildStatistics as jest.Mock).mockRejectedValue(new Error('Fetch failed'));
            (fetchTeamMembers as jest.Mock).mockRejectedValue(new Error('Fetch failed'));

            const context = { locale: 'en' };

            await expect(getStaticProps(context)).rejects.toThrow('Fetch failed');
        });
    });
});