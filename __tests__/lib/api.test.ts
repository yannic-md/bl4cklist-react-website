import {
    fetchCommunityMembers,
    fetchTeamMembers,
    saveUserMilestones,
    submitContactForm
} from "@/lib/api";

describe('API', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = {
            ...originalEnv,
            NEXT_PUBLIC_NODE_ENV: 'development',
            NEXT_PUBLIC_CONFIG_API_BASE_URL: 'https://api.production.com',
        };

        global.fetch = jest.fn();
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        process.env = originalEnv;
        jest.restoreAllMocks();
    });

    describe('fetchFromAPI (internally via public functions)', () => {
        it('should use development URL when NODE_ENV is development', async () => {
            process.env.NEXT_PUBLIC_NODE_ENV = 'development';
            const { fetchGuildStatistics } = require('@/lib/api');

            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: jest.fn().mockResolvedValue({ data: 'test' }),
            });

            await fetchGuildStatistics();

            expect(global.fetch).toHaveBeenCalledWith(
                'http://localhost:8081/stats/web2',
                expect.any(Object)
            );
        });

        it('should use production URL when NODE_ENV is not development', async () => {
            process.env.NEXT_PUBLIC_NODE_ENV = 'production';
            const { fetchGuildStatistics } = require('@/lib/api');

            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: jest.fn().mockResolvedValue({ data: 'test' }),
            });

            await fetchGuildStatistics();

            expect(global.fetch).toHaveBeenCalledWith(
                'https://api.production.com',
                expect.any(Object)
            );
        });

        it('should return null and log error if response is not ok', async () => {
            process.env.NEXT_PUBLIC_NODE_ENV = 'development';
            const { fetchTeamMembers } = require('@/lib/api');

            (global.fetch as jest.Mock).mockResolvedValue({
                ok: false,
                status: 404,
            });

            const result = await fetchTeamMembers();

            expect(result).toBeNull();
            expect(console.error).toHaveBeenCalledWith(
                expect.stringContaining('Failed to fetch from http://localhost:8081/stats/web2/team: HTTP 404')
            );
        });

        it('should return null and log error if fetch throws exception', async () => {
            (global.fetch as jest.Mock).mockRejectedValue(new Error('Network Error'));

            const result = await fetchCommunityMembers();

            expect(result).toBeNull();
            expect(console.error).toHaveBeenCalledWith(
                'Failed to fetch from API:',
                expect.any(Error)
            );
        });
    });

    describe('Specific Fetchers', () => {
        it('fetchGuildStatistics should call base URL with revalidate 300', async () => {
            process.env.NEXT_PUBLIC_NODE_ENV = 'development';
            const { fetchGuildStatistics } = require('@/lib/api');

            const mockData = { totalMembers: 100 };
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: jest.fn().mockResolvedValue(mockData),
            });

            const result = await fetchGuildStatistics();

            expect(result).toEqual(mockData);
            expect(global.fetch).toHaveBeenCalledWith(
                expect.any(String),
                { next: { revalidate: 300 } }
            );
        });

        it('fetchTeamMembers should call /team with revalidate 600', async () => {
            const mockData = [{ id: '1', name: 'Admin' }];
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: jest.fn().mockResolvedValue(mockData),
            });

            const result = await fetchTeamMembers();

            expect(result).toEqual(mockData);
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/team'),
                { next: { revalidate: 600 } }
            );
        });
    });

    describe('submitContactForm', () => {
        const mockFormData = new FormData();
        mockFormData.append('email', 'test@test.de');
        const token = 'fake-token';

        it('should return true on successful submission', async () => {
            process.env.NEXT_PUBLIC_NODE_ENV = 'development';
            const { submitContactForm } = require('@/lib/api');

            (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

            const result = await submitContactForm(mockFormData, token, 'general');

            expect(result).toBe(true);
            expect(global.fetch).toHaveBeenCalledWith(
                'http://localhost:8081/stats/web2/contact',
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify({
                        formType: 'general',
                        turnstileToken: token,
                        email: 'test@test.de',
                    }),
                })
            );
        });

        it('should return false and log error on HTTP error', async () => {
            (global.fetch as jest.Mock).mockResolvedValue({ ok: false, status: 500 });

            const result = await submitContactForm(mockFormData, token, 'unban');

            expect(result).toBe(false);
            expect(console.error).toHaveBeenCalledWith(
                expect.stringContaining('Failed to submit contact form: HTTP 500')
            );
        });

        it('should return false and log error on network exception', async () => {
            (global.fetch as jest.Mock).mockRejectedValue(new Error('Timeout'));

            const result = await submitContactForm(mockFormData, token, 'general');

            expect(result).toBe(false);
            expect(console.error).toHaveBeenCalledWith('Failed to submit contact form:', expect.any(Error));
        });
    });

    describe('saveUserMilestones', () => {
        const userId = '12345';
        const milestones = ['m1', 'm2'];

        it('should return true if request is ok', async () => {
            (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

            const result = await saveUserMilestones(userId, milestones);

            expect(result).toBe(true);
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/milestones/sync'),
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify({ user_id: userId, milestones }),
                })
            );
        });

        it('should return false if request is not ok', async () => {
            (global.fetch as jest.Mock).mockResolvedValue({ ok: false });

            const result = await saveUserMilestones(userId, milestones);

            expect(result).toBe(false);
        });

        it('should return false and log error on exception', async () => {
            (global.fetch as jest.Mock).mockRejectedValue(new Error('Sync failed'));

            const result = await saveUserMilestones(userId, milestones);

            expect(result).toBe(false);
            expect(console.error).toHaveBeenCalledWith('Failed to save milestones:', expect.any(Error));
        });
    });
});