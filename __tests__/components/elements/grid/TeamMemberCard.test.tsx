import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import { useTranslations } from 'next-intl';
import { Member } from '@/types/Member';
import { useAvatarUrl } from '@/hooks/useAvatarUrl';
import TeamMemberCard from "@/components/elements/grid/TeamMemberCard";

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

jest.mock('@/components/elements/misc/UsernameCopy', () => ({
    UsernameCopy: ({ username, displayName, userId }: any) => (
        <div data-testid="username-copy">{displayName || username}</div>
    ),
}));

jest.mock('@/hooks/useAvatarUrl', () => ({
    useAvatarUrl: jest.fn(),
}));

describe('TeamMemberCard', () => {
    const mockTranslations: Record<string, string> = {
        rank_owner: 'Owner',
        rank_developer: 'Developer',
        rank_helper: 'Helper',
        rank_owner_desc: 'Owner description',
        rank_admin_desc: 'Admin description',
        rank_senior_desc: 'Senior description',
        rank_dev_desc: 'Developer description',
        rank_mod_desc: 'Moderator description',
        rank_helper_desc: 'Helper description',
    };

    const mockTTeam = jest.fn((key: string) => mockTranslations[key] || key);

    const baseMember: Member = {
        user_id: '123456789',
        user_name: 'testuser',
        user_display_name: 'Test User',
        user_avatar_url: 'https://example.com/avatar.png',
        rank: 'MODERATOR',
        social_media_url: '',
    };

    beforeEach(() => {
        (useTranslations as jest.Mock).mockReturnValue(mockTTeam);
        (useAvatarUrl as jest.Mock).mockReturnValue('https://example.com/avatar.png');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Rendering', () => {
        it('should render member card with basic information', () => {
            render(<TeamMemberCard member={baseMember} />);

            expect(screen.getByTestId('username-copy')).toBeInTheDocument();
            expect(screen.getByText('Server-Moderator')).toBeInTheDocument();
        });

        it('should render avatar image when user_avatar_url is provided', () => {
            render(<TeamMemberCard member={baseMember} />);

            const avatar = screen.getByAltText(/Test User Avatar/);
            expect(avatar).toBeInTheDocument();
            expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.png');
        });

        it('should render fallback avatar when user_avatar_url is empty', () => {
            const memberWithoutAvatar: Member = { ...baseMember, user_avatar_url: '' };
            render(<TeamMemberCard member={memberWithoutAvatar} />);

            const fallback = screen.getByText('12');
            expect(fallback).toBeInTheDocument();
        });

        it('should display first 2 characters of user_id when user_name length > 1', () => {
            const memberWithoutAvatar: Member = {
                ...baseMember,
                user_avatar_url: '',
                user_name: 'ab',
                user_id: '987654321'
            };
            render(<TeamMemberCard member={memberWithoutAvatar} />);

            expect(screen.getByText('98')).toBeInTheDocument();
        });

        it('should display uppercase user_name when user_name length is 1', () => {
            const memberWithoutAvatar: Member = {
                ...baseMember,
                user_avatar_url: '',
                user_name: 'x'
            };
            render(<TeamMemberCard member={memberWithoutAvatar} />);

            expect(screen.getByText('X')).toBeInTheDocument();
        });
    });

    describe('Rank Rendering', () => {
        it('should render LEITUNG rank correctly', () => {
            const member: Member = { ...baseMember, rank: 'LEITUNG' };
            render(<TeamMemberCard member={member} />);

            expect(screen.getByText('Owner')).toBeInTheDocument();
            expect(screen.getByText('Owner description')).toBeInTheDocument();
        });

        it('should render ADMIN rank correctly', () => {
            const member: Member = { ...baseMember, rank: 'ADMIN' };
            render(<TeamMemberCard member={member} />);

            expect(screen.getByText('Administrator')).toBeInTheDocument();
            expect(screen.getByText('Admin description')).toBeInTheDocument();
        });

        it('should render SENIOR rank correctly', () => {
            const member: Member = { ...baseMember, rank: 'SENIOR' };
            render(<TeamMemberCard member={member} />);

            expect(screen.getByText('Senior-Moderator')).toBeInTheDocument();
            expect(screen.getByText('Senior description')).toBeInTheDocument();
        });

        it('should render ENTWICKLER rank correctly', () => {
            const member: Member = { ...baseMember, rank: 'ENTWICKLER' };
            render(<TeamMemberCard member={member} />);

            expect(screen.getByText('Developer')).toBeInTheDocument();
            expect(screen.getByText('Developer description')).toBeInTheDocument();
        });

        it('should render MODERATOR rank correctly', () => {
            const member: Member = { ...baseMember, rank: 'MODERATOR' };
            render(<TeamMemberCard member={member} />);

            expect(screen.getByText('Server-Moderator')).toBeInTheDocument();
            expect(screen.getByText('Moderator description')).toBeInTheDocument();
        });

        it('should render HELFER rank correctly', () => {
            const member: Member = { ...baseMember, rank: 'HELFER' };
            render(<TeamMemberCard member={member} />);

            expect(screen.getByText('Helper')).toBeInTheDocument();
            expect(screen.getByText('Helper description')).toBeInTheDocument();
        });

        it('should render empty string for unknown rank', () => {
            const member: Member = { ...baseMember, rank: 'UNKNOWN' as any };
            const { container } = render(<TeamMemberCard member={member} />);

            const rankElements = container.querySelectorAll('p.text-xs');
            expect(rankElements[0]).toHaveTextContent('');
        });
    });

    describe('Social Media Links', () => {
        it('should render Discord link', () => {
            render(<TeamMemberCard member={baseMember} />);

            const discordLink = screen.getByLabelText('Discord');
            expect(discordLink).toHaveAttribute('href', 'https://discord.com/users/123456789');
        });

        it('should render YouTube social media link', () => {
            const member: Member = { ...baseMember, social_media_url: 'https://youtube.com/channel123' };
            render(<TeamMemberCard member={member} />);

            const socialLink = screen.getByLabelText('YouTube');
            expect(socialLink).toHaveAttribute('href', 'https://youtube.com/channel123');
        });

        it('should render Twitter social media link', () => {
            const member: Member = { ...baseMember, social_media_url: 'https://twitter.com/user' };
            render(<TeamMemberCard member={member} />);

            const socialLink = screen.getByLabelText('Twitter');
            expect(socialLink).toBeInTheDocument();
        });

        it('should render Instagram social media link', () => {
            const member: Member = { ...baseMember, social_media_url: 'https://instagram.com/user' };
            render(<TeamMemberCard member={member} />);

            const socialLink = screen.getByLabelText('Instagram');
            expect(socialLink).toBeInTheDocument();
        });

        it('should render TikTok social media link', () => {
            const member: Member = { ...baseMember, social_media_url: 'https://tiktok.com/@user' };
            render(<TeamMemberCard member={member} />);

            const socialLink = screen.getByLabelText('TikTok');
            expect(socialLink).toBeInTheDocument();
        });

        it('should render GitHub social media link', () => {
            const member: Member = { ...baseMember, social_media_url: 'https://github.com/user' };
            render(<TeamMemberCard member={member} />);

            const socialLink = screen.getByLabelText('GitHub');
            expect(socialLink).toBeInTheDocument();
        });

        it('should render Twitch social media link', () => {
            const member: Member = { ...baseMember, social_media_url: 'https://twitch.tv/user' };
            render(<TeamMemberCard member={member} />);

            const socialLink = screen.getByLabelText('Twitch');
            expect(socialLink).toBeInTheDocument();
        });

        it('should render External Link for unknown social media URL', () => {
            const member: Member = { ...baseMember, social_media_url: 'https://unknown-site.com/user' };
            render(<TeamMemberCard member={member} />);

            const socialLink = screen.getByLabelText('External Link');
            expect(socialLink).toBeInTheDocument();
        });

        it('should not render social media link when social_media_url is empty', () => {
            const member: Member = { ...baseMember, social_media_url: '' };
            render(<TeamMemberCard member={member} />);

            const socialLinks = screen.queryAllByRole('link');
            expect(socialLinks).toHaveLength(1); // Only Discord link
        });

        it('should handle URL with www prefix', () => {
            const member: Member = { ...baseMember, social_media_url: 'https://www.youtube.com/channel' };
            render(<TeamMemberCard member={member} />);

            const socialLink = screen.getByLabelText('YouTube');
            expect(socialLink).toBeInTheDocument();
        });

        it('should handle URL without https protocol', () => {
            // noinspection HttpUrlsUsage
            const member: Member = { ...baseMember, social_media_url: 'http://youtube.com/channel' };
            render(<TeamMemberCard member={member} />);

            const socialLink = screen.getByLabelText('YouTube');
            expect(socialLink).toBeInTheDocument();
        });

        it('should handle x.com as Twitter', () => {
            const member: Member = { ...baseMember, social_media_url: 'https://x.com/user' };
            render(<TeamMemberCard member={member} />);

            const socialLink = screen.getByLabelText('Twitter');
            expect(socialLink).toBeInTheDocument();
        });

        it('should handle youtu.be as YouTube', () => {
            const member: Member = { ...baseMember, social_media_url: 'https://youtu.be/video123' };
            render(<TeamMemberCard member={member} />);

            const socialLink = screen.getByLabelText('YouTube');
            expect(socialLink).toBeInTheDocument();
        });
    });

    describe('Avatar Interaction', () => {
        it('should call useAvatarUrl with isHovered false initially', () => {
            render(<TeamMemberCard member={baseMember} />);

            expect(useAvatarUrl).toHaveBeenCalledWith({
                avatarUrl: 'https://example.com/avatar.png',
                isHovered: false,
            });
        });

        it('should call useAvatarUrl with isHovered true on mouse enter', async () => {
            const { container } = render(<TeamMemberCard member={baseMember} />);
            const cardWrapper = container.firstChild as HTMLElement;

            fireEvent.mouseEnter(cardWrapper);

            await waitFor(() => {
                expect(useAvatarUrl).toHaveBeenCalledWith({
                    avatarUrl: 'https://example.com/avatar.png',
                    isHovered: true,
                });
            });
        });

        it('should call useAvatarUrl with isHovered false on mouse leave', async () => {
            const { container } = render(<TeamMemberCard member={baseMember} />);
            const cardWrapper = container.firstChild as HTMLElement;

            fireEvent.mouseEnter(cardWrapper);
            fireEvent.mouseLeave(cardWrapper);

            await waitFor(() => {
                expect(useAvatarUrl).toHaveBeenCalledWith({
                    avatarUrl: 'https://example.com/avatar.png',
                    isHovered: false,
                });
            });
        });

        it('should not set unoptimized when avatar URL does not contain .gif', () => {
            render(<TeamMemberCard member={baseMember} />);

            const avatar = screen.getByAltText(/Test User Avatar/);
            expect(avatar).not.toHaveAttribute('unoptimized');
        });

        it('should show fallback avatar on image error', () => {
            const { container } = render(<TeamMemberCard member={baseMember} />);
            const avatar = screen.getByAltText(/Test User Avatar/);

            fireEvent.error(avatar);

            const fallback = container.querySelector('div.rounded-lg.bg-gradient-to-br');
            expect(avatar).toHaveStyle('display: none');
            expect(fallback).not.toBeNull();
            expect(fallback).toHaveStyle('display: flex');
        });

        it('should not show fallback if nextElementSibling is null on image error', () => {
            const { container } = render(<TeamMemberCard member={baseMember} />);
            const avatar = screen.getByAltText(/Test User Avatar/) as HTMLImageElement;

            // Remove nextElementSibling to simulate null case
            Object.defineProperty(avatar, 'nextElementSibling', {
                get: () => null,
                configurable: true,
            });

            avatar.dispatchEvent(new Event('error'));

            expect(avatar).toHaveStyle({ display: 'none' });
        });
    });
});