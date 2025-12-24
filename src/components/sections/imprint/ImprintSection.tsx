import React, {JSX, useState, useEffect, useRef, RefObject} from 'react';
import {ImprintSectionType} from "@/types/ImprintSection";
import {imprintData} from "@/data/imprintData";
import {FaChevronDown} from "react-icons/fa";

/**
 * Renders the imprint and data privacy section with a linked sidebar.
 * Tracks which article is currently visible using an IntersectionObserver and
 * exposes collapsible parent sections in the sidebar for improved navigation.
 *
 * @return {JSX.Element} The rendered ImprintSection component markup.
 */
export default function ImprintSection(): JSX.Element {
    const [activeSection, setActiveSection] = useState<string>('');
    const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
    const sectionRefs: RefObject<Map<string, HTMLElement>> = useRef<Map<string, HTMLElement>>(new Map());

    /**
     * Initialize an IntersectionObserver that tracks visibility of article sections.
     *
     * When a tracked section becomes visible within the configured root margins,
     * the observer updates the component state with the section's id by calling
     * `setActiveSection`. This allows the sidebar to highlight the currently
     * visible section while the user scrolls.
     */
    useEffect((): () => void => {
        const observer = new IntersectionObserver(
            (entries: IntersectionObserverEntry[]): void => {
                entries.forEach((entry: IntersectionObserverEntry): void => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            }, {rootMargin: '-20% 0px -70% 0px', threshold: 0}
        );

        sectionRefs.current.forEach((element: HTMLElement): void => { observer.observe(element); });
        return (): void => observer.disconnect();
    }, []);

    /**
     * Toggle the collapsed state for a section id.
     *
     * This performs a functional update on the React state `collapsedSections`,
     * which holds a Set<string>. A new Set is created from the previous state
     * to preserve immutability. If `sectionId` is present the id is removed
     * (section expands), otherwise it is added (section collapses).
     *
     * @param {string} sectionId - The id of the section to toggle.
     */
    const toggleSection: (sectionId: string) => void = (sectionId: string): void => {
        setCollapsedSections((prev: Set<string>): Set<string> => {
            const newSet = new Set(prev);
            if (newSet.has(sectionId)) {
                newSet.delete(sectionId);
            } else {
                newSet.add(sectionId);
            }
            return newSet;
        });
    };

    /**
     * Generate a human-readable paragraph_count string for a section.
     *
     * - Top-level sections (no `childIndex`) produce `"N."` (one-based parent index).
     * - Child sections produce `"N.M"` (one-based parent and child indices).
     *
     * @param parentIndex - zero-based index of the parent section
     * @param childIndex - optional zero-based index of the child section
     * @returns formatted paragraph_count string (e.g. `"1."` or `"1.2"`)
     */
    const calcParagraphCount = (parentIndex: number, childIndex?: number): string => {
        return childIndex !== undefined ? `${parentIndex + 1}.${childIndex + 1}` : `${parentIndex + 1}.`;
    };

    /**
     * Render a single item in the imprint sidebar navigation.
     *
     * @param section      Imprint section metadata (id, title, children, etc.).
     * @param parentIndex  Zero-based index of the parent section in `imprintData`.
     * @param childIndex   Optional zero-based index of the child section.
     * @returns JSX element for a single sidebar list item.
     */
    const renderSidebarItem = (section: ImprintSectionType, parentIndex: number,
                                                                  childIndex?: number): JSX.Element => {
        const isParent: boolean = childIndex === undefined;
        const paragraph_count: string = calcParagraphCount(parentIndex, childIndex);
        const parentIsActive: boolean = isParent &&
            (section.children ? section.children.some((child: ImprintSectionType): boolean => activeSection === child.id) : false);
        const isCollapsed: boolean = collapsedSections.has(section.id);

        return (
            <li key={section.id} className="relative">
                <a className={`flex items-center justify-between py transition ${isParent ? '' : 'ml-4'} 
                               ${activeSection === section.id || parentIsActive ? 'text-zinc-100' : 
                                                                                  'text-zinc-400 hover:text-zinc-200'}`}
                    href={`#${section.id}`}>
                    {/* Number and Title (Like "1.2 Data Privacy" */}
                    <div className="flex flex-row text-[13px] flex-1">
                        <span className={isParent ? 'w-4' : 'w-7'}>{paragraph_count}</span>
                        <span className="flex-1">{section.title}</span>
                    </div>

                    {/* Chevron Icon (open/close dropdown menu of parent elements) */}
                    {isParent && section.children && (
                        <button className="ml-2 p-1.5 hover:bg-zinc-800/50 rounded transition cursor-pointer"
                                aria-label={isCollapsed ? 'Open' : 'Close'}
                                onClick={(e): void => {
                                    e.preventDefault(); toggleSection(section.id); }}>
                            <FaChevronDown aria-hidden="true" size={12}
                                           className={`transition-transform ${isCollapsed ? '-rotate-90' : ''}`} />
                        </button>
                    )}
                </a>
            </li>
        );
    };

    /**
     * Render a single article of the imprint content area.
     *
     * @param section      Imprint section metadata (id, title, content, etc.).
     * @param parentIndex  Zero\-based index of the parent section.
     * @param childIndex   Optional zero\-based index of the child section.
     * @returns JSX.Element representing the rendered article section.
     */
    const renderArticle = (section: ImprintSectionType, parentIndex: number,
                           childIndex?: number): JSX.Element => {
        const paragraph_count: string = calcParagraphCount(parentIndex, childIndex);
        const isParent: boolean = childIndex === undefined;

        return (
            <article key={section.id} id={section.id} className={`scroll-m-18 xl:scroll-m-28 ${isParent ? 'mb-0' : 'mb-12'}`}
                     ref={(el: HTMLElement | null): void => {if (el) sectionRefs.current.set(section.id, el); }}>
                <h2 className={`font-bold tracking-tight text-white 
                                ${isParent ? 'text-3xl lg:text-4xl pb-6 lg:pb-8 border-b border-zinc-100/10 mb-6 lg:mb-8' 
                                           : 'text-xl lg:text-2xl mb-3 lg:mb-4'}`}>
                    {paragraph_count} {section.title}
                </h2>
                {section.content &&
                    <p className="text-[#969cb1] text-sm lg:text-base leading-relaxed mb-6 lg:mb-8 wrap-break-word"
                       dangerouslySetInnerHTML={{ __html: section.content }}></p>
                }
            </article>
        );
    };

    return (
        <section className="relative bg-slate-900/30 h-full">
            {/* Header Border */}
            <div className="absolute w-full left-0 border-b border-zinc-100/10 pt-20 lg:pt-24"></div>

            {/* Content */}
            <div className="relative border-x border-zinc-100/10 mx-auto max-w-[1400px] px-3 pt-16 lg:pt-24 h-full">
                <div className="flex flex-col min-h-[95vh]">
                    {/* Header */}
                    <div className="mt-12 lg:my-20">
                        <h1 className="px-4 text-4xl lg:text-6xl font-bold tracking-tight text-white">
                            Impressum & Datenschutz
                        </h1>

                        <p className="px-4 text-xs lg:text-sm text-zinc-500 mt-3 lg:mt-4">
                            Auf dieser Seite findest du alle gesetzlich vorgeschriebenen Angaben zu unseren Diensten
                            sowie umfassende Informationen zum Schutz deiner personenbezogenen Daten. Du erhältst
                            transparente Einblicke in die verantwortliche Stelle, Kontaktmöglichkeiten,
                            rechtliche Hinweise sowie Details zu verwendeten Cookies und Drittanbieter-Diensten.
                            Darüber hinaus erläutert die Datenschutzerklärung, welche Daten erfasst werden, zu welchem
                            Zweck dies geschieht und welche Rechte dir als Nutzer zustehen.<br /><br />
                            <strong>DIESE SEITE IST NUR IN DER DEUTSCHEN SPRACHE VERFÜGBAR.</strong>
                        </p>

                        <div className="relative mt-3 lg:mt-4">
                            <div className="absolute -left-[13px] top-1.5 h-3.5 w-[2px] bg-zinc-100"></div>
                            <span className="px-4 text-xs lg:text-sm text-zinc-500">
                                Aktualisiert am: 9. Dezember 2025 um 21:23 Uhr
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col lg:flex-row pb-16 lg:pb-24">
                        {/* Sidebar for Content */}
                        <aside className="relative top-12 w-full lg:w-2/5 px-4 pt-0 h-fit overflow-y-auto mb-16 xl:mb-0
                                          max-h-[25vh] lg:max-h-full">
                            <ul className="mt-1.5 space-y-2 text-sm/5">
                                {imprintData.map((section: ImprintSectionType, parentIndex: number): JSX.Element => (
                                    <React.Fragment key={section.id}>
                                        {renderSidebarItem(section, parentIndex)}
                                        {section.children &&
                                            !collapsedSections.has(section.id) &&
                                            section.children.map((child: ImprintSectionType, childIndex: number): JSX.Element =>
                                                renderSidebarItem(child, parentIndex, childIndex)
                                            )}
                                    </React.Fragment>
                                ))}
                            </ul>
                        </aside>

                        {/* Content of the articles */}
                        <div className="w-full max-w-none pl-4 lg:pl-8 pr-4 lg:pr-8 mt-8 lg:mt-0 lg:border-l-[1px]
                                        border-zinc-100/10">
                            {imprintData.map((section: ImprintSectionType, parentIndex: number): JSX.Element => (
                                <React.Fragment key={section.id}>
                                    {renderArticle(section, parentIndex)}
                                    {section.children &&
                                        section.children.map((child: ImprintSectionType, childIndex: number): JSX.Element =>
                                            renderArticle(child, parentIndex, childIndex)
                                        )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Border */}
            <div className="absolute w-full bottom-0 left-0 border-b border-zinc-100/10 pb-16 lg:pb-24"></div>
        </section>
    );
}
