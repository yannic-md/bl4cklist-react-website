import {render, screen, act, waitFor} from '@testing-library/react';
import FallingObjects from "@/components/elements/misc/FallingObjects";

// Mock Next.js Image component
jest.mock('next/image', () => ({
    __esModule: true,
    default: ({fill, unoptimized, priority, src, alt, ...rest}: any) => {
        // eslint-disable-next-line @next/next/no-img-element
        return ( <img src={src} alt={alt || ""}{...rest} /> );
    },
}));

describe('FallingObjects', () => {
    beforeEach(() => {
        let mockValue = 0;
        jest.spyOn(global.Math, 'random').mockImplementation(() => {
            mockValue += 0.01;
            return mockValue % 1; // always stay below 1.0
        });

        jest.spyOn(Date, 'now').mockReturnValue(1000000);
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
        jest.restoreAllMocks();
    });

    it('should render empty container initially', () => {
        render(<FallingObjects />);

        const container = document.getElementsByClassName('pointer-events-none')[0] as HTMLElement;

        expect(container).toBeInTheDocument();
        expect(container.children.length).toBe(0);
    });

    it('should register event listener on mount', () => {
        jest.spyOn(window, 'addEventListener');

        render(<FallingObjects />);
        expect(window.addEventListener).toHaveBeenCalledWith('triggerFallingObjects', expect.any(Function));
    });

    it('should remove event listener on unmount', () => {
        const { unmount } = render(<FallingObjects />);
        jest.spyOn(window, 'removeEventListener');

        unmount();

        expect(window.removeEventListener).toHaveBeenCalledWith('triggerFallingObjects', expect.anything());
    });

    it('should spawn 32 objects when triggerFallingObjects event is fired', async () => {
        jest.useRealTimers();

        render(<FallingObjects />);

        act(() => {
            window.dispatchEvent(new CustomEvent('triggerFallingObjects'));
        });

        await waitFor(() => {
            const images = screen.getAllByRole('img');
            expect(images.length).toBe(32);
        });
    });

    it('should create 16 hearts and 16 coins', () => {
        render(<FallingObjects />);

        act(() => {
            window.dispatchEvent(new CustomEvent('triggerFallingObjects'));
        });

        const images = screen.getAllByRole('img');
        const hearts = images.filter(img => img.getAttribute('src')?.includes('heart'));
        const coins = images.filter(img => img.getAttribute('src')?.includes('coin'));

        expect(hearts.length).toBe(16);
        expect(coins.length).toBe(16);
    });

    it('should assign unique left positions to each object', () => {
        render(<FallingObjects />);

        act(() => {
            window.dispatchEvent(new CustomEvent('triggerFallingObjects'));
        });

        const containers = screen.getAllByRole('img').map(img => img.parentElement);
        const leftPositions = containers.map(container => container?.style.left);
        const uniquePositions = new Set(leftPositions);

        expect(uniquePositions.size).toBe(32);
    });

    it('should set animation duration between 2 and 3 seconds', () => {
        render(<FallingObjects />);

        act(() => {
            window.dispatchEvent(new CustomEvent('triggerFallingObjects'));
        });

        const container = screen.getAllByRole('img')[0].parentElement;
        const duration = parseFloat(container?.style.animationDuration || '0');

        expect(duration).toBeGreaterThanOrEqual(2);
        expect(duration).toBeLessThanOrEqual(3);
    });

    it('should set animation delay based on index with 0.1s increments', () => {
        render(<FallingObjects />);

        act(() => {
            window.dispatchEvent(new CustomEvent('triggerFallingObjects'));
        });

        const containers = screen.getAllByRole('img').map(img => img.parentElement);
        const firstDelay = parseFloat(containers[0]?.style.animationDelay || '0');
        const lastDelay = parseFloat(containers[31]?.style.animationDelay || '0');

        expect(firstDelay).toBe(0);
        expect(lastDelay).toBe(3.1);
    });

    it('should render heart with correct image dimensions', () => {
        render(<FallingObjects />);

        act(() => {
            window.dispatchEvent(new CustomEvent('triggerFallingObjects'));
        });

        const heartImage = screen.getAllByRole('img').find(img =>
            img.getAttribute('src')?.includes('heart')
        );

        expect(heartImage).toHaveAttribute('width', '32');
        expect(heartImage).toHaveAttribute('height', '32');
    });

    it('should render coin with correct image dimensions', () => {
        render(<FallingObjects />);

        act(() => {
            window.dispatchEvent(new CustomEvent('triggerFallingObjects'));
        });

        const coinImage = screen.getAllByRole('img').find(img =>
            img.getAttribute('src')?.includes('coin')
        );

        expect(coinImage).toHaveAttribute('width', '32');
        expect(coinImage).toHaveAttribute('height', '37');
    });

    it('should remove all objects after 6500ms', async () => {
        render(<FallingObjects />);

        act(() => {
            window.dispatchEvent(new CustomEvent('triggerFallingObjects'));
        });

        expect(screen.getAllByRole('img').length).toBe(32);

        act(() => {
            jest.advanceTimersByTime(6500);
        });

        await waitFor(() => {
            expect(screen.queryAllByRole('img').length).toBe(0);
        })
    });

    it('should not remove objects before 6500ms', () => {
        render(<FallingObjects />);

        act(() => {
            window.dispatchEvent(new CustomEvent('triggerFallingObjects'));
        });

        act(() => {
            jest.advanceTimersByTime(6499);
        });

        expect(screen.getAllByRole('img').length).toBe(32);
    });

    it('should handle multiple trigger events', () => {
        render(<FallingObjects />);

        act(() => {
            window.dispatchEvent(new CustomEvent('triggerFallingObjects'));
        });

        expect(screen.getAllByRole('img').length).toBe(32);

        act(() => {
            jest.advanceTimersByTime(6500);
        });

        expect(screen.queryAllByRole('img').length).toBe(0);

        act(() => {
            window.dispatchEvent(new CustomEvent('triggerFallingObjects'));
        });

        expect(screen.getAllByRole('img').length).toBe(32);
    });

    it('should generate random positions within 2-97% range', () => {
        let val = 0;
        const mockRandom = jest.spyOn(global.Math, 'random').mockImplementation(() => {
            val += 0.01;
            return val;
        });

        render(<FallingObjects />);

        act(() => {
            window.dispatchEvent(new CustomEvent('triggerFallingObjects'));
        });

        const images = screen.getAllByRole('img');
        const containers = images.map(img => img.parentElement);

        const leftPositions = containers.map(container => {
            const left = container?.style.left || '0%';
            return parseFloat(left);
        });

        leftPositions.forEach(position => {
            expect(position).toBeGreaterThanOrEqual(2);
            expect(position).toBeLessThanOrEqual(97);
        });

        mockRandom.mockRestore();
    });

    it('should shuffle types array using Fisher-Yates algorithm', () => {
        render(<FallingObjects />);

        act(() => {
            window.dispatchEvent(new CustomEvent('triggerFallingObjects'));
        });

        const images = screen.getAllByRole('img');
        const types = images.map(img =>
            img.getAttribute('src')?.includes('heart') ? 'heart' : 'coin'
        );

        // Verify that not all hearts come first (indicating shuffle occurred)
        const firstSixteen = types.slice(0, 16);
        const hasCoins = firstSixteen.some(type => type === 'coin');

        expect(hasCoins).toBe(true);
    });

    it('should use Date.now() for unique object IDs', () => {
        const mockDateNow = jest.spyOn(Date, 'now').mockReturnValue(5000000);

        render(<FallingObjects />);

        act(() => {
            window.dispatchEvent(new CustomEvent('triggerFallingObjects'));
        });

        expect(mockDateNow).toHaveBeenCalled();
    });

    it('should apply correct CSS classes to container', () => {
        const { container } = render(<FallingObjects />);
        const mainDiv = container.firstChild as HTMLElement;

        expect(mainDiv).toHaveClass('fixed');
        expect(mainDiv).toHaveClass('top-0');
        expect(mainDiv).toHaveClass('left-0');
        expect(mainDiv).toHaveClass('w-full');
        expect(mainDiv).toHaveClass('h-full');
        expect(mainDiv).toHaveClass('pointer-events-none');
        expect(mainDiv).toHaveClass('z-[9999]');
        expect(mainDiv).toHaveClass('overflow-hidden');
    });

    it('should apply correct CSS classes to falling object divs', () => {
        render(<FallingObjects />);

        act(() => {
            window.dispatchEvent(new CustomEvent('triggerFallingObjects'));
        });

        const objectDiv = screen.getAllByRole('img')[0].parentElement as HTMLElement;

        expect(objectDiv).toHaveClass('absolute');
        expect(objectDiv).toHaveClass('-top-12');
        expect(objectDiv).toHaveClass('w-8');
        expect(objectDiv).toHaveClass('h-8');
    });
});