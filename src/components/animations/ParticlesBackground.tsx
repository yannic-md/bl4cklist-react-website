import {FC, JSX, memo, RefObject, useCallback, useEffect, useId, useRef, useState} from "react";
import Particles, {initParticlesEngine} from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import {Engine, MoveDirection, OutMode} from "@tsparticles/engine";
import {useMediaQuery} from "@/hooks/useMediaQuery";

interface ParticlesBackgroundProps {
    className?: string;
    id?: string;
    particles?: number;
}

/**
 * Renders a background with animated particles using the tsparticles library.
 *
 * @param {ParticlesBackgroundProps} props - Props for customizing the component.
 * @param {string} props.id - Custom ID for the particles background to allow multiply instances.
 * @param {number} props.particles - Custom amount of particles to show on a background.
 * @returns {JSX.Element} The rendered particles background.
 */
export const ParticlesBackground: FC<ParticlesBackgroundProps> = memo(({ className = "", id, particles = 40 }:
                                                                         ParticlesBackgroundProps): JSX.Element | null => {
    const uniqueId: string = useId();
    const particlesId: string = id || `tsparticles-${uniqueId}`;
    const containerRef: RefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);

    const [isVisible, setIsVisible] = useState(false);
    const isLargeScreen: boolean = useMediaQuery(1280);
    const [engineReady, setEngineReady] = useState(false);

    /**
     * Initialize only one time the tsparticles engine when the component is not running on a mobile viewport.
     *
     * Loads the slim tsparticles bundle into the provided engine and sets internal readiness state.
     * This avoids loading the engine on mobile devices and runs whenever the `isMobile` flag changes.
     */
    useEffect((): void => {
        if (!isLargeScreen) return; // Don't even load engine on mobile

        initParticlesEngine(async (engine: Engine): Promise<void> => {
            await loadSlim(engine);
        }).then((): void => setEngineReady(true))
          .catch((err) => console.error("Particles init failed", err));
    }, [isLargeScreen]);

    /**
     * Observe container visibility and toggle particle rendering.
     *
     * Sets up an IntersectionObserver that updates the `isVisible` state when the component's
     * container becomes at least 10% visible. The observer is only created when not on mobile and
     * the particles engine is ready.
     */
    useEffect((): (() => void) | undefined => {
        if (!isLargeScreen || !engineReady) return;

        const observer = new IntersectionObserver(
            (entries: IntersectionObserverEntry[]): void => {
                entries.forEach((entry: IntersectionObserverEntry): void => {
                    // Only show particles when section is at least 10% visible
                    setIsVisible(entry.isIntersecting && entry.intersectionRatio > 0.1);
                });
            },
            {
                threshold: [0, 0.1, 0.5], // Check at multiple thresholds
                rootMargin: '50px' // Start slightly before entering viewport
            }
        );

        const currentRef = containerRef.current;
        if (currentRef) { observer.observe(currentRef); }
        return (): void => { if (currentRef) { observer.unobserve(currentRef); } };
    }, [isLargeScreen, engineReady]);

    const particlesLoaded: () => Promise<void> = useCallback(async (): Promise<void> => {}, []);
    if (!isLargeScreen) { return null; }  // Don't render anything on mobile

    // Render placeholder container for intersection observer
    if (!engineReady || !isVisible) { return <div ref={containerRef} className="absolute inset-0 pointer-events-none" />; }

    return (
        <div ref={containerRef} className="absolute inset-0 pointer-events-none">
            <Particles
                id={particlesId}
                particlesLoaded={particlesLoaded}
                className={`absolute inset-0 !opacity-30 ${className} pointer-events-none`}
                style={{ willChange: 'transform, opacity' }} // GPU acceleration hint
                options={{
                    background: {
                        color: {
                            value: "transparent",
                        },
                    },
                    fullScreen: false,
                    fpsLimit: 60,
                    interactivity: {
                        events: {
                            resize: {
                                enable: true,
                            },
                        },
                        modes: {
                            repulse: {
                                distance: 200,
                                duration: 0.4,
                            },
                        },
                    },
                    particles: {
                        number: {
                            value: particles,
                            density: {
                                enable: true,
                                width: 1920,
                                height: 1080
                            }
                        },
                        move: {
                            direction: MoveDirection.none,
                            enable: true,
                            outModes: {
                                default: OutMode.out,
                            },
                            random: true,
                            speed: 0.2,
                            straight: false,
                        },
                        opacity: {
                            animation: {
                                enable: true,
                                speed: 0.8,
                                sync: false,
                            },
                            value: { min: 0, max: 1 },
                        },
                        size: {
                            value: { min: 1, max: 2.5 },
                        },
                    },
                    detectRetina: true,
                }}
            />
        </div>
    );
});
