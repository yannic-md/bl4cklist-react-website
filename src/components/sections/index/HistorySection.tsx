import {JSX} from "react";
import {AnimateOnView} from "@/components/animations/AnimateOnView";
import {AnimatedTextReveal} from "@/components/animations/TextReveal";
import colors from "@/styles/util/colors.module.css";
import buttons from "@/styles/util/buttons.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDiscord} from "@fortawesome/free-brands-svg-icons";
import ButtonHover from "@/components/elements/ButtonHover";
import {useTranslations} from "next-intl";
import {faUsers} from "@fortawesome/free-solid-svg-icons/faUsers";
import {timeline, TimelineData} from "@/types/TimelineData";
import TimelineItem from "@/components/elements/misc/TimelineItem";

import index from '../../../styles/components/index.module.css';

/**
 * The `HistorySection` component renders a section of the webpage that provides
 * an overview of the Discord server's history. It includes animated text, a description,
 * buttons for user interaction, and a timeline of events.
 *
 * Key Features:
 * - Sticky left content with an animated tag, headline, description, and buttons.
 * - Scrollable right content displaying a timeline of events.
 * - Responsive design with TailwindCSS utility classes.
 *
 * @returns {JSX.Element} The rendered `HistorySection` component.
 */
export default function HistorySection(): JSX.Element {
    const tWelcome = useTranslations('WelcomeHero');

    return (
        <section className="pr-8 pl-8 pb-28 pt-32 bg-slate-900/30" id="discord-server-history">
            <div className="mx-auto w-full max-w-[1400px]">
                <div className="grid auto-cols-[1fr] grid-cols-[1fr_1fr] grid-rows-[auto_auto] gap-x-[106px] gap-y-4
                                [place-items:start_stretch]">

                    {/* Sticky Content left (Section Overview) */}
                    <div className="sticky flex justify-start items-start [flex-flow:column] top-36 gap-2.5">
                        {/* Animated Tag */}
                        <div className="font-bold tracking-wider mb-1">
                            <AnimateOnView animation="animate__fadeInLeft animate__slower">
                                <AnimatedTextReveal text="WIE SIND WIR EIGENTLICH ENTSTANDEN?"
                                                    className="text-sm text-[coral] uppercase
                                                               text-center lg:text-start pb-3 lg:pb-0"
                                                    shadowColor="rgba(255,127,80,0.35)" />
                            </AnimateOnView>
                        </div>

                        {/* Headline */}
                        <AnimateOnView animation="animate__fadeInRight animate__slower">
                            <h2 className={`${index.head_border} max-w-[22ch] bg-clip-text text-transparent mb-6 
                                            ${colors.text_gradient_gray} my-0 font-semibold leading-[1.1] text-center 
                                            lg:text-start text-[clamp(2rem,_1.3838rem_+_2.6291vw,_3.60rem)]`}>
                                <span className="inline-block align-middle leading-none text-white">
                                    🪶</span> - DIE GESCHICHTE..
                            </h2>
                        </AnimateOnView>

                        {/* Description */}
                        <AnimateOnView animation="animate__fadeInUp animate__slower">
                            <p className="text-[#969cb1] mb-6 break-words max-w-2xl">
                                📜 › Wir haben zusammen mit unserer Discord-Community schon sehr viel erlebt. Wir haben viele schöne neue Erinnerungen, aber auch jede Menge neuer Freunde gefunden. Bl4cklist war ein Ort um den Stress des Alltags etwas zu vergessen.<br /><br />
                                ⚡› Doch dies war nur der Anfang: Auch nach vielen revolutionären und einzigartigen Ideen geht uns noch immer nicht die Luft aus: Uns wird es für immer für euch geben & wir haben noch jede Menge Asse im Ärmel um euch stets bei Laune zu halten und zu inspirieren.<br /><br />
                                💕 › Wir sind jedem einzelnen User dankbar, welcher uns in der vergangenen Zeit besucht, gechattet, gespendet oder innerhalb unseres Teams unterstützt hat. Ohne euch wäre Bl4cklist nicht das, was es heute ist und wir werden keinen einzigen von euch vergessen!<br /><br />
                                🤔 › Um euch einen kleinen Einblick darin zu geben was wir alles zusammen erlebt haben, haben wir ein paar besondere Momente hier zusammengetragen.</p>
                        </AnimateOnView>

                        {/* Buttons */}
                        <AnimateOnView animation="animate__fadeInUp animate__slower w-full lg:w-auto">
                            <div className="flex flex-row mt-2 gap-x-6">
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
                                    <a href="discord/community" className="flex flex-col items-end w-full">
                                        <button className={`relative w-full sm:min-w-52 ${buttons.black_purple}`}>
                                            <FontAwesomeIcon icon={faUsers} className="text-gray-100" />
                                            <p className="whitespace-pre">Unsere Community</p>
                                        </button>
                                    </a>

                                    <ButtonHover />
                                </div>
                            </div>
                        </AnimateOnView>

                    </div>

                    {/* Scrollable Content right (Timeline Items) */}
                    <div className="pl-3">
                        <div className="relative flex flex-col gap-14">
                            {/* Timeline Border gradient */}
                            <div className="absolute w-0.5 h-full bg-gradient-to-b from-white/20 via-white/40
                                          to-white/10 inset-y-0 left-0"></div>

                            {/* Items of the timeline */}
                            {timeline.reverse().map((item: TimelineData, index1: number): JSX.Element => (
                                <TimelineItem key={index1} date={item.date} title={item.title} description={item.description}
                                              logoSrc={item.logoSrc} logoAlt={item.logoAlt} borderShadowClass={index.team_border_shadow} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            { /* Bottom border for this section */ }
            <div className="bg-[radial-gradient(50%_50%_at_50%_50%,#d8e7f212_0%,#04070d_100%)] z-[1]
                            flex-none h-1 absolute bottom-0 left-0 right-0"></div>
        </section>
    )
}