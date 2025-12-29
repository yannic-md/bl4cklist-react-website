// noinspection DuplicatedCode

import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { useTranslations } from 'next-intl';
import { useMilestones } from '@/hooks/useMilestones';
import { saveUserMilestones } from '@/lib/api';
import {getUnlockedMilestones} from "@/lib/milestones/MilestoneEvents";
import EasterMenu from "@/components/elements/misc/EasterMenu";

// Mocks
jest.mock('next-intl', () => ({
    useTranslations: jest.fn(),
}));

jest.mock('@/hooks/useMilestones', () => ({
    useMilestones: jest.fn(),
}));

jest.mock('@/lib/api', () => ({
    saveUserMilestones: jest.fn(),
}));

jest.mock('@/data/milestones', () => ({
    MILESTONES: {
        milestone1: { id: 'id1', imageKey: 'key1', icon: '🎯' },
        milestone2: { id: 'id2', imageKey: 'key2', icon: '🏆' },
    },
}))

jest.mock('@/lib/milestones/MilestoneEvents', () => ({
    getUnlockedMilestones: jest.fn(),
}));

jest.mock('@/types/APIResponse', () => ({
    TOTAL_MILESTONES: 10,
}));

jest.mock('next/image', () => ({
    __esModule: true,
    default: ({fill, unoptimized, priority, src, alt, ...rest}: any) => {
        // eslint-disable-next-line @next/next/no-img-element
        return ( <img src={src} alt={alt || ""}{...rest} /> );
    },
}));

describe('EasterMenu', () => {
    const mockTGenericMenu = jest.fn((key: string) => `GenericMenu.${key}`);
    const mockTForm = jest.fn((key: string) => `Form.${key}`);
    const mockSaveUserMilestones = saveUserMilestones as jest.Mock;
    const mockGetUnlockedMilestones = getUnlockedMilestones as jest.Mock;

    beforeEach(() => {
        jest.useFakeTimers();
        (useTranslations as jest.Mock).mockImplementation((namespace: string) => {
            return namespace === 'GenericMenu' ? mockTGenericMenu : mockTForm;
        });
        (useMilestones as jest.Mock).mockReturnValue({
            count: 0,
            unlockedIds: [],
        });
        mockGetUnlockedMilestones.mockReturnValue([]);
        localStorage.clear();
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
        jest.clearAllMocks();
    });

    it('should not render button when count is 0', () => {
        (useMilestones as jest.Mock).mockReturnValue({ count: 0, unlockedIds: [] });
        render(<EasterMenu />);
        expect(screen.queryByLabelText('Achievement Menu')).not.toBeInTheDocument();
    });

    it('should render button when count is 1 or more', () => {
        (useMilestones as jest.Mock).mockReturnValue({ count: 1, unlockedIds: [] });
        render(<EasterMenu />);
        expect(screen.getByLabelText('Achievement Menu')).toBeInTheDocument();
    });

    it('should open menu when button is clicked', () => {
        (useMilestones as jest.Mock).mockReturnValue({ count: 1, unlockedIds: [] });
        render(<EasterMenu />);

        const button = screen.getByLabelText('Achievement Menu');
        fireEvent.click(button);

        expect(screen.getByText(/GenericMenu.title/i)).toBeInTheDocument();
    });

    it('should close menu when button is clicked again', () => {
        (useMilestones as jest.Mock).mockReturnValue({ count: 1, unlockedIds: [] });
        render(<EasterMenu />);

        const button = screen.getByLabelText('Achievement Menu');
        fireEvent.click(button);
        fireEvent.click(button);

        act(() => {
            jest.advanceTimersByTime(400);
        });

        expect(screen.queryByText('GenericMenu.title')).not.toBeInTheDocument();
    });

    it('should close menu when close button is clicked', () => {
        (useMilestones as jest.Mock).mockReturnValue({ count: 1, unlockedIds: [] });
        render(<EasterMenu />);

        fireEvent.click(screen.getByLabelText('Achievement Menu'));
        fireEvent.click(screen.getByLabelText('Close Menu'));

        act(() => {
            jest.advanceTimersByTime(400);
        });

        expect(screen.queryByText('GenericMenu.title')).not.toBeInTheDocument();
    });

    it('should close menu when clicking outside', () => {
        (useMilestones as jest.Mock).mockReturnValue({ count: 1, unlockedIds: [] });
        render(<EasterMenu />);

        fireEvent.click(screen.getByLabelText('Achievement Menu'));

        fireEvent.mouseDown(document.body);

        act(() => {
            jest.advanceTimersByTime(400);
        });

        expect(screen.queryByText('GenericMenu.title')).not.toBeInTheDocument();
    });

    it('should not close menu when clicking inside menu', () => {
        (useMilestones as jest.Mock).mockReturnValue({ count: 1, unlockedIds: [] });
        render(<EasterMenu />);

        fireEvent.click(screen.getByLabelText('Achievement Menu'));
        const menu = screen.getByText(/GenericMenu.title/i).closest('div');

        fireEvent.mouseDown(menu!);

        expect(screen.getByText(/GenericMenu.title/i)).toBeInTheDocument();
    });

    it('should load saved Discord ID from localStorage on mount', () => {
        localStorage.setItem('user_id', '775415193760169995');
        (useMilestones as jest.Mock).mockReturnValue({ count: 1, unlockedIds: [] });

        render(<EasterMenu />);
        fireEvent.click(screen.getByLabelText('Achievement Menu'));

        const input = screen.getByPlaceholderText('775415193760169995') as HTMLInputElement;
        expect(input.value).toBe('775415193760169995');
        expect(input).toBeDisabled();
    });

    it('should update Discord name on input change', () => {
        (useMilestones as jest.Mock).mockReturnValue({ count: 1, unlockedIds: [] });
        render(<EasterMenu />);

        fireEvent.click(screen.getByLabelText('Achievement Menu'));
        const input = screen.getByPlaceholderText('775415193760169995');

        fireEvent.change(input, { target: { value: '123456789012345678' } });

        expect((input as HTMLInputElement).value).toBe('123456789012345678');
    });

    it('should clear error when input is empty', () => {
        (useMilestones as jest.Mock).mockReturnValue({ count: 1, unlockedIds: [] });
        render(<EasterMenu />);

        fireEvent.click(screen.getByLabelText('Achievement Menu'));
        const input = screen.getByPlaceholderText('775415193760169995');

        fireEvent.change(input, { target: { value: 'invalid' } });
        fireEvent.change(input, { target: { value: '' } });

        expect(screen.queryByText('Form.errorDiscordId')).not.toBeInTheDocument();
    });

    it('should show error for invalid Discord ID', () => {
        (useMilestones as jest.Mock).mockReturnValue({ count: 1, unlockedIds: [] });
        render(<EasterMenu />);

        fireEvent.click(screen.getByLabelText('Achievement Menu'));
        const input = screen.getByPlaceholderText('775415193760169995');

        fireEvent.change(input, { target: { value: 'invalid' } });

        expect(screen.getByText('Form.errorDiscordId')).toBeInTheDocument();
    });

    it('should clear error for valid Discord ID', () => {
        (useMilestones as jest.Mock).mockReturnValue({ count: 1, unlockedIds: [] });
        render(<EasterMenu />);

        fireEvent.click(screen.getByLabelText('Achievement Menu'));
        const input = screen.getByPlaceholderText('775415193760169995');

        fireEvent.change(input, { target: { value: 'invalid' } });
        fireEvent.change(input, { target: { value: '123456789012345678' } });

        expect(screen.queryByText('Form.errorDiscordId')).not.toBeInTheDocument();
    });

    it('should not save milestones with invalid Discord ID', async () => {
        mockSaveUserMilestones.mockResolvedValue(true);
        (useMilestones as jest.Mock).mockReturnValue({ count: 1, unlockedIds: [] });

        render(<EasterMenu />);
        fireEvent.click(screen.getByLabelText('Achievement Menu'));

        const input = screen.getByPlaceholderText('775415193760169995') as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'invalid' } });
        expect(input.value).toBe('invalid');

        const saveButton = screen.getByRole('button', { name: /Form.buttonSave/i }) as HTMLButtonElement;
        const propKey = Object.keys(saveButton).find(key => key.startsWith('__reactProps'));

        if (propKey) {
            // @ts-ignore
            saveButton[propKey].onClick({ preventDefault: () => {}, stopPropagation: () => {} });
        }

        await waitFor(() => { expect(mockSaveUserMilestones).not.toHaveBeenCalled(); });

    });

    it('should save milestones successfully on first save', async () => {
        mockSaveUserMilestones.mockResolvedValue(true);
        (useMilestones as jest.Mock).mockReturnValue({ count: 1, unlockedIds: [] });

        render(<EasterMenu />);
        fireEvent.click(screen.getByLabelText('Achievement Menu'));

        const input = screen.getByPlaceholderText('775415193760169995');
        fireEvent.change(input, { target: { value: '123456789012345678' } });

        const saveButton = screen.getByText('Form.buttonSave');
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(mockSaveUserMilestones).toHaveBeenCalledWith('123456789012345678', []);
            expect(screen.getByText('✓ Form.successMilestonesSaved')).toBeInTheDocument();
            expect(localStorage.getItem('user_id')).toBe('123456789012345678');
        });
    });

    it('should save milestones successfully for existing user', async () => {
        localStorage.setItem('user_id', '123456789012345678');
        mockSaveUserMilestones.mockResolvedValue(true);
        (useMilestones as jest.Mock).mockReturnValue({ count: 1, unlockedIds: [] });

        render(<EasterMenu />);
        fireEvent.click(screen.getByLabelText('Achievement Menu'));

        // Input is disabled, but we can still trigger the save through the button
        const saveButton = screen.getByText('Form.buttonRefresh');

        // Manually enable it for testing purposes
        const input = screen.getByPlaceholderText('775415193760169995') as HTMLInputElement;
        input.disabled = false;

        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(mockSaveUserMilestones).toHaveBeenCalled();
            expect(screen.getByText('✓ Form.successMilestonesUpdated')).toBeInTheDocument();
        });
    });

    it('should reset states after cooldown period', async () => {
        mockSaveUserMilestones.mockResolvedValue(true);
        (useMilestones as jest.Mock).mockReturnValue({ count: 1, unlockedIds: [] });

        render(<EasterMenu />);
        fireEvent.click(screen.getByLabelText('Achievement Menu'));

        const input = screen.getByPlaceholderText('775415193760169995');
        fireEvent.change(input, { target: { value: '123456789012345678' } });

        const saveButton = screen.getByText('Form.buttonSave');
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(screen.getByText('✓ Form.successMilestonesSaved')).toBeInTheDocument();
        });

        act(() => {
            jest.advanceTimersByTime(5000);
        });

        expect(screen.queryByText('✓ Form.successMilestonesSaved')).not.toBeInTheDocument();
    });

    it('should show error message on save failure', async () => {
        mockSaveUserMilestones.mockResolvedValue(false);
        (useMilestones as jest.Mock).mockReturnValue({ count: 1, unlockedIds: [] });

        render(<EasterMenu />);
        fireEvent.click(screen.getByLabelText('Achievement Menu'));

        const input = screen.getByPlaceholderText('775415193760169995');
        fireEvent.change(input, { target: { value: '123456789012345678' } });

        const saveButton = screen.getByText('Form.buttonSave');
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(screen.getByText('Form.errorFormUnknown')).toBeInTheDocument();
        });
    });

    it('should display loading spinner during save', async () => {
        mockSaveUserMilestones.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(true), 1000)));
        (useMilestones as jest.Mock).mockReturnValue({ count: 1, unlockedIds: [] });

        render(<EasterMenu />);
        fireEvent.click(screen.getByLabelText('Achievement Menu'));

        const input = screen.getByPlaceholderText('775415193760169995');
        fireEvent.change(input, { target: { value: '123456789012345678' } });

        const saveButton = screen.getByText('Form.buttonSave');
        fireEvent.click(saveButton);

        expect(document.querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('should calculate progress correctly', () => {
        (useMilestones as jest.Mock).mockReturnValue({ count: 5, unlockedIds: [] });
        render(<EasterMenu />);

        fireEvent.click(screen.getByLabelText('Achievement Menu'));

        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('should return red color for progress <= 25%', () => {
        (useMilestones as jest.Mock).mockReturnValue({ count: 2, unlockedIds: [] });
        render(<EasterMenu />);

        fireEvent.click(screen.getByLabelText('Achievement Menu'));

        const progressBar: HTMLElement = document.querySelector('[style]') as HTMLElement;
        expect(progressBar.className).toContain('from-red-500');
    });

    it('should return orange color for progress between 26% and 75%', () => {
        (useMilestones as jest.Mock).mockReturnValue({ count: 5, unlockedIds: [] });
        render(<EasterMenu />);

        fireEvent.click(screen.getByLabelText('Achievement Menu'));

        const progressBar: HTMLElement = document.querySelector('[style]') as HTMLElement;
        expect(progressBar?.className).toContain('from-orange-500');
    });

    it('should return yellow color for progress between 76% and 99%', () => {
        (useMilestones as jest.Mock).mockReturnValue({ count: 8, unlockedIds: [] });
        render(<EasterMenu />);

        fireEvent.click(screen.getByLabelText('Achievement Menu'));

        const progressBar: HTMLElement = document.querySelector('[style]') as HTMLElement;
        expect(progressBar?.className).toContain('from-yellow-400');
    });

    it('should return emerald color for progress = 100%', () => {
        (useMilestones as jest.Mock).mockReturnValue({ count: 10, unlockedIds: [] });
        render(<EasterMenu />);

        fireEvent.click(screen.getByLabelText('Achievement Menu'));

        const progressBar: HTMLElement = document.querySelector('[style]') as HTMLElement;
        expect(progressBar?.className).toContain('from-emerald-500');
    });

    it('should display found achievements', () => {
        (useMilestones as jest.Mock).mockReturnValue({
            count: 2,
            unlockedIds: ['id1', 'id2'],
        });

        render(<EasterMenu />);
        fireEvent.click(screen.getByLabelText('Achievement Menu'));

        expect(screen.getByText('🎯')).toBeInTheDocument();
        expect(screen.getByText('🏆')).toBeInTheDocument();
        expect(screen.getByText('GenericMenu.generic_key1')).toBeInTheDocument();
        expect(screen.getByText('GenericMenu.generic_key2')).toBeInTheDocument();
    });

    it('should show empty state when no achievements are found', () => {
        (useMilestones as jest.Mock).mockReturnValue({ count: 0, unlockedIds: [] });
        render(<EasterMenu />);

        // Need count >= 1 to render button
        (useMilestones as jest.Mock).mockReturnValue({ count: 1, unlockedIds: [] });
        render(<EasterMenu />);

        fireEvent.click(screen.getByLabelText('Achievement Menu'));

        expect(screen.getByText('🔍')).toBeInTheDocument();
        expect(screen.getByText('GenericMenu.emptyTipp')).toBeInTheDocument();
    });

    it('should disable save button when Discord ID is empty', () => {
        (useMilestones as jest.Mock).mockReturnValue({ count: 1, unlockedIds: [] });
        render(<EasterMenu />);

        fireEvent.click(screen.getByLabelText('Achievement Menu'));

        const saveButton = screen.getByText('Form.buttonSave');
        expect(saveButton).toBeDisabled();
    });

    it('should disable save button when there is an error', () => {
        (useMilestones as jest.Mock).mockReturnValue({ count: 1, unlockedIds: [] });
        render(<EasterMenu />);

        fireEvent.click(screen.getByLabelText('Achievement Menu'));

        const input = screen.getByPlaceholderText('775415193760169995');
        fireEvent.change(input, { target: { value: 'invalid' } });

        const saveButton = screen.getByText('Form.buttonSave');
        expect(saveButton).toBeDisabled();
    });

    it('should disable save button during cooldown', async () => {
        mockSaveUserMilestones.mockResolvedValue(true);
        (useMilestones as jest.Mock).mockReturnValue({ count: 1, unlockedIds: [] });

        render(<EasterMenu />);
        fireEvent.click(screen.getByLabelText('Achievement Menu'));

        const input = screen.getByPlaceholderText('775415193760169995');
        fireEvent.change(input, { target: { value: '123456789012345678' } });

        const saveButton = screen.getByText('Form.buttonSave');
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(screen.getByText('Form.buttonRefresh')).toBeDisabled();
        });
    });

    it('should show info message when milestones are already saved', () => {
        localStorage.setItem('user_id', '123456789012345678');
        (useMilestones as jest.Mock).mockReturnValue({ count: 1, unlockedIds: [] });

        render(<EasterMenu />);
        fireEvent.click(screen.getByLabelText('Achievement Menu'));

        expect(screen.getByText('Form.infoMilestonesSaved')).toBeInTheDocument();
    });

    it('should show refresh button text for existing users', () => {
        localStorage.setItem('user_id', '123456789012345678');
        (useMilestones as jest.Mock).mockReturnValue({ count: 1, unlockedIds: [] });

        render(<EasterMenu />);
        fireEvent.click(screen.getByLabelText('Achievement Menu'));

        expect(screen.getByText('Form.buttonRefresh')).toBeInTheDocument();
    });

    it('should trim Discord ID before validation and saving', async () => {
        mockSaveUserMilestones.mockResolvedValue(true);
        (useMilestones as jest.Mock).mockReturnValue({ count: 1, unlockedIds: [] });

        render(<EasterMenu />);
        fireEvent.click(screen.getByLabelText('Achievement Menu'));

        const input = screen.getByPlaceholderText('775415193760169995');
        fireEvent.change(input, { target: { value: '  123456789012345678  ' } });

        const saveButton = screen.getByText('Form.buttonSave');
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(mockSaveUserMilestones).toHaveBeenCalledWith('123456789012345678', []);
        });
    });

    it('should handle achievements with undefined imageKey or icon', () => {
        (useMilestones as jest.Mock).mockReturnValue({
            count: 1,
            unlockedIds: ['nonexistent'],
        });

        render(<EasterMenu />);
        fireEvent.click(screen.getByLabelText('Achievement Menu'));

        expect(screen.getByText('GenericMenu.generic_undefined')).toBeInTheDocument();
    });
});