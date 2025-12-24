import {JSX, useEffect, useState} from "react";
import {AnimateOnView} from "@/components/animations/AnimateOnView";
import {AnimatedTextReveal} from "@/components/animations/TextReveal";
import index from "@/styles/components/index.module.css";
import colors from "@/styles/util/colors.module.css";
import animations from "@/styles/util/animations.module.css";
import {Testimonial, TESTIMONIALS} from "@/types/Testimonial";
import {TestimonialCard} from "@/components/elements/grid/TestimonialCard";
import Image from "next/image";
import {useTranslations} from "next-intl";

interface TestimonialSectionProps {
    position?: 'left' | 'right';
}

/**
 * Shuffles an array using the Fisher-Yates algorithm.
 * Creates a new array with elements in random order without modifying the original array.
 *
 * @template T - The type of elements in the array
 * @param {T[]} array - The array to shuffle
 * @returns {T[]} A new array with the same elements in randomized order
 *
 * @example
 * const numbers = [1, 2, 3, 4, 5];
 * const shuffled = shuffleArray(numbers); // e.g., [3, 1, 5, 2, 4]
 */
function shuffleArray<T>(array: T[]): T[] {
    const shuffled: T[] = [...array];
    for (let i: number = shuffled.length - 1; i > 0; i--) {
        const j: number = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Splits an array into a specified number of roughly equal parts.
 * Distributes elements evenly across subarrays, with earlier parts receiving extra elements if the division is uneven.
 *
 * @template T - The type of elements in the array
 * @param {T[]} array - The array to split
 * @param {number} parts - The number of subarrays to create
 * @returns {T[][]} An array of subarrays, each containing a portion of the original array's elements
 *
 * @example
 * const items = [1, 2, 3, 4, 5];
 * const split = splitArray(items, 2); // [[1, 2, 3], [4, 5]]
 */
function splitArray<T>(array: T[], parts: number): T[][] {
    const result: T[][] = [];
    const itemsPerPart: number = Math.ceil(array.length / parts);

    for (let i: number = 0; i < parts; i++) {
        result.push(array.slice(i * itemsPerPart, (i + 1) * itemsPerPart));
    }

    return result;
}

/**
 * TestimonialSection component that displays community testimonials in a two-column infinite scroll layout.
 * The testimonials are split into two columns that scroll in opposite directions to create a dynamic visual effect.
 *
 * Features:
 * - Two-column layout with infinite scrolling animations
 * - Left column with section description and animated title
 * - Right column with testimonials scrolling up and down
 * - Gradient overlays at top and bottom for smooth visual transitions
 * @param {object} props Component properties.
 * @param {string} props.position Can be "right" or "left".
 * @returns JSX element containing the complete testimonial section
 */
export default function TestimonialSection({ position = 'left' }: TestimonialSectionProps): JSX.Element {
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const [is2XL, setIs2XL] = useState(false);
    const tTestimonial = useTranslations('TestimonialSection');

    const [columns, setColumns] = useState<[Testimonial[], Testimonial[]]>((): [Testimonial[], Testimonial[]] => {
        const [left, right] = splitArray(TESTIMONIALS, 2); // initial state
        return [left, right];
    });

    /**
     * Effect: synchronize `is2XL` state with the current viewport width.
     *
     * - Sets `is2XL` to `true` when `window.innerWidth >= 1536` (Tailwind `2xl` breakpoint),
     *   otherwise sets it to `false`.
     * - Runs once on mount to initialize the value.
     * - Adds a `resize` event listener to update the state when the viewport resizes.
     * - Cleans up the event listener on unmount.
     */
    useEffect((): () => void => {
        const checkScreenSize: () => void = (): void => {
            setIs2XL(window.innerWidth >= 1536); // 2xl breakpoint
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return (): void => window.removeEventListener('resize', checkScreenSize);
    }, []);

    /**
     * Effect hook that shuffles testimonials on component mount.
     *
     * Randomizes the order of all testimonials and distributes them evenly
     * across two columns to create varied layouts on each page load.
     */
    useEffect((): void => {
        const shuffled: Testimonial[] = shuffleArray(TESTIMONIALS);
        const [left, right] = splitArray(shuffled, 2);
        setColumns([left, right]);
    }, []);

    /**
     * Handles the hover state for a testimonial card.
     * Updates the currently hovered card ID and toggles the scrolling animation.
     *
     * When a card is hovered, scrolling pauses for readability; when hover ends, it resumes.
     *
     * @param cardId - The hovered card's ID, or null if no card is hovered.
     */
    const handleCardHover: (cardId: string | null) => void = (cardId: string | null): void => {
        setHoveredCard(cardId);
        setIsPaused(cardId !== null);
    };

    /**
     * Renders a column of testimonial cards with infinite scroll animation.
     * The testimonials are doubled to create a seamless infinite scroll effect.
     *
     * @param testimonials - Array of testimonial objects to display
     * @param direction - Scroll direction: 'up' for upward scrolling, 'down' for downward scrolling
     * @returns JSX element containing the animated testimonial column
     */
    const renderColumn: (testimonials: Testimonial[], direction: 'up' | 'down') => JSX.Element =
        (testimonials: Testimonial[], direction: 'up' | 'down'): JSX.Element => {
            const doubled: Testimonial[] = [...testimonials, ...testimonials];

            return (
                <div className="flex-1 min-w-0 overflow-hidden">
                    <div className={`flex flex-col gap-y-4 md:gap-y-7 ${direction === 'down' ? animations.animate_scroll_column_up :
                                                                                               animations.animate_scroll_column_reverse}`}
                         style={{ animationPlayState: isPaused ? 'paused' : 'running' }}>
                        {doubled.map((testimonial: Testimonial, index: number): JSX.Element => {
                            const cardId: string = `${testimonial.userid}-${index}`;
                            const isCurrentHovered: boolean = hoveredCard === cardId;

                            return (
                                <div key={cardId} className={isCurrentHovered ? 'hovered' : ''}>
                                    <TestimonialCard username={testimonial.username} rank={testimonial.rank}
                                                     rank_color={testimonial.rank_color} avatar_url={testimonial.avatar_url}
                                                     content={testimonial.content} isHovered={isCurrentHovered}
                                                     hoveredCard={hoveredCard} userid={testimonial.userid}
                                                     onHoverChange={(hovered: boolean): void => handleCardHover(hovered ? cardId : null)} />
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        };

    {/* Left column: Section Description */}
    const descriptionColumn: JSX.Element = (
        <div>
            {/* Tag */}
            <div className="mb-2">
                <div className="font-bold tracking-wider">
                    <AnimateOnView animation={`${position === 'left' ? 'animate__fadeInLeft' : 'animate__fadeInRight'} animate__slower`}>
                        <AnimatedTextReveal text={tTestimonial('infoTag')}
                                            className={`text-sm text-[coral] uppercase text-center
                                                        ${position === 'left' ? '2xl:text-start' : ''} pb-3 lg:pb-0`}
                                            shadowColor="rgba(255,127,80,0.35)" />
                    </AnimateOnView>
                </div>
            </div>

            {/* Title */}
            <AnimateOnView animation={`${position === 'left' ? 'animate__fadeInLeft' : 'animate__fadeInRight'} animate__slower`}>
                <h2 className={`${is2XL && position === 'left' ? index.head_border : index.head_border_center} bg-clip-text 
                                text-transparent mb-2 text-center ${position === 'left' ? '2xl:text-start' : '2xl:text-center'}
                                ${colors.text_gradient_gray} my-0 font-semibold leading-[1.1] text-[2.25rem] 
                                md:text-[2.75rem] lg:text-[clamp(1.75rem,_1.3838rem_+_2.6291vw,_3.25rem)]`}>
                    <span className="inline-block align-middle leading-none -mx-[5px]
                                     -mt-[5px] text-white">💫</span> - {tTestimonial('title')}
                </h2>
            </AnimateOnView>

            {/* Description */}
            <AnimateOnView animation={`${position === 'left' ? 'animate__fadeInLeft' : 'animate__fadeInRight'} animate__slower`}>
                <p className={`text-[#969cb1] pt-6 break-words max-w-lg md:max-w-full  text-sm text-start 
                               items-center md:text-base mx-auto ${position === 'left' ? 'xl:mx-0 xl:max-w-md' : 'xl:max-w-full'}`}>
                    {tTestimonial('description')}
                    <br /><br />
                    {tTestimonial('description2')}
                </p>
            </AnimateOnView>
        </div>
    );

    {/* Right Column: Grid for Testimonials */}
    const testimonialsColumn: JSX.Element = (
        <div className="relative overflow-hidden">
            <AnimateOnView animation={`${is2XL ? position === 'left' ? "animate__fadeInRight" : "animate__fadeInLeft" : 
                                                                       "animate__fadeIn" } animate__slower`}>
                <div className="flex gap-4 md:gap-7 overflow-hidden max-h-[500px] sm:max-h-[580px] md:max-h-[680px]">
                    {renderColumn(columns[0], 'down')}
                    <div className="hidden sm:contents">
                        {/* Hide second column on smaller devices */}
                        {renderColumn(columns[1], 'up')}
                    </div>
                </div>
            </AnimateOnView>

            <div className={colors.gradient_top}></div>
            <div className={colors.gradient_bottom}></div>
        </div>
    );

    return (
        <section className="relative py-20 bg-black/49" id="discord-server-testimonials">
            {/* Background Image */}
            <div className="absolute inset-0 -z-10">
                <Image src="/images/bg/grid-1920w.webp" fill sizes="100vw"
                       alt="Grid BG - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                       className="w-full h-full object-cover" />
            </div>

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
                <div className={`grid gap-6 grid-cols-1 items-center overflow-hidden
                                 ${position === 'left' ? 'lg:grid-cols-[0.65fr_1fr] md:gap-7' : 'lg:grid-cols-[1fr_0.80fr] md:gap-20'}`}>
                    {position === 'left' ? (
                        <>
                            {descriptionColumn}
                            {testimonialsColumn}
                        </>
                    ) : (
                        <>
                            {testimonialsColumn}
                            {descriptionColumn}
                        </>
                    )}
                </div>
            </div>

            { /* Bottom border for this section */ }
            <div className="bg-[radial-gradient(50%_50%_at_50%_50%,#d8e7f212_0%,#04070d_100%)] z-10
                            flex-none h-1 absolute bottom-0 left-0 right-0"></div>
        </section>
    );
}
