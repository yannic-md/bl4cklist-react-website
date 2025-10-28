import {JSX, useEffect, useState} from "react";

import index from '../../../styles/components/index.module.css';
import animations from '../../../styles/util/animations.module.css';
import {AnimateOnView} from "@/components/animations/AnimateOnView";
import {AnimatedTextReveal} from "@/components/animations/TextReveal";
import colors from "@/styles/util/colors.module.css";
import {AnimatedCounter} from "@/components/animations/Counter";
import {useRouter} from "next/router";
import {useTranslations} from "next-intl";
import buttons from "@/styles/util/buttons.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDiscord} from "@fortawesome/free-brands-svg-icons/faDiscord";
import ButtonHover from "@/components/elements/ButtonHover";
import Link from "next/link";
import {faRobot} from "@fortawesome/free-solid-svg-icons/faRobot";
import Image from "next/image";

/**
 * functional component that renders the hero section for the coding support page.
 *
 * Responsibilities:
 * - Renders localized headings, descriptions and call-to-action buttons using `next-intl`.
 * - Shows animated UI elements via `AnimateOnView`, `AnimatedTextReveal`, and `AnimatedCounter`.
 * - Uses Next.js `Image` for optimized images and decorative overlays for visual styling.
 *
 * Behavior / Side effects:
 * - Maintains an `is2XL` boolean state which reflects whether the viewport width is at least
 *   Tailwind's `2xl` breakpoint (1536px). This is initialized on mount and updated on window
 *   `resize` events. The resize listener is cleaned up on unmount.
 *
 * @return `JSX.Element` — the hero section JSX tree.
 */
export default function CodingHero(): JSX.Element {
    const tWelcome = useTranslations('WelcomeHero');
    const tCodingHero = useTranslations('CodingHero');
    const [is2XL, setIs2XL] = useState(false);
    const { locale } = useRouter();

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

    return (
        <section className="relative w-full py-6 md:pb-12 xl:py-24 2xl:p-0 min-h-[90%] 2xl:h-[95vh]
                            [@media(max-height:500px)]:pt-[20px] [@media(max-height:500px)]:pb-[50px] overflow-hidden">
            <Image src="/images/bg/tech-coding-bg-1920w.avif" fill priority sizes="100vw"
                   alt="Grid Background - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                   className="object-cover object-center -z-10 grayscale" />

            {/* Some Overlays to improve quality & add unique effect */}
            <div className={`absolute z-[3] inset-0 overflow-hidden pointer-events-none blur-[2px] 
                                 ${index.hero_colored_overlay}`}></div>
            <div className={`absolute z-[3] inset-0 overflow-hidden pointer-events-none 
                             ${index.hero_corner_shadow}`}></div>
            <div className={`absolute rounded-none overflow-hidden bg-repeat inset-0 w-full ${index.hero_grid_bg}
                             pointer-events-none`}></div>

            <div className="flex place-items-center items-center h-full pt-20 md:pt-24 px-4 sm:px-6 lg:px-8
                            mx-auto w-full max-w-7xl [@media(min-width:2000px)]:max-w-[100rem]">
                <div className="flex w-full flex-col 2xl:flex-row justify-between items-center gap-8 lg:gap-12">

                    {/* Text Section */}
                    <div className="w-full 2xl:w-1/2 relative z-10 text-center 2xl:text-left">
                        {/* Dark background overlay for better readability */}
                        <div className="absolute inset-0 -z-10 bg-black/50 rounded-full blur-3xl scale-110
                                        pointer-events-none"></div>

                        {/* Animated Tag */}
                        <div className="mb-2">
                            <div className="font-bold tracking-wider">
                                <AnimateOnView animation="animate__fadeInLeft animate__slower">
                                    <AnimatedTextReveal text={tCodingHero('infoTag')}
                                                        className="text-sm text-[coral] uppercase text-center
                                                                   2xl:text-start pb-3 lg:pb-0"
                                                        shadowColor="rgba(255,127,80,0.35)" />
                                </AnimateOnView>
                            </div>
                        </div>

                        {/* Headline */}
                        <AnimateOnView animation="animate__fadeInLeft animate__slower">
                            <h2 className={`${is2XL ? index.head_border : index.head_border_center} max-w-full 
                                            2xl:max-w-[30ch] bg-clip-text text-transparent mb-4 md:mb-6 
                                            ${colors.text_gradient_gray} my-0 font-semibold leading-[1.1] text-[2rem] 
                                            lg:text-[clamp(1.75rem,_1.3838rem_+_2.6291vw,_3rem)]`}>
                                <span className="inline-block align-middle leading-none -mx-[5px] text-white">🛠️</span> -
                                {tCodingHero('title')}
                            </h2>
                        </AnimateOnView>

                        {/* Description */}
                        <AnimateOnView animation="animate__fadeInLeft animate__slower">
                            <p className="text-[#969cb1] mb-6 break-words max-w-full 2xl:max-w-xl
                                          [@media(min-width:2000px)]:max-w-2xl text-sm md:text-base">
                                {tCodingHero.rich('description', {
                                    strong: (chunks): JSX.Element => <strong>{chunks}</strong>
                                })}
                                <br /><br />
                                {tCodingHero.rich('description2', {
                                    strong: (chunks): JSX.Element => <strong>{chunks}</strong>
                                })}
                            </p>
                        </AnimateOnView>

                        {/* Statistics TODO */}
                        <AnimateOnView animation="animate__fadeInUp animate__slower xl:mt-12 2xl:mt-0">
                            <div className="flex justify-center 2xl:justify-start items-start flex-wrap gap-x-4 sm:gap-x-8
                                            gap-y-6 mb-6 md:mb-0">
                                <div className="flex flex-col items-center text-center min-w-[120px] sm:min-w-[140px]">
                                    <AnimatedCounter end={342} suffix="+" locale={locale} />
                                    <span className="text-xs sm:text-sm text-[#969cb1] tracking-wide whitespace-nowrap">
                                        📡 {tCodingHero('questionStats')}
                                    </span>
                                </div>

                                <div className="flex flex-col items-center text-center min-w-[120px] sm:min-w-[140px]">
                                    <AnimatedCounter end={216} suffix="+" locale={locale} />
                                    <span className="text-xs sm:text-sm text-[#969cb1] tracking-wide whitespace-nowrap">
                                        🐞 {tCodingHero('bugsStats')}
                                    </span>
                                </div>

                                <div className="flex flex-col items-center text-center min-w-[120px] sm:min-w-[140px]">
                                    <AnimatedCounter end={15123} suffix="+" locale={locale} />
                                    <span className="text-xs sm:text-sm text-[#969cb1] tracking-wide whitespace-nowrap">
                                        👾 Gaming-News
                                    </span>
                                </div>
                            </div>
                        </AnimateOnView>

                        {/* Buttons */}
                        <AnimateOnView animation="animate__fadeInUp animate__slower xl:mt-12 2xl:mt-0">
                            <div className="flex flex-col sm:flex-row mt-6 md:mt-8 gap-4 md:gap-6
                                            justify-center 2xl:justify-start">
                                <div className="flex flex-col items-end relative group w-full sm:w-auto z-[20]
                                                drop-shadow-xl drop-shadow-white/5">
                                    <a href="https://discord.gg/bl4cklist" target="_blank"
                                       className="flex flex-col items-end w-full">
                                        <button className={`relative w-full sm:min-w-52 ${buttons.white_gray}`}>
                                            <FontAwesomeIcon icon={faDiscord} className="text-gray-100" />
                                            <p className="whitespace-pre">{tWelcome('joinDiscord')}</p>
                                        </button>
                                    </a>
                                    <ButtonHover />
                                </div>

                                <div className="flex flex-col items-end relative group w-full sm:w-auto">
                                    <Link href="discord/clank-bot" className="flex flex-col items-end w-full">
                                        <button className={`relative w-full sm:min-w-52 ${buttons.black_purple}`}>
                                            <FontAwesomeIcon icon={faRobot} className="text-gray-100" />
                                            <p className="whitespace-pre">Discord-Bot Clank</p>
                                        </button>
                                    </Link>

                                    <ButtonHover />
                                </div>
                            </div>
                        </AnimateOnView>
                    </div>

                    {/* Image Section */}
                    <AnimateOnView animation="animate__zoomIn animate__slower"
                                   className="hidden 2xl:flex w-full lg:w-1/2 max-w-[280px] md:max-w-[350px]
                                              lg:max-w-[420px] flex-col justify-center items-center z-[20]">
                        <div className="relative w-full h-full">
                            {/* Dark background for better visibility */}
                            <div className="absolute z-[3] blur-2xl bg-[#0c0e12] w-full min-h-[200px] md:min-h-[300px]
                                            left-1/2 top-5 -translate-x-1/2"></div>

                            {/* Main image */}
                            <Image src="/images/bg/coding-support-450w.avif" width={450} height={571}
                                   alt="Discord Coding-Support BG - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                                   sizes="(max-width: 640px) 280px, (max-width: 768px) 350px, (max-width: 1024px) 400px, 450px"
                                   className={`relative z-[5] rounded-2xl w-full h-full object-cover border border-white/30
                                               ${animations.animate_float}`} />

                            {/* Decoration Images */}
                            <div className={`absolute z-[1] bottom-2 -left-16 md:-left-20 lg:-left-28 
                                             ${animations.animate_float}`}>
                                <Image src="/images/bg/discord-bot-150w.avif" width={150} height={182}
                                       alt="Discord Coding-Support BG - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                                       sizes="(max-width: 768px) 100px, (max-width: 1024px) 125px, 150px"
                                       className="-rotate-[40deg] w-[100px] md:w-[125px] lg:w-[150px]" />
                            </div>

                            <div className={`absolute z-[1] top-0 -right-16 md:-right-20 lg:-right-32 
                                             ${animations.animate_float}`}>
                                <Image src="/images/bg/code-programming-128w.avif" width={128} height={128}
                                       alt="Discord Coding-Support BG - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                                       sizes="(max-width: 768px) 80px, (max-width: 1024px) 100px, 128px"
                                       className="rotate-[24deg] w-[80px] md:w-[100px] lg:w-[107px]" />
                            </div>

                            {/* Some particle "effects" */}
                            <Image src="/images/particles/particle-up-116w.avif" width={116} height={114}
                                   alt="Particles Top - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                                   sizes="(max-width: 640px) 58px, (max-width: 768px) 87px, 116px"
                                   className={`absolute inset-[-60px_auto_auto_-126px] ${colors.orange_overlay}`} />
                            <Image src="/images/particles/particle-bottom-113w.avif" width={113} height={91}
                                   alt="Particles Bottom - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                                   sizes="(max-width: 640px) 57px, (max-width: 768px) 85px, 113px"
                                   className={`absolute inset-[auto_auto_-50px_-140px] ${colors.orange_overlay}`} />
                            <Image src="/images/particles/particle-top-right-100w.avif" width={100} height={106}
                                   alt="Particles Top Right - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                                   sizes="(max-width: 640px) 50px, (max-width: 768px) 75px, 100px"
                                   className={`absolute inset-[-85px_-100px_auto_auto] ${colors.orange_overlay}`} />

                            <Image src="/images/bg/circled-border-732w.avif" width={732} height={732}
                                   alt="Circle BG - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                                   sizes="(max-width: 640px) 366px, (max-width: 768px) 549px, 732px"
                                   className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[732px]
                                              animate-[spin_75s_linear_infinite]" />
                        </div>
                    </AnimateOnView>

                </div>
            </div>

            { /* Bottom border for this section */ }
            <div className="bg-[radial-gradient(50%_50%_at_50%_50%,#d8e7f212_0%,#04070d_100%)] z-10
                            flex-none h-1 absolute bottom-0 left-0 right-0"></div>
        </section>
    );
}
