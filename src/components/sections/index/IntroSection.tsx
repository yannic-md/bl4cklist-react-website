import {JSX} from "react";
import Image from 'next/image';

import colors from '../../../styles/util/colors.module.css';
import buttons from "@/styles/util/buttons.module.css";
import index from '../../../styles/components/index.module.css';

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDiscord} from "@fortawesome/free-brands-svg-icons";
import ButtonHover from "@/components/elements/ButtonHover";
import {useTranslations} from "next-intl";
import {AnimatedTextReveal} from "@/components/animations/TextReveal";
import {AnimateOnView} from "@/components/animations/AnimateOnView";
import {AnimatedCounter} from "@/components/animations/Counter";
import {useRouter} from "next/router";

/**
 * Renders the introductory section of the Discord server landing page.
 * Displays animated headline, description, server statistics, join button, and feature highlights.
 * Utilizes translations for localization and animated components for enhanced UX.
 *
 * @returns {JSX.Element} The rendered IntroSection component.
 */
export default function IntroSection(): JSX.Element {
    const tWelcome = useTranslations('WelcomeHero');
    const tIntro = useTranslations('IntroSection');
    const { locale } = useRouter();

    return (
        <section className="w-full min-h-screen relative overflow-hidden" id="discord-server-features">

            {/* Same Gradient for smoother section transition */}
            <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 opacity-80 grayscale z-[15]
                            animate__animated animate__fadeInDown pointer-events-none">
                <Image src="/images/bg/color-gradient-1726w.avif" width={800} height={161} priority={true}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
                    alt="Colored BG - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                    className="object-contain max-w-[800px] pointer-events-none rotate-180" />
            </div>

            <div className="bg-slate-900/30 pt-32">
                <div className="px-8 pb-20">
                    <div className="max-w-6xl w-full mx-auto">
                        <div>
                            <div className="flex mb-20 flex-row justify-center items-center gap-[60px]">
                                {/* Left Text Container */}
                                <div className="flex flex-col justify-start items-start">

                                    {/* Animated Tag */}
                                    <div className="mb-2">
                                        <div className="font-bold tracking-wider">
                                            <AnimateOnView animation="animate__fadeInLeft animate__slower">
                                                <AnimatedTextReveal text={tIntro('infoTag')}
                                                                    className="text-sm text-[coral] uppercase"
                                                                    shadowColor="rgba(255,127,80,0.35)" />
                                            </AnimateOnView>
                                        </div>
                                    </div>

                                    {/* Headline */}
                                    <AnimateOnView animation="animate__fadeInLeft animate__slower">
                                        <h2 className={`${index.head_border} max-w-[16ch] bg-clip-text text-transparent mb-6 
                                                        ${colors.text_gradient_gray} my-0 font-semibold leading-[1.1] 
                                                        text-[clamp(2rem,_1.3838rem_+_2.6291vw,_3.75rem)]`}>
                                            <span className="inline-block align-middle leading-none -mx-[5px]
                                                             text-white">👋</span> - {tIntro('title')}
                                        </h2>
                                    </AnimateOnView>

                                    {/* Description (strong tags in translation are formatted) */}
                                    <AnimateOnView animation="animate__fadeInRight animate__slower">
                                        <p className="text-[#969cb1] mb-6 break-words max-w-2xl">
                                            {tIntro.rich('description', {
                                                strong: (chunks): JSX.Element => <strong>{chunks}</strong>
                                            })}
                                            <br /><br />
                                            {tIntro.rich('description2', {
                                                strong: (chunks): JSX.Element => <strong>{chunks}</strong>
                                            })}
                                        </p>
                                    </AnimateOnView>

                                    {/* Some entertaining discord server statistics */}
                                    <AnimateOnView animation="animate__fadeInUp animate__slower">
                                        <div className="flex items-center flex-wrap gap-x-8 gap-y-12">
                                            <div className="flex flex-col items-center text-center px-1">
                                                <AnimatedCounter end={3533} suffix="+" locale={locale} />
                                                <span className="text-sm text-[#969cb1] tracking-wide mr-1">👥 {tWelcome('memberCount')}</span>
                                            </div>

                                            <div className="flex flex-col items-center text-center px-1">
                                                <AnimatedCounter end={890} suffix="+" locale={locale} />
                                                <span className="text-sm text-[#969cb1] tracking-wide mr-1.5">🔥 Online</span>
                                            </div>

                                            <div className="flex flex-col items-center text-center px-1">
                                                <AnimatedCounter end={4381784} suffix="+" locale={locale} />
                                                <span className="text-sm text-[#969cb1] tracking-wide mr-1">💬 {tIntro('count_chat')}</span>
                                            </div>
                                        </div>
                                    </AnimateOnView>

                                    {/* Join Discord button */}
                                    <AnimateOnView animation="animate__fadeInUp animate__slower">
                                        <div className="flex flex-col items-end relative group w-full sm:w-auto z-[20]
                                                    mt-8 drop-shadow-xl drop-shadow-white/5">
                                            <a href="https://discord.gg/bl4cklist" target="_blank"
                                               className="flex flex-col items-end w-full">
                                                <button className={`relative w-full sm:min-w-52 ${buttons.white_gray}`}>
                                                    <FontAwesomeIcon icon={faDiscord} className="text-gray-100" />
                                                    <p className="whitespace-pre">{tWelcome('joinDiscord')}</p>
                                                </button>
                                            </a>
                                            <ButtonHover />
                                        </div>
                                    </AnimateOnView>
                                </div>

                                {/* Right Image Container */}
                                <AnimateOnView animation="animate__fadeInRight animate__slower">
                                    <div className="rounded-xl bg-white/[0.06] drop-shadow-2xl drop-shadow-white/5
                                                p-px relative overflow-hidden rotate-1 border border-gray-900">
                                        <div className="rounded-xl">
                                            <Image src="/images/pixel/guild-banner-508w.webp" width={508} height={508}
                                                   alt="Pixelart #1 - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                                                   className="h-full rounded-xl brightness-90" unoptimized={true} />
                                        </div>
                                    </div>
                                </AnimateOnView>
                            </div>

                            {/* A few guild features */}
                            <div className="flex flex-wrap gap-10 [&>*]:flex-1 [&>*]:min-w-[280px]">
                                <AnimateOnView animation="animate__fadeInLeft animate__slower">
                                    <div className="flex items-start justify-start gap-4">
                                        <div className="flex-none">
                                            <Image src="/images/icons/small/coding-32w.webp" className="h-full" width={32} height={32}
                                                   alt="Programming Icon - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server" />
                                        </div>
                                        <div>
                                            <h3 className="mb-2 text-xl font-semibold leading-[1.5]">{tIntro('tip_1_title')}</h3>
                                            <p className="text-[#969cb1]">{tIntro('tip_1_desc')}</p>
                                        </div>
                                    </div>
                                </AnimateOnView>
                                <AnimateOnView animation="animate__fadeInUp animate__slower">
                                    <div className="flex items-start justify-start gap-4">
                                        <div className="flex-none">
                                            <Image src="/images/icons/small/heart-32w.webp" className="h-full" width={32} height={32}
                                                   alt="Heart Icon - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server" />
                                        </div>
                                        <div>
                                            <h3 className="mb-2 text-xl font-semibold leading-[1.5]">{tIntro('tip_2_title')}</h3>
                                            <p className="text-[#969cb1]">{tIntro('tip_2_desc')}</p>
                                        </div>
                                    </div>
                                </AnimateOnView>
                                <AnimateOnView animation="animate__fadeInRight animate__slower">
                                    <div className="flex items-start justify-start gap-4">
                                        <div className="flex-none">
                                            <Image src="/images/icons/small/verify-32w.webp" className="h-full"
                                                   width={32} height={32}
                                                   alt="Bot Icon - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server" />
                                        </div>
                                        <div>
                                            <h3 className="mb-2 text-xl font-semibold leading-[1.5]">{tIntro('tip_3_title')}</h3>
                                            <p className="text-[#969cb1]">{tIntro('tip_3_desc')}</p>
                                        </div>
                                    </div>
                                </AnimateOnView>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}