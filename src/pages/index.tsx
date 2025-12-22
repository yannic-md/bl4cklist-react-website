import Header from "@/components/elements/layout/Header";
import WelcomeHero from "@/components/sections/index/WelcomeHero";
import {JSX} from "react";
import {GetStaticPropsContext} from "next";
import TeamSection from "@/components/sections/index/TeamSection";
import HistorySection from "@/components/sections/index/HistorySection";
import Image from "next/image";
import Footer from "@/components/elements/layout/Footer";
import TestimonialSection from "@/components/sections/TestimonialSection";
import SingleFeatureSection from "@/components/sections/SingleFeatureSection";
import {GuildFeature} from "@/types/GuildFeature";
import {APIStatistics} from "@/types/APIResponse";
import {Member} from "@/types/Member";
import {fetchGuildStatistics, fetchTeamMembers} from "@/lib/api";
import {useTranslations} from "next-intl";
import MetaHead from "@/components/elements/MetaHead";

interface HomeProps {
    messages: any;
    guildStats: APIStatistics | null;
    teamMembers: Member[] | null;
}

/**
 * Renders the home page of the project.
 * Displays a welcome hero section to greet visitors and briefly explain the project.
 *
 * @param {HomeProps} props - Component configuration
 * @param {APIStatistics | null} props.guildStats - The API loaded stats about the guild.
 * @param {Member[] | null} props.teamMembers - The API loaded stats about the team.
 * @returns {JSX.Element} The home page component.
 */
export default function Home({ guildStats, teamMembers }: HomeProps): JSX.Element {
    const tWelcomeHero = useTranslations('WelcomeHero');
    const tSEO = useTranslations('SEO');

    const singleFeatureSub: GuildFeature[][] = [[
        { src: "/images/icons/small/coding-32w.webp", alt: "Programming Icon - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server",
          titleKey: "tip_1_title", descKey: "tip_1_desc", animation: "animate__fadeInLeft animate__slower" },
        { src: "/images/icons/small/heart-32w.webp", alt: "Heart Icon - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server",
          titleKey: "tip_2_title", descKey: "tip_2_desc", animation: "animate__fadeInDown animate__slower" },
        { src: "/images/icons/small/verify-32w.webp", alt: "Bot Icon - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server",
          titleKey: "tip_3_title", descKey: "tip_3_desc", animation: "animate__fadeInRight animate__slower" }],
        [{ src: "/images/icons/small/gift-32w.webp", alt: "Gift Icon - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server",
           titleKey: "tip_4_title", descKey: "tip_4_desc", animation: "animate__fadeInLeft animate__slower" },
         { src: "/images/icons/small/rocket-32w.webp", alt: "Rocket Icon - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server",
           titleKey: "tip_5_title", descKey: "tip_5_desc", animation: "animate__fadeInUp animate__slower" },
         { src: "/images/icons/small/game-32w.webp", alt: "Game Icon - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server",
           titleKey: "tip_6_title", descKey: "tip_6_desc", animation: "animate__fadeInRight animate__slower" }]]

    return (
        <>
            <MetaHead title={tSEO('homeTitle')} description={tWelcomeHero('description')} />

            {/* Header - allow navigation to other pages */}
            <Header />

            {/* Container for sections with transition overlay */}
            <div className="relative">
                {/* Start of the page; greet the visitor & explain our project quick */}
                <WelcomeHero guildStats={guildStats} />

                {/* Container for IntroSection with shadow overlay */}
                <div className="relative">
                    {/* Smooth transition shadow overlay - positioned at the top of IntroSection */}
                    <div className="absolute top-0 left-0 right-0 h-20 z-[2] pointer-events-none
                                    bg-gradient-to-b from-transparent via-gray-950/75 to-transparent 
                                    transform -translate-y-1/2"></div>

                    {/* Short description of our discord-server with some statistics */}
                    <SingleFeatureSection translationNamespace="IntroSection" particlesEnabled={true} planetDecoration="none"
                                          imagePosition="right" ctaEnabled={true} showTopGradients={true}
                                          imageSrc="/images/pixel/guild-banner-508w.webp" guildFeatures={singleFeatureSub}
                                          imageAlt="Pixelart #1 - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                                          sectionId="discord-server-features" titleEmoji="👋🏻" guildStats={guildStats} />

                    {/* Presentation of the server-team */}
                    <TeamSection teamMembers={teamMembers} />

                    {/* History of the server */}
                    <div>
                        {/* Decorational grid image on top of section */}
                        <Image src="/images/bg/grid-2340w.webp" className="absolute grayscale pointer-events-none"
                               width={2340} height={280} sizes="100vw"
                               alt="Grid BG ~ Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server" />

                        <HistorySection />
                    </div>

                    {/* Section for server member reviews */}
                    <TestimonialSection />
                </div>
            </div>

            {/* Footer at the bottom */}
            <Footer />
        </>
    );
}

/**
 * Generates static props for server-side rendering with internationalization support.
 *
 * This function is executed at build time by Next.js to pre-render pages with
 * static data. It dynamically imports locale-specific message files based on
 * the current locale context.
 *
 * @param context - The static props context object from Next.js
 * @param context.locale - The current locale string (e.g., 'en', 'es', 'fr')
 * @returns A promise that resolves to an object containing props for the component
 * @returns returns.props - The props object to be passed to the page component
 * @returns returns.props.messages - The imported locale-specific messages object
 */
export async function getStaticProps({ locale }: GetStaticPropsContext) {
    const [guildStats, teamMembers] = await Promise.all([fetchGuildStatistics(), fetchTeamMembers()]);

    return {
        props: {
            messages: (await import(`../../messages/${locale}.json`)).default,
            guildStats, teamMembers }, revalidate: 300 // regenerate http request cache every 5 minutes
    };
}
