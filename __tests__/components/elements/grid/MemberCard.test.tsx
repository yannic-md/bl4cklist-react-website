// noinspection DuplicatedCode

import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Member } from '@/types/Member';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import confetti from 'canvas-confetti';
import { isMilestoneUnlocked } from '@/lib/milestones/MilestoneEvents';
import { unlockMilestone } from '@/lib/milestones/MilestoneService';
import { useAvatarUrl } from '@/hooks/useAvatarUrl';
import {MemberCard} from "@/components/elements/grid/MemberCard";

// Mocks
jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));

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

jest.mock('canvas-confetti', () => jest.fn());

jest.mock('@/lib/milestones/MilestoneEvents', () => ({
    isMilestoneUnlocked: jest.fn(),
}));

jest.mock('@/lib/milestones/MilestoneService', () => ({
    unlockMilestone: jest.fn(),
}));

jest.mock('@/data/milestones', () => ({
    MILESTONES: {
        BIRTHDAY: {
            id: 'birthday-id',
            imageKey: 'birthday-image',
        },
    },
}));

jest.mock('@/hooks/useAvatarUrl', () => ({
    useAvatarUrl: jest.fn(),
}));

jest.mock('@/components/elements/misc/UsernameCopy', () => ({
    UsernameCopy: ({ children }: any) => <div data-testid="username-copy">{children}</div>,
}));

jest.mock('react-icons/fa', () => ({
    FaDiscord: () => <span data-testid="discord-icon">Discord</span>,
}));

describe('MemberCard', () => {
    const mockRouter = {
        push: jest.fn(),
        locale: 'de',
        pathname: '/',
        query: {},
    };

    const mockTranslations = {
        Misc: (key: string) => {
            const translations: Record<string, string> = {
                durationYear: 'Jahr',
                durationYears: 'Jahre',
                durationMonth: 'Monat',
                durationMonths: 'Monate',
            };
            return translations[key] || key;
        },
        TeamSection: (key: string) => {
            const translations: Record<string, string> = {
                rank_owner: 'Leitung',
            };
            return translations[key] || key;
        },
        MemberListSection: (key: string) => {
            const translations: Record<string, string> = {
                rankBirthday: 'Geburtstagskind',
                rankSponsor: 'Sponsor',
                rankBooster: 'Booster',
                rankRekrut: 'Rekrut',
                rankGhost: 'Geist',
                rankLvl: 'Level [level]',
                rankFormerStaff: 'Ehem. [rank] ([time])',
            };
            return translations[key] || key;
        },
    };

    const baseMember: Member = {
        social_media_url: null,
        user_id: '123456',
        user_name: 'testuser',
        user_display_name: 'Test User',
        user_avatar_url: 'https://example.com/avatar.png',
        rank: 'LVL50',
        staff_duration: undefined
    };

    beforeEach(() => {
        jest.useFakeTimers();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        (useTranslations as jest.Mock).mockImplementation((namespace: string) => mockTranslations[namespace as keyof typeof mockTranslations]);
        (useAvatarUrl as jest.Mock).mockReturnValue('https://example.com/avatar.png');
        (confetti as unknown as jest.Mock).mockClear();
        (isMilestoneUnlocked as jest.Mock).mockResolvedValue(false);
        (unlockMilestone as jest.Mock).mockResolvedValue(undefined);
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.useFakeTimers();
    });

    describe('Rendering', () => {
        it('should render member card with avatar and display name', () => {
            render(<MemberCard member={baseMember} />);

            expect(screen.getByAltText(/Test User's Avatar/i)).toBeInTheDocument();
            expect(screen.getByText('Test User')).toBeInTheDocument();
        });

        it('should render Discord profile link', () => {
            render(<MemberCard member={baseMember} />);

            const discordLink = screen.getByRole('link', { name: /Test User's Discord Profile/i });
            expect(discordLink).toHaveAttribute('href', 'https://discord.com/users/123456');
        });

        it('should render initials fallback when image fails to load', () => {
            render(<MemberCard member={baseMember} />);

            const image = screen.getByAltText(/Test User's Avatar/i);
            fireEvent.error(image);

            expect(screen.getByText('TE')).toBeInTheDocument();
        });

        it('should render non-GIF avatar without unoptimized prop', () => {
            render(<MemberCard member={baseMember} />);

            const image = screen.getByAltText(/Test User's Avatar/i);
            expect(image).not.toHaveAttribute('unoptimized');
        });
    });

    describe('Rank Colors', () => {
        it('should apply BIRTHDAY rank border color', () => {
            const birthdayMember = { ...baseMember, rank: 'BIRTHDAY' } as Member;
            const { container } = render(<MemberCard member={birthdayMember} />);

            expect(container.querySelector('.from-\\[\\#f3a683\\]\\/50')).toBeInTheDocument();
        });

        it('should apply SPONSOR rank border color', () => {
            const sponsorMember = { ...baseMember, rank: 'SPONSOR' } as Member;
            const { container } = render(<MemberCard member={sponsorMember} />);

            expect(container.querySelector('.from-\\[\\#ffbbec\\]\\/50')).toBeInTheDocument();
        });

        it('should apply BOOSTER rank border color', () => {
            const boosterMember = { ...baseMember, rank: 'BOOSTER' } as Member;
            const { container } = render(<MemberCard member={boosterMember} />);

            expect(container.querySelector('.from-\\[\\#f368e0\\]\\/50')).toBeInTheDocument();
        });

        it('should apply REKRUT rank border color', () => {
            const rekrutMember = { ...baseMember, rank: 'REKRUT' } as Member;
            const { container } = render(<MemberCard member={rekrutMember} />);

            expect(container.querySelector('.from-\\[\\#81ecec\\]\\/50')).toBeInTheDocument();
        });

        it('should apply EHEM_LEITUNG rank border color', () => {
            const ehemLeitungMember = { ...baseMember, rank: 'EHEM_LEITUNG', staff_duration: '31536000' } as Member;
            const { container } = render(<MemberCard member={ehemLeitungMember} />);

            expect(container.querySelector('.from-red-500\\/50')).toBeInTheDocument();
        });

        it('should apply EHEM_ADMIN rank border color', () => {
            const ehemAdminMember = { ...baseMember, rank: 'EHEM_ADMIN', staff_duration: '31536000' } as Member;
            const { container } = render(<MemberCard member={ehemAdminMember} />);

            expect(container.querySelector('.from-red-400\\/50')).toBeInTheDocument();
        });

        it('should apply EHEM_SENIOR rank border color', () => {
            const ehemSeniorMember = { ...baseMember, rank: 'EHEM_SENIOR', staff_duration: '31536000' } as Member;
            const { container } = render(<MemberCard member={ehemSeniorMember} />);

            expect(container.querySelector('.from-blue-500\\/50')).toBeInTheDocument();
        });

        it('should apply EHEM_MOD rank border color', () => {
            const ehemModMember = { ...baseMember, rank: 'EHEM_MOD', staff_duration: '31536000' } as Member;
            const { container } = render(<MemberCard member={ehemModMember} />);

            expect(container.querySelector('.from-sky-400\\/50')).toBeInTheDocument();
        });

        it('should apply GHOST rank border color', () => {
            const ghostMember = { ...baseMember, rank: 'GHOST' } as Member;
            const { container } = render(<MemberCard member={ghostMember} />);

            expect(container.querySelector('.from-sky-400\\/50')).toBeInTheDocument();
        });

        it('should apply LVL50 rank border color', () => {
            const lvl50Member = { ...baseMember, rank: 'LVL50' } as Member;
            const { container } = render(<MemberCard member={lvl50Member} />);

            expect(container.querySelector('.from-\\[\\#ee9d4a\\]\\/50')).toBeInTheDocument();
        });

        it('should apply LVL75 rank border color', () => {
            const lvl75Member = { ...baseMember, rank: 'LVL75' } as Member;
            const { container } = render(<MemberCard member={lvl75Member} />);

            expect(container.querySelector('.from-\\[\\#ff947a\\]\\/50')).toBeInTheDocument();
        });

        it('should apply LVL100 rank border color', () => {
            const lvl100Member = { ...baseMember, rank: 'LVL100' } as Member;
            const { container } = render(<MemberCard member={lvl100Member} />);

            expect(container.querySelector('.from-\\[\\#c7ecee\\]\\/50')).toBeInTheDocument();
        });

        it('should apply LVL125 rank border color', () => {
            const lvl125Member = { ...baseMember, rank: 'LVL125' } as Member;
            const { container } = render(<MemberCard member={lvl125Member} />);

            expect(container.querySelector('.from-\\[\\#ff597e\\]\\/50')).toBeInTheDocument();
        });

        it('should apply default rank border color for unknown rank', () => {
            const unknownMember = {...baseMember, rank: 'UNKNOWN'} as unknown as Member;
            const { container } = render(<MemberCard member={unknownMember} />);

            expect(container.querySelector('.from-\\[\\#1b1f2f\\]')).toBeInTheDocument();
        });
    });

    describe('Rank Labels', () => {
        it('should display BIRTHDAY rank label', () => {
            const birthdayMember = { ...baseMember, rank: 'BIRTHDAY' } as Member;
            render(<MemberCard member={birthdayMember} />);

            expect(screen.getByText('Geburtstagskind')).toBeInTheDocument();
        });

        it('should display SPONSOR rank label', () => {
            const sponsorMember = { ...baseMember, rank: 'SPONSOR' } as Member;
            render(<MemberCard member={sponsorMember} />);

            expect(screen.getByText('Sponsor')).toBeInTheDocument();
        });

        it('should display BOOSTER rank label', () => {
            const boosterMember = { ...baseMember, rank: 'BOOSTER' } as Member;
            render(<MemberCard member={boosterMember} />);

            expect(screen.getByText('Booster')).toBeInTheDocument();
        });

        it('should display REKRUT rank label', () => {
            const rekrutMember = { ...baseMember, rank: 'REKRUT' } as Member;
            render(<MemberCard member={rekrutMember} />);

            expect(screen.getByText('Rekrut')).toBeInTheDocument();
        });

        it('should display GHOST rank label', () => {
            const ghostMember = { ...baseMember, rank: 'GHOST' } as Member;
            render(<MemberCard member={ghostMember} />);

            expect(screen.getByText('Geist')).toBeInTheDocument();
        });

        it('should display LVL50 rank label', () => {
            const lvl50Member = { ...baseMember, rank: 'LVL50' } as Member;
            render(<MemberCard member={lvl50Member} />);

            expect(screen.getByText('Level 50')).toBeInTheDocument();
        });

        it('should display LVL75 rank label', () => {
            const lvl75Member = { ...baseMember, rank: 'LVL75' } as Member;
            render(<MemberCard member={lvl75Member} />);

            expect(screen.getByText('Level 75')).toBeInTheDocument();
        });

        it('should display former staff label with years (plural)', () => {
            const ehemMember = { ...baseMember, rank: 'EHEM_LEITUNG', staff_duration: '63072000' } as Member; // 2 years
            render(<MemberCard member={ehemMember} />);

            expect(screen.getByText('Ehem. Leitung (2 Jahre)')).toBeInTheDocument();
        });

        it('should display former staff label with year (singular)', () => {
            const ehemMember = { ...baseMember, rank: 'EHEM_LEITUNG', staff_duration: '31536000' } as Member; // 1 year
            render(<MemberCard member={ehemMember} />);

            expect(screen.getByText('Ehem. Leitung (1 Jahr)')).toBeInTheDocument();
        });

        it('should display former staff label with months (plural)', () => {
            const ehemMember = { ...baseMember, rank: 'EHEM_ADMIN', staff_duration: '5184000' } as Member; // 2 months
            render(<MemberCard member={ehemMember} />);

            expect(screen.getByText('Ehem. Administrator (2 Monate)')).toBeInTheDocument();
        });

        it('should display former staff label with month (singular)', () => {
            const ehemMember = { ...baseMember, rank: 'EHEM_ADMIN', staff_duration: '2592000' } as Member; // 1 month
            render(<MemberCard member={ehemMember} />);

            expect(screen.getByText('Ehem. Administrator (1 Monat)')).toBeInTheDocument();
        });

        it('should display former EHEM_SENIOR label', () => {
            const ehemSeniorMember = { ...baseMember, rank: 'EHEM_SENIOR', staff_duration: '5184000' } as Member;
            render(<MemberCard member={ehemSeniorMember} />);

            expect(screen.getByText('Ehem. Sr. Moderator (2 Monate)')).toBeInTheDocument();
        });

        it('should display former EHEM_MOD label', () => {
            const ehemModMember = { ...baseMember, rank: 'EHEM_MOD', staff_duration: '5184000' } as Member;
            render(<MemberCard member={ehemModMember} />);

            expect(screen.getByText('Ehem. Moderator (2 Monate)')).toBeInTheDocument();
        });

        it('should return empty string for unknown EHEM rank', () => {
            const ehemUnknownMember = {...baseMember, rank: 'EHEM_UNKNOWN', staff_duration: '5184000'} as unknown as Member;
            render(<MemberCard member={ehemUnknownMember} />);

            expect(screen.queryByText(/Ehem\./)).not.toBeInTheDocument();
        });

        it('should return empty string for unknown rank', () => {
            const unknownMember = {...baseMember, rank: 'UNKNOWN'} as unknown as Member;
            render(<MemberCard member={unknownMember} />);

            const rankElement = screen.queryByText(/Level|Ehem\.|Geburtstag|Sponsor|Booster|Rekrut|Geist/);
            expect(rankElement).not.toBeInTheDocument();
        });
    });

    describe('Ghost Interaction', () => {
        it('should grow ghost on mouse enter and remove after fade', () => {
            const onRemove = jest.fn();
            const ghostMember = { ...baseMember, rank: 'GHOST' } as Member;
            const { container } = render(<MemberCard member={ghostMember} onRemove={onRemove} />);

            const card = container.firstChild as HTMLElement;
            fireEvent.mouseEnter(card);

            expect(card.className).toContain('scale-110');

            act(() => {
                jest.advanceTimersByTime(1000);
            });

            expect(card.className).toContain('scale-115');
            expect(card.className).toContain('opacity-0');

            act(() => {
                jest.advanceTimersByTime(500);
            });

            expect(onRemove).toHaveBeenCalled();
        });

        it('should cancel ghost growth on mouse leave', () => {
            const onRemove = jest.fn();
            const ghostMember = { ...baseMember, rank: 'GHOST' } as Member;
            const { container } = render(<MemberCard member={ghostMember} onRemove={onRemove} />);

            const card = container.firstChild as HTMLElement;
            fireEvent.mouseEnter(card);

            expect(card.className).toContain('scale-110');

            fireEvent.mouseLeave(card);

            act(() => {
                jest.advanceTimersByTime(1500);
            });

            expect(onRemove).not.toHaveBeenCalled();
            expect(card.className).toContain('scale-100');
        });

        it('should not trigger removal if ghost is already fading', () => {
            const onRemove = jest.fn();
            const ghostMember = { ...baseMember, rank: 'GHOST' } as Member;
            const { container } = render(<MemberCard member={ghostMember} onRemove={onRemove} />);

            const card = container.firstChild as HTMLElement;
            fireEvent.mouseEnter(card);

            act(() => {
                jest.advanceTimersByTime(1000);
            });

            fireEvent.mouseEnter(card);

            act(() => {
                jest.advanceTimersByTime(1500);
            });

            expect(onRemove).toHaveBeenCalledTimes(1);
        });

        it('should not do anything on mouse leave if ghost is not growing', () => {
            const ghostMember = { ...baseMember, rank: 'GHOST' } as Member;
            const { container } = render(<MemberCard member={ghostMember} />);

            const card = container.firstChild as HTMLElement;
            fireEvent.mouseLeave(card);

            expect(card.className).toContain('scale-100');
        });

        it('should not remove ghost if onRemove callback is not provided', () => {
            const ghostMember = { ...baseMember, rank: 'GHOST' } as Member;
            const { container } = render(<MemberCard member={ghostMember} />);

            const card = container.firstChild as HTMLElement;
            fireEvent.mouseEnter(card);

            act(() => {
                jest.advanceTimersByTime(1500);
            });

            expect(container.firstChild).toBeInTheDocument();
        });
    });

    describe('Birthday Confetti', () => {
        beforeEach(() => {
            // Mock getBoundingClientRect
            Element.prototype.getBoundingClientRect = jest.fn(() => ({
                left: 100,
                top: 100,
                width: 200,
                height: 100,
                right: 300,
                bottom: 200,
                x: 100,
                y: 100,
                toJSON: () => {},
            }));

            Object.defineProperty(window, 'innerWidth', { value: 1000, writable: true });
            Object.defineProperty(window, 'innerHeight', { value: 800, writable: true });
        });

        it('should trigger confetti on birthday member hover', async () => {
            const birthdayMember = { ...baseMember, rank: 'BIRTHDAY' } as Member;
            const { container } = render(<MemberCard member={birthdayMember} />);

            const card = container.firstChild as HTMLElement;

            await act(async () => {
                fireEvent.mouseEnter(card);
            });

            await waitFor(() => {
                expect(confetti).toHaveBeenCalledWith(
                    expect.objectContaining({
                        particleCount: 50,
                        spread: 70,
                    })
                );
            });
        });

        it('should unlock birthday milestone if not already unlocked', async () => {
            (isMilestoneUnlocked as jest.Mock).mockResolvedValue(false);
            const birthdayMember = { ...baseMember, rank: 'BIRTHDAY' } as Member;
            const { container } = render(<MemberCard member={birthdayMember} />);

            const card = container.firstChild as HTMLElement;
            jest.advanceTimersByTime(4000);

            await act(async () => {
                fireEvent.mouseEnter(card);
            });

            await waitFor(() => {
                expect(unlockMilestone).toHaveBeenCalled();
            });
        });

        it('should not unlock birthday milestone if already unlocked', async () => {
            (isMilestoneUnlocked as jest.Mock).mockResolvedValue(true);
            const birthdayMember = { ...baseMember, rank: 'BIRTHDAY' } as Member;
            const { container } = render(<MemberCard member={birthdayMember} />);

            const card = container.firstChild as HTMLElement;

            await act(async () => {
                fireEvent.mouseEnter(card);
            });

            await waitFor(() => {
                expect(unlockMilestone).not.toHaveBeenCalled();
            });
        });

        it('should trigger sparkle confetti after 100ms', async () => {
            jest.advanceTimersByTime(10000);

            const birthdayMember = { ...baseMember, rank: 'BIRTHDAY' } as Member;
            const { container } = render(<MemberCard member={birthdayMember} />);

            const card = container.firstChild as HTMLElement;

            await act(async () => {
                fireEvent.mouseEnter(card);
            });

            await waitFor(() => {
                expect(confetti).toHaveBeenCalledWith(
                    expect.objectContaining({ particleCount: 50 })
                );
            });

            act(() => {
                jest.advanceTimersByTime(101);
            });

            await waitFor(() => {
                expect(confetti).toHaveBeenCalledWith(
                    expect.objectContaining({
                        particleCount: 20,
                        spread: 50,
                    })
                );
            });
        });

        it('should respect 3 second cooldown between birthday hovers', async () => {
            jest.advanceTimersByTime(20000);

            const birthdayMember1 = {...baseMember, rank: 'BIRTHDAY', user_id: '1'} as Member;
            const birthdayMember2 = {...baseMember, rank: 'BIRTHDAY', user_id: '999'} as Member;

            const {getAllByTestId} = render(
                <>
                    <div data-testid="card1"><MemberCard member={birthdayMember1}/></div>
                    <div data-testid="card2"><MemberCard member={birthdayMember2}/></div>
                </>
            );

            const card1 = screen.getByTestId('card1').firstChild as HTMLElement;
            const card2 = screen.getByTestId('card2').firstChild as HTMLElement;

            // first hover (should shoot confetti)
            await act(async () => {
                fireEvent.mouseEnter(card1);
            });

            await waitFor(() => {
                expect(confetti).toHaveBeenCalled();
            }, {timeout: 1000});

            (confetti as unknown as jest.Mock).mockClear();

            // second hover (should NOT shoot confetti)
            await act(async () => {
                fireEvent.mouseEnter(card2);
            });

            expect(confetti).not.toHaveBeenCalled();

            act(() => {
                jest.advanceTimersByTime(3001);
            });

            // third hover (should shoot confetti - AFTER COOLDOWN)
            await act(async () => {
                fireEvent.mouseEnter(card2);
            });

            await waitFor(() => {
                expect(confetti).toHaveBeenCalled();
            });
        });

        it('should use "de" locale for milestone unlock when router locale is "de"', async () => {
            jest.advanceTimersByTime(30000);
            (isMilestoneUnlocked as jest.Mock).mockResolvedValue(false);
            (useRouter as jest.Mock).mockReturnValue({ ...mockRouter, locale: 'de' });

            const birthdayMember = { ...baseMember, rank: 'BIRTHDAY' } as Member;
            const { container } = render(<MemberCard member={birthdayMember} />);

            const card = container.firstChild as HTMLElement;

            await act(async () => {
                fireEvent.mouseEnter(card);
            });

            await waitFor(() => {
                expect(unlockMilestone).toHaveBeenCalledWith(
                    expect.anything(),
                    expect.anything(),
                    'de'
                );
            });
        });

        it('should use "en" locale for milestone unlock when router locale is "en"', async () => {
            jest.advanceTimersByTime(40000);
            (isMilestoneUnlocked as jest.Mock).mockResolvedValue(false);
            (useRouter as jest.Mock).mockReturnValue({ ...mockRouter, locale: 'en' });

            const birthdayMember = { ...baseMember, rank: 'BIRTHDAY' } as Member;
            const { container } = render(<MemberCard member={birthdayMember} />);

            const card = container.firstChild as HTMLElement;

            await act(async () => {
                fireEvent.mouseEnter(card);
            });

            await waitFor(() => {
                expect(unlockMilestone).toHaveBeenCalledWith(
                    expect.anything(),
                    expect.anything(),
                    'en'
                );
            });
        });

        it('should fallback to "de" locale for milestone unlock when router locale is unsupported', async () => {
            jest.advanceTimersByTime(50000);
            (isMilestoneUnlocked as jest.Mock).mockResolvedValue(false);
            (useRouter as jest.Mock).mockReturnValue({ ...mockRouter, locale: 'fr' });

            const birthdayMember = { ...baseMember, rank: 'BIRTHDAY' } as Member;
            const { container } = render(<MemberCard member={birthdayMember} />);

            const card = container.firstChild as HTMLElement;

            await act(async () => {
                fireEvent.mouseEnter(card);
            });

            await waitFor(() => {
                expect(unlockMilestone).toHaveBeenCalledWith(
                    expect.anything(),
                    expect.anything(),
                    'de'
                );
            });
        });
    });

    describe('Mouse Hover Behavior', () => {
        it('should call useAvatarUrl with isHovered true on mouse enter', () => {
            render(<MemberCard member={baseMember} />);
            const card = screen.getByText('Test User').closest('div')?.parentElement?.parentElement;

            fireEvent.mouseEnter(card!);

            expect(useAvatarUrl).toHaveBeenCalledWith(
                expect.objectContaining({ isHovered: true })
            );
        });

        it('should call useAvatarUrl with isHovered false on mouse leave', () => {
            render(<MemberCard member={baseMember} />);
            const card = screen.getByText('Test User').closest('div')?.parentElement?.parentElement;

            fireEvent.mouseEnter(card!);
            fireEvent.mouseLeave(card!);

            expect(useAvatarUrl).toHaveBeenCalledWith(
                expect.objectContaining({ isHovered: false })
            );
        });

        it('should not trigger confetti for non-birthday members', async () => {
            const regularMember = {...baseMember, rank: 'LVL50'} as Member;
            const { container } = render(<MemberCard member={regularMember} />);

            const card = container.firstChild as HTMLElement;

            await act(async () => {
                fireEvent.mouseEnter(card);
            });

            expect(confetti).not.toHaveBeenCalled();
        });
    });

    describe('getInitials', () => {
        it('should extract two initials from display name', () => {
            render(<MemberCard member={baseMember} />);

            const image = screen.getByAltText(/Test User's Avatar/i);
            fireEvent.error(image);

            expect(screen.getByText('TE')).toBeInTheDocument();
        });

        it('should handle single character name', () => {
            const singleCharMember = { ...baseMember, user_name: 'A', user_display_name: 'B' };
            render(<MemberCard member={singleCharMember} />);

            const image = screen.getByAltText(/B's Avatar/i);
            fireEvent.error(image);

            expect(screen.getByText('B')).toBeInTheDocument();
        });
    });
});