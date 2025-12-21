import {JSX, useEffect, useState} from 'react';
import animations from '@/styles/util/animations.module.css';
import Image from "next/image";

interface FallingObject {
    id: number;
    type: 'heart' | 'coin';
    left: number;
    duration: number;
    delay: number;
}

/**
 * React component for animating falling heart and coin objects.
 *
 * This component listens for a custom 'triggerFallingObjects' event and, when triggered,
 * spawns 32 animated objects (hearts and coins) that fall from randomized horizontal positions
 * with varied animation durations and delays. The objects are displayed for 6.5 seconds before being removed.
 *
 * @returns {JSX.Element} - The rendered overlay containing the falling objects.
 */
export default function FallingObjects(): JSX.Element {
    const [objects, setObjects] = useState<FallingObject[]>([]);

    /**
     * Spawns and animates 32 falling objects (hearts and coins) with randomized positions and timings.
     *
     * This function generates an array of 32 objects, each representing either a heart or a coin.
     * The objects are shuffled for random order, assigned unique horizontal positions, and given
     * randomized animation durations and delays to create a dynamic falling effect. After spawning,
     * the objects are set in state and automatically removed after 6.5 seconds to clean up the animation.
     */
    const spawnObjects: () => void = (): void => {
        const newObjects: FallingObject[] = [];
        const positions = new Set<number>();

        // create 32
        const types: ('heart' | 'coin')[] = [...Array(16).fill('heart'),
                                             ...Array(16).fill('coin')];

        // Fisher-Yates Shuffle for random sequence
        for (let i: number = types.length - 1; i > 0; i--) {
            const j: number = Math.floor(Math.random() * (i + 1));
            [types[i], types[j]] = [types[j], types[i]];
        }

        while (positions.size < 32) { // generate positions
            positions.add(Math.floor(Math.random() * 95) + 2); // 2-97% of width
        }

        const posArray: number[] = Array.from(positions);
        types.forEach((type: 'heart' | 'coin', index: number): void => {
            newObjects.push({id: Date.now() + index, type, left: posArray[index], duration: 2 + Math.random(),
                             delay: index * 0.1 // every object spawns 0.1s after the previes one (3.2s total)
                            });
        });

        setObjects(newObjects);
        setTimeout((): void => setObjects([]), 6500); // remove elements after animation
    };

    /**
     * useEffect hook to handle the falling objects animation trigger event.
     *
     * This effect sets up an event listener for the custom 'triggerFallingObjects' event on the window object.
     * When the event is fired, it calls the spawnObjects function to generate and animate falling objects.
     * The event listener is properly cleaned up when the component unmounts to prevent memory leaks.
     *
     * @returns {() => void} Cleanup function that removes the event listener.
     */
    useEffect((): () => void => {
        const handler: (_e: CustomEvent<any>) => void = (_e: CustomEvent): void => {
            spawnObjects();
        };

        window.addEventListener('triggerFallingObjects', handler as EventListener);
        return (): void => window.removeEventListener('triggerFallingObjects', handler as EventListener);
    }, []);

    return (
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999] overflow-hidden">
            {/* Drop the falling objects from top to bottom */}
            {objects.map((obj: FallingObject): JSX.Element => (
                <div key={obj.id} className={`absolute -top-12 w-8 h-8 ${animations.animate_image_fall}
                                              [filter:drop-shadow(0_2px_4px_rgba(0,0,0,0.3))]`}
                    style={{left: `${obj.left}%`, animationDuration: `${obj.duration}s`, animationDelay: `${obj.delay}s`}}>
                    <Image src={`/images/icons/pixel/konami-${obj.type === 'heart' ? 'heart' : 'coin'}-32w.webp`}
                           alt={"Konami Code Icon - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"} width={32}
                           height={obj.type === 'heart' ? 32 : 37} />
                </div>
            ))}
        </div>
    );
};