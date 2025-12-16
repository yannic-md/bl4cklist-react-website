import React, {JSX} from "react";
import {AnimateOnView} from "@/components/animations/AnimateOnView";
import {AnimatedTextReveal} from "@/components/animations/TextReveal";
import index from "@/styles/components/index.module.css";
import colors from "@/styles/util/colors.module.css";
import buttons from "@/styles/util/buttons.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDiscord} from "@fortawesome/free-brands-svg-icons/faDiscord";
import ButtonHover from "@/components/elements/ButtonHover";
import Link from "next/link";
import {AnimatedCounter} from "@/components/animations/Counter";
import {useRouter} from "next/router";
import Image from "next/image";
import {useTranslations} from "next-intl";
import {faHammer} from "@fortawesome/free-solid-svg-icons/faHammer";
import {APIStatistics} from "@/types/APIResponse";

interface ComHeroProps {
    guildStats?: APIStatistics | null;
}

/**
 * Renders the hero section for the community page featuring an animated introduction,
 * key statistics about the Discord community, and call-to-action buttons for joining
 * the server or accessing coding support.
 *
 * @param {ComHeroProps} props - Component configuration
 * @param {APIStatistics | null} props.guildStats - The API loaded stats about the guild.
 * @returns {JSX.Element} The rendered hero section with animated text, statistics counters, and action buttons
 */
export default function ComHero({guildStats}: ComHeroProps): JSX.Element {
    const tComHero = useTranslations('ComHero');
    const tWelcome = useTranslations('WelcomeHero');
    const { locale } = useRouter();

    // fallback for SSR
    const templatesCount: number = guildStats?.templates_count ?? 216;
    const messageCount: number = guildStats?.message_count ?? 4447507;
    const questionCount: number = guildStats?.coding_question_count ?? 47;

    return (
        <section className="relative w-full min-h-[90%] 2xl:h-[95vh] bg-slate-900/30 overflow-hidden
                            flex items-center justify-center py-12 md:py-16 xl:py-20" id="intro">

            {/* Grid Background image of whole section */}
            <div className="absolute inset-0 pointer-events-none select-none">
                <Image src="/images/bg/community-hero-1440w.webp" sizes="(max-width: 1439px) 100vw, 1440px"
                       alt="Grid BG - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server" fill unoptimized loading="eager"
                       className="object-cover object-[center_10%] md:object-[center_80%] grayscale"/>
            </div>

            {/* Colored Cloud in the center to add some depth */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:block
                            w-[clamp(20rem,50vw,38rem)] h-[clamp(16rem,40vw,26rem)] pointer-events-none select-none
                            rounded-full bg-[#cecece] blur-[106px] brightness-[0.5]"></div>

            {/* Frame Overlay Background image */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[68.75rem] px-4
                            mt-4 pointer-events-none select-none hidden lg:block">
                <Image src="/images/bg/community-hero-frame-2200w.webp" sizes="(max-width: 2200px) 100vw, 2200px"
                       className="w-full h-auto grayscale xl:scale-125" width={2200} height={1142}
                       alt="Frame BG - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server" />
            </div>

            {/* Container for Hero text section */}
            <div className="relative z-[1] w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                <div className="text-center">
                    <div className="w-full max-w-[58rem] mx-auto">
                        {/* Animated Tag */}
                        <div className="mb-2">
                            <div className="font-bold tracking-wider">
                                <AnimateOnView animation="animate__fadeInRight animate__slower">
                                    <AnimatedTextReveal text={tComHero('infoTag')}
                                                        className="text-sm text-[coral] uppercase
                                                                   text-center pb-3 lg:pb-0"
                                                        shadowColor="rgba(255,127,80,0.35)" />
                                </AnimateOnView>
                            </div>
                        </div>

                        {/* Headline */}
                        <AnimateOnView animation="animate__fadeInRight animate__slower">
                            <h2 className={`${index.head_border_center} max-w-full 2xl:max-w-[30ch] bg-clip-text
                                            text-transparent mb-4 md:mb-6 ${colors.text_gradient_gray} my-0
                                            font-semibold leading-[1.1] text-[1.75rem]
                                            lg:text-[clamp(1.75rem,_1.3838rem_+_2.6291vw,_4rem)]`}>
                                <span className="inline-block align-middle leading-none -mx-[5px] mb-1 text-white">💕</span> -
                                {tComHero('title')}
                            </h2>
                        </AnimateOnView>

                        {/* Description */}
                        <AnimateOnView animation="animate__fadeInLeft animate__slower">
                            <p className="text-gray-400 lg:text-gray-300 mb-6 break-words max-w-3xl text-base
                                          sm:text-lg mx-auto text-shadow-lg">
                                {tComHero('description')}
                            </p>
                        </AnimateOnView>

                        {/* Statistics */}
                        <AnimateOnView animation="animate__fadeInLeft animate__slower">
                            <div className="flex justify-center items-start flex-wrap gap-x-4 sm:gap-x-8
                                            gap-y-6 mb-6 mt-8">
                                <div className="flex flex-col items-center text-center min-w-[120px] sm:min-w-[140px]">
                                    <AnimatedCounter end={templatesCount} suffix="+" locale={locale} />
                                    <span className="text-xs sm:text-sm text-[#969cb1] tracking-wide whitespace-nowrap">
                                        📂 {tComHero('stat_templates')}
                                    </span>
                                </div>

                                <div className="flex flex-col items-center text-center min-w-[120px] sm:min-w-[140px]">
                                    <AnimatedCounter end={messageCount} suffix="+" locale={locale} />
                                    <span className="text-xs sm:text-sm text-[#969cb1] tracking-wide whitespace-nowrap -ml-0.5">
                                        📡 {tComHero('stat_messages')}
                                    </span>
                                </div>

                                <div className="flex flex-col items-center text-center min-w-[120px] sm:min-w-[140px]">
                                    <AnimatedCounter end={questionCount} suffix="+" locale={locale} />
                                    <span className="text-xs sm:text-sm text-[#969cb1] tracking-wide whitespace-nowrap">
                                        🐞 {tComHero('stat_questions')}
                                    </span>
                                </div>
                            </div>
                        </AnimateOnView>

                        {/* Buttons */}
                        <AnimateOnView animation="animate__fadeInUp animate__slower">
                            <div className="flex flex-col sm:flex-row mt-6 md:mt-8 gap-4 md:gap-6
                                            justify-center">
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
                                    <Link href="tech-coding" className="flex flex-col items-end w-full">
                                        <button className={`relative w-full sm:min-w-52 ${buttons.black_purple}`}>
                                            <FontAwesomeIcon icon={faHammer} className="text-gray-100" />
                                            <p className="whitespace-pre">{tComHero('button_support')}</p>
                                        </button>
                                    </Link>

                                    <ButtonHover />
                                </div>
                            </div>
                        </AnimateOnView>
                    </div>
                </div>
            </div>

            {/* Bottom border for this section */}
            <div className="bg-[radial-gradient(50%_50%_at_50%_50%,#d8e7f212_0%,#04070d_100%)] z-[1]
                            flex-none h-1 absolute bottom-0 left-0 right-0"></div>
        </section>
    )
}
