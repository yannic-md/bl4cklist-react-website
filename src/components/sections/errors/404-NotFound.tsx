import {JSX} from "react";
import {useTranslations} from "next-intl";
import index from "@/styles/components/index.module.css";
import responsive from "@/styles/util/responsive.module.css";
import animations from "@/styles/util/animations.module.css";
import colors from "@/styles/util/colors.module.css";
import buttons from "@/styles/util/buttons.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDiscord} from "@fortawesome/free-brands-svg-icons";
import ButtonHover from "@/components/elements/ButtonHover";
import {faHouse} from "@fortawesome/free-solid-svg-icons/faHouse";
import Image from "next/image";
import Link from "next/link";

/* A full-screen 404 error section component with decorative animated background elements
 * and localized copy. This component uses `next-intl` translations to render user-facing
 * strings and composes several presentational utilities and assets:
 *
 * Accessibility & behavior notes:
 * - Decorative elements are placed in non-interactive containers (`pointer-events-none`).
 * - The component returns a `JSX.Element`.
 *
 * @returns {JSX.Element} The 404 error section JSX.
*/
export default function NotFound(): JSX.Element {
    const tWelcome = useTranslations('WelcomeHero');
    const tErrors = useTranslations('Errors');

    return (
        <section className="relative w-full h-screen overflow-hidden bg-blue-900/30" id="discord-error-page">
            {/* Some Overlays to improve quality & add unique effect */}
            <div className={`absolute z-[3] inset-0 overflow-hidden pointer-events-none 
                             ${index.hero_corner_shadow}`}></div>
            <div className={`absolute rounded-none overflow-hidden bg-repeat h-full w-full ${index.hero_grid_bg}`}></div>

            {/* Animated Planets Background */}
            <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
                {/* Jupiter - Top Left */}
                <div className={`absolute top-[8%] left-[5%] md:top-[12%] md:left-[8%] ${animations.animate_float_less}
                                 opacity-30 hover:opacity-50 transition-opacity duration-500 -rotate-[24deg]`}>
                    <Image src="/images/bg/jupiter-128w.webp" width={128} height={128}
                           alt="Jupiter Deco ~ Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                           className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 drop-shadow-2xl" />
                </div>

                {/* Moon - Top Right */}
                <div className={`absolute top-[15%] right-[12%] md:top-[18%] md:right-[15%] ${animations.animate_float_less}
                                 opacity-70 hover:opacity-60 transition-opacity duration-500 rotate-[25deg]`}>
                    <Image src="/images/bg/moon.svg" width={128} height={128}
                           alt="Moon Deco ~ Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                           className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 drop-shadow-2xl" />
                </div>

                {/* Uranus - Bottom Left */}
                <div className={`absolute bottom-[18%] left-[8%] md:bottom-[13%] md:left-[15%] ${animations.animate_float_less}
                                 opacity-35 hover:opacity-55 transition-opacity duration-500 rotate-[240deg]`}>
                    <Image src="/images/bg/uranus-128w.webp" width={128} height={128}
                           alt="Uranus Deco ~ Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                           className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 drop-shadow-2xl" />
                </div>

                {/* Earth - Bottom Right */}
                <div className={`absolute bottom-[25%] right-[6%] md:bottom-[22%] md:right-[10%] ${animations.animate_float_less}
                                 opacity-35 hover:opacity-65 transition-opacity duration-500 rotate-[36deg]`}>
                    <Image src="/images/bg/earth-128w.webp" width={128} height={128}
                           alt="Earth Deco ~ Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                           className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 drop-shadow-2xl" />
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full gap-3">
                <div className={`flex flex-col text-center max-w-4xl z-10 justify-center items-center 
                                 ${responsive.hero_main_gap}`}>
                    {/* Title */}
                    <h1 className={`font-normal font-jetbrains-mono text-[100px] xl:text-[166px] leading-none 
                                    animate__animated animate__fadeInDown tracking-tighter bg-clip-text 
                                    text-transparent ${colors.text_gradient_gray} px-2`}>
                        404
                    </h1>

                    {/* Description */}
                    <p className="mx-auto max-w-3xl text-sm sm:text-base font-normal tracking-tight text-[#a3a3a3]
                                  font-ibm-plex-sans animate__animated animate__fadeInRight px-7 lg:px-0">
                        {tErrors('404_DESC')}
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
                            <Link href="/" className="flex flex-col items-end w-full">
                                <button className={`relative w-full sm:min-w-52 ${buttons.black_purple}`}>
                                    <FontAwesomeIcon icon={faHouse} className="text-gray-100" />
                                    <p className="whitespace-pre">{tErrors('goBack')}</p>
                                </button>

                                <div className="flex items-center justify-center w-full gap-1.5 text-white/80
                                                text-xs font-ibm-plex-sans bg-slate-950/70 px-2 py-1 rounded-b
                                                border border-gray-800">
                                    <div className="w-2 h-2 bg-gray-500 rounded-full" />
                                    <span>3.533 {tWelcome('memberCount')}</span> { /* TODO */ }
                                </div>
                            </Link>
                            <ButtonHover />
                        </div>
                    </div>
                </div>


                <div className={`absolute inset-0 w-full h-full z-[2] ${index.hero_text_bg} pointer-events-none`}></div>
            </div>
        </section>
    )
}