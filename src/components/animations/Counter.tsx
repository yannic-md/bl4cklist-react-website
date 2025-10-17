import {useState, useEffect, useRef, RefObject, JSX} from 'react';
import { useCountUp } from '@/hooks/useCountUp';

/**
 * Displays a number that animates from 0 to the specified end value
 * when it becomes visible in the viewport. Supports optional suffix and locale formatting.
 *
 * @param {Object} props - Component props
 * @param {number} props.end - The target number to count up to
 * @param {string} [props.suffix] - Optional suffix to display after the number
 * @param {string} [props.locale] - Optional locale for number formatting
 * @returns {JSX.Element} The animated counter element
 */
export const AnimatedCounter = ({ end, suffix = '', locale }:
                                { end: number; suffix?: string; locale?: string }): JSX.Element => {
    const [isVisible, setIsVisible] = useState(false);
    const ref: RefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);
    const count: number = useCountUp(isVisible ? end : 0, 2500);

    /**
     * Sets up an IntersectionObserver to detect when the counter element becomes visible in the viewport.
     * Once visible, triggers the animation by updating the isVisible state.
     * Cleans up the observer on component unmount.
     *
     * @returns {void}
     */
    useEffect((): () => void => {
        const observer: IntersectionObserver = new IntersectionObserver(
            ([entry]: IntersectionObserverEntry[]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );

        if (ref.current) { observer.observe(ref.current); }
        return (): void => observer.disconnect();
    }, []);

    return (
        <div ref={ref} className="text-3xl font-bold text-white mb-2">
            {count.toLocaleString(locale || 'en-US')}{suffix}
        </div>
    );
};

