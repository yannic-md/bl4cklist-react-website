import React, {JSX, RefObject, useEffect, useRef, useState} from "react";

interface AnimateOnViewProps {
    children: React.ReactNode;
    animation: string;
    threshold?: number;
    rootMargin?: string;
    triggerOnce?: boolean;
    className?: string;
    delay?: number;
    duration?: number;
    onAnimationEnd?: () => void;
}

/**
 * Triggers CSS animations when its children enter the viewport.
 * Uses IntersectionObserver to detect visibility and supports optional delay, duration, and single/multiple triggers.
 *
 * @returns {JSX.Element} Animated container wrapping the children.
 */
export const AnimateOnView = ({
        children, animation, threshold = 0.1, rootMargin = "0px 0px -100px 0px", triggerOnce = true, className = "",
        delay = 0, duration = 1000, onAnimationEnd}: AnimateOnViewProps): JSX.Element => {
    const [isVisible, setIsVisible] = useState(false);
    const [hasTriggered, setHasTriggered] = useState(false);
    const elementRef: RefObject<HTMLDivElement | null> = useRef(null);

    /**
     * React effect hook that sets up an IntersectionObserver to trigger animation when the element enters the viewport.
     * Handles optional delay, duration, and single/multiple trigger behavior.
     *
     * @param {React.MutableRefObject<HTMLDivElement | null>} elementRef - Reference to the DOM element to observe.
     * @param {boolean} triggerOnce - If true, animation triggers only once.
     * @param {boolean} hasTriggered - State indicating if animation has already triggered.
     * @param {number} threshold - Intersection threshold for triggering animation.
     * @param {string} rootMargin - Margin around the root for intersection calculations.
     * @param {number} delay - Delay in milliseconds before triggering animation.
     * @param {(visible: boolean) => void} setIsVisible - State setter for visibility.
     * @param {(triggered: boolean) => void} setHasTriggered - State setter for trigger status.
     */
    useEffect((): () => void => {
        const observer: IntersectionObserver = new IntersectionObserver(
            ([entry]: IntersectionObserverEntry[]): void => {
                if (entry.isIntersecting && (!triggerOnce || !hasTriggered)) {
                    setTimeout((): void => {
                        setIsVisible(true);
                        if (triggerOnce) setHasTriggered(true);
                        observer.disconnect();
                    }, delay);
                } else if (!triggerOnce && !entry.isIntersecting) {
                    setIsVisible(false);
                }
            },
            { threshold, rootMargin }
        );

        if (elementRef.current) { observer.observe(elementRef.current); }
        const currentRef: HTMLDivElement | null = elementRef.current;

        return (): void => {
            if (currentRef) { observer.unobserve(currentRef); }
        };
    }, [hasTriggered, triggerOnce, threshold, rootMargin, delay]);

    /**
     * Handles the animation end event.
     * Calls the optional onAnimationEnd callback if provided.
     */
    const handleAnimationEnd: () => void = (): void => {
        if (onAnimationEnd) onAnimationEnd();
    };

    return (
        <div ref={elementRef} style={{animationDuration: `${duration}ms`}}
             onAnimationEnd={handleAnimationEnd}
             className={`${className} ${!isVisible ? 'opacity-0' : ''} 
                         ${isVisible && animation ? `animate__animated ${animation}` : ''}`}>
            {children}
        </div>
    );
};