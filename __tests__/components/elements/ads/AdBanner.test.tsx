import {act, render, waitFor} from '@testing-library/react';
import { useRouter } from 'next/router';
import AdBanner from "@/components/elements/ads/AdBanner";

// Mock Next.js router
jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));

describe('AdBanner', () => {
    const mockRouter = {
        asPath: '/test-path',
        pathname: '/test',
        query: {},
        push: jest.fn(),
        replace: jest.fn(),
    };

    const defaultProps = {
        dataAdSlot: '1234567890',
    };

    let mockAdsbygoogle: jest.Mock;
    let originalEnv: string | undefined;

    beforeEach(() => {
        jest.useFakeTimers();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);

        // Mock process.env
        originalEnv = process.env.NEXT_PUBLIC_ADSENSE_ID;
        process.env.NEXT_PUBLIC_ADSENSE_ID = '9876543210';

        // Mock adsbygoogle
        mockAdsbygoogle = jest.fn();
        (window as any).adsbygoogle = { push: jest.fn() };

        // Mock querySelector
        jest.spyOn(document, 'querySelector').mockReturnValue(null);

        // Mock console.warn
        jest.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
        jest.restoreAllMocks();
        delete (window as any).adsbygoogle;
        if (originalEnv !== undefined) {
            process.env.NEXT_PUBLIC_ADSENSE_ID = originalEnv;
        } else {
            delete process.env.NEXT_PUBLIC_ADSENSE_ID;
        }
    });

    describe('Rendering', () => {
        it('should render ad container with default props', () => {
            const { container } = render(<AdBanner {...defaultProps} />);

            const adContainer = container.querySelector('.ad-container');
            expect(adContainer).toBeInTheDocument();
            expect(adContainer).toHaveClass('ad-container');
            expect(adContainer).toHaveStyle({
                minHeight: '100px',
                width: '100%',
                overflow: 'hidden',
            });
        });

        it('should render ins element with correct attributes', () => {
            const { container } = render(<AdBanner {...defaultProps} />);

            const insElement = container.querySelector('ins.adsbygoogle');
            expect(insElement).toBeInTheDocument();
            expect(insElement).toHaveAttribute('data-ad-slot', '1234567890');
            expect(insElement).toHaveAttribute('data-ad-format', 'auto');
            expect(insElement).toHaveAttribute('data-ad-client', 'ca-pub-9876543210');
            expect(insElement).toHaveAttribute('data-full-width-responsive', 'true');
        });

        it('should render with custom dataAdFormat', () => {
            const { container } = render(<AdBanner {...defaultProps} dataAdFormat="rectangle" />);

            const insElement = container.querySelector('ins.adsbygoogle');
            expect(insElement).toBeInTheDocument();
            expect(insElement).toHaveAttribute('data-ad-format', 'rectangle');
        });

        it('should render with dataFullWidthResponsive set to false', () => {
            const { container } = render(<AdBanner {...defaultProps} dataFullWidthResponsive={false} />);

            const insElement = container.querySelector('ins.adsbygoogle');
            expect(insElement).toBeInTheDocument();
            expect(insElement).toHaveAttribute('data-full-width-responsive', 'false');
        });

        it('should render with custom className', () => {
            const { container } = render(<AdBanner {...defaultProps} className="custom-class" />);

            const adContainer = container.querySelector('.ad-container');
            expect(adContainer).toHaveClass('ad-container');
            expect(adContainer).toHaveClass('custom-class');
        });

        it('should render with multiple custom classes', () => {
            const { container } = render(<AdBanner {...defaultProps} className="class-1 class-2" />);

            const adContainer = container.querySelector('.ad-container');
            expect(adContainer).toHaveClass('ad-container');
            expect(adContainer).toHaveClass('class-1');
            expect(adContainer).toHaveClass('class-2');
        });

        it('should apply inline styles to ins element', () => {
            const { container } = render(<AdBanner {...defaultProps} />);

            const insElement = container.querySelector('ins.adsbygoogle');
            expect(insElement).toBeInTheDocument();
            expect(insElement).toHaveStyle({
                display: 'block',
                minWidth: '250px',
            });
        });
    });

    describe('AdSense Initialization', () => {
        it('should push to adsbygoogle when ad element has positive clientWidth', async () => {
            const mockAdElement = {
                clientWidth: 300,
                getAttribute: jest.fn((attr: string) => {
                    if (attr === 'data-ad-slot') return '1234567890';
                    return null;
                }),
            } as unknown as HTMLElement;

            jest.spyOn(document, 'querySelector').mockReturnValue(mockAdElement);

            // Correct adsbygoogle mock as array with push
            (window as any).adsbygoogle = {push: jest.fn()};

            render(<AdBanner {...defaultProps} />);

            act(() => {
                jest.advanceTimersByTime(500);
            });

            await waitFor(() => {
                expect(document.querySelector).toHaveBeenCalledWith('ins[data-ad-slot="1234567890"]');
                expect((window as any).adsbygoogle.push).toHaveBeenCalledWith({});
                expect((window as any).adsbygoogle.push).toHaveBeenCalledTimes(1);
            });
        });


        it('should hide banner when adsbygoogle is not available', async () => {
            delete (window as any).adsbygoogle;

            const {container} = render(<AdBanner {...defaultProps} />);

            act(() => {
                jest.advanceTimersByTime(500);
            });

            await waitFor(() => {
                expect(container.firstChild).toBeNull();
            });
        });

        it('should hide banner when ad element is not found', async () => {
            jest.spyOn(document, 'querySelector').mockReturnValue(null);

            const {container} = render(<AdBanner {...defaultProps} />);

            act(() => {
                jest.advanceTimersByTime(500);
            });

            await waitFor(() => {
                expect(container.firstChild).toBeNull();
            });
        });

        it('should hide banner when ad element has zero clientWidth', async () => {
            const mockAdElement = {
                clientWidth: 0,
                getAttribute: jest.fn((attr: string) => {
                    if (attr === 'data-ad-slot') return '1234567890';
                    return null;
                }),
            } as unknown as HTMLElement;

            jest.spyOn(document, 'querySelector').mockReturnValue(mockAdElement);

            const {container} = render(<AdBanner {...defaultProps} />);

            act(() => {
                jest.advanceTimersByTime(500);
            });

            await waitFor(() => {
                expect(container.firstChild).toBeNull();
                expect((window as any).adsbygoogle.push).not.toHaveBeenCalled();
            });
        });

        it('should hide banner when adsbygoogle push throws error', async () => {
            const mockAdElement = {
                clientWidth: 300,
                getAttribute: jest.fn((attr: string) => {
                    if (attr === 'data-ad-slot') return '1234567890';
                    return null;
                }),
            } as unknown as HTMLElement;

            jest.spyOn(document, 'querySelector').mockReturnValue(mockAdElement);
            (window as any).adsbygoogle.push = jest.fn(() => {
                throw new Error('AdSense blocked');
            });

            const {container} = render(<AdBanner {...defaultProps} />);

            act(() => {
                jest.advanceTimersByTime(500);
            });

            await waitFor(() => {
                expect(console.warn).toHaveBeenCalledWith(
                    'AdSense push failed (likely blocked):',
                    expect.any(Error)
                );
                expect(container.firstChild).toBeNull();
            });
        });
    });

    describe('Route Changes', () => {
        it('should show banner again after route change even if previously hidden', () => {
            delete (window as any).adsbygoogle;

            const { rerender, container } = render(<AdBanner {...defaultProps} />);

            act(() => {
                jest.advanceTimersByTime(500);
            });

            waitFor(() => {
                expect(container.firstChild).toBeNull();
            });

            // Re-enable adsbygoogle and change route
            (window as any).adsbygoogle = mockAdsbygoogle;
            const mockAdElement = {
                clientWidth: 300,
                getAttribute: jest.fn((attr: string) => {
                    if (attr === 'data-ad-slot') return '1234567890';
                    return null;
                }),
            } as unknown as HTMLModElement;

            jest.spyOn(document, 'querySelector').mockReturnValue(mockAdElement);

            (useRouter as jest.Mock).mockReturnValue({
                ...mockRouter,
                asPath: '/another-path',
            });

            rerender(<AdBanner {...defaultProps} />);

            expect(container.firstChild).not.toBeNull();
        });

        it('should query correct ad slot after dataAdSlot prop changes', () => {
            const mockAdElement = {
                clientWidth: 300,
                getAttribute: jest.fn(),
            } as unknown as HTMLModElement;

            const querySelectorSpy = jest.spyOn(document, 'querySelector').mockReturnValue(mockAdElement);

            const { rerender } = render(<AdBanner {...defaultProps} />);

            act(() => {
                jest.advanceTimersByTime(500);
            });
            expect(querySelectorSpy).toHaveBeenCalledWith('ins[data-ad-slot="1234567890"]');

            rerender(<AdBanner dataAdSlot="9999999999" />);

            act(() => {
                jest.advanceTimersByTime(500);
            });
            expect(querySelectorSpy).toHaveBeenCalledWith('ins[data-ad-slot="9999999999"]');
        });
    });

    describe('Cleanup', () => {
        it('should clear timeout on unmount', () => {
            const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

            const { unmount } = render(<AdBanner {...defaultProps} />);

            unmount();

            expect(clearTimeoutSpy).toHaveBeenCalled();
        });

        it('should clear timeout when asPath changes before timer completes', () => {
            const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

            const { rerender } = render(<AdBanner {...defaultProps} />);

            jest.advanceTimersByTime(200);

            (useRouter as jest.Mock).mockReturnValue({
                ...mockRouter,
                asPath: '/different-path',
            });

            rerender(<AdBanner {...defaultProps} />);

            expect(clearTimeoutSpy).toHaveBeenCalled();
        });

        it('should clear timeout when dataAdSlot changes before timer completes', () => {
            const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

            const { rerender } = render(<AdBanner {...defaultProps} />);

            jest.advanceTimersByTime(200);

            rerender(<AdBanner dataAdSlot="0000000000" />);

            expect(clearTimeoutSpy).toHaveBeenCalled();
        });
    });

    describe('Visibility State', () => {
        it('should return null when isVisible is false', () => {
            delete (window as any).adsbygoogle;

            const { container } = render(<AdBanner {...defaultProps} />);

            act(() => {
                jest.advanceTimersByTime(500);
            });

            waitFor(() => {
                expect(container.firstChild).toBeNull();
            });
        });

        it('should maintain visibility when ad loads successfully', () => {
            const mockAdElement = {
                clientWidth: 300,
                getAttribute: jest.fn((attr: string) => {
                    if (attr === 'data-ad-slot') return '1234567890';
                    return null;
                }),
            } as unknown as HTMLModElement;

            jest.spyOn(document, 'querySelector').mockReturnValue(mockAdElement);

            const { container } = render(<AdBanner {...defaultProps} />);

            act(() => {
                jest.advanceTimersByTime(500);
            });

            waitFor(() => {
                expect(container.firstChild).not.toBeNull();
                const adContainer = container.querySelector('.ad-container');
                expect(adContainer).toBeInTheDocument();
            })
        });
    });
});