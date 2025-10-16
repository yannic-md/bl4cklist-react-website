import React, {JSX, useCallback, useEffect, useId} from "react";
import Particles, {initParticlesEngine} from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import {MoveDirection, OutMode} from "@tsparticles/engine";

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
export const ParticlesBackground: React.FC<ParticlesBackgroundProps> = ({ className = "", id, particles = 40 }:
                                                                        ParticlesBackgroundProps): JSX.Element => {
    const uniqueId: string = useId();
    const particlesId: string = id || `tsparticles-${uniqueId}`;

    /**
     * Initializes the particles engine with the slim preset when the component mounts.
     * Ensures that the particles engine is loaded only once.
     */
    useEffect((): void => {
        initParticlesEngine(async (engine): Promise<void> => { await loadSlim(engine); }).then();
    }, []);

    const particlesLoaded: () => Promise<void> = useCallback(async (): Promise<void> => {}, []);

    return (
        <Particles id={particlesId} particlesLoaded={particlesLoaded} className={`absolute inset-0 !opacity-30 
                                                                                  ${className} pointer-events-none`}
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
                            value: particles,
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
                            value: { min: 1, max: 2.5 },
                        },
                    },
                    detectRetina: true,
                }} />
    );
};
