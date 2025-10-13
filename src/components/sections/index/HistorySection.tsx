import {JSX} from "react";
import {AnimateOnView} from "@/components/animations/AnimateOnView";
import {AnimatedTextReveal} from "@/components/animations/TextReveal";
import index from "@/styles/components/index.module.css";
import colors from "@/styles/util/colors.module.css";
import buttons from "@/styles/util/buttons.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDiscord} from "@fortawesome/free-brands-svg-icons";
import ButtonHover from "@/components/elements/ButtonHover";
import {useTranslations} from "next-intl";
import {faUsers} from "@fortawesome/free-solid-svg-icons/faUsers";
import Image from "next/image";

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
                            <div className="relative flex flex-col gap-4 pl-[63px]">
                                <div className={`relative flex p-3 bg-[#04070d] rounded-2xl 
                                                 shadow-[inset_0_2px_1px_0_rgba(207,231,255,0.2)]
                                                 ${index.team_border_shadow} hover:-translate-y-1 transition-all duration-200`}>
                                    <div>
                                        <p className="opacity-50 mb-2 ml-1">25. Mai 2020</p>

                                        {/* News Title */}
                                        <h3 className="text-[clamp(1.375rem,1.1989rem+.7512vw,1.5rem)] font-semibold">
                                            🎉 ~ Discord-Server veröffentlicht!</h3>

                                        {/* News Desc */}
                                        <p className="text-[#969cb1] mb-6 break-words max-w-2xl">
                                            › Discord war noch für alle etwas ganz neues: es war aufregend! Angefangen als kleine GTA5-Crew haben wir uns zu einem allgemeinen Community-Server weiterentwickelt.
                                        </p>
                                    </div>

                                    {/* Sticker Logo */}
                                    <div className="absolute -top-8 -right-8 w-24 h-24 z-10">
                                        <Image src="/images/brand/old/first_logo-96w.webp" width={96} height={96}
                                               alt="First Logo ~ Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                                               className="w-full h-full object-contain drop-shadow-2xl hover:opacity-100
                                                          hover:scale-110 transition-all duration-300 opacity-80" />
                                    </div>

                                    {/* Light Effect on Profile Container */}
                                    <div className="absolute top-0 right-0 w-[437px] h-[306px] pointer-events-none opacity-[0.1] rounded-tr-2xl
                                                    bg-[radial-gradient(50%_50%_at_93.7%_8.1%,#b8c7d980_0%,rgba(4,7,13,0)_100%)]"></div>
                                </div>

                                {/* Decoration for timeline item */}
                                <div className="w-[10px] absolute top-[47%] -left-[4px]">
                                    <div className="aspect-square rounded-full w-full
                                                    bg-[radial-gradient(circle_farthest-corner_at_50%_50%,#fff,#e5e5e5_54%,#a3a3a3)]"></div>
                                    <div className="w-[40px] h-[2px] absolute top-1/2 right-0 translate-x-full
                                                    -translate-y-1/2 bg-gradient-to-r from-white/80 via-white/50
                                                    via-21% to-transparent to-92%"></div>
                                    <div className="w-[2px] h-[40px] absolute top-0 left-1/2 -translate-x-1/2
                                                    -translate-y-full bg-gradient-to-t from-white/60
                                                    to-transparent to-80%"></div>
                                    <div className="w-[2px] h-[40px] absolute bottom-0 left-1/2 -translate-x-1/2
                                                    translate-y-full bg-gradient-to-b from-white/60 to-transparent
                                                    to-80%"></div>
                                </div>
                            </div>
                            <div className="relative flex flex-col gap-4 pl-[63px]">
                                <div className={`relative flex p-3 bg-[#04070d] rounded-2xl 
                                                 shadow-[inset_0_2px_1px_0_rgba(207,231,255,0.2)]
                                                 ${index.team_border_shadow} hover:-translate-y-1 transition-all duration-200`}>
                                    <div>
                                        <p className="opacity-50 mb-2 ml-1">28. November 2020</p>

                                        {/* News Title */}
                                        <h3 className="text-[clamp(1.375rem,1.1989rem+.7512vw,1.5rem)] font-semibold">
                                            🖼️ ~ Die erste eigene Webseite</h3>

                                        {/* News Desc */}
                                        <p className="text-[#969cb1] mb-6 break-words max-w-2xl">
                                            › Unsere erste eigene Webseite sollte unseren Discord-Server vorstellen, unsere Server-Partner hervorheben und neue User erreichen, auf der Suche nach einer eigenen Identität..
                                        </p>
                                    </div>

                                    {/* Light Effect on Profile Container */}
                                    <div className="absolute top-0 right-0 w-[437px] h-[306px] pointer-events-none opacity-[0.1] rounded-tr-2xl
                                                    bg-[radial-gradient(50%_50%_at_93.7%_8.1%,#b8c7d980_0%,rgba(4,7,13,0)_100%)]"></div>
                                </div>

                                {/* Decoration for timeline item */}
                                <div className="w-[10px] absolute top-[47%] -left-[4px]">
                                    <div className="aspect-square rounded-full w-full
                                                    bg-[radial-gradient(circle_farthest-corner_at_50%_50%,#fff,#e5e5e5_54%,#a3a3a3)]"></div>
                                    <div className="w-[40px] h-[2px] absolute top-1/2 right-0 translate-x-full
                                                    -translate-y-1/2 bg-gradient-to-r from-white/80 via-white/50
                                                    via-21% to-transparent to-92%"></div>
                                    <div className="w-[2px] h-[40px] absolute top-0 left-1/2 -translate-x-1/2
                                                    -translate-y-full bg-gradient-to-t from-white/60
                                                    to-transparent to-80%"></div>
                                    <div className="w-[2px] h-[40px] absolute bottom-0 left-1/2 -translate-x-1/2
                                                    translate-y-full bg-gradient-to-b from-white/60 to-transparent
                                                    to-80%"></div>
                                </div>
                            </div>
                            <div className="relative flex flex-col gap-4 pl-[63px]">
                                <div className={`relative flex p-3 bg-[#04070d] rounded-2xl 
                                                 shadow-[inset_0_2px_1px_0_rgba(207,231,255,0.2)]
                                                 ${index.team_border_shadow} hover:-translate-y-1 transition-all duration-200`}>
                                    <div>
                                        <p className="opacity-50 mb-2 ml-1">8. Januar 2021</p>

                                        {/* News Title */}
                                        <h3 className="text-[clamp(1.375rem,1.1989rem+.7512vw,1.5rem)] font-semibold">
                                            🌍 ~ Der erste Discord-Bot: Global-Chat</h3>

                                        {/* News Desc */}
                                        <p className="text-[#969cb1] mb-6 break-words max-w-2xl">
                                            › Dieser Bot ermöglicht eine serverweite Kommunikation mit anderen Usern, ohne das diese auf deinem Server sein müssen - dies ist praktisch für kleinere Server für aktivere Chats & etwas Werbung.
                                        </p>
                                    </div>

                                    {/* Sticker Logo */}
                                    <div className="absolute -top-8 -right-8 w-24 h-24 z-10">
                                        <Image src="/images/brand/old/second_logo-96w.webp" width={96} height={96}
                                               alt="Second Logo ~ Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                                               className="w-full h-full object-contain drop-shadow-2xl hover:opacity-100
                                                          hover:scale-110 transition-all duration-300 opacity-80" />
                                    </div>

                                    {/* Light Effect on Profile Container */}
                                    <div className="absolute top-0 right-0 w-[437px] h-[306px] pointer-events-none opacity-[0.1] rounded-tr-2xl
                                                    bg-[radial-gradient(50%_50%_at_93.7%_8.1%,#b8c7d980_0%,rgba(4,7,13,0)_100%)]"></div>
                                </div>

                                {/* Decoration for timeline item */}
                                <div className="w-[10px] absolute top-[47%] -left-[4px]">
                                    <div className="aspect-square rounded-full w-full
                                                    bg-[radial-gradient(circle_farthest-corner_at_50%_50%,#fff,#e5e5e5_54%,#a3a3a3)]"></div>
                                    <div className="w-[40px] h-[2px] absolute top-1/2 right-0 translate-x-full
                                                    -translate-y-1/2 bg-gradient-to-r from-white/80 via-white/50
                                                    via-21% to-transparent to-92%"></div>
                                    <div className="w-[2px] h-[40px] absolute top-0 left-1/2 -translate-x-1/2
                                                    -translate-y-full bg-gradient-to-t from-white/60
                                                    to-transparent to-80%"></div>
                                    <div className="w-[2px] h-[40px] absolute bottom-0 left-1/2 -translate-x-1/2
                                                    translate-y-full bg-gradient-to-b from-white/60 to-transparent
                                                    to-80%"></div>
                                </div>
                            </div>
                            <div className="relative flex flex-col gap-4 pl-[63px]">
                                <div className={`relative flex p-3 bg-[#04070d] rounded-2xl 
                                                 shadow-[inset_0_2px_1px_0_rgba(207,231,255,0.2)]
                                                 ${index.team_border_shadow} hover:-translate-y-1 transition-all duration-200`}>
                                    <div>
                                        <p className="opacity-50 mb-2 ml-1">23. April 2021</p>

                                        {/* News Title */}
                                        <h3 className="text-[clamp(1.375rem,1.1989rem+.7512vw,1.5rem)] font-semibold">
                                            🚨 ~ Unser zuverlässiger Raidschutz</h3>

                                        {/* News Desc */}
                                        <p className="text-[#969cb1] mb-6 break-words max-w-2xl">
                                            › Während dieser Zeit hatte Discord enorme Probleme mit massiven Bot-Accounts - wir haben einen automatischen & starken Schutz entwickelt, damit ihr eure Communitys schützen könnt.
                                        </p>
                                    </div>

                                    {/* Light Effect on Profile Container */}
                                    <div className="absolute top-0 right-0 w-[437px] h-[306px] pointer-events-none opacity-[0.1] rounded-tr-2xl
                                                    bg-[radial-gradient(50%_50%_at_93.7%_8.1%,#b8c7d980_0%,rgba(4,7,13,0)_100%)]"></div>
                                </div>

                                {/* Decoration for timeline item */}
                                <div className="w-[10px] absolute top-[47%] -left-[4px]">
                                    <div className="aspect-square rounded-full w-full
                                                    bg-[radial-gradient(circle_farthest-corner_at_50%_50%,#fff,#e5e5e5_54%,#a3a3a3)]"></div>
                                    <div className="w-[40px] h-[2px] absolute top-1/2 right-0 translate-x-full
                                                    -translate-y-1/2 bg-gradient-to-r from-white/80 via-white/50
                                                    via-21% to-transparent to-92%"></div>
                                    <div className="w-[2px] h-[40px] absolute top-0 left-1/2 -translate-x-1/2
                                                    -translate-y-full bg-gradient-to-t from-white/60
                                                    to-transparent to-80%"></div>
                                    <div className="w-[2px] h-[40px] absolute bottom-0 left-1/2 -translate-x-1/2
                                                    translate-y-full bg-gradient-to-b from-white/60 to-transparent
                                                    to-80%"></div>
                                </div>
                            </div>
                            <div className="relative flex flex-col gap-4 pl-[63px]">
                                <div className={`relative flex p-3 bg-[#04070d] rounded-2xl 
                                                 shadow-[inset_0_2px_1px_0_rgba(207,231,255,0.2)]
                                                 ${index.team_border_shadow} hover:-translate-y-1 transition-all duration-200`}>
                                    <div>
                                        <p className="opacity-50 mb-2 ml-1">22. Oktober 2021</p>

                                        {/* News Title */}
                                        <h3 className="text-[clamp(1.375rem,1.1989rem+.7512vw,1.5rem)] font-semibold">
                                            🎁 ~ Gewinnspiel-Bot veröffentlicht</h3>

                                        {/* News Desc */}
                                        <p className="text-[#969cb1] mb-6 break-words max-w-2xl">
                                            › Unser wohl beliebteste Discord-Bot wurde nach über 6 Monaten endlich veröffentlicht und seitdem mithilfe unserer Community über die Jahre hinweg stetig verbessert - mit einem Auge fürs Detail!
                                        </p>
                                    </div>

                                    {/* Light Effect on Profile Container */}
                                    <div className="absolute top-0 right-0 w-[437px] h-[306px] pointer-events-none opacity-[0.1] rounded-tr-2xl
                                                    bg-[radial-gradient(50%_50%_at_93.7%_8.1%,#b8c7d980_0%,rgba(4,7,13,0)_100%)]"></div>
                                </div>

                                {/* Decoration for timeline item */}
                                <div className="w-[10px] absolute top-[47%] -left-[4px]">
                                    <div className="aspect-square rounded-full w-full
                                                    bg-[radial-gradient(circle_farthest-corner_at_50%_50%,#fff,#e5e5e5_54%,#a3a3a3)]"></div>
                                    <div className="w-[40px] h-[2px] absolute top-1/2 right-0 translate-x-full
                                                    -translate-y-1/2 bg-gradient-to-r from-white/80 via-white/50
                                                    via-21% to-transparent to-92%"></div>
                                    <div className="w-[2px] h-[40px] absolute top-0 left-1/2 -translate-x-1/2
                                                    -translate-y-full bg-gradient-to-t from-white/60
                                                    to-transparent to-80%"></div>
                                    <div className="w-[2px] h-[40px] absolute bottom-0 left-1/2 -translate-x-1/2
                                                    translate-y-full bg-gradient-to-b from-white/60 to-transparent
                                                    to-80%"></div>
                                </div>
                            </div>
                            <div className="relative flex flex-col gap-4 pl-[63px]">
                                <div className={`relative flex p-3 bg-[#04070d] rounded-2xl 
                                                 shadow-[inset_0_2px_1px_0_rgba(207,231,255,0.2)]
                                                 ${index.team_border_shadow} hover:-translate-y-1 transition-all duration-200`}>
                                    <div>
                                        <p className="opacity-50 mb-2 ml-1">14. Juli 2022</p>

                                        {/* News Title */}
                                        <h3 className="text-[clamp(1.375rem,1.1989rem+.7512vw,1.5rem)] font-semibold">
                                            ⭐ ~ Wir entwickeln uns - ein Rebrand!</h3>

                                        {/* News Desc */}
                                        <p className="text-[#969cb1] mb-6 break-words max-w-2xl">
                                            › Unser Discord-Server existiert nun seit ca. 2 Jahren und es wird Zeit für eine richtige Identität: Wir haben ein neues Server-Thema (Community-Server im "Wilden Westen") & Logo festgelegt.
                                        </p>
                                    </div>

                                    {/* Sticker Logo */}
                                    <div className="absolute -top-8 -right-8 w-24 h-24 z-10">
                                        <Image src="/images/brand/old/third_logo-96w.webp" width={96} height={96}
                                               alt="Third Logo ~ Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                                               className="w-full h-full object-contain drop-shadow-2xl hover:opacity-100
                                                          hover:scale-110 transition-all duration-300 opacity-80" />
                                    </div>

                                    {/* Light Effect on Profile Container */}
                                    <div className="absolute top-0 right-0 w-[437px] h-[306px] pointer-events-none opacity-[0.1] rounded-tr-2xl
                                                    bg-[radial-gradient(50%_50%_at_93.7%_8.1%,#b8c7d980_0%,rgba(4,7,13,0)_100%)]"></div>
                                </div>

                                {/* Decoration for timeline item */}
                                <div className="w-[10px] absolute top-[47%] -left-[4px]">
                                    <div className="aspect-square rounded-full w-full
                                                    bg-[radial-gradient(circle_farthest-corner_at_50%_50%,#fff,#e5e5e5_54%,#a3a3a3)]"></div>
                                    <div className="w-[40px] h-[2px] absolute top-1/2 right-0 translate-x-full
                                                    -translate-y-1/2 bg-gradient-to-r from-white/80 via-white/50
                                                    via-21% to-transparent to-92%"></div>
                                    <div className="w-[2px] h-[40px] absolute top-0 left-1/2 -translate-x-1/2
                                                    -translate-y-full bg-gradient-to-t from-white/60
                                                    to-transparent to-80%"></div>
                                    <div className="w-[2px] h-[40px] absolute bottom-0 left-1/2 -translate-x-1/2
                                                    translate-y-full bg-gradient-to-b from-white/60 to-transparent
                                                    to-80%"></div>
                                </div>
                            </div>
                            <div className="relative flex flex-col gap-4 pl-[63px]">
                                <div className={`relative flex p-3 bg-[#04070d] rounded-2xl 
                                                 shadow-[inset_0_2px_1px_0_rgba(207,231,255,0.2)]
                                                 ${index.team_border_shadow} hover:-translate-y-1 transition-all duration-200`}>
                                    <div>
                                        <p className="opacity-50 mb-2 ml-1">12. November 2022</p>

                                        {/* News Title */}
                                        <h3 className="text-[clamp(1.375rem,1.1989rem+.7512vw,1.5rem)] font-semibold">
                                            💖 ~ Unsere Seelsorge für eure Gesundheit!</h3>

                                        {/* News Desc */}
                                        <p className="text-[#969cb1] mb-6 break-words max-w-2xl">
                                            › Wir haben sehr lange darüber nachgedacht und ihr habt es euch gewünscht - wir haben einen Seelsorge Kanal eingerichtet, in welchen ihr (auch anonym) über eure Probleme sprechen könnt.
                                        </p>
                                    </div>

                                    {/* Light Effect on Profile Container */}
                                    <div className="absolute top-0 right-0 w-[437px] h-[306px] pointer-events-none opacity-[0.1] rounded-tr-2xl
                                                    bg-[radial-gradient(50%_50%_at_93.7%_8.1%,#b8c7d980_0%,rgba(4,7,13,0)_100%)]"></div>
                                </div>

                                {/* Decoration for timeline item */}
                                <div className="w-[10px] absolute top-[47%] -left-[4px]">
                                    <div className="aspect-square rounded-full w-full
                                                    bg-[radial-gradient(circle_farthest-corner_at_50%_50%,#fff,#e5e5e5_54%,#a3a3a3)]"></div>
                                    <div className="w-[40px] h-[2px] absolute top-1/2 right-0 translate-x-full
                                                    -translate-y-1/2 bg-gradient-to-r from-white/80 via-white/50
                                                    via-21% to-transparent to-92%"></div>
                                    <div className="w-[2px] h-[40px] absolute top-0 left-1/2 -translate-x-1/2
                                                    -translate-y-full bg-gradient-to-t from-white/60
                                                    to-transparent to-80%"></div>
                                    <div className="w-[2px] h-[40px] absolute bottom-0 left-1/2 -translate-x-1/2
                                                    translate-y-full bg-gradient-to-b from-white/60 to-transparent
                                                    to-80%"></div>
                                </div>
                            </div>
                            <div className="relative flex flex-col gap-4 pl-[63px]">
                                <div className={`relative flex p-3 bg-[#04070d] rounded-2xl 
                                                 shadow-[inset_0_2px_1px_0_rgba(207,231,255,0.2)]
                                                 ${index.team_border_shadow} hover:-translate-y-1 transition-all duration-200`}>
                                    <div>
                                        <p className="opacity-50 mb-2 ml-1">24. Dezember 2022</p>

                                        {/* News Title */}
                                        <h3 className="text-[clamp(1.375rem,1.1989rem+.7512vw,1.5rem)] font-semibold">
                                            🎫 ~ Innovativer Support-Bot für alle!</h3>

                                        {/* News Desc */}
                                        <p className="text-[#969cb1] mb-6 break-words max-w-2xl">
                                            › Mithilfe unseres eigenen Support-Bots sollten Tickets organisiert & leicht zu bearbeiten sein mit vielen nützlichen Informationen (wie eine Team-Erreichbarkeits-Info oder FAQ-Themen)
                                        </p>
                                    </div>

                                    {/* Light Effect on Profile Container */}
                                    <div className="absolute top-0 right-0 w-[437px] h-[306px] pointer-events-none opacity-[0.1] rounded-tr-2xl
                                                    bg-[radial-gradient(50%_50%_at_93.7%_8.1%,#b8c7d980_0%,rgba(4,7,13,0)_100%)]"></div>
                                </div>

                                {/* Decoration for timeline item */}
                                <div className="w-[10px] absolute top-[47%] -left-[4px]">
                                    <div className="aspect-square rounded-full w-full
                                                    bg-[radial-gradient(circle_farthest-corner_at_50%_50%,#fff,#e5e5e5_54%,#a3a3a3)]"></div>
                                    <div className="w-[40px] h-[2px] absolute top-1/2 right-0 translate-x-full
                                                    -translate-y-1/2 bg-gradient-to-r from-white/80 via-white/50
                                                    via-21% to-transparent to-92%"></div>
                                    <div className="w-[2px] h-[40px] absolute top-0 left-1/2 -translate-x-1/2
                                                    -translate-y-full bg-gradient-to-t from-white/60
                                                    to-transparent to-80%"></div>
                                    <div className="w-[2px] h-[40px] absolute bottom-0 left-1/2 -translate-x-1/2
                                                    translate-y-full bg-gradient-to-b from-white/60 to-transparent
                                                    to-80%"></div>
                                </div>
                            </div>
                            <div className="relative flex flex-col gap-4 pl-[63px]">
                                <div className={`relative flex p-3 bg-[#04070d] rounded-2xl 
                                                 shadow-[inset_0_2px_1px_0_rgba(207,231,255,0.2)]
                                                 ${index.team_border_shadow} hover:-translate-y-1 transition-all duration-200`}>
                                    <div>
                                        <p className="opacity-50 mb-2 ml-1">3. Mai 2023</p>

                                        {/* News Title */}
                                        <h3 className="text-[clamp(1.375rem,1.1989rem+.7512vw,1.5rem)] font-semibold">
                                            🧮 ~ Discord-Hilfe ausgebaut & erneuert</h3>

                                        {/* News Desc */}
                                        <p className="text-[#969cb1] mb-6 break-words max-w-2xl">
                                            › Diese sollte Server-Admins dabei helfen einen guten Discord-Server aufzubauen & einzuführen - mithilfe von nützlichen Tutorials & vielen Server-Vorlagen aus der Community!
                                        </p>
                                    </div>

                                    {/* Light Effect on Profile Container */}
                                    <div className="absolute top-0 right-0 w-[437px] h-[306px] pointer-events-none opacity-[0.1] rounded-tr-2xl
                                                    bg-[radial-gradient(50%_50%_at_93.7%_8.1%,#b8c7d980_0%,rgba(4,7,13,0)_100%)]"></div>
                                </div>

                                {/* Decoration for timeline item */}
                                <div className="w-[10px] absolute top-[47%] -left-[4px]">
                                    <div className="aspect-square rounded-full w-full
                                                    bg-[radial-gradient(circle_farthest-corner_at_50%_50%,#fff,#e5e5e5_54%,#a3a3a3)]"></div>
                                    <div className="w-[40px] h-[2px] absolute top-1/2 right-0 translate-x-full
                                                    -translate-y-1/2 bg-gradient-to-r from-white/80 via-white/50
                                                    via-21% to-transparent to-92%"></div>
                                    <div className="w-[2px] h-[40px] absolute top-0 left-1/2 -translate-x-1/2
                                                    -translate-y-full bg-gradient-to-t from-white/60
                                                    to-transparent to-80%"></div>
                                    <div className="w-[2px] h-[40px] absolute bottom-0 left-1/2 -translate-x-1/2
                                                    translate-y-full bg-gradient-to-b from-white/60 to-transparent
                                                    to-80%"></div>
                                </div>
                            </div>
                            <div className="relative flex flex-col gap-4 pl-[63px]">
                                <div className={`relative flex p-3 bg-[#04070d] rounded-2xl 
                                                 shadow-[inset_0_2px_1px_0_rgba(207,231,255,0.2)]
                                                 ${index.team_border_shadow} hover:-translate-y-1 transition-all duration-200`}>
                                    <div>
                                        <p className="opacity-50 mb-2 ml-1">3. September 2023</p>

                                        {/* News Title */}
                                        <h3 className="text-[clamp(1.375rem,1.1989rem+.7512vw,1.5rem)] font-semibold">
                                            🤖 ~ Rebrand: Technik ist nun unser Ding!</h3>

                                        {/* News Desc */}
                                        <p className="text-[#969cb1] mb-6 break-words max-w-2xl">
                                            › Da eigene Webseiten, Discord-Bots & Server-Verwaltung immer mehr zu einem Thema wurde und das Interesse stieg, sind wir zu einem neuen, passenderen Server-Thema gewechselt.
                                        </p>
                                    </div>

                                    {/* Sticker Logo */}
                                    <div className="absolute -top-8 -right-8 w-24 h-24 z-10">
                                        <Image src="/images/brand/logo-96w.webp" width={96} height={96}
                                               alt="Main Logo ~ Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                                               className="w-full h-full object-contain drop-shadow-2xl hover:opacity-100
                                                          hover:scale-110 transition-all duration-300 opacity-80" />
                                    </div>

                                    {/* Light Effect on Profile Container */}
                                    <div className="absolute top-0 right-0 w-[437px] h-[306px] pointer-events-none opacity-[0.1] rounded-tr-2xl
                                                    bg-[radial-gradient(50%_50%_at_93.7%_8.1%,#b8c7d980_0%,rgba(4,7,13,0)_100%)]"></div>
                                </div>

                                {/* Decoration for timeline item */}
                                <div className="w-[10px] absolute top-[47%] -left-[4px]">
                                    <div className="aspect-square rounded-full w-full
                                                    bg-[radial-gradient(circle_farthest-corner_at_50%_50%,#fff,#e5e5e5_54%,#a3a3a3)]"></div>
                                    <div className="w-[40px] h-[2px] absolute top-1/2 right-0 translate-x-full
                                                    -translate-y-1/2 bg-gradient-to-r from-white/80 via-white/50
                                                    via-21% to-transparent to-92%"></div>
                                    <div className="w-[2px] h-[40px] absolute top-0 left-1/2 -translate-x-1/2
                                                    -translate-y-full bg-gradient-to-t from-white/60
                                                    to-transparent to-80%"></div>
                                    <div className="w-[2px] h-[40px] absolute bottom-0 left-1/2 -translate-x-1/2
                                                    translate-y-full bg-gradient-to-b from-white/60 to-transparent
                                                    to-80%"></div>
                                </div>
                            </div>
                            <div className="relative flex flex-col gap-4 pl-[63px]">
                                <div className={`relative flex p-3 bg-[#04070d] rounded-2xl 
                                                 shadow-[inset_0_2px_1px_0_rgba(207,231,255,0.2)]
                                                 ${index.team_border_shadow} hover:-translate-y-1 transition-all duration-200`}>
                                    <div>
                                        <p className="opacity-50 mb-2 ml-1">5. Mai 2024</p>

                                        {/* News Title */}
                                        <h3 className="text-[clamp(1.375rem,1.1989rem+.7512vw,1.5rem)] font-semibold">
                                            🔨 ~ Der neue Coding-Support V2!</h3>

                                        {/* News Desc */}
                                        <p className="text-[#969cb1] mb-6 break-words max-w-2xl">
                                            › Verdient Karma um neue Server-Vorteile freizuschalten, in dem ihr die Programmierfragen von anderen Usern löst - Das System des Kanals ist dabei inspiriert von StackOverflow.
                                        </p>
                                    </div>

                                    {/* Light Effect on Profile Container */}
                                    <div className="absolute top-0 right-0 w-[437px] h-[306px] pointer-events-none opacity-[0.1] rounded-tr-2xl
                                                    bg-[radial-gradient(50%_50%_at_93.7%_8.1%,#b8c7d980_0%,rgba(4,7,13,0)_100%)]"></div>
                                </div>

                                {/* Decoration for timeline item */}
                                <div className="w-[10px] absolute top-[47%] -left-[4px]">
                                    <div className="aspect-square rounded-full w-full
                                                    bg-[radial-gradient(circle_farthest-corner_at_50%_50%,#fff,#e5e5e5_54%,#a3a3a3)]"></div>
                                    <div className="w-[40px] h-[2px] absolute top-1/2 right-0 translate-x-full
                                                    -translate-y-1/2 bg-gradient-to-r from-white/80 via-white/50
                                                    via-21% to-transparent to-92%"></div>
                                    <div className="w-[2px] h-[40px] absolute top-0 left-1/2 -translate-x-1/2
                                                    -translate-y-full bg-gradient-to-t from-white/60
                                                    to-transparent to-80%"></div>
                                    <div className="w-[2px] h-[40px] absolute bottom-0 left-1/2 -translate-x-1/2
                                                    translate-y-full bg-gradient-to-b from-white/60 to-transparent
                                                    to-80%"></div>
                                </div>
                            </div>
                            <div className="relative flex flex-col gap-4 pl-[63px]">
                                <div className={`relative flex p-3 bg-[#04070d] rounded-2xl 
                                                 shadow-[inset_0_2px_1px_0_rgba(207,231,255,0.2)]
                                                 ${index.team_border_shadow} hover:-translate-y-1 transition-all duration-200`}>
                                    <div>
                                        <p className="opacity-50 mb-2 ml-1">9. November 2024</p>

                                        {/* News Title */}
                                        <h3 className="text-[clamp(1.375rem,1.1989rem+.7512vw,1.5rem)] font-semibold">
                                            🔥 ~ Alle Bots in einem: Clank ist öffentlich!</h3>

                                        {/* News Desc */}
                                        <p className="text-[#969cb1] mb-6 break-words max-w-2xl">
                                            › Es hat uns enorm viel Zeit gekostet an die vereinzelten Discord-Bots zu arbeiten, dadurch haben wir alle in einen einzigen gebündelt: Clank erblickt überglücklich das Licht der Welt!
                                        </p>
                                    </div>

                                    {/* Light Effect on Profile Container */}
                                    <div className="absolute top-0 right-0 w-[437px] h-[306px] pointer-events-none opacity-[0.1] rounded-tr-2xl
                                                    bg-[radial-gradient(50%_50%_at_93.7%_8.1%,#b8c7d980_0%,rgba(4,7,13,0)_100%)]"></div>
                                </div>

                                {/* Decoration for timeline item */}
                                <div className="w-[10px] absolute top-[47%] -left-[4px]">
                                    <div className="aspect-square rounded-full w-full
                                                    bg-[radial-gradient(circle_farthest-corner_at_50%_50%,#fff,#e5e5e5_54%,#a3a3a3)]"></div>
                                    <div className="w-[40px] h-[2px] absolute top-1/2 right-0 translate-x-full
                                                    -translate-y-1/2 bg-gradient-to-r from-white/80 via-white/50
                                                    via-21% to-transparent to-92%"></div>
                                    <div className="w-[2px] h-[40px] absolute top-0 left-1/2 -translate-x-1/2
                                                    -translate-y-full bg-gradient-to-t from-white/60
                                                    to-transparent to-80%"></div>
                                    <div className="w-[2px] h-[40px] absolute bottom-0 left-1/2 -translate-x-1/2
                                                    translate-y-full bg-gradient-to-b from-white/60 to-transparent
                                                    to-80%"></div>
                                </div>
                            </div>
                            <div className="relative flex flex-col gap-4 pl-[63px]">
                                <div className={`relative flex p-3 bg-[#04070d] rounded-2xl 
                                                 shadow-[inset_0_2px_1px_0_rgba(207,231,255,0.2)]
                                                 ${index.team_border_shadow} hover:-translate-y-1 transition-all duration-200`}>
                                    <div>
                                        <p className="opacity-50 mb-2 ml-1">14. August 2025</p>

                                        {/* News Title */}
                                        <h3 className="text-[clamp(1.375rem,1.1989rem+.7512vw,1.5rem)] font-semibold">
                                            🚀 ~ Clank erhält ein modernes Dashboard!</h3>

                                        {/* News Desc */}
                                        <p className="text-[#969cb1] mb-6 break-words max-w-2xl">
                                            › Damit Server-Admins nicht umständlich über etliche Slashbefehle den Discord-Bot einrichten müssen, haben wir ein wunderschönes Dashboard für diesen implementiert.
                                        </p>
                                    </div>

                                    {/* Light Effect on Profile Container */}
                                    <div className="absolute top-0 right-0 w-[437px] h-[306px] pointer-events-none opacity-[0.1] rounded-tr-2xl
                                                    bg-[radial-gradient(50%_50%_at_93.7%_8.1%,#b8c7d980_0%,rgba(4,7,13,0)_100%)]"></div>
                                </div>

                                {/* Decoration for timeline item */}
                                <div className="w-[10px] absolute top-[47%] -left-[4px]">
                                    <div className="aspect-square rounded-full w-full
                                                    bg-[radial-gradient(circle_farthest-corner_at_50%_50%,#fff,#e5e5e5_54%,#a3a3a3)]"></div>
                                    <div className="w-[40px] h-[2px] absolute top-1/2 right-0 translate-x-full
                                                    -translate-y-1/2 bg-gradient-to-r from-white/80 via-white/50
                                                    via-21% to-transparent to-92%"></div>
                                    <div className="w-[2px] h-[40px] absolute top-0 left-1/2 -translate-x-1/2
                                                    -translate-y-full bg-gradient-to-t from-white/60
                                                    to-transparent to-80%"></div>
                                    <div className="w-[2px] h-[40px] absolute bottom-0 left-1/2 -translate-x-1/2
                                                    translate-y-full bg-gradient-to-b from-white/60 to-transparent
                                                    to-80%"></div>
                                </div>
                            </div>
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