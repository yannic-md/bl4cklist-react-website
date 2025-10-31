import {JSX, useEffect, useState} from "react";
import {AnimateOnView} from "@/components/animations/AnimateOnView";
import {AnimatedTextReveal} from "@/components/animations/TextReveal";
import index from "@/styles/components/index.module.css";
import colors from "@/styles/util/colors.module.css";
import Image from "next/image";
import {useTranslations} from "next-intl";

export default function CodingFeatures(): JSX.Element {
    const tCodingFeatures = useTranslations('CodingFeatures');
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
        <section className="relative py-24 pb-0 lg:pb-10 bg-blue-700/5" id="features">
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
                        {/* Left Item: Gaming-& Tech News */}
                        <AnimateOnView animation="animate__fadeInLeft animate__slower"
                            className="relative flex flex-col justify-end items-start overflow-hidden
                                       transition-all duration-200 w-full xl:max-w-[376px] min-h-[376px] p-6 border
                                       border-white/[0.08] rounded-lg group">
                            {/* Background Image Wrapper */}
                            <div className="absolute inset-0 -z-10">
                                <Image src="/images/containers/bentobox-tl-339w.avif" fill
                                       sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 376px"
                                       alt="Bentobox Top-Left BG - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                                       className="object-cover object-center pointer-events-none
                                                  group-hover:brightness-125 transition-all duration-200" />
                            </div>

                            {/* Showcase Image */}
                            <div className="inline-block self-center my-auto mt-0 max-h-[70%] overflow-hidden border-2
                                          border-gray-700/50 rounded-4xl drop-shadow-2xl transition-all duration-200
                                            hover:rotate-1 hover:-translate-y-1 hover:scale-105 w-full max-w-[280px]
                                            sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px] xl:max-w-[441px]
                                            mb-7 xl:mb-auto">
                                <Image src="/images/pixel/gaming-tech-news-441w.webp" width={441} height={360} unoptimized
                                       alt="Cocoboi Pixel-Art - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                                       className="w-full h-auto object-contain opacity-65 transition-opacity duration-200
                                                  hover:opacity-100" title="Made by CocoNotShell" />
                            </div>

                            {/* Description */}
                            <div className="relative z-[2] text-lg text-center w-full">
                                <span className="font-medium text-white">{tCodingFeatures('BENTO_1_TITLE')}</span><br />
                                <span className="text-base text-[#969cb1]">{tCodingFeatures('BENTO_1_DESC')}</span>
                            </div>
                        </AnimateOnView>

                        {/* Mid Item: Coding-Support */}
                        <AnimateOnView animation="animate__fadeInUp animate__slower"
                            className="relative flex flex-col justify-end items-start overflow-hidden w-full
                                       transition-all duration-200 xl:max-w-[602px] min-h-[376px] p-6 border
                                       border-white/[0.08] rounded-lg group">
                            {/* Background Image Wrapper */}
                            <div className="absolute inset-0 -z-10">
                                <Image src="/images/containers/bentobox-t-602w.avif" fill
                                       sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 602px"
                                       alt="Bentobox Top-Mid BG - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                                       className="object-cover object-center pointer-events-none
                                                  group-hover:brightness-125 transition-all duration-200" />
                            </div>

                            {/* Showcase Image */}
                            <div className="inline-block border-2 border-gray-700/50 rounded-4xl overflow-hidden
                                            self-center my-auto mt-0 hover:-rotate-1 drop-shadow-2xl w-full max-w-[594px]
                                            transition-all duration-200 hover:-translate-y-1 hover:scale-105 max-h-[70%]
                                            mb-7 xl:mb-auto">
                                <Image src="/images/pixel/coding-support-594w.webp" width={594} height={301} unoptimized
                                       alt="Coding Pixel-Art - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                                       className="w-full h-auto object-contain opacity-65 hover:opacity-100
                                                  transition-opacity duration-200" title="Made by Kirokaze" />
                            </div>

                            {/* Description */}
                            <div className="relative z-[2] text-lg text-center">
                                <span className="font-medium text-white">{tCodingFeatures('BENTO_2_TITLE')}</span><br />
                                <span className="text-base text-[#969cb1]">{tCodingFeatures('BENTO_2_DESC')}</span>
                            </div>
                        </AnimateOnView>

                        {/* Right Item: Guides & Tutorials */}
                        <AnimateOnView animation={is2XL ? "animate__fadeInRight animate__slower" : "animate__fadeInUp animate__slower"}
                            className="relative flex flex-col justify-end items-start overflow-hidden w-full
                                       transition-all duration-200 xl:max-w-[376px] min-h-[376px] p-6 border
                                       border-white/[0.08] rounded-lg group">
                            {/* Background Image Wrapper */}
                            <div className="absolute inset-0 -z-10">
                                <Image src="/images/containers/bentobox-tl-339w.avif" fill
                                       sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 376px"
                                       alt="Bentobox Top-Right BG - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                                       className="object-cover object-center pointer-events-none
                                                  group-hover:brightness-125 transition-all duration-200" />
                            </div>

                            {/* Showcase Image */}
                            <div className="inline-block self-center my-auto mt-0 max-h-[70%] overflow-hidden border-2
                                            border-gray-700/50 rounded-4xl drop-shadow-2xl transition-all duration-200
                                            hover:rotate-1 hover:-translate-y-1 hover:scale-105 w-full max-w-[280px]
                                            sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px] xl:max-w-[441px]
                                            mb-7 xl:mb-auto">
                                <Image src="/images/pixel/discord-study-content-441w.webp" width={441} height={360} unoptimized
                                       alt="Guides & Tutorials Pixel-Art - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                                       className="w-full h-auto object-contain opacity-65 transition-opacity duration-200
                                                  hover:opacity-100" title="Made by Archipics" />
                            </div>

                            {/* Description */}
                            <div className="relative z-[2] text-lg text-center w-full">
                                <span className="font-medium text-white">{tCodingFeatures('BENTO_3_TITLE')}</span><br />
                                <span className="text-sm md:text-base text-[#969cb1]">{tCodingFeatures('BENTO_3_DESC')}</span>
                            </div>
                        </AnimateOnView>
                    </div>

                    {/* Bottom Row of Items */}
                    <div className="flex flex-col lg:flex-row justify-between mt-2 lg:mt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-x-5 auto-cols-fr gap-y-7 lg:gap-y-0">
                            {/* Left Item */}
                            <AnimateOnView animation="animate__fadeInLeft animate__slower"
                                           className="relative flex flex-col justify-end items-start overflow-hidden w-full
                                                      transition-all duration-200 min-h-[320px] md:min-h-[418px] group
                                                      md:max-h-[400px] p-5 md:p-6 border border-white/[0.08] rounded-lg">
                                {/* Background Image Wrapper */}
                                <div className="absolute inset-0 -z-10">
                                    <Image src="/images/containers/bentobox-b-650w.avif" fill
                                           sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 602px"
                                           alt="Bentobox Bottom-Left BG - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                                           className="object-cover object-center pointer-events-none
                                                      group-hover:brightness-125 transition-all duration-200" />
                                </div>

                                {/* Showcase Image */}
                                <div className="inline-block border-2 border-gray-700/50 rounded-2xl md:rounded-4xl overflow-hidden
                                self-center my-auto mt-0 hover:-rotate-1 drop-shadow-2xl mb-7 xl:mb-auto
                                transition-all duration-200 hover:-translate-y-1 hover:scale-105 max-h-[60%] md:max-h-[70%] w-full">
                                    <Image src="/images/pixel/discord-bots-740w.webp" width={594} height={301} unoptimized
                                           alt="Discord-Bots Pixel-Art - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                                           className="w-full h-auto object-contain opacity-65 hover:opacity-100
                                                      transition-opacity duration-200" title="Made by Karukaze"/>
                                </div>

                                {/* Description */}
                                <div className="relative z-[2] text-base md:text-lg text-center w-full">
                                    <span className="font-medium text-white">{tCodingFeatures('BENTO_4_TITLE')}</span><br />
                                    <span className="text-sm md:text-base text-[#969cb1]">{tCodingFeatures('BENTO_4_DESC')}</span>
                                </div>
                            </AnimateOnView>

                            {/* Right Item */}
                            <AnimateOnView animation={is2XL ? "animate__fadeInRight animate__slower" : "animate__fadeInUp animate__slower"}
                                           className="relative flex flex-col justify-end items-start overflow-hidden w-full
                                                      transition-all duration-200 min-h-[320px] md:min-h-[418px] group
                                                      md:max-h-[400px] p-5 md:p-6 border border-white/[0.08] rounded-lg">
                                {/* Background Image Wrapper */}
                                <div className="absolute inset-0 -z-10">
                                    <Image src="/images/containers/bentobox-b-650w.avif" fill
                                           sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 602px"
                                           alt="Bentobox Bottom-Left BG - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                                           className="object-cover object-center pointer-events-none
                                                      group-hover:brightness-125 transition-all duration-200" />
                                </div>

                                {/* Showcase Image */}
                                <div className="inline-block border-2 border-gray-700/50 rounded-2xl md:rounded-4xl overflow-hidden
                                self-center my-auto hover:-rotate-1 drop-shadow-2xl mb-7 xl:mb-auto xl:mt-0
                                transition-all duration-200 hover:-translate-y-1 hover:scale-105 max-h-[60%] md:max-h-[70%] w-full">
                                    <Image src="/images/pixel/discord-server-templates-740w.webp" width={740} height={322}
                                           alt="Discord-Bots Pixel-Art - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                                           className="w-full h-auto object-contain opacity-65 hover:opacity-100
                                                      transition-opacity duration-200" unoptimized title="Made by Karukaze"/>
                                </div>
                                <div className="relative z-[2] text-base md:text-lg text-center w-full">
                                    <span className="font-medium text-white">{tCodingFeatures('BENTO_5_TITLE')}</span><br />
                                    <span className="text-sm md:text-base text-[#969cb1]">{tCodingFeatures('BENTO_5_DESC')}</span>
                                </div>
                            </AnimateOnView>
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