import {JSX, useEffect, useState} from "react";
import {AnimateOnView} from "@/components/animations/AnimateOnView";
import {AnimatedTextReveal} from "@/components/animations/TextReveal";
import index from "@/styles/components/index.module.css";
import colors from "@/styles/util/colors.module.css";
import animations from "@/styles/util/animations.module.css";
import {Testimonial} from "@/types/Testimonial";
import {TestimonialCard} from "@/components/elements/grid/TestimonialCard";
import Image from "next/image";
import {useTranslations} from "next-intl";

{/* TODO: REAL API DATA */}
const TESTIMONIALS: Testimonial[] = [
    {
        userid: "587319452865921024",
        username: "† | Leonie",
        rank: "GELDGEBER (SPONSOR)",
        rank_color: "#a9c9ff",
        avatar_url: "https://cdn.discordapp.com/avatars/587319452865921024/a_1ba1da1ad9a13829d516cec880fe65e6.gif?size=64",
        content: "Bl4cklist bietet einem extrem viele coole Möglichkeiten seine Langeweile los zu werden. Neben einem extrem freundlichen und aktiven Chat, in dem auch jeder willkommen geheißen wird und ins Gespräch aufgenommen wird, gibt es auch immer Leute im Talk zum reden. Zusätzlich bietet der Server noch Minispiele, wie ein Casino, sowie das der Server sehr angenehm gestaltet ist und eine sehr nette Community aufweist. Alles in allem also mein Lieblingsserver, auf dem ich auch gerne sehr viel Zeit verbringe und schon viele Freunde getroffen habe."
    },
    {
        userid: "422480081680728065",
        username: "dodoYui",
        rank: "INGENIEUR (LVL: 15)",
        rank_color: "#34ace0",
        avatar_url: "https://i.imgur.com/8VQjnno.png",
        content: "Ich befinde mich schon seit bald fast einem Jahr auf diesem Discord und kann mich nicht beschweren. Es mangelt nicht an Chat-Aktitivität und es ist immer jemand da, mit dem man schreiben kann. Es gibt regelmäßige Gewinnspiele, Serverevents, Communityevents. Dazu einen schönen Discord-Aufbau mit wunderbarem und gutem Design. Alles in allem ist wirklich mit viel Liebe und Mühe aufgebaut worden. Alle Teammitglieder sind sehr nett, du hast immer Aktivität und ein paar Anregungen, um hier zu schreiben. Einfach nicht lange nachdenken, der Join ist es wert."
    },
    {
        userid: "810579335727677472",
        username: "Black_Wither",
        rank: "WISSENSCHAFTLER (LVL: 50)",
        rank_color: "#ee9d4a",
        avatar_url: "https://cdn.discordapp.com/avatars/810579335727677472/5bbec2f55b63bc2bff74d5e48322550e.png?size=64",
        content: "Bl4cklist ist eine mega Community Server im Deutschen Bereich, sie verfügen über ein qualifiziertes und nettes Team, eine angenehme Atmosphäre, tolle Designs, gute Übersicht und veranstalte regelmäßig Gewinnspiele und Events. Bl4cklist hat nicht nur mit dem Discord Server ein guten Ruf sondern auch deren eigenen öffentlichen Bots, darunter der Gewinnspiel und Partner Bot (Anti Raid Bot)."
    },
    {
        userid: "744222707792478310",
        username: "Kerim 🔥",
        rank: "HACKER (LVL: 75)",
        rank_color: "#ff947a",
        avatar_url: "https://cdn.discordapp.com/avatars/744222707792478310/7d9a9b6ea8c2161e30cbabb91f9efdb8.png?size=64",
        content: "Ich habe Bl4cklist kennengelernt und mich immer besser zurechtgefunden. Seitdem ist dieser Server für mich mit der wichtigste. Es kommen regelmäßig große Updates, coole neue Bots oder interessante Neuerungen. Die Stimmung im Chat ist entspannt und lustig, gleiches gilt für die Sprachkanäle. Das Level-System ist einfach und sehr fair aufgebaut. Ein weiterer sehr wichtiger Punkt ist der Support durch’s Server-Team. Das System mit dem eigenen Support-Bot ist klar und sauber. Die Schnelligkeit des Teams ist jedes mal auf’s neue atemberaubend. Der Umgang mit der Community ist freundlich und professionell, es wird einem mit jedem Problem direkt und schnell weitergeholfen."
    },
    {
        userid: "841827102331240468",
        username: "᧔𐓪᧓ leonie",
        rank: "HACKER (LVL: 75)",
        rank_color: "#ff947a",
        avatar_url: "https://cdn.discordapp.com/avatars/841827102331240468/8d160013bf0eaebe2315a6e0520a2a5b.png?size=64",
        content: "Bl4cklist ist der Server auf dem ich mittlerweile am längsten aktiv bin, daher kann ich den Discord mehr als nur oberflächlich bewerten. Die Athmosphäre auf dem Server ist entspannt und humorvoll. Die sind Voice Channels lustig und vertreiben immer Langeweile. Die vielen Gewinnspiele kommen den Membern auf jeden Fall zu Gute. Die Teamler sind nicht zu streng und gehen meist humorvoll mit den Usern um, greifen aber auch durch wenn es zu Diskriminierungen oder Regelverstößen kommt. Im Großen und Ganzen kann sich jeder auf dem Server wohlfühlen und Leute zum Zocken oder einfach zum reden finden <3"
    },
    {
        userid: "552928153472073760",
        username: "Kalo",
        rank: "WISSENSCHAFTLER (LVL: 50)",
        rank_color: "#ee9d4a",
        avatar_url: "https://cdn.discordapp.com/avatars/552928153472073760/fa50897d3253516e37e4140394d3a6b3.png?size=64",
        content: "Generell hat mich Bl4cklist von Anfang an allein das Channeldesign & die Community sehr angesprochen... Ich habe so viele nette Menschen kennengelernt & mich mit ihnen ausgetauscht/Spaß gehabt. Als ob das nicht genug wäre, gibt es auch mega Vorteile, für die man auf viele anderen Discord Server (die das anbieten) sehr warscheinlich Geld bezahlen müsste. (Discord Bots, Designs etc.) Hier jedoch kann sich das jeder gratis durch schreiben im Chat bzw. durch das Casino erfarmen. Ich sage den ganzen Stuff nicht nur, weil ich im Team bin. Ich hatte auch eine Zeit vor dem Bl4cklist Team als User und schon dort war es nice. Generell sind auch alle Teammitglieder engagiert & stets freundlich und aktiv. Also in der Zusammenfassung: \"Top Server, Top Community, Top Vorteile & Perks und zuletzt ein Top Team"
    },
    {
        userid: "727375263561941055",
        username: "yøbama",
        rank: "GELDGEBER (SPONSOR)",
        rank_color: "#a9c9ff",
        avatar_url: "https://cdn.discordapp.com/avatars/727375263561941055/f2b7f8172564de57b338dd8a287ecdc6.png?size=64",
        content: "Ein hervorragendes Design! Die Verbindungen und Emotes sind passend gewählt worden, und die einen oder anderen Kategorien haben sogar kleine Infos (z.B. Mitglieder-& Onlineanzahl). Die Struktur ist nicht so meins. Es gibt viele unnötige Channels bzw. viele werden nicht mehr aktiv genutzt. Ihr habt echt gute Angebote, das muss man euch lassen. Viele benötigen Hilfe beim Bauen eines Server bzw. ihnen fehlt die Motivation. Aber ihr habt es möglich gemacht. Durch eure Hilfe können sich viele nun besser orientieren und wissen was zu tun ist. Auch eure Automatic-Hilfe (das, wo man ein Symbol senden soll, damit man Hilfe bekommt) ist sehr liebevoll gestaltet. Aber ihr könntet auch ein wenig euer Angebot erweitern. Fazit: Der Server ist schön designt, hat tolle Mitglieder, einen guten Kontakt zu seiner Community, bietet viele Dinge an und ist deshalb einfach nur lobenswert. Macht weiter so, und entwickelt euch weiter!"
    },
    {
        userid: "696395304399929417",
        username: "Brot",
        rank: "WISSENSCHAFTLER (LVL: 50)",
        rank_color: "#ee9d4a",
        avatar_url: "https://cdn.discordapp.com/avatars/696395304399929417/1ec93b3f208fd4d1a75df14adaeb3879.png?size=64",
        content: "Meiner Meinung nach ist Bl4cklist aktuell der beste Deutsche wenn nicht sogar der beste Discord Server der Welt. Und zwar aus folgenden Gründen: Unglaublich große Belohnungen fürs leveln, strukturierte und gute Partnerschaften, Hilfe bei wirklich allen möglichen Problemen, egal ob es Commands von Bots sind oder Einstellungen von Channeln, eine übersichtliche Webside mit eine sehr guten allgemeinen Hilfe, einen übersichtlichen Server mit guten Werbemöglichkeiten, Regelmäßige Giveaways und tollen Events, übersichtliche News die auch wirklich was bringen, eine richtig aktive Community und ein übersichtlicher Support. Insgesamt möchte ich meinen großen Respekt aussprechen an Bl4cklist, denn alles was sie machen ist einfach Perfekt. Ich danke vorallem der Leitung für ihre extrem Professionelle Arbeit!"
    },
    {
        userid: "423074517548531712",
        username: "IcePain",
        rank: "WISSENSCHAFTLER (LVL: 50)",
        rank_color: "#ee9d4a",
        avatar_url: "https://cdn.discordapp.com/avatars/423074517548531712/a_7eb65af607ef4a270e4bc66b58a9365d.gif?size=64",
        content: "Der Server ist übersichtlich strukturiert und wird durch die sehr gut programmierten Bots täglich unterstützt. Bei Fragen und Problemen steht das Support-Team mit Rat und Tat zur Seite. Das eingebaute Casino spielt eine große Rolle im täglichen Alltag und macht sehr viel Spaß. Die Spieleabende sind eine tolle Abwechslung, nicht nur um neue Leute kennenzulernen sondern auch zusammen die Spiele zu entdecken. Der Globaler-Chat lässt einem auch Serverübergreifend Kontakte knüpfen. Im großen und ganzen ist dies ein sehr guter Community-Server, welcher täglich neue echte User zählt."
    },
    {
        userid: "979717048496185416",
        username: "Pierre",
        rank: "DEV-OPS (LVL: 100)",
        rank_color: "#c7ecee",
        avatar_url: "https://cdn.discordapp.com/avatars/979717048496185416/575031b40c8d3468e974885ff0cfdb99.png?size=64",
        content: "Dann war ich auf Bl4cklist, habe geboostet, war ein bisschen im Chat aktiv. Die Events & Gewinnspiele haben immer gute/tolle Preise beinhaltet, und das tun sie jetzt immer noch, dank den Sponsoren, die es immer noch gibt/die dazu kommen. Es gibt viele Leute, die sehr aktiv im Bl4cklist-Chat sind, da sieht man auch, dass sie Bl4cklist unterstützen wollen. Mittlerweile tut sich Yannic auch voll auf die neue Website & Discord Bots konzentrieren, es gibt zwar schon den Gift-Bot, global Chatbot & Security Bot, aber Yannic/das Team möchte den Usern immer mehr Bots bieten, eventuell für ihren eigenen Server, und das ist auch toll, weil die Bots immer coole Funktionen haben. Dann, Das Server-Team ist auch sehr nett und immer schnell da und die global Chat Moderatoren/Admins sind auch immer da, und bearbeiten die Reports direkt, dass der global Chat immer schön sauber ist. Es ist wichtig, dass die Community immer Spaß hat auf diesem Server."
    },
    {
        userid: "765116530899419147",
        username: "KEK",
        rank: "TECHNIKER (LVL: 5)",
        rank_color: "#8499ff",
        avatar_url: "https://cdn.discordapp.com/avatars/765116530899419147/699bea51cec8c30b787365ddceb708c8.png?size=64",
        content: "Ein gut aufgebauter Server mit einem guten Design. Man kann Rollen aussuchen und durch leveln mehr Rollen bekommen. Es gibt auch Gesetze die von den Mods und Admins eingehalten werden. Es werden keine halben Sachen gemacht. Du kannst auch dein Geburtstag eintragen und an deinem Geburtstag ein Geschenk bekommen. Es gibt auch regelmäßige Giveaways und Community Events. Der Server kommuniziert gerne mit seinen Members. Man kann auch ne Partnerschaft mit Blacklist beantragen somit kann man sich selber auch pushen was auch sehr gut ist. Blacklist ist ein schöner Server mit vielen Netten Menschen. Ist sehr zu empfehlen. Das einzige wo man aufpassen muss isrt bei den Regeln des Servers sonst ist es ein guter Server zum chillen."
    },
    {
        userid: "1311718583591768166",
        username: "Felix.",
        rank: "BUG-HUNTER (LVL: 20)",
        rank_color: "#ff793f",
        avatar_url: "https://i.imgur.com/pCK5CIY.png",
        content: "BL4CKLIST ist wirklich ein sehr guter Server. Man hat viele Möglichkeiten, sich zu unterhalten. Das Casino kann man sehe gut benutzen und ist auch ebenfalls gut eingerichtet. Die anderen Unrerhaltungschannel schaue ich mir auch gerne an. Ich bin selber auf dem Server ein Helfer, weswegen ich noch ein besseren Eindruck von ihm gewinnen konnte. Wirklich sehr empfehlenswert, nette Personen usw. Joint gerne, es wird sich lohnen"
    },
    {
        userid: "831222668178489386",
        username: "Lb_1504 ツ",
        rank: "INGENIEUR (LVL: 15)",
        rank_color: "#34ace0",
        avatar_url: "https://cdn.discordapp.com/avatars/831222668178489386/93c48fc7204e70fff8dd54d5b400204c.png?size=64",
        content: "Ich finde das bl4cklist einer der besten Discord Server ist die ich kenne und deswegen hat der Server auch fünf von fünf Sternen verdient. Das Team ist sehr nett. Es gibt viele eigene & vor allem gute Bots. Außerdem ist alles sehr gut erklärt. Es gibt viele interessante Channel z.B. das Casino. Am besten sind allerdings die eigenen öffentlichen Discord Bots. Mehr brauch man eigentlich gar nicht sagen."
    },
    {
        userid: "507492751571550210",
        username: "🧮 ᕁ FINANCE ON DUTY",
        rank: "GELDGEBER (SPONSOR)",
        rank_color: "#a9c9ff",
        avatar_url: "https://cdn.discordapp.com/avatars/507492751571550210/9f02eeaa21130aae332ba5d191412ce1.png?size=64",
        content: "Bin jetzt seit einem Jahr fast auf den Server und würde nie wieder Wechseln wollen, das Team und die Community sind einfach alle si familiär man fühlt sich einfach wohl in den Chats und Talks und kann sich immer prima mit in Gespräche einbinden."
    },
    {
        userid: "530110948984356867",
        username: "its.florent01",
        rank: "INGENIEUR (LVL: 15)",
        rank_color: "#34ace0",
        avatar_url: "https://cdn.discordapp.com/avatars/530110948984356867/fb2962bb156e12fc4626346e334b0b0f.png?size=64",
        content: "Top Community, jeder ist willkommen. Tolle Sachen auf dem Server zu entdecken und ja empfehlenswert. Weiter so, ich drücke euch die Daumen noch größer zu werden."
    },
    {
        userid: "385833844907180033",
        username: "Lecr0x",
        rank: "GELDGEBER (SPONSOR)",
        rank_color: "#a9c9ff",
        avatar_url: "https://cdn.discordapp.com/avatars/385833844907180033/a_2dcae2943ca18e7be1639c0f1b18e47f.gif?size=64",
        content: "Sehr angenehme und Cleane Chat Atmosphäre, Sehr Hilfsbereit und Freundliche Teamler. Als Aktiver Discord Nutzer wirklich Empfehlenswert."
    },
    {
        userid: "119263663621275648",
        username: "Philip",
        rank: "GELDGEBER (SPONSOR)",
        rank_color: "#a9c9ff",
        avatar_url: "https://cdn.discordapp.com/avatars/119263663621275648/e41e5c0fcb1b2442a4e1689223d19c1d.png?size=64",
        content: "Bl4cklist.de ist ein super Server um sich mit Leuten zu unterhalten und für vieles mehr. Dazu machen die auch oft Giveaways.. darunter auch Nitro Giveaways. Das Team ist auch mega nett. Die Vorteile der Rollen sind auch gut."
    },
    {
        userid: "927723500444213308",
        username: "Fabian | D4rkSoulx",
        rank: "GELDGEBER (SPONSOR)",
        rank_color: "#a9c9ff",
        avatar_url: "https://cdn.discordapp.com/guilds/616655040614236160/users/927723500444213308/avatars/93eca5eabbcbdc581756bdd4afbda789.png?size=64",
        content: "Hey! Ich empfehle den Server weiter! Der Server bietet einiges: aktive Chats, Casino usw. Ich bin dort Supporter und es macht echt Spaß im Team zu sein"
    },
    {
        userid: "750718563651944518",
        username: "SkyTigerTV",
        rank: "ENTWICKLER (LVL: 30)",
        rank_color: "#1dd1a1",
        avatar_url: "https://cdn.discordapp.com/avatars/750718563651944518/6b134388a7942e973b13e960d84af27d.png?size=64",
        content: "Hiermit möchte ich das ganze Team loben, da ihr einfach die besten seid. Ihr antwortet immer sehr schnell und ausführlich!"
    },
    {
        userid: "798943533989101589",
        username: "Google 🌀",
        rank: "ARCHITEKT (LVL: 10)",
        rank_color: "#00b33f",
        avatar_url: "https://cdn.discordapp.com/avatars/798943533989101589/d3a2a70bd30957be25b95031a68165c4.webp?size=64",
        content: "Ich mag den Server sehr gerne, Der Aufbau ist inzwischen sehr schön, der Server ist sehr professionell und ich liebe das Casino."
    },
    {
        userid: "506043612782657546",
        username: "Zahid",
        rank: "GELDGEBER (SPONSOR)",
        rank_color: "#a9c9ff",
        avatar_url: "https://cdn.discordapp.com/avatars/506043612782657546/1ad028babb5eaf47b9d68f3f97ab7048.webp?size=64",
        content: "Ich hab schon lange keinen Server mehr gesehen, der so eine nice Community hat "
    },
    {
        userid: "996317701695881237",
        username: "Jack02",
        rank: "HACKER (LVL: 75)",
        rank_color: "#ff947a",
        avatar_url: "https://cdn.discordapp.com/avatars/996317701695881237/68d2045b2bdb02eda9a2ffbd2cb5adb2.webp?size=64",
        content: "bl4cklist ist für mich nicht nur irgendeiin Server, es ist DER Server überhaupt. Die besten Mitgleider, das beste Team, das beste Design, alles dabei. Ob man nur entspannt am Samstag abend bisschen talken will , coden lernen will (couldnt be me) oder einfach nur chaten will, dafür geht man auf bl4cklist. Ich habe hier einige meiner besten Freunde kennengelernt, hatte hier mehr spaß als irgendwo anders und fühle mich hier wohl wie nirgendswo anders. Die Atmosphäre ist so entspannt und gechillt, man wird für (fast) nichts verurteilt und wird nie ausgeschlossen. ich bin froh dass es so einen Ort für diese Community gibt und hoffe auf weitere geile Jahre mit Bl4cklist"
    },
];

/**
 * Shuffles an array using the Fisher-Yates algorithm.
 * Creates a new array with elements in random order without modifying the original array.
 *
 * @template T - The type of elements in the array
 * @param {T[]} array - The array to shuffle
 * @returns {T[]} A new array with the same elements in randomized order
 *
 * @example
 * const numbers = [1, 2, 3, 4, 5];
 * const shuffled = shuffleArray(numbers); // e.g., [3, 1, 5, 2, 4]
 */
function shuffleArray<T>(array: T[]): T[] {
    const shuffled: T[] = [...array];
    for (let i: number = shuffled.length - 1; i > 0; i--) {
        const j: number = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Splits an array into a specified number of roughly equal parts.
 * Distributes elements evenly across subarrays, with earlier parts receiving extra elements if the division is uneven.
 *
 * @template T - The type of elements in the array
 * @param {T[]} array - The array to split
 * @param {number} parts - The number of subarrays to create
 * @returns {T[][]} An array of subarrays, each containing a portion of the original array's elements
 *
 * @example
 * const items = [1, 2, 3, 4, 5];
 * const split = splitArray(items, 2); // [[1, 2, 3], [4, 5]]
 */
function splitArray<T>(array: T[], parts: number): T[][] {
    const result: T[][] = [];
    const itemsPerPart: number = Math.ceil(array.length / parts);

    for (let i: number = 0; i < parts; i++) {
        result.push(array.slice(i * itemsPerPart, (i + 1) * itemsPerPart));
    }

    return result;
}

/**
 * TestimonialSection component that displays community testimonials in a two-column infinite scroll layout.
 * The testimonials are split into two columns that scroll in opposite directions to create a dynamic visual effect.
 *
 * Features:
 * - Two-column layout with infinite scrolling animations
 * - Left column with section description and animated title
 * - Right column with testimonials scrolling up and down
 * - Gradient overlays at top and bottom for smooth visual transitions
 *
 * @returns JSX element containing the complete testimonial section
 */
export default function TestimonialSection(): JSX.Element {
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const [is2XL, setIs2XL] = useState(false);
    const tTestimonial = useTranslations('TestimonialSection');

    const [columns, setColumns] = useState<[Testimonial[], Testimonial[]]>((): [Testimonial[], Testimonial[]] => {
        const [left, right] = splitArray(TESTIMONIALS, 2); // initial state
        return [left, right];
    });

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

    /**
     * Effect hook that shuffles testimonials on component mount.
     *
     * Randomizes the order of all testimonials and distributes them evenly
     * across two columns to create varied layouts on each page load.
     */
    useEffect((): void => {
        const shuffled: Testimonial[] = shuffleArray(TESTIMONIALS);
        const [left, right] = splitArray(shuffled, 2);
        setColumns([left, right]);
    }, []);

    /**
     * Handles the hover state for a testimonial card.
     * Updates the currently hovered card ID and toggles the scrolling animation.
     *
     * When a card is hovered, scrolling pauses for readability; when hover ends, it resumes.
     *
     * @param cardId - The hovered card's ID, or null if no card is hovered.
     */
    const handleCardHover: (cardId: string | null) => void = (cardId: string | null): void => {
        setHoveredCard(cardId);
        setIsPaused(cardId !== null);
    };

    /**
     * Renders a column of testimonial cards with infinite scroll animation.
     * The testimonials are doubled to create a seamless infinite scroll effect.
     *
     * @param testimonials - Array of testimonial objects to display
     * @param direction - Scroll direction: 'up' for upward scrolling, 'down' for downward scrolling
     * @returns JSX element containing the animated testimonial column
     */
    const renderColumn: (testimonials: Testimonial[], direction: 'up' | 'down') => JSX.Element =
        (testimonials: Testimonial[], direction: 'up' | 'down'): JSX.Element => {
            const doubled: Testimonial[] = [...testimonials, ...testimonials];

            return (
                <div className="flex-1 min-w-0 overflow-hidden">
                    <div className={`flex flex-col gap-y-4 md:gap-y-7 ${direction === 'down' ? animations.animate_scroll_column_up :
                                                                                               animations.animate_scroll_column_reverse}`}
                         style={{ animationPlayState: isPaused ? 'paused' : 'running' }}>
                        {doubled.map((testimonial: Testimonial, index: number): JSX.Element => {
                            const cardId: string = `${testimonial.userid}-${index}`;
                            const isCurrentHovered: boolean = hoveredCard === cardId;

                            return (
                                <div key={cardId} className={isCurrentHovered ? 'hovered' : ''}>
                                    <TestimonialCard username={testimonial.username} rank={testimonial.rank}
                                                     rank_color={testimonial.rank_color} avatar_url={testimonial.avatar_url}
                                                     content={testimonial.content} isHovered={isCurrentHovered}
                                                     hoveredCard={hoveredCard} userid={testimonial.userid}
                                                     onHoverChange={(hovered: boolean): void => handleCardHover(hovered ? cardId : null)} />
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        };

    return (
        <section className="relative py-20 bg-black/50" id="discord-server-testimonials">
            {/* Background Image */}
            <div className="absolute inset-0 -z-10">
                <Image src="/images/bg/grid-1920w.webp" fill priority unoptimized sizes="100vw"
                       alt="Grid BG - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                       className="w-full h-full object-cover" />
            </div>

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
                <div className="grid gap-6 md:gap-7 grid-cols-1 lg:grid-cols-[0.65fr_1fr] items-center overflow-hidden">
                    {/* Left column: Section Description */}
                    <div>
                        <div className="mb-2">
                            <div className="font-bold tracking-wider">
                                <AnimateOnView animation="animate__fadeInLeft animate__slower">
                                    <AnimatedTextReveal text={tTestimonial('infoTag')}
                                                        className="text-sm text-[coral] uppercase text-center
                                                                   2xl:text-start pb-3 lg:pb-0"
                                                        shadowColor="rgba(255,127,80,0.35)" />
                                </AnimateOnView>
                            </div>
                        </div>

                        <AnimateOnView animation="animate__fadeInLeft animate__slower">
                            <h2 className={`${is2XL ? index.head_border : index.head_border_center} bg-clip-text 
                                            text-transparent mb-2 text-center 2xl:text-start
                                            ${colors.text_gradient_gray} my-0 font-semibold leading-[1.1] text-[2.25rem] 
                                            md:text-[2.75rem] lg:text-[clamp(1.75rem,_1.3838rem_+_2.6291vw,_3.25rem)]`}>
                                <span className="inline-block align-middle leading-none -mx-[5px]
                                                 -mt-[5px] text-white">💫</span> - {tTestimonial('title')}
                            </h2>
                        </AnimateOnView>

                        <AnimateOnView animation="animate__fadeInRight animate__slower">
                            <p className="text-[#969cb1] pt-6 break-words max-w-lg md:max-w-full xl:max-w-md
                                          text-sm text-start items-center md:text-base mx-auto xl:mx-0">
                                {tTestimonial('description')}
                                <br /><br />
                                {tTestimonial('description2')}
                            </p>
                        </AnimateOnView>
                    </div>

                    {/* Right Column: Grid for Testimonials */}
                    <div className="relative overflow-hidden">
                        <AnimateOnView animation="animate__fadeIn lg:animate__fadeInRight animate__slower">
                            <div className="flex gap-4 md:gap-7 overflow-hidden max-h-[500px] sm:max-h-[580px] md:max-h-[680px]">
                                {renderColumn(columns[0], 'down')}
                                <div className="hidden sm:contents">
                                    {/* Hide second column on smaller devices */}
                                    {renderColumn(columns[1], 'up')}
                                </div>
                            </div>
                        </AnimateOnView>

                        <div className={colors.gradient_top}></div>
                        <div className={colors.gradient_bottom}></div>
                    </div>
                </div>
            </div>

            { /* Bottom border for this section */ }
            <div className="bg-[radial-gradient(50%_50%_at_50%_50%,#d8e7f212_0%,#04070d_100%)] z-10
                            flex-none h-1 absolute bottom-0 left-0 right-0"></div>
        </section>
    );
}
