import React, {JSX, useCallback, useEffect} from "react";
import Particles, {initParticlesEngine} from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import {MoveDirection, OutMode} from "@tsparticles/engine";

interface ParticlesBackgroundProps {
    className?: string;
}

/**
 * Renders a background with animated particles using the tsparticles library.
 *
 * @param {ParticlesBackgroundProps} props - Props for customizing the component.
 * @returns {JSX.Element} The rendered particles background.
 */
export const ParticlesBackground: React.FC<ParticlesBackgroundProps> = ({ className = "" }: ParticlesBackgroundProps): JSX.Element => {
    /**
     * Initializes the particles engine with the slim preset when the component mounts.
     * Ensures that the particles engine is loaded only once.
     */
    useEffect((): void => {
        initParticlesEngine(async (engine): Promise<void> => { await loadSlim(engine); }).then();
    }, []);

    const particlesLoaded: () => Promise<void> = useCallback(async (): Promise<void> => {}, []);

    return (
        <Particles id="tsparticles" particlesLoaded={particlesLoaded} className={`absolute inset-0 opacity-30 ${className}`}
                options={{
                    background: {
                        color: {
                            value: "transparent",
                        },
                    },
                    fullScreen: false,
                    fpsLimit: 120,
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
                            value: 40,
                        },
                        move: {
                            direction: MoveDirection.none,
                            enable: true,
                            outModes: {
                                default: OutMode.out,
                            },
                            random: true,
                            speed: 0.25,
                            straight: false,
                        },
                        opacity: {
                            animation: {
                                enable: true,
                                speed: 1,
                                sync: false,
                            },
                            value: { min: 0, max: 1 },
                        },
                        size: {
                            value: { min: 1, max: 3 },
                        },
                    },
                    detectRetina: true,
                }} />
    );
};
