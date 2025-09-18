import {useState, useEffect, useRef, RefObject, JSX} from 'react';

interface AnimatedTextRevealProps {
    text: string;
    className?: string;
    letterDelay?: number;
    fadeDuration?: number;
    threshold?: number;
    rootMargin?: string;
    shadowColor?: string;
    blurShadow?: boolean;
    blurShadowOpacity?: number;
    triggerOnce?: boolean;
}

/**
 * An independent React component for animating the reveal of text, letter by letter.
 * Each character fades in sequentially with optional blur-shadow background for enhanced visual effect.
 *
 * Props:
 * - text: The string to be revealed.
 * - className: Optional CSS classes for the container.
 * - letterDelay: Delay in ms between each letter's animation.
 * - fadeDuration: Duration in ms for each letter's fade-in.
 * - threshold: IntersectionObserver threshold for triggering animation.
 * - rootMargin: Margin for IntersectionObserver.
 * - shadowColor: Color for the text shadow and blur layer.
 * - blurShadow: Enables/disables blur-shadow effect.
 * - blurShadowOpacity: Opacity for the blur-shadow layer.
 * - triggerOnce: If true, animation triggers only once per mount.
 */
export const AnimatedTextReveal = ({
        text, className = "", letterDelay = 50, fadeDuration = 500, threshold = 0.3,  rootMargin = "0px 0px -50px 0px",
        shadowColor = "rgba(255,127,80,0.35)", blurShadow = true, blurShadowOpacity = 0.4,
        triggerOnce = true}: AnimatedTextRevealProps): JSX.Element => {
    const [isVisible, setIsVisible] = useState(false);
    const [hasAnimated, setHasAnimated] = useState(false);
    const elementRef: RefObject<null | HTMLDivElement> = useRef(null);

    /**
     * useEffect hook to observe the visibility of the component using IntersectionObserver.
     * Triggers animation when the element enters the viewport, optionally only once.
     *
     * @returns {void} Cleans up the observer on unmount or dependency change.
     */
    useEffect((): (() => void) => {
        const observer: IntersectionObserver = new IntersectionObserver(
            ([entry]: IntersectionObserverEntry[]): void => {
                if (entry.isIntersecting && (!triggerOnce || !hasAnimated)) {
                    setIsVisible(true);
                    if (triggerOnce) {
                        setHasAnimated(true);
                    }
                } else if (!triggerOnce && !entry.isIntersecting) {
                    setIsVisible(false);
                }
            },
            {
                threshold,
                rootMargin
            }
        );

        if (elementRef.current) { observer.observe(elementRef.current); }
        const currentRef: HTMLDivElement | null = elementRef.current;

        return (): void => {
            if (currentRef) { observer.unobserve(currentRef); }
        };
    }, [hasAnimated, triggerOnce, threshold, rootMargin]);

    return (
        <div ref={elementRef} className={`relative ${className}`}>
            {text.split('').map((char, index) => (
                <span key={index} className="relative inline-block">
                    {/* Blur-Shadow Layer (optional) */}
                    {blurShadow && (
                        <span className={`absolute inset-0 -top-[5px] -bottom-[5px] blur-sm transition-opacity ease-out`}
                              style={{transitionDuration: `${fadeDuration}ms`,
                                      transitionDelay: isVisible ? `${index * letterDelay}ms` : '0ms',
                                      opacity: isVisible ? blurShadowOpacity : 0,
                                      color: shadowColor.includes('rgba') ?
                                             shadowColor.replace(/rgba?\(([^)]+)\)/, 'rgb($1)')
                                                 .replace(/,\s*[\d.]+\)/, ')') : shadowColor}}>
                          {char === ' ' ? '\u00A0' : char}
                        </span>
                    )}

                    {/* Main Letters */}
                    <span className={`relative z-10 inline-block transition-all ease-out`} style={{
                            transitionDuration: `${fadeDuration}ms`,
                            transitionDelay: isVisible ? `${index * letterDelay}ms` : '0ms',
                            opacity: isVisible ? 1 : 0,
                            textShadow: isVisible ? `0 2px 4px ${shadowColor}` :
                                                    `0 2px 4px ${shadowColor.replace(/[\d.]+\)$/, '0)')}`}}>
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                </span>
            ))}
        </div>
    );
};
