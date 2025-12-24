import {JSX, RefObject, useEffect, useMemo, useRef, useState} from "react";
import {AnimateOnView} from "@/components/animations/AnimateOnView";
import {AnimatedTextReveal} from "@/components/animations/TextReveal";
import colors from "@/styles/util/colors.module.css";
import buttons from "@/styles/util/buttons.module.css";
import ButtonHover from "@/components/elements/ButtonHover";
import {useTranslations} from "next-intl";
import {timeline, TimelineData} from "@/types/TimelineData";

import index from '../../../styles/components/index.module.css';
import Link from "next/link";
import {AdContainer} from "@/components/elements/ads/AdWrapper";
import AdBanner from "@/components/elements/ads/AdBanner";
import {ParticlesBackground} from "@/components/animations/ParticlesBackground";
import TimelineItem from "@/components/elements/grid/TimelineItem";
import {FaDiscord, FaRocket, FaUsers} from "react-icons/fa";

/**
 * The `HistorySection` component renders a section of the webpage that provides
 * an overview of the Discord server's history. It includes animated text, a description,
 * buttons for user interaction, and a timeline of events.
 *
 * Key Features:
 * - Sticky left content with an animated tag, headline, description, and buttons.
 * - Scrollable right content displaying a timeline of events.
 * - Responsive design with TailwindCSS utility classes.
 *
 * @returns {JSX.Element} The rendered `HistorySection` component.
 */
export default function HistorySection(): JSX.Element {
    const tWelcome = useTranslations('WelcomeHero');
    const tHistorySection = useTranslations("HistorySection");
    const [focusedIndex, setFocusedIndex] = useState<number>(0);
    const [fillHeight, setFillHeight] = useState<number>(0);
    const [maxBorderHeight, setMaxBorderHeight] = useState<number>(0);
    const [borderAnimationComplete, setBorderAnimationComplete] = useState<boolean>(false);
    const itemRefs: RefObject<(HTMLDivElement | null)[]> = useRef<(HTMLDivElement | null)[]>([]);

    /**
     * Sets up an IntersectionObserver to track which timeline item is closest to the vertical center of the viewport.
     * Updates the focusedIndex state when the closest item changes.
     * Observes all timeline item refs and disconnects the observer on cleanup.
     *
     * This is used to change the size and opacity of the focused item inside the timeline.
     */
    useEffect((): () => void => {
        const observer: IntersectionObserver = new IntersectionObserver(
            (entries: IntersectionObserverEntry[]): void => {
                let closestEntry: IntersectionObserverEntry = entries[0];
                let closestDistance: number = Math.abs(
                    entries[0].boundingClientRect.top + entries[0].boundingClientRect.height / 2 - window.innerHeight / 2
                );

                // find the item which is the closest in the mid of the screen
                entries.forEach((entry: IntersectionObserverEntry): void => {
                    const distance: number = Math.abs(
                        entry.boundingClientRect.top + entry.boundingClientRect.height / 2 - window.innerHeight / 2
                    );

                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestEntry = entry;
                    }
                });

                // find the index of the focused item and set it to the state
                const index: number = itemRefs.current.findIndex((ref: HTMLDivElement | null): boolean =>
                    ref === closestEntry.target);
                if (index !== -1) { setFocusedIndex(index); }
            },
            {threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: '-50% 0px -50% 0px' }
        );

        // observe all timeline items
        itemRefs.current.forEach((ref: HTMLDivElement | null): void => {
            if (ref) observer.observe(ref);
        });

        return (): void => observer.disconnect();
    }, []);

    /**
     * Updates the fill height of the timeline's animated line based on the currently focused timeline item.
     * - If the first item is focused, calculates the height from the top of the container to the center of the first item.
     * - If another item is focused, sums the heights of all previous items plus half the height of the focused item,
     *   including the gap between items (56px).
     *
     * This is used to apply a "color animation" on the border of the timeline container.
     *
     * @param focusedIndex Index of the currently focused timeline item.
     * @effect Recalculates fillHeight whenever focusedIndex changes.
     */
    useEffect((): void => {
        if (focusedIndex === 0 && itemRefs.current[0]) {
            const firstItemRect: DOMRect = itemRefs.current[0].getBoundingClientRect();
            const containerTop: number = itemRefs.current[0].parentElement?.parentElement?.getBoundingClientRect().top || 0;
            setFillHeight((firstItemRect.top - containerTop) + (firstItemRect.height / 2));
        } else if (focusedIndex > 0 && itemRefs.current[focusedIndex]) {
            let totalHeight: number = 0;
            for (let i: number = 0; i < focusedIndex; i++) {
                if (itemRefs.current[i]) {
                    totalHeight += itemRefs.current[i]!.offsetHeight + 56; // 56px = "gap-14"
                }
            }
            if (itemRefs.current[focusedIndex]) {
                totalHeight += itemRefs.current[focusedIndex]!.offsetHeight / 2;
            }
            setFillHeight(totalHeight);
        }
    }, [focusedIndex]);

    /**
     * Calculates and sets the maximum height for the timeline border gradient based on the measured
     * heights of the rendered timeline items.
     *
     * The effect runs whenever the count of measured item refs changes. It:
     * - Ensures all timeline item refs are present.
     * - Sums the heights of all items before the last one, adding 56px per gap (corresponds to `gap-14`).
     * - Adds half of the last item's height (to reach its vertical center).
     * - Stores the computed value in `maxBorderHeight` so the border gradient can be clipped to the content.
     */
    useEffect((): void => {
        if (itemRefs.current.length === timeline.length && itemRefs.current[timeline.length - 1]) {
            let totalHeight: number = 0;
            for (let i: number = 0; i < timeline.length - 1; i++) {
                if (itemRefs.current[i]) {
                    totalHeight += itemRefs.current[i]!.offsetHeight + 56;
                }
            }
            // to mid from last item
            if (itemRefs.current[timeline.length - 1]) {
                totalHeight += itemRefs.current[timeline.length - 1]!.offsetHeight / 2;
            }
            setMaxBorderHeight(totalHeight);
        }
    }, [itemRefs.current.length]);

    /**
     * Smoothly scrolls the viewport to the timeline item at the given index,
     * centering it vertically in the window.
     *
     * @param index - The index of the timeline item to scroll to.
     */
    const scrollToItem: (index: number) => void = (index: number): void => {
        if (itemRefs.current[index]) {
            const element: HTMLDivElement | null = itemRefs.current[index];
            const elementRect: DOMRect = element!.getBoundingClientRect();
            const absoluteElementTop: number = elementRect.top + window.pageYOffset;
            const middle: number = absoluteElementTop - (window.innerHeight / 2) + (elementRect.height / 2);

            window.scrollTo({top: middle, behavior: 'smooth' });
        }
    };

    /**
     * Handles the click event for a timeline item.
     * Scrolls smoothly to the selected item and updates the focused index state.
     *
     * @param index - Index of the clicked timeline item.
     */
    const handleItemClick: (index: number) => void = (index: number): void => {
        scrollToItem(index);
        setFocusedIndex(index);
    };

    return (
        <section className="pr-8 pl-8 pb-40 pt-32 bg-slate-900/30 relative" id="discord-server-history">
            {/* useMemo stops re-creating the particles on scroll */}
            {useMemo((): JSX.Element => (
                <ParticlesBackground particles={80} className="z-10 animate__animated animate__fadeIn animate__slower" />
            ), [])}

            <div className="mx-auto w-full xl:max-w-[1400px]">
                <div className="flex flex-col xl:grid xl:auto-cols-[1fr] xl:grid-cols-[1fr_1fr] xl:grid-rows-[auto_auto]
                                xl:gap-x-[106px] gap-y-18 xl:gap-y-4 xl:[place-items:start_stretch]">

                    {/* Sticky Content left (Section Overview) */}
                    <div className="flex justify-start items-start [flex-flow:column] xl:sticky xl:top-36 gap-2.5
                                    px-0 md:px-20 xl:px-0">
                        {/* Animated Tag */}
                        <div className="font-bold tracking-wider mb-1 self-center xl:self-auto">
                            <AnimateOnView animation="animate__fadeInLeft animate__slower">
                                <AnimatedTextReveal text={tHistorySection('infoTag')}
                                                    className="text-sm text-[coral] uppercase
                                                               text-center lg:text-start pb-3 lg:pb-0"
                                                    shadowColor="rgba(255,127,80,0.35)" />
                            </AnimateOnView>
                        </div>

                        {/* Headline */}
                        <AnimateOnView animation="animate__fadeInLeft animate__slower">
                            <h2 className={`${index.head_border} max-w-[22ch] bg-clip-text text-transparent mb-6 
                                            ${colors.text_gradient_gray} my-0 font-semibold leading-[1.1]
                                            text-start text-[clamp(2rem,_1.3838rem_+_2.6291vw,_3.60rem)]`}>
                                <span className="inline-block align-middle leading-none text-white">
                                    🪶</span> - {tHistorySection('title')}
                            </h2>
                        </AnimateOnView>

                        {/* Description */}
                        <AnimateOnView animation="animate__fadeInLeft animate__slower">
                            <p className="text-[#969cb1] mb-6 break-words max-w-full xl:max-w-2xl">
                                {tHistorySection('description')}<br /><br />
                                {tHistorySection('description2')}<br /><br />
                                {tHistorySection('description3')}<br /><br />
                                {tHistorySection('description4')}</p>
                        </AnimateOnView>

                        {/* Buttons */}
                        <AnimateOnView animation="animate__fadeInUp animate__slower w-full lg:w-auto">
                            <div className="flex flex-col lg:flex-row mt-2 gap-6">
                                <div className="flex flex-col items-end relative group w-full sm:w-auto z-[20]
                                                drop-shadow-xl drop-shadow-white/5">
                                    <a href="https://discord.gg/bl4cklist" target="_blank"
                                       className="flex flex-col items-end w-full">
                                        <button className={`relative w-full sm:min-w-52 ${buttons.white_gray}`}>
                                            <FaDiscord className="text-gray-100" />
                                            <p className="whitespace-pre">{tWelcome('joinDiscord')}</p>
                                        </button>
                                    </a>
                                    <ButtonHover />
                                </div>

                                <div className="flex flex-col items-end relative group w-full sm:w-auto">
                                    <Link href="discord/community" className="flex flex-col items-end w-full">
                                        <button className={`relative w-full sm:min-w-52 ${buttons.black_purple}`}>
                                            <FaUsers className="text-gray-100" />
                                            <p className="whitespace-pre">{tHistorySection('ourCommunity')}</p>
                                        </button>
                                    </Link>

                                    <ButtonHover />
                                </div>
                            </div>
                        </AnimateOnView>

                    </div>

                    {/* Scrollable Content right (Timeline Items) */}
                    <div className="pl-3">
                        <div className="relative flex flex-col gap-14">
                            <AnimateOnView animation="animate__fadeIn animate__slower" className="absolute inset-0"
                                           threshold={0.05} rootMargin="0px 0px 0px 0px"
                                           onAnimationEnd={() => setBorderAnimationComplete(true)}>
                                {/* Timeline Border gradient */}
                                <div className="absolute w-0.5 h-full bg-gradient-to-b from-white/20 via-white/40
                                                to-white/10 inset-y-0 left-0"
                                     style={{ height: maxBorderHeight > 0 ? `${maxBorderHeight}px` : '100%' }}></div>

                                {/* Used to fill out the timeline border color for passed elements */}
                                <div className="absolute w-0.5 bg-gradient-to-b from-white/90 to-white/60 inset-y-0
                                                left-0 transition-all duration-500"
                                     style={{ height: `${fillHeight}px` }} />

                                {/* Icon at the top of the timeline border */}
                                <div className="absolute -top-1 -left-2 w-5 h-5 flex items-center justify-center
                                                bg-gradient-to-br from-white via-gray-200 to-gray-400 rounded-full
                                                shadow-lg transition-all duration-500">
                                    <FaRocket className="text-gray-800 text-xs -rotate-45" />
                                </div>
                            </AnimateOnView>

                            {/* Items of the timeline */}
                            {timeline.map((item: TimelineData, index1: number): JSX.Element => (
                                <div key={index1} ref={(el: HTMLDivElement | null): void => { itemRefs.current[index1] = el; }}>
                                    <AnimateOnView animation={borderAnimationComplete ?
                                                              "animate__fadeInUp animate__slower" : ""}
                                                   className="opacity-0">
                                        <TimelineItem date={tHistorySection(item.date)} title={tHistorySection(item.title)}
                                                      description={tHistorySection(item.description)}
                                                      logoSrc={item.logoSrc} logoAlt={item.logoAlt}
                                                      bgSrc={item.bgSrc} bgAlt={item.bgAlt}
                                                      bgRotation={item.bgRotation}
                                                      borderShadowClass={index.team_border_shadow}
                                                      isFocused={focusedIndex === index1}
                                                      isPassed={index1 <= focusedIndex}
                                                      isLastItem={index1 === timeline.length - 1}
                                                      onClick={() => handleItemClick(index1)} />
                                    </AnimateOnView>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <AdContainer>
                    <AdBanner dataAdSlot="3191745244" dataAdFormat="horizontal" />
                </AdContainer>
            </div>

            { /* Bottom border for this section */ }
            <div className="bg-[radial-gradient(50%_50%_at_50%_50%,#d8e7f212_0%,#04070d_100%)] z-[1]
                            flex-none h-1 absolute bottom-0 left-0 right-0"></div>
        </section>
    )
}