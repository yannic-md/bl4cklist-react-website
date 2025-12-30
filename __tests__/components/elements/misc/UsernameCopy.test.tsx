import { UsernameCopy } from "@/components/elements/misc/UsernameCopy";
import {render, screen, fireEvent, waitFor, act} from '@testing-library/react';
import { useTranslations } from 'next-intl';

jest.mock('next-intl', () => ({
    useTranslations: jest.fn(),
}));

describe('UsernameCopy', () => {
    const mockTMisc = jest.fn();
    const mockWriteText = jest.fn();

    const defaultProps = {
        username: 'testuser',
        displayName: 'Test User',
        userId: 'user123',
    };

    beforeEach(() => {
        jest.useFakeTimers();
        (useTranslations as jest.Mock).mockReturnValue(mockTMisc);
        mockTMisc.mockReturnValue('Copied');

        Object.assign(navigator, {
            clipboard: {
                writeText: mockWriteText,
            },
        });

        mockWriteText.mockResolvedValue(undefined);
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
        jest.clearAllMocks();
    });

    it('should render with displayName by default', () => {
        render(<UsernameCopy {...defaultProps} />);

        expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    it('should render children instead of displayName when provided', () => {
        render(
            <UsernameCopy {...defaultProps}>
                <span>Custom Content</span>
            </UsernameCopy>
        );

        expect(screen.getByText('Custom Content')).toBeInTheDocument();
        expect(screen.queryByText('Test User')).not.toBeInTheDocument();
    });

    it('should apply custom className to wrapper', () => {
        const { container } = render(<UsernameCopy {...defaultProps} className="custom-class" />);

        expect(container.firstChild).toHaveClass('group', 'custom-class');
    });

    it('should copy username to clipboard on click', async () => {
        render(<UsernameCopy {...defaultProps} />);

        const clickableElement = screen.getByText('Test User');
        fireEvent.click(clickableElement);

        await waitFor(() => {
            expect(mockWriteText).toHaveBeenCalledWith('testuser');
        });
    });

    it('should show success tooltip after successful copy', async () => {
        render(<UsernameCopy {...defaultProps} />);

        const clickableElement = screen.getByText('Test User');
        fireEvent.click(clickableElement);

        await waitFor(() => {
            expect(screen.getByText('Copied')).toBeInTheDocument();
        });
    });

    it('should reset isCopied state after 1500ms', async () => {
        render(<UsernameCopy {...defaultProps} />);

        const clickableElement = screen.getByText('Test User');
        fireEvent.click(clickableElement);

        await waitFor(() => {
            expect(screen.getByText('Copied')).toBeInTheDocument();
        });

        act(() => {
            jest.advanceTimersByTime(1500);
        });

        await waitFor(() => {
            expect(screen.getByText('testuser')).toBeInTheDocument();
        });
    });

    it('should clear existing timeout when clicking multiple times', async () => {
        render(<UsernameCopy {...defaultProps} />);

        const clickableElement = screen.getByText('Test User');

        fireEvent.click(clickableElement);
        await waitFor(() => {
            expect(mockWriteText).toHaveBeenCalledTimes(1);
        });

        act(() => {
            jest.advanceTimersByTime(500);
        });

        fireEvent.click(clickableElement);
        await waitFor(() => {
            expect(mockWriteText).toHaveBeenCalledTimes(2);
        });

        act(() => {
            jest.advanceTimersByTime(1500);
        });

        await waitFor(() => {
            expect(screen.getByText('testuser')).toBeInTheDocument();
        });
    });

    it('should handle clipboard write error gracefully', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        mockWriteText.mockRejectedValue(new Error('Clipboard error'));

        render(<UsernameCopy {...defaultProps} />);

        const clickableElement = screen.getByText('Test User');
        fireEvent.click(clickableElement);

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'Failed to copy username:',
                expect.any(Error)
            );
        });

        consoleErrorSpy.mockRestore();
    });

    it('should clear timeout on unmount', async () => {
        const { unmount } = render(<UsernameCopy {...defaultProps} />);

        const clickableElement = screen.getByText('Test User');
        fireEvent.click(clickableElement);

        await waitFor(() => {
            expect(mockWriteText).toHaveBeenCalled();
        });

        unmount();

        jest.advanceTimersByTime(1500);
    });

    it('should show username in tooltip when not copied', () => {
        render(<UsernameCopy {...defaultProps} />);

        expect(screen.getByText('testuser')).toBeInTheDocument();
    });

    it('should apply correct CSS classes for copied state', async () => {
        render(<UsernameCopy {...defaultProps} />);

        const clickableElement = screen.getByText('Test User');
        fireEvent.click(clickableElement);

        await waitFor(() => {
            const tooltip = screen.getByText('Copied').closest('div');
            expect(tooltip).toHaveClass('bg-green-600', 'border-green-500');
        });
    });

    it('should apply correct CSS classes for default state', () => {
        render(<UsernameCopy {...defaultProps} />);

        const tooltip = screen.getByText('testuser').closest('div');
        expect(tooltip).toHaveClass('bg-gray-900', 'border-gray-700');
    });
});