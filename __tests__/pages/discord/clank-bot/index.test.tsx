import { render, screen } from '@testing-library/react';
import { useTranslations } from 'next-intl';
import ClankBot, {getStaticProps} from "@/pages/discord/clank-bot";
import {APIStatistics} from "@/types/APIResponse";
import {fetchGuildStatistics} from "@/lib/api";

// Mock all dependencies
jest.mock('next-intl', () => ({
    useTranslations: jest.fn(),
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

jest.mock('@/components/elements/layout/Footer', () => ({
    __esModule: true,
    default: () => <footer data-testid="footer">Footer</footer>,
}));

jest.mock('@/components/sections/clank-page/ClankHero', () => ({
    __esModule: true,
    default: () => <div data-testid="clank-hero">ClankHero</div>,
}));

jest.mock('@/components/sections/SingleFeatureSection', () => ({
    __esModule: true,
    default: ({ translationNamespace, sectionId, customStatistics }: any) => (
        <div data-testid={`feature-section-${sectionId}`}>
            <span data-testid={`namespace-${sectionId}`}>{translationNamespace}</span>
            {customStatistics && (
                <div data-testid={`stats-${sectionId}`}>
                    {customStatistics.map((stat: any, index: number) => (
                        <span key={index} data-testid={`stat-${sectionId}-${index}`}>
                            {stat.end}
                        </span>
                    ))}
                </div>
            )}
        </div>
    ),
}));

jest.mock('@/components/sections/TestimonialSection', () => ({
    __esModule: true,
    default: () => <div data-testid="testimonial-section">TestimonialSection</div>,
}));

jest.mock('@/lib/api', () => ({
    fetchGuildStatistics: jest.fn(),
}));

describe('ClankBot', () => {
    const mockTranslations = jest.fn((key: string) => `translated_${key}`);

    beforeEach(() => {
        (useTranslations as jest.Mock).mockReturnValue(mockTranslations);
    });

    it('should render all main components', () => {
        render(<ClankBot guildStats={undefined as any} />);

        expect(screen.getByTestId('meta-head')).toBeInTheDocument();
        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('clank-hero')).toBeInTheDocument();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
        expect(screen.getByTestId('testimonial-section')).toBeInTheDocument();
    });

    it('should render MetaHead with correct title and description', () => {
        render(<ClankBot guildStats={undefined as any} />);

        expect(screen.getByTestId('meta-title')).toHaveTextContent('Clank Discord-Bot');
        expect(screen.getByTestId('meta-description')).toHaveTextContent('translated_description');
        expect(mockTranslations).toHaveBeenCalledWith('description');
    });

    it('should render all four feature sections with correct IDs', () => {
        render(<ClankBot guildStats={undefined as any} />);

        expect(screen.getByTestId('feature-section-ticket-tool')).toBeInTheDocument();
        expect(screen.getByTestId('feature-section-giveaways')).toBeInTheDocument();
        expect(screen.getByTestId('feature-section-security')).toBeInTheDocument();
        expect(screen.getByTestId('feature-section-global-chat')).toBeInTheDocument();
    });

    it('should use fallback values when guildStats is undefined', () => {
        render(<ClankBot guildStats={undefined as any} />);

        // Ticket stats fallbacks
        const ticketStats = screen.getByTestId('stats-ticket-tool');
        expect(ticketStats.children[0]).toHaveTextContent('1919');
        expect(ticketStats.children[1]).toHaveTextContent('94');
        expect(ticketStats.children[2]).toHaveTextContent('13');

        // Giveaway stats fallbacks
        const giveawayStats = screen.getByTestId('stats-giveaways');
        expect(giveawayStats.children[0]).toHaveTextContent('993');
        expect(giveawayStats.children[1]).toHaveTextContent('16');
        expect(giveawayStats.children[2]).toHaveTextContent('5');

        // Security stats fallbacks
        const securityStats = screen.getByTestId('stats-security');
        expect(securityStats.children[0]).toHaveTextContent('34');
        expect(securityStats.children[1]).toHaveTextContent('63');
        expect(securityStats.children[2]).toHaveTextContent('10');

        // Global chat stats fallbacks
        const globalStats = screen.getByTestId('stats-global-chat');
        expect(globalStats.children[0]).toHaveTextContent('5893487');
        expect(globalStats.children[1]).toHaveTextContent('17272');
        expect(globalStats.children[2]).toHaveTextContent('324');
    });

    it('should use provided guildStats values when available', () => {
        const mockGuildStats = {
            tickets_count: 2000,
            tickets_open_count: 100,
            tickets_claimed_count: 20,
            giveaways_count: 1000,
            giveaways_scheduled_count: 20,
            giveaways_active_count: 10,
            backup_count: 50,
            log_count: 80,
            global_message_count: 6000000,
            global_users_count: 20000,
            global_chats_count: 400,
        } as APIStatistics;

        render(<ClankBot guildStats={mockGuildStats} />);

        // Ticket stats
        const ticketStats = screen.getByTestId('stats-ticket-tool');
        expect(ticketStats.children[0]).toHaveTextContent('2000');
        expect(ticketStats.children[1]).toHaveTextContent('100');
        expect(ticketStats.children[2]).toHaveTextContent('20');

        // Giveaway stats
        const giveawayStats = screen.getByTestId('stats-giveaways');
        expect(giveawayStats.children[0]).toHaveTextContent('1000');
        expect(giveawayStats.children[1]).toHaveTextContent('20');
        expect(giveawayStats.children[2]).toHaveTextContent('10');

        // Security stats
        const securityStats = screen.getByTestId('stats-security');
        expect(securityStats.children[0]).toHaveTextContent('50');
        expect(securityStats.children[1]).toHaveTextContent('80');

        // Global chat stats
        const globalStats = screen.getByTestId('stats-global-chat');
        expect(globalStats.children[0]).toHaveTextContent('6000000');
        expect(globalStats.children[1]).toHaveTextContent('20000');
        expect(globalStats.children[2]).toHaveTextContent('400');
    });

    it('should use fallback for individual missing guildStats properties', () => {
        const partialGuildStats = {
            tickets_count: 2000,
            // tickets_open_count missing
            tickets_claimed_count: 20,
        } as APIStatistics;

        render(<ClankBot guildStats={partialGuildStats} />);

        const ticketStats = screen.getByTestId('stats-ticket-tool');
        expect(ticketStats.children[0]).toHaveTextContent('2000');
        expect(ticketStats.children[1]).toHaveTextContent('94'); // fallback
        expect(ticketStats.children[2]).toHaveTextContent('20');
    });

    it('should render feature sections with correct translation namespaces', () => {
        render(<ClankBot guildStats={undefined as any} />);

        expect(screen.getByTestId('namespace-ticket-tool')).toHaveTextContent('ClankSupportSection');
        expect(screen.getByTestId('namespace-giveaways')).toHaveTextContent('ClankGiveawaysSection');
        expect(screen.getByTestId('namespace-security')).toHaveTextContent('ClankSecuritySection');
        expect(screen.getByTestId('namespace-global-chat')).toHaveTextContent('ClankGlobalSection');
    });

    describe('getStaticProps', () => {
        const mockFetchGuildStatistics = fetchGuildStatistics as jest.Mock;

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('should return props with messages and guildStats', async () => {
            const mockGuildStats = {
                tickets_count: 2000,
                tickets_open_count: 100,
                tickets_claimed_count: 20,
                giveaways_count: 1000,
                giveaways_scheduled_count: 20,
                giveaways_active_count: 10,
                backup_count: 50,
                log_count: 80,
                global_message_count: 6000000,
                global_users_count: 20000,
                global_chats_count: 400,
            };

            mockFetchGuildStatistics.mockResolvedValue(mockGuildStats);

            const result = await getStaticProps({ locale: 'en' } as any);

            expect(mockFetchGuildStatistics).toHaveBeenCalledTimes(1);
            expect(result).toEqual({
                props: {
                    messages: expect.any(Object),
                    guildStats: mockGuildStats,
                },
                revalidate: 3600,
            });
        });

        it('should load correct locale messages for different locales', async () => {
            mockFetchGuildStatistics.mockResolvedValue({});

            const resultEn = await getStaticProps({ locale: 'en' } as any);
            expect(resultEn.props.messages).toBeDefined();

            const resultDe = await getStaticProps({ locale: 'de' } as any);
            expect(resultDe.props.messages).toBeDefined();
        });

        it('should set revalidate to 3600 seconds', async () => {
            mockFetchGuildStatistics.mockResolvedValue({});

            const result = await getStaticProps({ locale: 'en' } as any);

            expect(result.revalidate).toBe(3600);
        });

        it('should handle fetchGuildStatistics returning null', async () => {
            mockFetchGuildStatistics.mockResolvedValue(null);

            const result = await getStaticProps({ locale: 'en' } as any);

            expect(result.props.guildStats).toBeNull();
            expect(result.props.messages).toBeDefined();
        });
    });
});