import {useEffect, useState} from "react";

/**
 * Determine whether the viewport matches Tailwind's 2XL breakpoint (>= 1536px).
 *
 * Tracks a `(min-width: 1536px)` media query with `window.matchMedia`, updates React state immediately
 * and on subsequent changes, and cleans up the event listener on unmount. Prefers the modern
 * `addEventListener`/`removeEventListener` API on `MediaQueryList` when available.
 *
 * @param {number} max_width - The used width to search for.
 * @returns {boolean} - True if the viewport width is at least 1536px.
 */
export function useMediaQuery(max_width: number = 1536): boolean {
    const [is2XL, setIs2XL] = useState(false);

    /**
     * Returns true when the viewport matches Tailwind's 2XL breakpoint (min-width: 1536px).
     *
     * Uses window.matchMedia to track the 2XL breakpoint and subscribes to changes,
     * updating state immediately and on subsequent viewport resizes. Prefers the
     * modern addEventListener/removeEventListener API on MediaQueryList.
     *
     * @returns {boolean} - whether the viewport is at least 1536px wide.
     */
    useEffect((): (() => void) | undefined => {
        const mediaQuery: MediaQueryList = window.matchMedia(`(min-width: ${max_width}px)`);

        const handleChange: (e: MediaQueryListEvent | MediaQueryList) => void = (e: MediaQueryListEvent | MediaQueryList): void => {
            setIs2XL(e.matches);
        };

        handleChange(mediaQuery);
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleChange);
            return (): void => mediaQuery.removeEventListener('change', handleChange);
        }
    }, []);

    return is2XL;
}