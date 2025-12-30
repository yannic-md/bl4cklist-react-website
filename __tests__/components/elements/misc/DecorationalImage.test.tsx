// noinspection DuplicatedCode

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import {isMilestoneUnlocked} from "@/lib/milestones/MilestoneEvents";
import {unlockMilestone} from "@/lib/milestones/MilestoneService";
import DecorationalImage from "@/components/elements/misc/DecorationalImage";

// Mock Setup
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

jest.mock('@/lib/milestones/MilestoneEvents', () => ({
    isMilestoneUnlocked: jest.fn(),
}));

jest.mock('@/lib/milestones/MilestoneService', () => ({
    unlockMilestone: jest.fn(),
}));

jest.mock('@/components/animations/AnimateOnView', () => {
    const MockAnimate = ({ children, className }: any) => (
        <div data-testid="animate-on-view" className={className}>
            {children}
        </div>
    );
    return {__esModule: true, AnimateOnView: MockAnimate};
});

jest.mock('@/data/milestones', () => ({
    MILESTONES: {
        BOTSDEAD: {
            id: 'botsdead-id',
            imageKey: 'botsdead-image',
        },
    },
}));

jest.mock('@/styles/util/animations.module.css', () => ({
    animate_slideOutRight: 'animate-slide-out-right',
}));

describe('DecorationalImage', () => {
    const mockRouter = {
        locale: 'de',
        pathname: '/',
        push: jest.fn(),
        replace: jest.fn(),
        query: {},
        asPath: '/',
    };

    const mockTranslations = jest.fn((key: string) => {
        const translations: Record<string, string> = {
            ripBots: 'R.I.P. Bots',
        };
        return translations[key] || key;
    });

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        (useTranslations as jest.Mock).mockReturnValue(mockTranslations);
        (isMilestoneUnlocked as jest.Mock).mockResolvedValue(false);
        (unlockMilestone as jest.Mock).mockResolvedValue(undefined);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render gravestone image', () => {
        render(<DecorationalImage />);

        const image = screen.getByAltText(/Gravestone - Bl4cklist/i);
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', '/images/icons/gravestone-128w.webp');
        expect(image).toHaveAttribute('width', '128');
        expect(image).toHaveAttribute('height', '128');
    });

    it('should show tooltip on hover when not clicked', () => {
        render(<DecorationalImage />);

        const gravestoneContainer = screen.getByAltText(/Gravestone - Bl4cklist/i).closest('div');

        expect(screen.queryByText(/R.I.P. Bots/i)).not.toBeInTheDocument();

        fireEvent.mouseEnter(gravestoneContainer!.parentElement!);

        expect(screen.getByText(/R.I.P. Bots/i)).toBeInTheDocument();
        expect(screen.getByText(/💐/i)).toBeInTheDocument();
    });

    it('should hide tooltip on mouse leave', () => {
        render(<DecorationalImage />);

        const gravestoneContainer = screen.getByAltText(/Gravestone - Bl4cklist/i).closest('div');

        fireEvent.mouseEnter(gravestoneContainer!.parentElement!);
        expect(screen.getByText(/R.I.P. Bots/i)).toBeInTheDocument();

        fireEvent.mouseLeave(gravestoneContainer!.parentElement!);
        expect(screen.queryByText(/R.I.P. Bots/i)).not.toBeInTheDocument();
    });

    it('should not show tooltip after click', () => {
        render(<DecorationalImage />);

        const gravestoneContainer = screen.getByAltText(/Gravestone - Bl4cklist/i).closest('div');

        fireEvent.click(gravestoneContainer!.parentElement!);
        fireEvent.mouseEnter(gravestoneContainer!.parentElement!);

        expect(screen.queryByText(/R.I.P. Bots/i)).not.toBeInTheDocument();
    });

    it('should unlock milestone on click when not already unlocked', async () => {
        (isMilestoneUnlocked as jest.Mock).mockResolvedValue(false);

        render(<DecorationalImage />);

        const gravestoneContainer = screen.getByAltText(/Gravestone - Bl4cklist/i).closest('div');

        fireEvent.click(gravestoneContainer!.parentElement!);

        await waitFor(() => {
            expect(isMilestoneUnlocked).toHaveBeenCalledWith('botsdead-id');
        });

        await waitFor(() => {
            expect(unlockMilestone).toHaveBeenCalledWith(
                'botsdead-id',
                'botsdead-image',
                'de'
            );
        });
    });

    it('should not unlock milestone on click when already unlocked', async () => {
        (isMilestoneUnlocked as jest.Mock).mockResolvedValue(true);

        render(<DecorationalImage />);

        const gravestoneContainer = screen.getByAltText(/Gravestone - Bl4cklist/i).closest('div');

        fireEvent.click(gravestoneContainer!.parentElement!);

        await waitFor(() => {
            expect(isMilestoneUnlocked).toHaveBeenCalledWith('botsdead-id');
        });

        expect(unlockMilestone).not.toHaveBeenCalled();
    });

    it('should use "en" locale when router locale is "en"', async () => {
        (useRouter as jest.Mock).mockReturnValue({ ...mockRouter, locale: 'en' });
        (isMilestoneUnlocked as jest.Mock).mockResolvedValue(false);

        render(<DecorationalImage />);

        const gravestoneContainer = screen.getByAltText(/Gravestone - Bl4cklist/i).closest('div');

        fireEvent.click(gravestoneContainer!.parentElement!);

        await waitFor(() => {
            expect(unlockMilestone).toHaveBeenCalledWith(
                'botsdead-id',
                'botsdead-image',
                'en'
            );
        });
    });

    it('should default to "de" locale when router locale is neither "de" nor "en"', async () => {
        (useRouter as jest.Mock).mockReturnValue({ ...mockRouter, locale: 'fr' });
        (isMilestoneUnlocked as jest.Mock).mockResolvedValue(false);

        render(<DecorationalImage />);

        const gravestoneContainer = screen.getByAltText(/Gravestone - Bl4cklist/i).closest('div');

        fireEvent.click(gravestoneContainer!.parentElement!);

        await waitFor(() => {
            expect(unlockMilestone).toHaveBeenCalledWith(
                'botsdead-id',
                'botsdead-image',
                'de'
            );
        });
    });

    it('should default to "de" locale when router locale is undefined', async () => {
        (useRouter as jest.Mock).mockReturnValue({ ...mockRouter, locale: undefined });
        (isMilestoneUnlocked as jest.Mock).mockResolvedValue(false);

        render(<DecorationalImage />);

        const gravestoneContainer = screen.getByAltText(/Gravestone - Bl4cklist/i).closest('div');

        fireEvent.click(gravestoneContainer!.parentElement!);

        await waitFor(() => {
            expect(unlockMilestone).toHaveBeenCalledWith(
                'botsdead-id',
                'botsdead-image',
                'de'
            );
        });
    });
});