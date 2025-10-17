import { useState, useEffect } from 'react';

/**
 * Animates a number counting up from `start` to `end` over a given `duration`.
 * Uses an easeOutQuart function for a natural animation effect.
 *
 * @param {number} end - The target value to count up to.
 * @param {number} duration - Duration of the animation in milliseconds. Defaults to 2000ms.
 * @param {number} start - The initial value to start counting from. Defaults to 0.
 * @returns {number} The current animated count value.
 */
export const useCountUp = (end: number, duration: number = 2000, start: number = 0): number => {
    const [count, setCount] = useState(start);

    /**
     * Custom React hook that animates a number counting up from `start` to `end` over a given `duration`.
     * Uses an easeOutQuart function for a natural animation effect.
     *
     * @param {number} end - The target value to count up to.
     * @param {number} duration - Duration of the animation in milliseconds. Defaults to 2000ms.
     * @param {number} start - The initial value to start counting from. Defaults to 0.
     * @returns {number} The current animated count value.
     */
    useEffect((): () => void => {
        let startTime: number;
        let animationFrame: number;

        const animate: (timestamp: number) => void = (timestamp: number): void => {
            if (!startTime) startTime = timestamp;
            const progress: number = Math.min((timestamp - startTime) / duration, 1);

            // Easing function für natural animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentCount = Math.floor(easeOutQuart * (end - start) + start);
            setCount(currentCount);

            if (progress < 1) { animationFrame = requestAnimationFrame(animate); }
        };

        animationFrame = requestAnimationFrame(animate);

        return (): void  => {
            if (animationFrame) { cancelAnimationFrame(animationFrame); }
        };
    }, [end, duration, start]);

    return count;
};
