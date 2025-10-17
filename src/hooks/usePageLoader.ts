import {RefObject, useEffect, useRef, useState} from "react";

/**
 * Custom React hook that manages a simulated page loading progress bar.
 *
 * This hook provides a progress value (0-100) and a loading state, which can be used to display
 * a loading indicator while the page is loading. The progress bar increases gradually up to 90%
 * until the window "load" event fires, then animates smoothly to 100% and fades out after a configurable delay.
 *
 * @param {number} [fadeOutMs=300] - The duration in milliseconds to wait before hiding the loader after reaching 100%.
 * @returns An object containing the current progress (rounded integer) and loading state.
 */
export function usePageLoader(fadeOutMs: number = 300): { progress: number; isLoading: boolean } {
    const [progress, setProgress] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const intervalRef: RefObject<number | null> = useRef<number | null>(null);
    const rafRef: RefObject<number | null> = useRef<number | null>(null);
    const timeoutRef: RefObject<number | null> = useRef<number | null>(null);

    useEffect((): (() => void) | undefined => {
        /**
         * Completes the loading process by setting progress to 100%, then hides the loader after a specified delay.
         *
         * Clears any existing timeout to prevent multiple triggers.
         * Also removes the "is-loading" class from the document body.
         */
        const finishLoading: () => void = (): void => {
            if (timeoutRef.current) window.clearTimeout(timeoutRef.current);

            setProgress(100);
            timeoutRef.current = window.setTimeout(() => {
                setIsLoading(false);
                document.body.classList.remove("is-loading");
            }, fadeOutMs);
        };

        if (typeof window === "undefined" || typeof document === "undefined") { finishLoading(); return; }

        /**
         * Increases the progress value gradually up to a maximum of 90.
         *
         * Uses a minimum increment of 1 or 8% of the remaining distance to 90.
         * This simulates a loading bar that slows down as it approaches completion.
         */
        const trickle: () => void = (): void => {
            setProgress((p): number => (p >= 90 ? p : Math.min(90, p + Math.max(1, (90 - p) * 0.08))));
        };

        if (document.readyState === "complete") { finishLoading(); return; }
        intervalRef.current = window.setInterval(trickle, 120);

        /**
         * Handles the window load event by stopping the trickle interval,
         * then animates the progress bar to 100% using requestAnimationFrame.
         * Once complete, triggers a timeout to fade out the loader.
         */
        const onLoad: () => void = (): void => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }

            /**
             * Increases progress by at least 1 or 25% of the remaining distance to 100.
             * Once 100% is reached, triggers a timeout to fade out the loader.
             */
            const step: () => void = (): void => {
                let finished: boolean = false;
                setProgress((p): number => {
                    const next: number = p + Math.max(1, (100 - p) * 0.25);
                    if (next >= 100) {
                        finished = true;
                        return 100;
                    }
                    return next;
                });

                if (!finished) {
                    rafRef.current = window.requestAnimationFrame(step);
                } else {
                    finishLoading();
                }
            };

            step();
        };

        window.addEventListener("load", onLoad, { once: true });

        return (): void => { // cleanup
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            window.removeEventListener("load", onLoad);
        };
    }, [fadeOutMs]);

    return { progress: Math.round(progress), isLoading };
}