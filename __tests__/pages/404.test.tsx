import { render, screen } from '@testing-library/react';
import Custom404, { getStaticProps } from '@/pages/404';
import { GetStaticPropsContext } from 'next';
import {fetchGuildStatistics} from "@/lib/api";

// Mock NotFound component
jest.mock('@/components/sections/errors/404-NotFound', () => ({
    __esModule: true,
    default: ({ guildStats }: any) => (
        <div data-testid="not-found-component">
            NotFound Component
            {guildStats && <span data-testid="guild-stats">{JSON.stringify(guildStats)}</span>}
        </div>
    ),
}));

// Mock fetchGuildStatistics
jest.mock('@/lib/api', () => ({
    fetchGuildStatistics: jest.fn(),
}));

describe('Custom404 Page', () => {
    describe('Component Rendering', () => {
        it('should render NotFound component without guildStats', () => {
            render(<Custom404 guildStats={undefined as any} />);

            expect(screen.getByTestId('not-found-component')).toBeInTheDocument();
            expect(screen.queryByTestId('guild-stats')).not.toBeInTheDocument();
        });

        it('should render NotFound component with guildStats', () => {
            const mockGuildStats = { totalGuilds: 100, activeUsers: 5000 };

            render(<Custom404 guildStats={mockGuildStats as any} />);

            expect(screen.getByTestId('not-found-component')).toBeInTheDocument();
            expect(screen.getByTestId('guild-stats')).toHaveTextContent(JSON.stringify(mockGuildStats));
        });
    });

    describe('getStaticProps', () => {
        const mockFetchGuildStatistics = fetchGuildStatistics as jest.MockedFunction<typeof fetchGuildStatistics>;

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('should return props with messages and guildStats for locale "en"', async () => {
            const mockGuildStats = { totalGuilds: 150 };
            mockFetchGuildStatistics.mockResolvedValue(mockGuildStats as any);

            const context: GetStaticPropsContext = {
                locale: 'en',
            };

            const result = await getStaticProps(context);

            expect(mockFetchGuildStatistics).toHaveBeenCalledTimes(1);
            expect(result).toEqual({
                props: {
                    messages: expect.any(Object),
                    guildStats: mockGuildStats,
                },
                revalidate: 300,
            });
        });

        it('should return props with messages and guildStats for locale "de"', async () => {
            const mockGuildStats = { totalGuilds: 200, activeUsers: 10000 };
            mockFetchGuildStatistics.mockResolvedValue(mockGuildStats as any);

            const context: GetStaticPropsContext = {
                locale: 'de',
            };

            const result = await getStaticProps(context);

            expect(mockFetchGuildStatistics).toHaveBeenCalledTimes(1);
            expect(result).toEqual({
                props: {
                    messages: expect.any(Object),
                    guildStats: mockGuildStats,
                },
                revalidate: 300,
            });
        });

        it('should handle fetchGuildStatistics returning null', async () => {
            mockFetchGuildStatistics.mockResolvedValue(null);

            const context: GetStaticPropsContext = {
                locale: 'en',
            };

            const result = await getStaticProps(context);

            expect(mockFetchGuildStatistics).toHaveBeenCalledTimes(1);
            expect(result).toEqual({
                props: {
                    messages: expect.any(Object),
                    guildStats: null,
                },
                revalidate: 300,
            });
        });

        it('should handle fetchGuildStatistics returning undefined', async () => {
            mockFetchGuildStatistics.mockResolvedValue(undefined as any);

            const context: GetStaticPropsContext = {
                locale: 'en',
            };

            const result = await getStaticProps(context);

            expect(mockFetchGuildStatistics).toHaveBeenCalledTimes(1);
            expect(result).toEqual({
                props: {
                    messages: expect.any(Object),
                    guildStats: undefined,
                },
                revalidate: 300,
            });
        });
    });
});