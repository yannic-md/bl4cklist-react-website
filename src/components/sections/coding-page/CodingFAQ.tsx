import {JSX, useEffect, useState} from "react";
import {AnimateOnView} from "@/components/animations/AnimateOnView";
import {AnimatedTextReveal} from "@/components/animations/TextReveal";
import index from "@/styles/components/index.module.css";
import colors from "@/styles/util/colors.module.css";
import coding from "@/styles/components/coding.module.css";
import Image from "next/image";
import buttons from "@/styles/util/buttons.module.css";
import anim from "@/styles/util/animations.module.css";
import ButtonHover from "@/components/elements/ButtonHover";
import {useTranslations} from "next-intl";
import FAQItem from "@/components/elements/grid/FAQItem";
import FeatureItem from "@/components/elements/grid/FeatureItem";
import {isMilestoneUnlocked} from "@/lib/milestones/MilestoneEvents";
import {MILESTONES} from "@/data/milestones";
import {unlockMilestone} from "@/lib/milestones/MilestoneService";
import {NextRouter, useRouter} from "next/router";
import AdBanner from "@/components/elements/ads/AdBanner";
import {AdContainer} from "@/components/elements/ads/AdWrapper";
import {FaDiscord} from "react-icons/fa";
import {useMediaQuery} from "@/hooks/useMediaQuery";

/**
 * CodingFAQ component displays a FAQ section with animated features and interactive questions.
 * It uses React state to toggle the visibility of answers and integrates various UI elements,
 * including images, icons, and animated transitions for enhanced user experience.
 *
 * @returns {JSX.Element} The rendered FAQ section for the coding page.
 */
export default function CodingFAQ(): JSX.Element {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const tWelcome = useTranslations('WelcomeHero');
    const tFAQ = useTranslations('CodingFAQ');
    const is2XL: boolean = useMediaQuery();
    const [isShiftPressed, setIsShiftPressed] = useState(false);
    const [secretFaqUnlocked, setSecretFaqUnlocked] = useState(false);
    const router: NextRouter = useRouter();

    /**
     * Track Shift key pressed state and update component state.
     *
     * Registers global keyboard event listeners to detect when the user's Shift key is pressed and released.
     * The effect updates the React state `isShiftPressed` accordingly and adds listeners on mount.
     */
    useEffect((): () => void => {
        const handleKeyDown: (e: KeyboardEvent) => void = (e: KeyboardEvent): void => {
            if (e.key === 'Shift' && !isShiftPressed) { setIsShiftPressed(true); }
        };

        const handleKeyUp: (e: KeyboardEvent) => void = (e: KeyboardEvent): void => {
            if (e.key === 'Shift') { setIsShiftPressed(false); }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return (): void => {  // cleanup
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    /**
     * Toggles the open state of a FAQ item.
     * If the given index is already open, it closes it; otherwise, it opens the selected FAQ.
     *
     * @param {number} index - The index of the FAQ item to toggle.
     */
    const toggleFaq: (index: number) => void = async (index: number): Promise<void> => {
        setOpenFaq(openFaq === index ? null : index);

        // Unlock secret FAQ permanently once opened
        if (index === 999) {
            setSecretFaqUnlocked(true);

            const alreadyUnlocked: boolean = await isMilestoneUnlocked(MILESTONES.HEROBRINE.id);
            if (!alreadyUnlocked) {
                await unlockMilestone(MILESTONES.HEROBRINE.id, MILESTONES.HEROBRINE.imageKey,
                    (router.locale === "de" || router.locale === "en") ? router.locale : "de");
            }
        }
    };

    return (
        <section className="relative py-24 bg-slate-900/30 overflow-x-hidden" id="faq">
            <div className="w-full max-w-7xl mx-auto">

                {/* Decorative Planet - Left Top */}
                <AnimateOnView animation="animate__fadeInLeft animate__slower"
                               className="absolute left-20 top-36 -translate-x-1/3 lg:-translate-x-1/4
                                          pointer-events-none hidden md:block">
                    <div>
                        <Image src="/images/bg/uranus-128w.webp" width={128} height={128}
                            alt="Uranus Deco ~ Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                            className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 drop-shadow-2xl
                                       z-0 opacity-40" />
                    </div>
                </AnimateOnView>

                {/* Decorative Planet - Right Bottom */}
                <AnimateOnView animation="animate__fadeInRight animate__slower"
                               className="absolute right-32 bottom-24 translate-x-1/3 lg:translate-x-1/4
                                          pointer-events-none hidden md:block">
                    <div>
                        <Image src="/images/bg/moon.svg" width={128} height={128}
                               alt="Moon Deco ~ Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                               className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 drop-shadow-2xl z-0 opacity-40" />
                    </div>
                </AnimateOnView>


                {/* Header of Section */}
                <div className="flex flex-col xl:flex-row justify-between gap-x-8 mb-4 px-8 lg:px-0">
                    <div className="xl:max-w-xl">
                        {/* Animated Tag */}
                        <div className="mb-2">
                            <div className="font-bold tracking-wider">
                                <AnimateOnView animation="animate__fadeInLeft animate__slower">
                                    <AnimatedTextReveal text={tFAQ('infoTag')}
                                                        className="text-sm text-[coral] uppercase text-center
                                                           2xl:text-start pb-3 lg:pb-0"
                                                        shadowColor="rgba(255,127,80,0.35)"/>
                                </AnimateOnView>
                            </div>
                        </div>

                        {/* Headline */}
                        <AnimateOnView animation="animate__fadeInLeft animate__slower">
                            <h2 className={`${is2XL ? index.head_border : index.head_border_center} bg-clip-text 
                                            text-transparent mb-2 md:mb-6 
                                            text-center ${colors.text_gradient_gray} my-0 font-semibold 
                                            leading-[1.1] text-[2.25rem] md:text-[2.75rem] 
                                            lg:text-[clamp(1.75rem,_1.3838rem_+_2.6291vw,_3.50rem)]`}>
                                <span className="inline-block align-middle leading-none -mx-[5px] -mt-[5px] text-white">❓</span> -
                                {tFAQ('title')}
                            </h2>
                        </AnimateOnView>

                    </div>

                    {/* Description */}
                    <AnimateOnView animation="animate__fadeInRight animate__slower">
                        <p className="text-[#969cb1] pt-6 break-words max-w-lg xl:max-w-md text-sm text-center xl:text-end
                                      items-center md:text-base mx-auto xl:mx-0">
                            {tFAQ('description')}
                        </p>
                    </AnimateOnView>
                </div>

                {/* Feature List */}
                <div className="relative max-w-7xl mt-0 mx-auto !mb-10 px-4 lg:px-0 transition-all duration-200">
                    <div className="relative z-10 mx-auto overflow-hidden">
                        <div className="grid z-10 w-full h-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                            <AnimateOnView animation="animate__fadeInLeft animate__slower">
                                <FeatureItem iconSrc="/images/icons/small/charts-40w.avif"
                                             title={tFAQ('feature1.title')}
                                             description={tFAQ('feature1.description')}
                                             altText="Charts Icon - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server" />
                            </AnimateOnView>
                            <AnimateOnView animation="animate__fadeInLeft animate__slower">
                                <FeatureItem iconSrc="/images/icons/small/book-40w.avif"
                                             title={tFAQ('feature2.title')} link="https://discord.bl4cklist.de/"
                                             description={tFAQ('feature2.description')}
                                             altText="Book Icon - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server" />
                            </AnimateOnView>
                            <AnimateOnView animation="animate__fadeInRight animate__slower">
                                <FeatureItem iconSrc="/images/icons/small/money-40w.avif"
                                             title={tFAQ('feature3.title')}
                                             description={tFAQ('feature3.description')}
                                             altText="Money Icon - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server" />
                            </AnimateOnView>
                            <AnimateOnView animation="animate__fadeInRight animate__slower">
                                <FeatureItem iconSrc="/images/icons/small/love-40w.avif"
                                             title={tFAQ('feature4.title')}
                                             description={tFAQ('feature4.description')}
                                             altText="Love Heart - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server" />
                            </AnimateOnView>
                        </div>
                    </div>
                    <AnimateOnView animation="animate__fadeIn animate__slower">
                        <div className={`absolute hidden lg:flex h-full w-full justify-between top-0 
                                         ${coding.feature_grid}`}>
                            <div></div><div></div><div></div><div></div><div></div><div></div>
                        </div>
                    </AnimateOnView>
                </div>

                {/* FAQ Items */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 px-6 2xl:px-0">
                    {/* Left column */}
                    <div className="flex flex-col gap-7">
                        <AnimateOnView animation="animate__fadeInLeft animate__slower">
                            <FAQItem index={0} isOpen={openFaq === 0} title={tFAQ('question1.title')}
                                     description={tFAQ.raw('question1.description')} onToggle={toggleFaq} />
                        </AnimateOnView>
                        <AnimateOnView animation="animate__fadeInLeft animate__slower">
                            <FAQItem index={2} isOpen={openFaq === 2} title={tFAQ('question3.title')}
                                     description={tFAQ.raw('question3.description')} onToggle={toggleFaq} />
                        </AnimateOnView>
                    </div>

                    {/* Right column */}
                    <div className="flex flex-col gap-7">
                        <AnimateOnView animation="animate__fadeInRight animate__slower">
                            <FAQItem index={1} isOpen={openFaq === 1} title={tFAQ('question2.title')}
                                     description={tFAQ.raw('question2.description')} onToggle={toggleFaq} />
                        </AnimateOnView>
                        <AnimateOnView animation="animate__fadeInRight animate__slower">
                            <FAQItem index={3} isOpen={openFaq === 3} title={tFAQ('question4.title')}
                                     description={tFAQ.raw('question4.description')} onToggle={toggleFaq} />
                        </AnimateOnView>
                    </div>
                </div>

                {/* Other Centered FAQ-Item */}
                <div className={`mt-7 w-full lg:max-w-2xl mx-auto transition-all duration-500 px-6 2xl:px-0
                                 ${(isShiftPressed || secretFaqUnlocked) ? 'opacity-100 translate-y-0 max-h-[500px]'
                                                                         : 'opacity-0 translate-y-4 max-h-0 overflow-hidden'}`}>
                    <AnimateOnView animation="animate__fadeInUp animate__slower">
                        <FAQItem index={999} isOpen={openFaq === 999} title={tFAQ('question5.title')}
                                 description={tFAQ('question5.description')} onToggle={toggleFaq} />
                    </AnimateOnView>
                </div>


                {/* Join Button */}
                <div className="flex justify-center items-center mt-16">
                    <AnimateOnView animation="animate__fadeInUp animate__slower">
                        <div className="relative">
                            {/* Join Button */}
                            <div className="relative group drop-shadow-xl drop-shadow-white/5">
                                <a href="https://discord.gg/bl4cklist" target="_blank">
                                    <button className={`relative w-full sm:min-w-52 ${buttons.white_gray}`}>
                                        <FaDiscord className="text-gray-100" />
                                        <p className="whitespace-pre">{tWelcome('joinDiscord')}</p>
                                    </button>
                                </a>

                                <ButtonHover />
                            </div>

                            {/* Left Pointing Arrow */}
                            <div className={`hidden md:block opacity-10 absolute right-full top-1/2 -translate-y-1/2 
                                             mr-4 lg:mr-6 w-12 h-6 lg:w-20 lg:h-14 ${anim.animate_click_slide}`}>
                                <Image src="/images/pixel/arrow-80w.avif" width={80} height={54}
                                       alt="Arrow Icon - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                                       className="w-12 h-6 lg:w-20 lg:h-14 grayscale pointer-events-none" />
                            </div>
                        </div>
                    </AnimateOnView>
                </div>

                <AdContainer>
                    <AdBanner dataAdSlot="3444501462" dataAdFormat="horizontal" />
                </AdContainer>
            </div>

            { /* Bottom border for this section */ }
            <div className="bg-[radial-gradient(50%_50%_at_50%_50%,#d8e7f212_0%,#04070d_100%)] z-10
                            flex-none h-1 absolute bottom-0 left-0 right-0"></div>
        </section>
    );
}