import { useState, useEffect } from 'react';

/**
 * Custom React hook to determine the currently most visible section in the viewport.
 *
 * @param sectionIds - Array of section element IDs to observe.
 * @returns The ID of the section with the largest visible area in the viewport.
 */
export const useActiveSection = (sectionIds: string[]): string => {
    const [activeSection, setActiveSection] = useState<string>('');

    /**
     * React effect to track and update the most visible section in the viewport.
     *
     * This effect observes scroll and resize events to determine which section
     * (from the provided sectionIds) currently has the largest visible area
     * in the viewport, and updates the activeSection state accordingly.
     */
    useEffect((): () => void => {
        /* Calculates which section is most visible in the viewport and updates state. */
        const calculateActiveSection: () => void = (): void => {
            let maxVisibleArea: number = 0;
            let mostVisibleSectionId: string = '';

            sectionIds.forEach((id: string): void => {
                const element: HTMLElement | null = document.getElementById(id);
                if (!element) return; // Skip if element not found

                const rect: DOMRect = element.getBoundingClientRect();
                const viewportHeight: number = window.innerHeight;
                const viewportWidth: number = window.innerWidth;

                // Calculate visible height within viewport
                const visibleTop: number = Math.max(0, rect.top);
                const visibleBottom: number = Math.min(viewportHeight, rect.bottom);
                const visibleHeight: number = Math.max(0, visibleBottom - visibleTop);

                // Calculate visible width within viewport
                const visibleLeft: number = Math.max(0, rect.left);
                const visibleRight: number = Math.min(viewportWidth, rect.right);
                const visibleWidth: number = Math.max(0, visibleRight - visibleLeft);

                // Area of the section currently visible in the viewport
                const visibleArea: number = visibleHeight * visibleWidth;

                // Track the section with the largest visible area
                if (visibleArea > maxVisibleArea) {
                    maxVisibleArea = visibleArea;
                    mostVisibleSectionId = id;
                }
            });

            setActiveSection(mostVisibleSectionId || '');
        };

        // Run calculation initially
        calculateActiveSection();

        // Listen for scroll and resize to recalculate
        window.addEventListener('scroll', calculateActiveSection);
        window.addEventListener('resize', calculateActiveSection);

        // Cleanup event listeners on unmount or sectionIds change
        return (): void => {
            window.removeEventListener('scroll', calculateActiveSection);
            window.removeEventListener('resize', calculateActiveSection);
        };
    }, [sectionIds]);

    return activeSection;
};