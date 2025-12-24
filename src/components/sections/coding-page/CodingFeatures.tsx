import {JSX, useEffect, useState} from "react";
import {AnimateOnView} from "@/components/animations/AnimateOnView";
import {AnimatedTextReveal} from "@/components/animations/TextReveal";
import index from "@/styles/components/index.module.css";
import colors from "@/styles/util/colors.module.css";
import Image from "next/image";
import {useTranslations} from "next-intl";
import BentoBoxItem from "@/components/elements/grid/BentoBoxItem";
import {useMediaQuery} from "@/hooks/useMediaQuery";

/**
 * Renders the "Coding Features" section used on the tech-coding page.
 *
 * Behavior:
 * - Displays an animated headline, tag and description.
 * - Arranges multiple `BentoBoxItem` feature cards in a responsive grid.
 * - Maintains internal `is2XL` state synchronized with the viewport width to
 *   adapt animations and layout when the viewport reaches Tailwind's `2xl`
 *   breakpoint (>= 1536px).
 *
 * @returns {JSX.Element} The rendered features section.
*/
export default function CodingFeatures(): JSX.Element {
    const tCodingFeatures = useTranslations('CodingFeatures');
    const is2XL: boolean = useMediaQuery();
    const [bugItemIndex, setBugItemIndex] = useState<number | null>(null);

    /**
     * Selects a random BentoBoxItem index for a decorational bug element.
     *
     * Runs once on mount and chooses a random integer between 0 and totalItems - 1,
     * then calls setBugItemIndex with that value. This ensures exactly one item
     * contains the bug per page load.
     */
    useEffect((): void => {
        const randomIndex: number = Math.floor(Math.random() * 5); // because 5 BentoBoxItems exist
        setBugItemIndex(randomIndex);
    }, []);

    return (
        <section className="relative py-24 pb-0 lg:pb-10 bg-blue-700/5 overflow-x-hidden" id="features">
            {/* Background Image  */}
            <div className="absolute inset-0 -z-10">
                <Image src="/images/bg/grid-bg-1920w.avif" fill priority unoptimized sizes="100vw"
                       alt="Grid BG - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                       className="w-full h-full object-cover grayscale" />
            </div>

            {/* Content Area */}
            <div className="w-full max-w-[1400px] mx-auto px-3.5">
                <div className="relative flex flex-col mx-auto justify-start items-center gap-y-4 !mb-8">
                    {/* Animated Tag */}
                    <div className="mb-2">
                        <div className="font-bold tracking-wider">
                            <AnimateOnView animation="animate__fadeInLeft animate__slower">
                                <AnimatedTextReveal text={tCodingFeatures('infoTag')}
                                                    className="text-sm text-[coral] uppercase text-center
                                                           2xl:text-start pb-3 lg:pb-0"
                                                    shadowColor="rgba(255,127,80,0.35)" />
                            </AnimateOnView>
                        </div>
                    </div>

                    {/* Headline */}
                    <AnimateOnView animation="animate__fadeInLeft animate__slower">
                        <h2 className={`${is2XL ? index.head_border : index.head_border_center} max-w-full 
                                            2xl:max-w-[30ch] bg-clip-text text-transparent mb-2 md:mb-6 text-center
                                            ${colors.text_gradient_gray} my-0 font-semibold leading-[1.1] text-[1.75rem] 
                                            md:text-[2.5rem] lg:text-[clamp(1.75rem,_1.3838rem_+_2.6291vw,_3.75rem)]`}>
                            <span className="inline-block align-middle leading-none -mx-[5px] text-white">⚡</span> -
                             {tCodingFeatures('title')}
                        </h2>
                    </AnimateOnView>

                    {/* Description */}
                    <AnimateOnView animation="animate__fadeInLeft animate__slower">
                        <p className="text-[#969cb1] mb-6 break-words max-w-4xl text-sm text-center md:text-base">
                            {tCodingFeatures('description')}
                        </p>
                    </AnimateOnView>
                </div>

                {/* BentoBox Layout of Features */}
                <div className="flex flex-col gap-y-5 origin-top scale-90">
                    {/* Top Row of Items */}
                    <div className="flex flex-col xl:flex-row justify-between gap-x-5 gap-y-7 xl:gap-y-0">
                        <BentoBoxItem animation="animate__fadeInLeft animate__slower"
                                      backgroundImage="/images/containers/bentobox-tl-339w.avif" showcaseWidth={322}
                                      showcaseImage="/images/pixel/gaming-tech-news-322w.avif" showcaseHeight={263}
                                      showcaseAlt="Cocoboi Pixel-Art - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                                      showcaseTitle="Made by CocoNotShell" title={tCodingFeatures('BENTO_1_TITLE')}
                                      description={tCodingFeatures('BENTO_1_DESC')} maxWidth="xl:max-w-[376px]"
                                      hasBug={bugItemIndex === 0} />

                        <BentoBoxItem animation="animate__fadeInUp animate__slower" hoverRotation="right"
                                      backgroundImage="/images/containers/bentobox-t-602w.avif" showcaseWidth={526}
                                      showcaseImage="/images/pixel/coding-support-526w.avif" showcaseHeight={267}
                                      showcaseAlt="Coding Pixel-Art - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                                      showcaseTitle="Made by Kirokaze" title={tCodingFeatures('BENTO_2_TITLE')}
                                      description={tCodingFeatures('BENTO_2_DESC')} maxWidth="xl:max-w-[602px]"
                                      hasBug={bugItemIndex === 1} />

                        <BentoBoxItem animation={is2XL ? "animate__fadeInRight animate__slower" : "animate__fadeInUp animate__slower"}
                                      backgroundImage="/images/containers/bentobox-tl-339w.avif" showcaseWidth={322}
                                      showcaseImage="/images/pixel/discord-study-content-322w.avif" showcaseHeight={263}
                                      showcaseAlt="Guides & Tutorials Pixel-Art - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                                      showcaseTitle="Made by Archipics" title={tCodingFeatures('BENTO_3_TITLE')}
                                      description={tCodingFeatures('BENTO_3_DESC')} maxWidth="xl:max-w-[376px]"
                                      hasBug={bugItemIndex === 2} />
                    </div>

                    {/* Bottom Row of Items */}
                    <div className="flex flex-col lg:flex-row justify-between mt-2 lg:mt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-x-5 auto-cols-fr gap-y-7 lg:gap-y-0">
                            <BentoBoxItem animation="animate__fadeInLeft animate__slower" hoverRotation="right"
                                          backgroundImage="/images/containers/bentobox-b-650w.avif" showcaseWidth={622}
                                          showcaseImage="/images/pixel/discord-bots-622w.avif" showcaseHeight={279}
                                          showcaseAlt="Discord-Bots Pixel-Art - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                                          showcaseTitle="Made by Karukaze" title={tCodingFeatures('BENTO_4_TITLE')}
                                          description={tCodingFeatures('BENTO_4_DESC')}
                                          minHeight="min-h-[320px] md:min-h-[418px]" hasBug={bugItemIndex === 3} />

                            <BentoBoxItem animation={is2XL ? "animate__fadeInRight animate__slower" : "animate__fadeInUp animate__slower"}
                                          backgroundImage="/images/containers/bentobox-b-650w.avif" showcaseWidth={622}
                                          showcaseImage="/images/pixel/discord-server-templates-622w.avif" showcaseHeight={271}
                                          showcaseAlt="Discord-Templates Pixel-Art - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                                          showcaseTitle="Made by Karukaze" title={tCodingFeatures('BENTO_5_TITLE')}
                                          description={tCodingFeatures('BENTO_5_DESC')}
                                          minHeight="min-h-[320px] md:min-h-[418px]" hasBug={bugItemIndex === 4} />
                        </div>
                    </div>
                </div>

            </div>

            { /* Bottom border for this section */ }
            <div className="bg-[radial-gradient(50%_50%_at_50%_50%,#d8e7f212_0%,#04070d_100%)] z-10
                            flex-none h-1 absolute bottom-0 left-0 right-0"></div>
        </section>
    );
}