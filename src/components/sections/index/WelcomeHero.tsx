import Image from 'next/image';
import {JSX} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faAnglesDown, faCircleInfo} from "@fortawesome/free-solid-svg-icons";
import {faDiscord} from "@fortawesome/free-brands-svg-icons";

import buttons from '../../../styles/util/buttons.module.css';
import colors from '../../../styles/util/colors.module.css';
import index from '../../../styles/components/index.module.css';
import responsive from '../../../styles/util/responsive.module.css';
import ButtonHover from '@/components/elements/ButtonHover';
import { useTranslations } from 'next-intl';

/**
 * Hero Section - Welcome Experience
 *
 * Features a fullscreen video background with interactive overlays designed to:
 * - Welcome users with an immersive visual experience
 * - Present key information through strategically placed text overlays
 * - Create curiosity and encourage further exploration of the site
 * - Establish brand identity and visual tone
 *
 * Components included:
 * - Fullscreen background video
 * - Welcome text overlays
 * - Call-to-action elements
 * - Scroll down indicator
 *
 * @returns {JSX.Element} The welcome hero section.
 */
export default function WelcomeHero(): JSX.Element {
    const tWelcome = useTranslations('WelcomeHero');

    return (
        <section className="relative w-full h-screen overflow-hidden">
            {/* Background Video */}
            <div className="absolute w-full h-full z-[1] top-0 left-0 right-0 -bottom-36 grayscale opacity-[.4]">
                <video className="w-full h-full object-cover relative" autoPlay muted loop
                       playsInline poster="/images/bg/bg-intro.avif">
                    <source src="/videos/hero/bg-intro-2560w.webm" type="video/webm; codecs=vp9" media="(min-width: 2560px)" />
                    <source src="/videos/hero/bg-intro-1920w.webm" type="video/webm; codecs=vp9" media="(min-width: 1920px)" />
                    <source src="/videos/hero/bg-intro-1440w.webm" type="video/webm; codecs=vp9" media="(min-width: 1440px)" />
                    <source src="/videos/hero/bg-intro-1080w.webm" type="video/webm; codecs=vp9" media="(min-width: 1024px)" />
                    <source src="/videos/hero/bg-intro-768w.webm" type="video/webm" media="(min-width: 768px)" />
                    <source src="/images/bg/bg-intro.avif" media="(max-width: 480px)" />

                    {/* Fallback for Safari or other old browsers */}
                    <source src="/videos/hero/bg-intro-1920w.mp4" type="video/mp4" media="(min-width: 1920px)" />
                    <source src="/videos/hero/bg-intro-1080w.mp4" type="video/mp4" media="(min-width: 1024px)" />
                </video>
            </div>

            {/* Some Overlays to improve quality & add unique effect */}
            <div className={`absolute z-[3] inset-0 overflow-hidden pointer-events-none blur-[2px] 
                             ${index.hero_colored_overlay}`}></div>
            <div className={`absolute z-[3] inset-0 overflow-hidden pointer-events-none 
                             ${index.hero_corner_shadow}`}></div>
            <div className={`absolute z-[3] h-[30vh] w-[80vw] max-w-[1241px] rounded-[10px] top-10 left-1/2 
                             -translate-x-1/2 -translate-y-1/2 ${index.hero_top_glow}`}></div>
            <div className={`absolute rounded-none overflow-hidden bg-repeat h-full w-full ${index.hero_grid_bg}`}></div>

            {/* Our Partners */}
            <div className="absolute bottom-12 left-0 right-0 z-[15] hidden xl:flex px-4 2xl:px-12 animate__animated
                            animate__fadeInUp justify-between items-center">
                <a href="https://deinserverhost.de/store/aff.php?aff=3181" target="_blank" aria-label="DeinServerHost Partner"
                   className="relative z-[20] opacity-20 hover:opacity-50 transition-opacity duration-300">
                    <Image src="/images/brand/dsh-partner.webp" width={537} height={132} priority
                        className="object-contain w-auto max-w-[35vw] md:max-w-[250px] xl:max-w-[425px] h-auto"
                        alt="DeinServerHost Partner - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server" />
                </a>

                <a href="https://clank.dev" target="_blank" aria-label="Clank-Bot Partner" 
                   className="flex items-center gap-2 relative z-[20] opacity-20 hover:opacity-50 
                              transition-opacity duration-300 cursor-pointer mr-16 2xl:mr-20">
                    <div className="w-12 h-12 md:w-20 md:h-20 flex items-center justify-center">
                        <Image src="/images/brand/clank-logo-65w.webp" className="object-contain"
                               width={65} height={65} priority
                               alt="Clank Partner - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server" />
                    </div>
                    <h2 className="font-jetbrains-mono tracking-tight text-3xl md:text-6xl font-bold opacity-60
                                   text-white">CLANK</h2>
                </a>

            </div>


            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full gap-3">
                {/* Animated Tag */}
                <div className={`relative z-10 animate__animated animate__fadeInDown mb-4 md:mb-0 hidden 
                                 ${responsive.hero_responsive_tag}`}>
                    <div className="relative flex items-center justify-center px-3 py-2 bg-slate-950 border
                                  border-gray-900">
                        <img src="/images/icons/small/discord-heart-24w.webp" className="w-[18px] h-[18px] mr-1 mt-0.5"
                             alt="Heart - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server" />
                        <div className="relative">
                            <p className="text-[rgb(240,240,255)] text-sm font-normal tracking-normal
                                          whitespace-nowrap font-ibm-plex-sans">{tWelcome('welcomeTag')}</p>
                        </div>

                        {/* Borders & Accents */}
                        <div className="absolute -left-0.5 top-0 w-0.5 h-full bg-orange-50"></div>
                        <div className="absolute -right-0.5 top-0 w-0.5 h-full bg-orange-50"></div>

                        <div className={`absolute left-0 top-0 w-6 h-full ${index.hero_tag_left_accent}`}></div>
                        <div className={`absolute right-0 top-0 w-6 h-full ${index.hero_tag_right_accent}`}></div>
                    </div>
                </div>

                {/* Main Area */}
                <div className={`flex flex-col text-center max-w-4xl z-10 justify-center items-center 
                                 ${responsive.hero_main_gap}`}>
                    {/* Logo Container */}
                    <div className="flex flex-row justify-center items-center gap-4 animate__animated animate__fadeInLeft">
                        {/* Logo Showcase Box */}
                        <div className="relative w-16 sm:w-24 lg:w-32 xl:w-40 z-[2]">
                            <div className={`${index.square_border} !h-auto aspect-square`}>
                                {/* Corners */}
                                <div className={`absolute z-[1] -left-[5px] -top-[5px] ${index.corner_anim_tl}`}>
                                    <div className="h-2.5 w-2.5 opacity-[0.8]">
                                        <div className={`${index.showcase_top_edge}`} />
                                        <div className={`${index.showcase_bottom_edge}`} />
                                    </div>
                                </div>

                                <div className={`absolute z-[1] -left-[5px] -bottom-[5px] ${index.corner_anim_bl}`}>
                                    <div className="h-2.5 w-2.5 opacity-[0.8] -rotate-90">
                                        <div className={`${index.showcase_top_edge}`} />
                                        <div className={`${index.showcase_bottom_edge}`} />
                                    </div>
                                </div>

                                <div className={`absolute z-[1] -right-[5px] -bottom-[5px] ${index.corner_anim_br}`}>
                                    <div className="h-2.5 w-2.5 opacity-[0.8] -rotate-180">
                                        <div className={`${index.showcase_top_edge}`} />
                                        <div className={`${index.showcase_bottom_edge}`} />
                                    </div>
                                </div>

                                <div className={`absolute z-[1] -right-[5px] -top-[5px] ${index.corner_anim_tr}`}>
                                    <div className="h-2.5 w-2.5 opacity-[0.8] rotate-90">
                                        <div className={`${index.showcase_top_edge}`} />
                                        <div className={`${index.showcase_bottom_edge}`} />
                                    </div>
                                </div>
                            </div>

                            <Image src="/images/brand/logo-animated-120w.webp" height={120} width={120} priority
                                alt="Logo - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server" unoptimized
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 sm:w-28
                                           lg:w-32" />
                        </div>

                        <h1 className={`font-normal font-jetbrains-mono text-[50px] sm:text-7xl lg:text-[120px] 
                                        xl:text-[166px] leading-none tracking-tighter bg-clip-text text-transparent 
                                        ${colors.text_gradient_gray} px-2`}>
                            BL4CKLIST
                        </h1>
                    </div>

                    {/* Description */}
                    <p className="mx-auto max-w-2xl text-sm sm:text-base font-normal tracking-tight text-[#a3a3a3]
                                  font-ibm-plex-sans animate__animated animate__fadeInRight">
                        {tWelcome('description')}
                    </p>

                    {/* Call-to-Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 gap-x-4 sm:gap-x-20 md:gap-x-20 lg:gap-4
                                    justify-center items-center
                                    mt-4 md:mt-1 lg:mt-4 animate__animated animate__fadeInUp z-[20]">
                        {/* Join Discord */}
                        <div className="flex flex-col items-end relative group w-full sm:w-auto z-[20]">
                            <a href="https://discord.gg/bl4cklist" target="_blank" className="flex flex-col items-end
                                                                                              w-full">
                                <button className={`relative w-full sm:min-w-52 ${buttons.white_gray}`}>
                                    <FontAwesomeIcon icon={faDiscord} className="text-gray-100" />
                                    <p className="whitespace-pre">{tWelcome('joinDiscord')}</p>
                                </button>

                                <div className="flex items-center justify-center w-full gap-1.5 text-green-400
                                                text-xs font-ibm-plex-sans bg-slate-950/70 px-2 py-1 rounded-b
                                                border border-gray-800">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                    <span>890 Online</span> { /* TODO */ }
                                </div>
                            </a>
                            <ButtonHover />
                        </div>

                        {/* Learn More */}
                        <div className="flex flex-col items-end relative group w-full sm:w-auto">
                            <a href="discord/community" className="flex flex-col items-end w-full">
                                <button className={`relative w-full sm:min-w-52 ${buttons.black_purple}`}>
                                    <FontAwesomeIcon icon={faCircleInfo} className="text-gray-100" />
                                    <p className="whitespace-pre">{tWelcome('learnMore')}</p>
                                </button>

                                <div className="flex items-center justify-center w-full gap-1.5 text-white/80
                                                text-xs font-ibm-plex-sans bg-slate-950/70 px-2 py-1 rounded-b
                                                border border-gray-800">
                                    <div className="w-2 h-2 bg-gray-500 rounded-full" />
                                    <span>3.533 {tWelcome('memberCount')}</span> { /* TODO */ }
                                </div>
                            </a>
                            <ButtonHover />
                        </div>
                    </div>
                </div>


                <div className={`absolute inset-0 w-full h-full z-[2] ${index.hero_text_bg}`}></div>
            </div>

            {/* Scroll Indicator with Background gradient */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 drop-shadow-2xl z-20 
                            animate__animated animate__fadeInUp">
                <div className="animate-bounce drop-shadow-[0_0_4px_rgba(0,0,0,1)]">
                    <FontAwesomeIcon icon={faAnglesDown} size={"lg"} className="text-white/70" />
                </div>
            </div>

            <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 opacity-80 grayscale z-10
                            md:z-5 lg:z-10 animate__animated animate__fadeInUp pointer-events-none">
                <Image src="/images/bg/color-gradient-1726w.avif" width={800} height={161} priority={true}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
                    alt="Colored BG - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                    className="object-contain max-w-[800px] pointer-events-none" />
            </div>
        </section>
    )
}