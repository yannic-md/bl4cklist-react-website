import {JSX} from "react";

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

export default function CodingHero(): JSX.Element {
    const tWelcome = useTranslations('WelcomeHero');
    const { locale } = useRouter();

    return (
        <section className={`relative h-[95vh]`}>
            <Image src="/images/bg/tech-coding-bg-1920w.avif" fill priority quality={90} sizes="100vw"
                   alt="Grid Background - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                   className="object-cover object-center -z-10 grayscale" />

            {/* Some Overlays to improve quality & add unique effect */}
            <div className={`absolute z-[3] inset-0 overflow-hidden pointer-events-none blur-[2px] 
                                 ${index.hero_colored_overlay}`}></div>
            <div className={`absolute z-[3] inset-0 overflow-hidden pointer-events-none 
                                 ${index.hero_corner_shadow}`}></div>
            <div className={`absolute rounded-none overflow-hidden bg-repeat inset-0 w-full ${index.hero_grid_bg} 
                             pointer-events-none`}></div>

            <div className="flex place-items-center items-center h-full pt-24 mx-auto max-w-[70%]">
                <div className="flex w-full justify-around items-center gap-x-52">
                    {/* Text Section on the left */}
                    <div className="w-full relative z-10">
                        {/* Dark background overlay for better readability */}
                        <div className="absolute inset-0 -z-10 bg-black/50 rounded-full blur-3xl scale-110
                                        pointer-events-none"></div>

                        {/* Animated Tag */}
                        <div className="mb-2">
                            <div className="font-bold tracking-wider">
                                <AnimateOnView animation="animate__fadeInLeft animate__slower">
                                    <AnimatedTextReveal text="PROGRAMMIEREN LERNEN - EINFACH GEMACHT!"
                                                        className="text-sm text-[coral] uppercase text-center
                                                                   lg:text-start pb-3 lg:pb-0"
                                                        shadowColor="rgba(255,127,80,0.35)" />
                                </AnimateOnView>
                            </div>
                        </div>
                        {/* Headline */}
                        <AnimateOnView animation="animate__fadeInLeft animate__slower">
                            <h2 className={`${index.head_border} max-w-[30ch] bg-clip-text text-transparent mb-6 
                                            ${colors.text_gradient_gray} my-0 font-semibold leading-[1.1] 
                                            text-[clamp(2rem,_1.3838rem_+_2.6291vw,_3.25rem)]`}>
                                <span className="inline-block align-middle leading-none -mx-[5px] text-white">🛠️</span> -
                                TECHNIK & CODING
                            </h2>
                        </AnimateOnView>

                        {/* Description (strong tags in translation are formatted) */}
                        <AnimateOnView animation="animate__fadeInLeft animate__slower">
                            <p className="text-[#969cb1] mb-6 break-words max-w-xl">
                                Auf unserem Discord-Server dreht sich viel um <strong>Software-Entwicklung & Technik</strong> an sich. Wir bieten eigene kleine Lernkurse, öffentliche Discord-Bots, einen Coding-Support und automatisierte Technik-News von GameStar.
                                <br /><br />
                                Dabei ist unser Coding-Support-System von Stackoverflow inspiriert und für jede hilfreiche Antwort winkt eine Belohnung! Wirf doch einen Blick rein und vielleicht können wir dein unbeantwortetes Problem lösen.
                            </p>
                        </AnimateOnView>

                        {/* Some entertaining discord server statistics TODO */}
                        <AnimateOnView animation="animate__fadeInUp animate__slower">
                            <div className="flex justify-start items-center flex-wrap gap-x-8 gap-y-12">
                                <div className="flex flex-col items-center text-center px-1">
                                    <AnimatedCounter end={342} suffix="+" locale={locale} />
                                    <span className="text-sm text-[#969cb1] tracking-wide mr-1">
                                                         📡 Fragen gestellt</span>
                                </div>

                                <div className="flex flex-col items-center text-center px-1">
                                    <AnimatedCounter end={216} suffix="+" locale={locale} />
                                    <span className="text-sm text-[#969cb1] tracking-wide mr-1">
                                                         🐞 Bugs behoben</span>
                                </div>

                                <div className="flex flex-col items-center text-center px-1">
                                    <AnimatedCounter end={15123} suffix="+" locale={locale} />
                                    <span className="text-sm text-[#969cb1] tracking-wide mr-1">
                                                         👾 Gaming-News</span>
                                </div>
                            </div>
                        </AnimateOnView>

                        {/* Buttons */}
                        <AnimateOnView animation="animate__fadeInUp animate__slower w-full lg:w-auto">
                            <div className="flex flex-col lg:flex-row mt-8 gap-6">
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

                    {/* Image Section on the right */}
                    <div className="relative flex w-full max-w-[420px] flex-col justify-center items-center mr-12">
                        {/* Dark background for better visibility */}
                        <div className="absolute z-[3] blur-2xl bg-[#0c0e12] w-[534px] min-h-[300px]
                                        inset-[20px_auto_auto] mx-auto"></div>

                        {/* Main image */}
                        <Image src="/images/bg/coding-support-450w.avif" width={450} height={571}
                               alt="Discord Coding-Support BG - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                               sizes="(max-width: 640px) 300px, (max-width: 768px) 350px, (max-width: 1024px) 400px, 450px"
                               className={`relative z-[4] rounded-2xl w-full h-full object-cover border border-white/30
                                          ${animations.animate_float}`} />

                        {/* Decoration Images */}
                        <Image src="/images/bg/discord-bot-150w.avif" width={150} height={182} quality={100}
                               alt="Discord Coding-Support BG - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                               sizes="(max-width: 640px) 75px, (max-width: 768px) 112px, 150px"
                               className="absolute z-[1] -rotate-[40deg] inset-[auto_auto_9px_-111px]" />
                        <Image src="/images/bg/code-programming-128w.avif" width={128} height={128}
                               alt="Discord Coding-Support BG - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                               sizes="(max-width: 640px) 64px, (max-width: 768px) 96px, 128px"
                               className="absolute z-[1] inset-[0_-125px_auto_auto] rotate-[24deg] max-w-[107px]" />

                        {/* Some particle "effects" */}
                        <Image src="/images/particles/particle-up-116w.avif" width={116} height={114}
                               alt="Particles Top - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                               sizes="(max-width: 640px) 58px, (max-width: 768px) 87px, 116px"
                               className={`absolute inset-[-50px_auto_auto_-116px] ${colors.orange_overlay}`} />
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
                               className="absolute inset-auto max-w-[732px] animate-[spin_75s_linear_infinite]" />
                    </div>
                </div>
            </div>

            { /* Bottom border for this section */ }
            <div className="bg-[radial-gradient(50%_50%_at_50%_50%,#d8e7f212_0%,#04070d_100%)] z-10
                                flex-none h-1 absolute bottom-0 left-0 right-0"></div>
        </section>
    );
}