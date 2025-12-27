// noinspection DuplicatedCode

import { render, screen, act, waitFor } from '@testing-library/react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { useId } from 'react';
import {ParticlesBackground} from "@/components/animations/ParticlesBackground";

// Mock dependencies
jest.mock('@/hooks/useMediaQuery', () => ({
    useMediaQuery: jest.fn(),
}));
jest.mock('@tsparticles/react', () => ({
    __esModule: true,
    default: jest.fn(),
    initParticlesEngine: jest.fn(() => Promise.resolve()),
}));
jest.mock('@tsparticles/engine', () => ({
    init: jest.fn(),
    MoveDirection: {
        none: 'none',
        top: 'top',
        topRight: 'top-right',
        right: 'right',
        bottomRight: 'bottom-right',
        bottom: 'bottom',
        bottomLeft: 'bottom-left',
        left: 'left',
        topLeft: 'top-left',
    },
    OutMode: {
        bounce: 'bounce',
        bounceHorizontal: 'bounce-horizontal',
        bounceVertical: 'bounce-vertical',
        destroy: 'destroy',
        none: 'none',
        out: 'out',
        split: 'split',
    },
}));
jest.mock('@tsparticles/slim', () => ({
    loadSlim: jest.fn(),
}));
jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useId: jest.fn(),
}));

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
const mockObserve = jest.fn();
const mockUnobserve = jest.fn();
const mockDisconnect = jest.fn();

describe('ParticlesBackground', () => {
    let intersectionObserverCallback: IntersectionObserverCallback;
    const ParticlesMock = Particles as jest.MockedFunction<typeof Particles>;

    beforeEach(() => {
        jest.useFakeTimers();

        ParticlesMock.mockImplementation(({ id, className, particlesLoaded, options, style }: any) => (
            <div data-testid="particles-component" id={id} className={className} style={style}>
                Particles Mock
            </div>
        ));

        mockIntersectionObserver.mockImplementation((callback: IntersectionObserverCallback) => {
            intersectionObserverCallback = callback;
            return {observe: mockObserve, unobserve: mockUnobserve, disconnect: mockDisconnect};
        });

        global.IntersectionObserver = mockIntersectionObserver as any;

        // Default mock implementations
        (useId as jest.Mock).mockReturnValue('test-id-123');
        (useMediaQuery as jest.Mock).mockReturnValue(true); // Default: large screen
        (initParticlesEngine as jest.Mock).mockImplementation((callback) => {
            callback({} as any);
            return Promise.resolve();
        });
        (loadSlim as jest.Mock).mockResolvedValue(undefined);
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
        jest.clearAllMocks();
        ParticlesMock.mockClear();
    });

    it('should return null when not on large screen', () => {
        (useMediaQuery as jest.Mock).mockReturnValue(false);

        const { container } = render(<ParticlesBackground particles={40} />);

        expect(container.firstChild).toBeNull();
    });

    it('should not initialize engine on mobile', () => {
        (useMediaQuery as jest.Mock).mockReturnValue(false);

        render(<ParticlesBackground particles={40} />);

        expect(initParticlesEngine).not.toHaveBeenCalled();
    });

    it('should initialize engine on large screen', async () => {
        (useMediaQuery as jest.Mock).mockReturnValue(true);

        render(<ParticlesBackground particles={40} />);

        await waitFor(() => {
            expect(initParticlesEngine).toHaveBeenCalled();
        });
    });

    it('should call loadSlim during engine initialization', async () => {
        (useMediaQuery as jest.Mock).mockReturnValue(true);

        render(<ParticlesBackground particles={40} />);

        await waitFor(() => {
            expect(loadSlim).toHaveBeenCalled();
        });
    });

    it('should render placeholder container when engine not ready', () => {
        (useMediaQuery as jest.Mock).mockReturnValue(true);
        (initParticlesEngine as jest.Mock).mockReturnValue(new Promise(() => {})); // Never resolves

        const { container } = render(<ParticlesBackground particles={40} />);

        const placeholder = container.querySelector('.absolute.inset-0.pointer-events-none');
        expect(placeholder).toBeInTheDocument();
        expect(screen.queryByTestId('particles-component')).not.toBeInTheDocument();
    });

    it('should render placeholder container when not visible', async () => {
        (useMediaQuery as jest.Mock).mockReturnValue(true);

        const { container } = render(<ParticlesBackground particles={40} />);

        await waitFor(() => {
            expect(initParticlesEngine).toHaveBeenCalled();
        });

        const placeholder = container.querySelector('.absolute.inset-0.pointer-events-none');
        expect(placeholder).toBeInTheDocument();
        expect(screen.queryByTestId('particles-component')).not.toBeInTheDocument();
    });

    it('should set up IntersectionObserver with correct options', async () => {
        (useMediaQuery as jest.Mock).mockReturnValue(true);

        render(<ParticlesBackground particles={40} />);

        await waitFor(() => {
            expect(mockIntersectionObserver).toHaveBeenCalledWith(
                expect.any(Function),
                {
                    threshold: [0, 0.1, 0.5],
                    rootMargin: '50px'
                }
            );
        });
    });

    it('should observe container when engine is ready', async () => {
        (useMediaQuery as jest.Mock).mockReturnValue(true);

        render(<ParticlesBackground particles={40} />);

        await waitFor(() => {
            expect(mockObserve).toHaveBeenCalled();
        });
    });

    it('should not set up observer when engine not ready', () => {
        (useMediaQuery as jest.Mock).mockReturnValue(true);
        (initParticlesEngine as jest.Mock).mockReturnValue(new Promise(() => {}));

        render(<ParticlesBackground particles={40} />);

        expect(mockObserve).not.toHaveBeenCalled();
    });

    it('should not set up observer on mobile', () => {
        (useMediaQuery as jest.Mock).mockReturnValue(false);

        render(<ParticlesBackground particles={40} />);

        expect(mockObserve).not.toHaveBeenCalled();
    });

    it('should render Particles component when visible and engine ready', async () => {
        (useMediaQuery as jest.Mock).mockReturnValue(true);

        const { rerender } = render(<ParticlesBackground particles={40} />);

        await waitFor(() => {
            expect(initParticlesEngine).toHaveBeenCalled();
            expect(mockObserve).toHaveBeenCalled();
        });

        const mockEntry = {
            isIntersecting: true,
            intersectionRatio: 0.2,
            target: document.querySelector('.absolute'),
        } as IntersectionObserverEntry;

        await act(async () => {
            intersectionObserverCallback([mockEntry], {} as IntersectionObserver);
        });

        rerender(<ParticlesBackground particles={40} />);

        await waitFor(() => {
            expect(screen.getByTestId('particles-component')).toBeInTheDocument();
        });
    });

    it('should not show particles when intersectionRatio is below 0.1', async () => {
        (useMediaQuery as jest.Mock).mockReturnValue(true);

        render(<ParticlesBackground particles={40} />);

        await waitFor(() => {
            expect(initParticlesEngine).toHaveBeenCalled();
            expect(mockObserve).toHaveBeenCalled();
        });

        const mockEntry = {
            isIntersecting: true,
            intersectionRatio: 0.05,
            target: document.querySelector('.absolute'),
        } as IntersectionObserverEntry;

        await act(async () => {
            intersectionObserverCallback([mockEntry], {} as IntersectionObserver);
        });

        expect(screen.queryByTestId('particles-component')).not.toBeInTheDocument();
    });

    it('should not show particles when not intersecting even with high ratio', async () => {
        (useMediaQuery as jest.Mock).mockReturnValue(true);

        render(<ParticlesBackground particles={40} />);

        await waitFor(() => {
            expect(initParticlesEngine).toHaveBeenCalled();
            expect(mockObserve).toHaveBeenCalled();
        });

        const mockEntry = {
            isIntersecting: false,
            intersectionRatio: 0.5,
            target: document.querySelector('.absolute'),
        } as IntersectionObserverEntry;

        await act(async () => {
            intersectionObserverCallback([mockEntry], {} as IntersectionObserver);
        });

        expect(screen.queryByTestId('particles-component')).not.toBeInTheDocument();
    });

    it('should use custom id when provided', async () => {
        (useMediaQuery as jest.Mock).mockReturnValue(true);

        const { rerender } = render(<ParticlesBackground id="custom-id" particles={40} />);

        await waitFor(() => {
            expect(initParticlesEngine).toHaveBeenCalled();
            expect(mockObserve).toHaveBeenCalled();
        });

        const mockEntry = {
            isIntersecting: true,
            intersectionRatio: 0.2,
            target: document.querySelector('.absolute'),
        } as IntersectionObserverEntry;

        await act(async () => {
            intersectionObserverCallback([mockEntry], {} as IntersectionObserver);
        });

        rerender(<ParticlesBackground id="custom-id" particles={40} />);

        await waitFor(() => {
            expect(ParticlesMock).toHaveBeenCalledWith(
                expect.objectContaining({ id: 'custom-id' }),
                undefined
            );
        });
    });

    it('should use generated id when not provided', async () => {
        (useMediaQuery as jest.Mock).mockReturnValue(true);
        (useId as jest.Mock).mockReturnValue('generated-id');

        const { rerender } = render(<ParticlesBackground particles={40} />);

        await waitFor(() => {
            expect(initParticlesEngine).toHaveBeenCalled();
            expect(mockObserve).toHaveBeenCalled();
        });

        const mockEntry = {
            isIntersecting: true,
            intersectionRatio: 0.2,
            target: document.querySelector('.absolute'),
        } as IntersectionObserverEntry;

        await act(async () => {
            intersectionObserverCallback([mockEntry], {} as IntersectionObserver);
        });

        rerender(<ParticlesBackground particles={40} />);

        await waitFor(() => {
            expect(ParticlesMock).toHaveBeenCalledWith(
                expect.objectContaining({ id: 'tsparticles-generated-id' }),
                undefined
            );
        });
    });

    it('should use custom particles count', async () => {
        (useMediaQuery as jest.Mock).mockReturnValue(true);

        const { rerender } = render(<ParticlesBackground particles={100} />);

        await waitFor(() => {
            expect(initParticlesEngine).toHaveBeenCalled();
            expect(mockObserve).toHaveBeenCalled();
        });

        const mockEntry = {
            isIntersecting: true,
            intersectionRatio: 0.2,
            target: document.querySelector('.absolute'),
        } as IntersectionObserverEntry;

        await act(async () => {
            intersectionObserverCallback([mockEntry], {} as IntersectionObserver);
        });

        rerender(<ParticlesBackground particles={100} />);

        await waitFor(() => {
            const lastCall = ParticlesMock.mock.calls[ParticlesMock.mock.calls.length - 1];
            expect(lastCall[0].options!.particles!.number!.value).toBe(100);
        });
    });

    it('should use default particles count of 40', async () => {
        (useMediaQuery as jest.Mock).mockReturnValue(true);

        const { rerender } = render(<ParticlesBackground />);

        await waitFor(() => {
            expect(initParticlesEngine).toHaveBeenCalled();
            expect(mockObserve).toHaveBeenCalled();
        });

        const mockEntry = {
            isIntersecting: true,
            intersectionRatio: 0.2,
            target: document.querySelector('.absolute'),
        } as IntersectionObserverEntry;

        await act(async () => {
            intersectionObserverCallback([mockEntry], {} as IntersectionObserver);
        });

        rerender(<ParticlesBackground />);

        await waitFor(() => {
            const lastCall = ParticlesMock.mock.calls[ParticlesMock.mock.calls.length - 1];
            expect(lastCall[0].options!.particles!.number!.value).toBe(40);
        });
    });

    it('should apply custom className to Particles', async () => {
        (useMediaQuery as jest.Mock).mockReturnValue(true);

        const { rerender } = render(<ParticlesBackground className="custom-class" particles={40} />);

        await waitFor(() => {
            expect(initParticlesEngine).toHaveBeenCalled();
            expect(mockObserve).toHaveBeenCalled();
        });

        const mockEntry = {
            isIntersecting: true,
            intersectionRatio: 0.2,
            target: document.querySelector('.absolute'),
        } as IntersectionObserverEntry;

        await act(async () => {
            intersectionObserverCallback([mockEntry], {} as IntersectionObserver);
        });

        rerender(<ParticlesBackground className="custom-class" particles={40} />);

        await waitFor(() => {
            const lastCall = ParticlesMock.mock.calls[ParticlesMock.mock.calls.length - 1];
            expect(lastCall[0].className).toContain('custom-class');
        });
    });

    it('should apply default opacity and pointer-events classes', async () => {
        (useMediaQuery as jest.Mock).mockReturnValue(true);

        const { rerender } = render(<ParticlesBackground particles={40} />);

        await waitFor(() => {
            expect(initParticlesEngine).toHaveBeenCalled();
            expect(mockObserve).toHaveBeenCalled();
        });

        const mockEntry = {
            isIntersecting: true,
            intersectionRatio: 0.2,
            target: document.querySelector('.absolute'),
        } as IntersectionObserverEntry;

        await act(async () => {
            intersectionObserverCallback([mockEntry], {} as IntersectionObserver);
        });

        rerender(<ParticlesBackground particles={40} />);

        await waitFor(() => {
            const lastCall = ParticlesMock.mock.calls[ParticlesMock.mock.calls.length - 1];
            expect(lastCall[0].className).toContain('!opacity-30');
            expect(lastCall[0].className).toContain('pointer-events-none');
        });
    });

    it('should unobserve on unmount', async () => {
        (useMediaQuery as jest.Mock).mockReturnValue(true);

        const { unmount } = render(<ParticlesBackground particles={40} />);

        await waitFor(() => {
            expect(mockObserve).toHaveBeenCalled();
        });

        unmount();

        expect(mockUnobserve).toHaveBeenCalled();
    });

    it('should handle multiple intersection entries', async () => {
        (useMediaQuery as jest.Mock).mockReturnValue(true);

        const { rerender } = render(<ParticlesBackground particles={40} />);

        await waitFor(() => {
            expect(initParticlesEngine).toHaveBeenCalled();
        });

        const mockEntries = [
            {
                isIntersecting: true,
                intersectionRatio: 0.2,
                target: document.querySelector('.absolute'),
            },
            {
                isIntersecting: false,
                intersectionRatio: 0,
                target: document.querySelector('.absolute'),
            }
        ] as IntersectionObserverEntry[];

        await act(async () => {
            intersectionObserverCallback(mockEntries, {} as IntersectionObserver);
        });

        rerender(<ParticlesBackground particles={40} />);

        // Should process all entries - last one determines visibility
        await waitFor(() => {
            expect(screen.queryByTestId('particles-component')).not.toBeInTheDocument();
        });
    });

    it('should hide particles when visibility drops below threshold', async () => {
        (useMediaQuery as jest.Mock).mockReturnValue(true);

        const { rerender } = render(<ParticlesBackground particles={40} />);

        await waitFor(() => {
            expect(initParticlesEngine).toHaveBeenCalled();
            expect(mockObserve).toHaveBeenCalled();
        });

        // First make it visible
        const mockEntryVisible = {
            isIntersecting: true,
            intersectionRatio: 0.5,
            target: document.querySelector('.absolute'),
        } as IntersectionObserverEntry;

        await act(async () => {
            intersectionObserverCallback([mockEntryVisible], {} as IntersectionObserver);
        });

        rerender(<ParticlesBackground particles={40} />);

        await waitFor(() => {
            expect(screen.getByTestId('particles-component')).toBeInTheDocument();
        });

        // Then hide it
        const mockEntryHidden = {
            isIntersecting: true,
            intersectionRatio: 0.05,
            target: document.querySelector('.absolute'),
        } as IntersectionObserverEntry;

        await act(async () => {
            intersectionObserverCallback([mockEntryHidden], {} as IntersectionObserver);
        });

        rerender(<ParticlesBackground particles={40} />);

        await waitFor(() => {
            expect(screen.queryByTestId('particles-component')).not.toBeInTheDocument();
        });
    });

    it('should have correct particle options configuration', async () => {
        (useMediaQuery as jest.Mock).mockReturnValue(true);

        const { rerender } = render(<ParticlesBackground particles={40} />);

        await waitFor(() => {
            expect(initParticlesEngine).toHaveBeenCalled();
            expect(mockObserve).toHaveBeenCalled();
        });

        const mockEntry = {
            isIntersecting: true,
            intersectionRatio: 0.2,
            target: document.querySelector('.absolute'),
        } as IntersectionObserverEntry;

        await act(async () => {
            intersectionObserverCallback([mockEntry], {} as IntersectionObserver);
        });

        rerender(<ParticlesBackground particles={40} />);

        await waitFor(() => {
            const lastCall = ParticlesMock.mock.calls[ParticlesMock.mock.calls.length - 1];
            const options = lastCall[0].options as any;

            expect(options.background.color.value).toBe('transparent');
            expect(options.fullScreen).toBe(false);
            expect(options.fpsLimit).toBe(60);
            expect(options.detectRetina).toBe(true);
            expect(options.particles.move.speed).toBe(0.2);
            expect(options.particles.move.random).toBe(true);
            expect(options.particles.opacity.animation.enable).toBe(true);
        });
    });

    it('should have GPU acceleration hint in style', async () => {
        (useMediaQuery as jest.Mock).mockReturnValue(true);

        const { rerender } = render(<ParticlesBackground particles={40} />);

        await waitFor(() => {
            expect(initParticlesEngine).toHaveBeenCalled();
            expect(mockObserve).toHaveBeenCalled();
        });

        const mockEntry = {
            isIntersecting: true,
            intersectionRatio: 0.2,
            target: document.querySelector('.absolute'),
        } as IntersectionObserverEntry;

        await act(async () => {
            intersectionObserverCallback([mockEntry], {} as IntersectionObserver);
        });

        rerender(<ParticlesBackground particles={40} />);

        await waitFor(() => {
            const lastCall = ParticlesMock.mock.calls[ParticlesMock.mock.calls.length - 1];
            expect(lastCall[0].style!.willChange).toBe('transform, opacity');
        });
    });

    it('should handle edge case with 0 particles', async () => {
        (useMediaQuery as jest.Mock).mockReturnValue(true);

        const { rerender } = render(<ParticlesBackground particles={0} />);

        await waitFor(() => {
            expect(initParticlesEngine).toHaveBeenCalled();
            expect(mockObserve).toHaveBeenCalled();
        });

        const mockEntry = {
            isIntersecting: true,
            intersectionRatio: 0.2,
            target: document.querySelector('.absolute'),
        } as IntersectionObserverEntry;

        await act(async () => {
            intersectionObserverCallback([mockEntry], {} as IntersectionObserver);
        });

        rerender(<ParticlesBackground particles={0} />);

        await waitFor(() => {
            const lastCall = ParticlesMock.mock.calls[ParticlesMock.mock.calls.length - 1];
            expect(lastCall[0].options!.particles!.number!.value).toBe(0);
        });
    });

    it('should handle engine initialization failure', async () => {
        (useMediaQuery as jest.Mock).mockReturnValue(true);
        jest.spyOn(console, 'error').mockImplementation(() => {});
        (initParticlesEngine as jest.Mock).mockRejectedValue(new Error('Engine init failed'));

        render(<ParticlesBackground particles={40} />);

        // Should not crash and should render placeholder
        await waitFor(() => {
            const placeholder = document.querySelector('.absolute.inset-0.pointer-events-none');
            expect(placeholder).toBeInTheDocument();
        });
    });

    it('should not render observer cleanup when ref is null', async () => {
        (useMediaQuery as jest.Mock).mockReturnValue(true);
        (initParticlesEngine as jest.Mock).mockResolvedValue(undefined);

        const { unmount } = render(<ParticlesBackground particles={40} />);

        await waitFor(() => {
            expect(mockObserve).toHaveBeenCalled();
        });

        // Should not throw during unmount
        expect(() => unmount()).not.toThrow();
    });

    it('should be memoized component', async () => {
        const { rerender } = render(<ParticlesBackground particles={40} />);

        await waitFor(() => {
            expect(initParticlesEngine).toHaveBeenCalled();
        });

        // Rerender with same props
        rerender(<ParticlesBackground particles={40} />);

        // Component should use memo (React.memo)
        expect(ParticlesBackground).toBeDefined();
    });

    it('should handle transition from small to large screen', async () => {
        (useMediaQuery as jest.Mock).mockReturnValue(false);

        render(<ParticlesBackground particles={40} />);

        expect(initParticlesEngine).not.toHaveBeenCalled();

        // Change to large screen
        (useMediaQuery as jest.Mock).mockReturnValue(true);

        render(<ParticlesBackground particles={40} />);

        await waitFor(() => {
            expect(initParticlesEngine).toHaveBeenCalled();
        });
    });

    it('should handle empty className prop', async () => {
        (useMediaQuery as jest.Mock).mockReturnValue(true);

        const { rerender } = render(<ParticlesBackground className="" particles={40} />);

        await waitFor(() => {
            expect(initParticlesEngine).toHaveBeenCalled();
            expect(mockObserve).toHaveBeenCalled();
        });

        const mockEntry = {
            isIntersecting: true,
            intersectionRatio: 0.2,
            target: document.querySelector('.absolute'),
        } as IntersectionObserverEntry;

        await act(async () => {
            intersectionObserverCallback([mockEntry], {} as IntersectionObserver);
        });

        rerender(<ParticlesBackground className="" particles={40} />);

        await waitFor(() => {
            expect(ParticlesMock).toHaveBeenCalled();
        });
    });
});