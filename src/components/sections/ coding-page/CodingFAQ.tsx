import {JSX, useState} from "react";
import {AnimateOnView} from "@/components/animations/AnimateOnView";
import {AnimatedTextReveal} from "@/components/animations/TextReveal";
import index from "@/styles/components/index.module.css";
import colors from "@/styles/util/colors.module.css";
import coding from "@/styles/components/coding.module.css";
import Image from "next/image";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown} from "@fortawesome/free-solid-svg-icons";
import buttons from "@/styles/util/buttons.module.css";
import anim from "@/styles/util/animations.module.css";
import {faDiscord} from "@fortawesome/free-brands-svg-icons/faDiscord";
import ButtonHover from "@/components/elements/ButtonHover";
import {useTranslations} from "next-intl";

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

    /**
     * Toggles the open state of a FAQ item.
     * If the given index is already open, it closes it; otherwise, it opens the selected FAQ.
     *
     * @param index - The index of the FAQ item to toggle.
     */
    const toggleFaq: (index: number) => void = (index: number): void => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <section className="relative py-24 bg-slate-900/30" id="faq">
            <div className="w-full max-w-7xl mx-auto">

                {/* Decorative Planet - Left Top */}
                <div className="absolute left-20 top-36 -translate-x-1/3 lg:-translate-x-1/4
                                pointer-events-none z-0 opacity-40 hidden md:block">
                    <Image src="/images/bg/uranus-128w.webp" width={128} height={128}
                           alt="Uranus Deco ~ Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                           className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 drop-shadow-2xl" />
                </div>

                {/* Decorative Planet - Right Bottom */}
                <div className="absolute right-32 bottom-24 translate-x-1/3 lg:translate-x-1/4
                                pointer-events-none z-0 opacity-40 hidden md:block">
                    <Image src="/images/bg/moon.svg" width={128} height={128}
                           alt="Moon Deco ~ Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                           className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 drop-shadow-2xl" />
                </div>

                {/* Header of Section */}
                <div className="flex justify-between gap-x-8 mb-4">
                    <div className="max-w-xl">
                        {/* Animated Tag */}
                        <div className="mb-2">
                            <div className="font-bold tracking-wider">
                                <AnimateOnView animation="animate__fadeInLeft animate__slower">
                                    <AnimatedTextReveal text="HÄUFIG GESTELLTEN FRAGEN AUS DER COMMUNITY!"
                                                        className="text-sm text-[coral] uppercase text-center
                                                           2xl:text-start pb-3 lg:pb-0"
                                                        shadowColor="rgba(255,127,80,0.35)"/>
                                </AnimateOnView>
                            </div>
                        </div>

                        {/* Headline */}
                        <AnimateOnView animation="animate__fadeInLeft animate__slower">
                            <h2 className={`${index.head_border} bg-clip-text text-transparent mb-2 md:mb-6 
                                            text-center ${colors.text_gradient_gray} my-0 font-semibold 
                                            leading-[1.1] text-[1.75rem] md:text-[2.5rem] 
                                            lg:text-[clamp(1.75rem,_1.3838rem_+_2.6291vw,_3.50rem)]`}>
                                <span className="inline-block align-middle leading-none -mx-[5px] -mt-[5px] text-white">❓</span> -
                                Eure Fragen..
                            </h2>
                        </AnimateOnView></div>

                    {/* Description */}
                    <AnimateOnView animation="animate__fadeInRight animate__slower">
                        <p className="text-[#969cb1] pt-6 break-words max-w-md text-sm text-end items-center md:text-base">
                            › In den vergangenen Jahren haben sich einige interessante Fragen zu unserem Coding-System
                            angesammelt, die wir euch gerne beantworten! 🚀
                        </p>
                    </AnimateOnView>
                </div>

                {/* Feature List */}
                <div className="relative w-7xl mt-0 mx-auto !mb-10">
                    <div className="relative z-10 mx-auto overflow-hidden">
                        <div className="grid z-10 w-full h-full grid-cols-4">
                            <AnimateOnView animation="animate__fadeInLeft animate__slower">
                                <div className={`relative px-8 pt-6 pb-9 ${coding.feature_card} hover:bg-gradient-to-b 
                                                 hover:from-transparent hover:to-slate-900/30 transition-all 
                                                 duration-300`}>
                                <Image src="/images/icons/small/charts-40w.avif" width={40} height={40}
                                       className="mb-5 pointer-events-none"
                                       alt="Member Count - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server" />
                                <div className="font-medium text-white mb-1">Bewirb Dein Projekt</div>
                                <div className="text-[#969cb1] text-base">
                                    Erreiche eine riesige Community & vergrößere das Interesse an dein eigenes Projekt!
                                </div>
                            </div>
                            </AnimateOnView>
                            <AnimateOnView animation="animate__fadeInLeft animate__slower">
                                <div className={`relative px-8 pt-6 pb-9 ${coding.feature_card} hover:bg-gradient-to-b 
                                                 hover:from-transparent hover:to-slate-900/30 transition-all 
                                                 duration-300`}>
                                <Image src="/images/icons/small/book-40w.avif" width={40} height={40}
                                       className="mb-5 pointer-events-none"
                                       alt="Love Heart - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server" />
                                <div className="font-medium text-white mb-1 hover:text-[coral] transition-colors duration-200">
                                    <a href="https://discord.bl4cklist.de/">Unsere Discord-Hilfe</a>
                                </div>
                                <div className="text-[#969cb1] text-base">
                                    Wir haben eine riesige Sammlung an Artikeln, die dir helfen deinen Discord-Server einzurichten.
                                </div>
                            </div>
                            </AnimateOnView>
                            <AnimateOnView animation="animate__fadeInRight animate__slower">
                                <div className={`relative px-8 pt-6 pb-9 ${coding.feature_card} hover:bg-gradient-to-b 
                                                 hover:from-transparent hover:to-slate-900/30 transition-all 
                                                 duration-300`}>
                                <Image src="/images/icons/small/money-40w.avif" width={40} height={40}
                                       className="mb-5 pointer-events-none"
                                       alt="Love Heart - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server" />
                                <div className="font-medium text-white mb-1">Erhalte Gratis-Spiele</div>
                                <div className="text-[#969cb1] text-base">
                                    Spare echtes Geld und werde zu jedem neuen kostenlosen Spiel sofort informiert!
                                </div>
                            </div>
                            </AnimateOnView>
                            <AnimateOnView animation="animate__fadeInRight animate__slower">
                                <div className={`relative px-8 pt-6 pb-9 ${coding.feature_card} hover:bg-gradient-to-b 
                                                 hover:from-transparent hover:to-slate-900/30 transition-all 
                                                 duration-300`}>
                                <Image src="/images/icons/small/love-40w.avif" width={40} height={40}
                                       className="mb-5 pointer-events-none"
                                       alt="Love Heart - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server" />
                                <div className="font-medium text-white mb-1">Lerne Zusammen Mit Uns</div>
                                <div className="text-[#969cb1] text-base">
                                    Wir reden immer zusammen mit euch über unsere Entwicklung und lassen euch direkt teil daran haben.
                                </div>
                            </div>
                            </AnimateOnView>
                        </div>
                    </div>
                    <div className={`absolute flex h-full w-full justify-between top-0 ${coding.feature_grid}`}>
                        <div></div><div></div><div></div><div></div><div></div><div></div>
                    </div>
                </div>

                {/* FAQ Items */}
                <div className="grid grid-cols-2 gap-7">
                    {/* Left column */}
                    <div className="flex flex-col gap-7">
                        <div className="relative p-px drop-shadow-white/1 drop-shadow-xl">
                            <div className="relative rounded-lg z-10 p-8 cursor-pointer"
                                 onClick={(): void => toggleFaq(0)}>
                                {/* Background Image Wrapper */}
                                <div className="absolute inset-0 -z-10">
                                    <Image src="/images/containers/bentobox-tl-339w.avif" fill
                                           alt={`Bentobox Background`} className="object-cover object-center pointer-events-none
                                                                          group-hover:brightness-125 transition-all duration-200" />
                                </div>

                                {/* Title */}
                                <div className="flex justify-between items-center cursor-pointer" >
                                    <h3 className="text-xl font-medium">⚙️ ~ Welche Programmiersprachen unterstützt ihr?</h3>
                                    <span className={`transform transition-transform duration-300 text-[#969cb1]
                                                      ${openFaq === 0 ? 'rotate-180' : ''}`}>
                                        <FontAwesomeIcon icon={faChevronDown} />
                                    </span>
                                </div>

                                {/* Description */}
                                <div className={`overflow-hidden transition-all duration-300 cursor-default
                                                 ${openFaq === 0 ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="w-5/6 mx-auto h-px bg-gradient-to-r from-slate-900 via-slate-300
                                                  to-slate-900 rounded-full opacity-40 my-6"></div>
                                    <div className="max-w-full text-[#969cb1]">
                                        <p>› Auf unserem Discord-Server findest du <strong>alle bekannten Programmiersprachen</strong>, von Python bis hin zu Assembly. Da unsere Community sehr vielfältig ist und viele verschiedene Talente bietet, ist es sehr wahrscheinlich das dein Problem oder deine Frage blitzschnell beantwortet werden kann.
                                            <br /><br />
                                            › Das Server-Team von uns arbeitet hauptsächlich mit Python für Discord-Bots, Java für REST-APIs & Minecraft-Plugins und TypeScript für die Web-Entwicklung, zum Beispiel für genau diese Webseite.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Border Gradient */}
                            <div className="absolute inset-0 rounded-lg opacity-40 bg-white/[0.05] bg-gradient-to-r
                                            from-transparent via-white/60 to-transparent"></div>
                        </div>
                        <div className="relative p-px drop-shadow-white/1 drop-shadow-xl">
                            <div className="relative rounded-lg z-10 p-8 bg-[#04070d] cursor-pointer"
                                 onClick={(): void => toggleFaq(2)}>
                                <div className="absolute inset-0 -z-10">
                                    <Image src="/images/containers/bentobox-tl-339w.avif" fill
                                           alt={`Bentobox Background`} className="object-cover object-center pointer-events-none
                                                                          group-hover:brightness-125 transition-all duration-200" />
                                </div>

                                <div className="flex justify-between items-center" >
                                    <h3 className="text-xl font-medium">🤖 ~ Wie entwickle ich einen eigenen Discord-Bot?</h3>
                                    <span className={`transform transition-transform duration-300 text-[#969cb1]
                                                      ${openFaq === 2 ? 'rotate-180' : ''}`}>
                                        <FontAwesomeIcon icon={faChevronDown} />
                                    </span>
                                </div>

                                <div className={`overflow-hidden transition-all duration-300 cursor-default
                                                 ${openFaq === 2 ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="w-5/6 mx-auto h-px bg-gradient-to-r from-slate-900 via-slate-300
                                                  to-slate-900 rounded-full opacity-40 my-6"></div>
                                    <div className="max-w-full text-[#969cb1]">
                                        <p>› Wir haben eine kleine <a href="https://www.youtube.com/playlist?list=PLkZNWsy7A7m5RBj02l042pqJIGk2fAZdt" target="_blank" className="text-[coral]">Tutorial-Reihe auf YouTube</a> hochgeladen, in welchen wir zusammen mit Python3.12 und - der Bibliothek für Discord's API - discord.py ausführlich Feature-für-Feature durchgehen und diese in einen eigenen Discord-Bot integrieren.
                                            <br /><br />
                                            › Es finden hin und wieder <a href="https://www.twitch.tv/r4zzerde" target="_blank" className="text-[coral]">Livestreams</a> auf Twitch statt, in welchen wir an diesem Projekt gemeinsam mit euch weiterarbeiten und währenddessen auch Fragen zum Thema (oder auch allgemeine Programmierfragen) beantworten.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute inset-0 rounded-lg opacity-40 bg-white/[0.05] bg-gradient-to-r
                                            from-transparent via-white/60 to-transparent"></div>
                        </div>
                    </div>

                    {/* Right column */}
                    <div className="flex flex-col gap-7">
                        <div className="relative p-px drop-shadow-white/1 drop-shadow-xl">
                            <div className="relative rounded-lg z-10 p-8 bg-[#04070d] cursor-pointer"
                                 onClick={(): void => toggleFaq(1)}>
                                <div className="absolute inset-0 -z-10">
                                    <Image src="/images/containers/bentobox-tl-339w.avif" fill
                                           alt={`Bentobox Background`} className="object-cover object-center pointer-events-none
                                                                          group-hover:brightness-125 transition-all duration-200" />
                                </div>

                                <div className="flex justify-between items-center" >
                                    <h3 className="text-xl font-medium">🌐 ~ Wie kann ich mein Projekt online stellen?</h3>
                                    <span className={`transform transition-transform duration-300 text-[#969cb1]
                                                      ${openFaq === 1 ? 'rotate-180' : ''}`}>
                                        <FontAwesomeIcon icon={faChevronDown} />
                                    </span>
                                </div>

                                <div className={`overflow-hidden transition-all duration-300 cursor-default
                                                 ${openFaq === 1 ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="w-5/6 mx-auto h-px bg-gradient-to-r from-slate-900 via-slate-300
                                                  to-slate-900 rounded-full opacity-40 my-6"></div>
                                    <div className="max-w-full text-[#969cb1]">
                                        <p>› Im Internet kusieren sehr viele Angebote von Plattformen die anbieten dein Projekt kostenlos zu hosten, wir raten jedoch dringend davon ab, da dies massive Datenschutz-& Sicherheitsbedenken beherbergt.
                                            <br /><br />
                                            › Wir selbst nutzen <a href="https://deinserverhost.de/store/aff.php?aff=3181" className="text-[coral]">DeinServerHost</a> um für wenig Geld enorm leistungsstarke Server zu erhalten, worauf alle unsere Dienste rund um die Uhr laufen.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute inset-0 rounded-lg opacity-40 bg-white/[0.05] bg-gradient-to-r
                                            from-transparent via-white/60 to-transparent"></div>
                        </div>
                        <div className="relative p-px drop-shadow-white/1 drop-shadow-xl">
                            <div className="relative rounded-lg z-10 p-8 bg-[#04070d] cursor-pointer"
                                 onClick={(): void => toggleFaq(3)}>
                                <div className="absolute inset-0 -z-10">
                                    <Image src="/images/containers/bentobox-tl-339w.avif" fill
                                           alt={`Bentobox Background`} className="object-cover object-center pointer-events-none
                                                                          group-hover:brightness-125 transition-all duration-200" />
                                </div>
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-medium">📌 ~ Habt ihr Projekte, von denen man lernen kann?</h3>
                                    <span className={`transform transition-transform duration-300 text-[#969cb1]
                                                      ${openFaq === 3 ? 'rotate-180' : ''}`}>
                                        <FontAwesomeIcon icon={faChevronDown} />
                                    </span>
                                </div>

                                <div className={`overflow-hidden transition-all duration-300 cursor-default
                                                 ${openFaq === 3 ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="w-5/6 mx-auto h-px bg-gradient-to-r from-slate-900 via-slate-300
                                                  to-slate-900 rounded-full opacity-40 my-6"></div>
                                    <div className="max-w-full text-[#969cb1]">
                                        <p>› JA - Die meisten Projekte von uns sind <strong>Open Source</strong> und daher kann der vollständige Quellcode ausgelesen werden. So könnt ihr lernen, wie wir bestimmte Features (wie ein Drag-& Drop-System) umgesetzt haben oder wie man Unit-Tests schreibt.
                                            <br /><br />
                                            › Ihr könnt die Projekte auch für eure eigenen Ideen umbauen und was völlig neues daraus erschaffen! Wir freuen uns immer sehr über eigene Kreativität - alle unsere Projekte findet ihr <a href="https://github.com/yannic-md?tab=repositories" target="_blank" className="text-[coral]">hier auf Github</a>.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute inset-0 rounded-lg opacity-40 bg-white/[0.05] bg-gradient-to-r
                                            from-transparent via-white/60 to-transparent"></div>
                        </div>
                    </div>
                </div>


                {/* Join Button */}
                <div className="flex justify-center items-center mt-16">
                    <div className="relative">
                        {/* Join Button */}
                        <div className="relative group drop-shadow-xl drop-shadow-white/5">
                            <a href="https://discord.gg/bl4cklist" target="_blank">
                                <button className={`relative w-full sm:min-w-52 ${buttons.white_gray}`}>
                                    <FontAwesomeIcon icon={faDiscord} className="text-gray-100" />
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
                </div>





            </div>

            { /* Bottom border for this section */ }
            <div className="bg-[radial-gradient(50%_50%_at_50%_50%,#d8e7f212_0%,#04070d_100%)] z-10
                            flex-none h-1 absolute bottom-0 left-0 right-0"></div>
        </section>
    );
}