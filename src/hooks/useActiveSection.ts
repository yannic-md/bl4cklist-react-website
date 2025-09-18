import { useState, useEffect } from 'react';

/**
 * Track the currently active section based on intersection with the viewport.
 * Observes elements by their IDs and updates the active section when a section becomes visible.
 *
 * @param sectionIds Array of section element IDs to observe.
 * @param threshold Intersection threshold for visibility (default: 0.5).
 * @returns The ID of the currently active section or an empty string if none are visible.
 */
export const useActiveSection = (sectionIds: string[], threshold: number = 0.5): string => {
    const [activeSection, setActiveSection] = useState<string>('');

    /**
     * Custom React hook to track the currently active section based on intersection with the viewport.
     * Observes elements by their IDs and updates the active section when a section becomes visible.
     *
     * @param sectionIds - Array of section element IDs to observe.
     * @param threshold - Intersection threshold for visibility (default: 0.5).
     * @returns The ID of the currently active section or an empty string if none are visible.
     */
    useEffect((): () => void => {
        const observerCallback = (entries: IntersectionObserverEntry[]): void => {
            const sortedEntries: IntersectionObserverEntry[] = entries.sort((a, b): number => {
                const rectA: DOMRect = a.boundingClientRect;
                const rectB: DOMRect = b.boundingClientRect;
                return rectA.top - rectB.top;
            }); // Sort by position in the document (top to bottom)

            // Find first visible element
            const visibleEntry: IntersectionObserverEntry | undefined = sortedEntries.find(entry => entry.isIntersecting);

            if (visibleEntry) {
                const id: string = visibleEntry.target.id;
                setActiveSection(id);
            } else {
                setActiveSection('');  // Reset if no element is visible
            }
        };

        const observer: IntersectionObserver = new IntersectionObserver(observerCallback, { threshold });

        const elements: HTMLElement[] = sectionIds
            .map(id => document.getElementById(id))
            .filter((el): el is HTMLElement => Boolean(el));
        elements.forEach(element => observer.observe(element));

        return (): void => observer.disconnect();
    }, [sectionIds, threshold]);

    return activeSection;
};

