import {JSX, useEffect, useState} from "react";
import {AnimateOnView} from "@/components/animations/AnimateOnView";
import index from "@/styles/components/index.module.css";
import colors from "@/styles/util/colors.module.css";
import {AnimatedTextReveal} from "@/components/animations/TextReveal";
import buttons from "@/styles/util/buttons.module.css";
import animations from "@/styles/util/animations.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ButtonHover from "@/components/elements/ButtonHover";
import {faRobot} from "@fortawesome/free-solid-svg-icons/faRobot";
import Image from "next/image";
import {useTranslations} from "next-intl";

/**
 * Renders the hero section for the Clank bot landing page.
 *
 * @returns {JSX.Element} The rendered hero section for the Clank bot page.
 */
export default function ClankHero(): JSX.Element {
    const tClankBot = useTranslations('ClankHero');
    const [is2XL, setIs2XL] = useState(false);

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
        <section className="relative z-[2] pt-20 md:pt-24 lg:pt-28  2xl:h-[100vh] bg-slate-900/30" id="start">
            <div className={`relative z-[1] w-full max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-6 overflow-hidden 
                             [@media(min-width:1980px)]:max-w-[80%] [@media(min-width:1980px)]:pt-8`}>
                {/* Top Area - Responsive Layout */}
                <div className="flex flex-col xl:flex-row items-start justify-between gap-4 md:gap-6 lg:gap-x-2.5
                                lg:gap-y-5 px-2 w-full">
                    {/* Left side - Title & Tag */}
                    <div className="w-full xl:w-[42%] 2xl:w-[45%]">
                        {/* Animated Tag */}
                        <div className="mb-2 md:mb-3">
                            <div className="font-bold tracking-wider">
                                <AnimateOnView animation="animate__fadeInLeft animate__slower">
                                    <AnimatedTextReveal text={tClankBot('infoTag')}
                                                        className="text-xs sm:text-sm text-[coral] uppercase text-center
                                                                   xl:text-start pb-2 md:pb-3 lg:pb-0"
                                                        shadowColor="rgba(255,127,80,0.35)" />
                                </AnimateOnView>
                            </div>
                        </div>

                        {/* Headline */}
                        <AnimateOnView animation="animate__fadeInLeft animate__slower">
                            <h2 className={`${is2XL ? index.head_border : index.head_border_center} max-w-full
                                            lg:max-w-[25ch] xl:max-w-[28ch] 2xl:max-w-[30ch] 
                                            bg-clip-text text-transparent mb-4 md:mb-6
                                            ${colors.text_gradient_gray} my-0 font-semibold leading-[1.1] 
                                            text-[1.75rem] sm:text-[2rem] md:text-[2.25rem]
                                            lg:text-[clamp(1.75rem,_1.3838rem_+_2.6291vw,_3rem)]
                                            text-center xl:text-left mx-auto xl:mx-0`}>
                                <span className="inline-block align-middle leading-none -mx-[5px] mb-1 text-white">🤖</span> -
                                {tClankBot('title')}
                            </h2>
                        </AnimateOnView>
                    </div>

                    {/* Right side - Description & Button */}
                    <div className="flex w-full xl:w-[55%] h-full items-center justify-center lg:justify-start
                                    flex-col lg:flex-row-reverse gap-4 md:gap-6 lg:gap-x-7 self-center pb-2 md:pb-4">
                        {/* Description */}
                        <AnimateOnView animation="animate__fadeInRight animate__slower w-full xl:w-1/2 text-xs sm:text-sm
                                                  font-normal mb-0 text-[#969cb1] text-center lg:text-left
                                                  [@media(min-width:1980px)]:w-[40%]">
                            {tClankBot('description')}
                        </AnimateOnView>

                        {/* Invite Button */}
                        <div className="flex flex-col items-center sm:items-end relative group w-full sm:w-auto z-[20]
                                        drop-shadow-xl drop-shadow-white/5 pt-4 lg:pt-0">
                            <AnimateOnView animation="animate__fadeInRight animate__slower">
                                <a href="https://bl4cklist.de/invites/clank" target="_blank"
                                   className="flex flex-col items-end w-full">
                                    <button className={`relative w-full sm:min-w-44 md:min-w-52 ${buttons.white_gray} 
                                                        text-sm md:text-base px-4 py-2 md:px-5 md:py-2.5`}>
                                        <FontAwesomeIcon icon={faRobot} className="text-gray-100" />
                                        <p className="whitespace-pre">{tClankBot('inviteButton')}</p>
                                    </button>
                                </a>
                                <ButtonHover />
                            </AnimateOnView>
                        </div>
                    </div>
                </div>

                {/* Showcase Image */}
                <div className="relative overflow-hidden p-px mt-12 md:mt-6 lg:mt-8 mb-12 lg:mb-0">
                    <div className="relative z-[2]">
                        <AnimateOnView animation="animate__fadeInUp animate__slower">
                            {/* Dark Overlay - Gradient */}
                            <div className="absolute inset-0 z-30 pointer-events-none"
                                 style={{backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 68%, ' +
                                                          'rgba(5,7,13,0.4) 82%, rgba(5,7,13,1) 95%, rgba(5,7,13,1) 100%)'}}>
                            </div>

                            <div className="relative z-[2] overflow-hidden bg-[#1b1b22] rounded-lg md:rounded-xl">
                                {/* Animated Trail */}
                                <div className={`absolute w-[10cqmin] h-[3px] aspect-[2/1] [offset-path:border-box]
                                                 [offset-anchor:100%_50%] ${animations.animate_border_trail}`}
                                     style={{background: "radial-gradient(100% 100% at right, white, transparent 50%)"}}></div>

                                {/* Main image */}
                                <Image src="/images/bg/clank-discord-bot-dashboard-3759w.avif" width={1358} height={554}
                                       alt="Clank Discord Bot Dashboard - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                                       className="relative block z-20 w-full h-auto mx-auto" priority
                                       sizes="(max-width: 640px) 95vw, (max-width: 768px) 90vw, (max-width: 1024px) 85vw,
                                              (max-width: 1920px) 1358px, (max-width: 2560px) 75vw, 85vw" />
                            </div>
                        </AnimateOnView>
                    </div>
                </div>
            </div>

            {/* Bottom border */}
            <div className="bg-[radial-gradient(50%_50%_at_50%_50%,#d8e7f212_0%,#04070d_100%)] z-10
                            flex-none h-1 absolute bottom-12 left-0 right-0"></div>
        </section>
    );
}
