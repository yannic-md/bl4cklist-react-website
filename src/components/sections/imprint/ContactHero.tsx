import {JSX} from "react";
import {ParticlesBackground} from "@/components/animations/ParticlesBackground";
import index from "@/styles/components/index.module.css";
import {AnimateOnView} from "@/components/animations/AnimateOnView";
import {AnimatedTextReveal} from "@/components/animations/TextReveal";
import colors from "@/styles/util/colors.module.css";
import buttons from "@/styles/util/buttons.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ButtonHover from "@/components/elements/ButtonHover";
import {faHandcuffs} from "@fortawesome/free-solid-svg-icons/faHandcuffs";
import {faPencil} from "@fortawesome/free-solid-svg-icons/faPencil";
import {IconDefinition} from "@fortawesome/free-brands-svg-icons";
import {useTranslations} from "next-intl";

interface FormBox {
    icon: string;
    title: string;
    description: string;
    buttonText: string;
    buttonIcon: IconDefinition;
    href: string;
}

/**
 * Renders the contact hero section with animated background, headline, description,
 * and action boxes linking to contact forms.
 *
 * @returns {JSX.Element} The rendered ContactHero React component.
 */
export default function ContactHero(): JSX.Element {
    const tContactHero = useTranslations('ContactHero')
    const form_boxes: FormBox[] = [
        {icon: "🛑", title: "formUnbanTitle", description: "formUnbanDescription",
         buttonText: "formUnbanButton", buttonIcon: faHandcuffs, href: "https://discord.gg/bl4cklist"},
        {icon: "📡", title: "formGeneralTitle", description: "formGeneralDescription",
         buttonText: "formGeneralButton", buttonIcon: faPencil, href: "https://discord.gg/bl4cklist"}];

    return (
        <section className="relative w-full min-h-[90%] 2xl:h-[95vh] bg-slate-900/25 overflow-hidden
                            flex items-center justify-center py-12 md:py-16 xl:py-20" id="start">
            <ParticlesBackground className="z-0 animate__animated animate__fadeIn animate__slower" particles={60} />

            {/* Centered content */}
            <div className="relative z-10 flex flex-col items-center justify-center gap-3 px-4 md:px-6 lg:px-8 mx-auto
                            mt-12 2xl:mt-0">
                {/* Animated Tag */}
                <div className="mb-2">
                    <div className="font-bold tracking-wider">
                        <AnimateOnView animation="animate__fadeInLeft animate__slower">
                            <AnimatedTextReveal text={tContactHero('infoTag')}
                                                className="text-sm text-[coral] uppercase text-center
                                                           2xl:text-start pb-3 lg:pb-0"
                                                shadowColor="rgba(255,127,80,0.35)" />
                        </AnimateOnView>
                    </div>
                </div>

                {/* Headline */}
                <AnimateOnView animation="animate__fadeInLeft animate__slower">
                    <h2 className={`${index.head_border_center} max-w-full 2xl:max-w-[30ch] bg-clip-text text-transparent mb-4
                                    md:mb-6 ${colors.text_gradient_gray} my-0 font-semibold leading-[1.1] text-[2rem] 
                                    lg:text-[clamp(1.75rem,_1.3838rem_+_2.6291vw,_3rem)] text-center`}>
                        <span className="inline-block align-middle leading-none -mx-[5px] mb-1 text-white">📬</span> -
                        {tContactHero('title')}
                    </h2>
                </AnimateOnView>

                {/* Description */}
                <AnimateOnView animation="animate__fadeInLeft animate__slower">
                    <p className="text-[#969cb1] mb-6 break-words max-w-full md:max-w-2xl lg:max-w-3xl text-center
                                  [@media(min-width:2000px)]:max-w-2xl text-sm md:text-base">
                        {tContactHero("description")}
                    </p>
                </AnimateOnView>

                {/* "Pick-A-Form" Container */}
                <div className="flex flex-col lg:flex-row w-full gap-6 md:gap-8 lg:gap-12 xl:gap-20 items-center justify-center">
                    {form_boxes.map((item: FormBox, index: number): JSX.Element => (
                        <AnimateOnView key={index} animation={`animate__fadeIn${index === 0 ? 'Left' : 'Right'} animate__slower`}>
                            <div className="shadow-[0_10px_25px_rgba(0,0,0,0.5)] hover:-translate-y-1
                                            transition-all duration-200 w-full max-w-md lg:max-w-none">
                                <div className="relative flex p-3 bg-[#04070d] rounded-2xl w-full lg:w-[400px]
                                                xl:w-[450px] shadow-[inset_0_2px_1px_0_rgba(207,231,255,0.2)]">
                                    <div>
                                        <h3 className="text-[clamp(1.375rem,1.1989rem+.7512vw,1.5rem)] font-semibold">
                                            {item.icon} ~ {tContactHero(item.title)}
                                        </h3>
                                        <p className="text-[#969cb1] mb-6 break-words text-base">
                                            {tContactHero(item.description)}
                                        </p>

                                        {/* Action Button */}
                                        <div className="flex flex-col items-end relative group w-fit z-[20]
                                                        drop-shadow-xl drop-shadow-white/5 mx-auto">
                                            <a href={item.href} target="_blank" className="flex flex-col items-center">
                                                <button className={`relative sm:min-w-52 ${buttons.white_gray}`}>
                                                    <FontAwesomeIcon icon={item.buttonIcon} className="text-gray-100" />
                                                    <p className="whitespace-pre">{tContactHero(item.buttonText)}</p>
                                                </button>
                                            </a>

                                            <ButtonHover />
                                        </div>
                                    </div>

                                    {/* Container gradient in right corner for more depth */}
                                    <div className="absolute top-0 right-0 w-[437px] h-[306px] pointer-events-none opacity-[0.1] rounded-tr-2xl
                                                    bg-[radial-gradient(50%_50%_at_93.7%_8.1%,#b8c7d980_0%,rgba(4,7,13,0)_100%)]" />
                                </div>
                            </div>
                        </AnimateOnView>
                    ))}
                </div>

            </div>

            {/* Some Overlays to improve quality & add unique effect */}
            <div className={`absolute z-[3] inset-0 overflow-hidden pointer-events-none blur-[2px] 
                             ${index.hero_colored_overlay}`}></div>
            <div className={`absolute z-[3] inset-0 overflow-hidden pointer-events-none 
                             ${index.hero_corner_shadow}`}></div>
            <div className={`absolute inset-0 w-full h-full z-[3] ${index.hero_text_bg}`}></div>
            <div className={`absolute rounded-none overflow-hidden bg-repeat h-full w-full ${index.hero_grid_bg}`}></div>

            {/* Bottom border for this section */}
            <div className="bg-[radial-gradient(50%_50%_at_50%_50%,#d8e7f212_0%,#04070d_100%)] z-10
                            flex-none h-1 absolute bottom-0 left-0 right-0"></div>
        </section>
    );
}