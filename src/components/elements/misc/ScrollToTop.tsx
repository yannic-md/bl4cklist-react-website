import {JSX, useEffect, useState} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faChevronUp} from "@fortawesome/free-solid-svg-icons";

/**
 * Displays a floating button that appears when the user scrolls  down more than half the viewport height.
 * Clicking the button smoothly scrolls the page to the top. The button uses fade-in and fade-out animations
 * for smooth appearance and disappearance.
 *
 * @returns {JSX.Element | null} The scroll-to-top button element, or null if not visible.
 */
export default function ScrollToTopButton(): JSX.Element | null {
    const [visible, setVisible] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    /**
     * useEffect hook that manages the visibility and rendering state of the scroll-to-top button
     * based on the user's scroll position. Adds a scroll event listener to the window and updates
     * the button's state for smooth appearance and disappearance.
     *
     * @param visible - Indicates if the button is currently visible (for animation).
     * @returns void
     */
    useEffect((): (() => void) => {
        const onScroll: () => void = (): void => {
            const isVisible: boolean = window.scrollY > window.innerHeight / 2;

            if (isVisible && !visible) {
                setShouldRender(true);
                setTimeout((): void => setVisible(true), 10);
            } else if (!isVisible && visible) {
                setVisible(false);
            }
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return (): void => window.removeEventListener("scroll", onScroll);
    }, [visible]);

    /**
     * Handles the delayed unmounting of the scroll-to-top button for smooth fade-out animation.
     * When the button becomes invisible, waits 300ms before removing it from the DOM.
     *
     * @param visible - Indicates if the button is currently visible (for animation).
     * @param shouldRender - Indicates if the button should be rendered in the DOM.
     */
    useEffect((): (() => void) | void => {
        if (!visible && shouldRender) {
            const timer: ReturnType<typeof setTimeout> = setTimeout((): void => setShouldRender(false), 400);
            return (): void => clearTimeout(timer);
        }
    }, [visible, shouldRender]);

    /**
     * Smoothly scrolls the window to the top of the page.
     * Used as the click handler for the scroll-to-top button.
     */
    const scrollToTop: () => void = (): void => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (!shouldRender) return null;

    return (
        <button onClick={scrollToTop} aria-label="Scroll to top"
                className={`fixed bottom-5 right-6 z-50 p-2 py-1.5 rounded-full bg-[rgba(29,30,35,0.85)]
                       border border-white/10 shadow-lg backdrop-blur-md transition-all duration-200
                       hover:bg-white/20 hover:border-white/20 text-white text-lg cursor-pointer hover:-translate-y-0.5
                       animate__animated ${visible ? 'animate__fadeInUp' : 'animate__fadeOutDown'}`}>
            <FontAwesomeIcon icon={faChevronUp} />
        </button>
    );
}
