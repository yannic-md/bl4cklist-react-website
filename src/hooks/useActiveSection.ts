import {useState, useEffect, useRef, RefObject} from 'react';
import { usePathname } from 'next/navigation';

/**
 * Returns the id of the currently most visible section on large screens.
 *
 * Observes all section elements (with an id) and keeps track of visibility ratios via
 * an IntersectionObserver. Also reacts to DOM mutations to re-init when new
 * sections are added. No observation happens on small screens.
 *
 * @returns {string} - The id of the most visible section, or an empty string.
 */
export const useActiveSection: () => string = (): string => {
    const [activeSection, setActiveSection] = useState<string>('');
    const pathname: string = usePathname();
    const visibilityMapRef: RefObject<Map<string, number>> = useRef<Map<string, number>>(new Map());

    useEffect((): (() => void) | undefined => {
        /**
         * Collects all section ids present in the document.
         * Queries the DOM for `section[id]` elements and returns their ids.
         *
         * @returns {string[]} - Array of section ids found in the document.
         */
        const collectSectionIds: () => string[] = (): string[] => {
            const sections: NodeListOf<HTMLElement> = document.querySelectorAll('section[id]');
            return Array.from(sections).map((section: HTMLElement): string => section.id);
        };

        let allSectionIds: string[] = [];
        const observerOptions = {root: null, rootMargin: '0px',
                                 threshold: Array.from({ length: 101 }, (_, i): number => i / 100)};
        const visibilityMap: Map<string, number> = visibilityMapRef.current;

        /**
         * Determines which section currently has the highest visibility ratio and updates the hook state accordingly.
         * Scans the visibility map and sets the id with the maximum ratio, or an empty string if nothing is visible.
         */
        const updateActiveSection: () => void = (): void => {
            let maxRatio: number = 0;
            let mostVisibleId: string = '';

            allSectionIds.forEach((id: string): void => {
                const ratio: number = visibilityMap.get(id) || 0;
                if (ratio > maxRatio) {
                    maxRatio = ratio;
                    mostVisibleId = id;
                }
            });

            setActiveSection(maxRatio > 0 ? mostVisibleId : '');
        };

        /**
         * Intersection observer for tracking visibility of sections.
         *
         * Creates an IntersectionObserver that updates the visibility map for each observed section.
         * The callback ignores entries without a valid `id` and updates the map with either the intersection ratio
         * when intersecting or `0` when not intersecting, then triggers an active-section recalculation.
         *
         * @param {IntersectionObserverEntry[]} entries - Array of intersection entries provided by the observer.
         */
        const intersectionObserver = new IntersectionObserver((entries: IntersectionObserverEntry[]): void => {
            entries.forEach((entry: IntersectionObserverEntry): void => {
                visibilityMap.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
            });

            updateActiveSection();
        }, observerOptions);

        /**
         * Initialize or reinitialize the observation of all sections.
         *
         * Disconnects previous observations, clears visibility state, collects current `section[id]` elements,
         * registers them with the IntersectionObserver and performs an initial active-section update.
         */
        const initObserver: () => void = (): void => {
            // Clear previous observations
            intersectionObserver.disconnect();
            visibilityMap.clear();

            allSectionIds = collectSectionIds();
            allSectionIds.forEach((id: string): void => {
                const element: HTMLElement | null = document.getElementById(id);
                if (element) { visibilityMap.set(id, 0); intersectionObserver.observe(element); }
            });

            updateActiveSection();  // Initial update
        };

        /**
         * MutationObserver callback that re-initializes the IntersectionObserver
         * when new `section` elements are added to the DOM.
         *
         * @param {MutationRecord[]} mutations - Array of mutation records from the observer.
         */
        const mutationObserver = new MutationObserver((mutations: MutationRecord[]): void => {
            const hasNewSections: boolean = mutations.some((mutation: MutationRecord): boolean =>
                Array.from(mutation.addedNodes).some(node =>
                    node instanceof HTMLElement &&
                    (node.tagName === 'SECTION' || node.querySelector('section[id]'))
                )
            );

            if (hasNewSections) { initObserver(); }
        });

        mutationObserver.observe(document.body, {childList: true, subtree: true});
        // Initial setup with a small delay to ensure DOM is ready
        const timeoutId: NodeJS.Timeout = setTimeout(initObserver, 100);

        return (): void => {
            clearTimeout(timeoutId);
            intersectionObserver.disconnect();
            mutationObserver.disconnect();
            visibilityMap.clear();
        };
    }, [pathname]);

    return activeSection;
};