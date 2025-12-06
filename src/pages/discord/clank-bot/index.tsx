import {GetStaticPropsContext} from "next";
import {JSX} from "react";
import Header from "@/components/elements/layout/Header";
import TestimonialSection from "@/components/sections/TestimonialSection";
import Footer from "@/components/elements/layout/Footer";
import ClankHero from "@/components/sections/clank-page/ClankHero";
import SingleFeatureSection from "@/components/sections/SingleFeatureSection";
import {GuildFeature} from "@/types/GuildFeature";

/**
 * Renders the Clank Bot landing page with header, hero content,
 * testimonials and footer as a static React component.
 *
 * This page is statically generated via `getStaticProps` and does not
 * accept any runtime props.
 *
 * @returns JSX element representing the Clank Bot page layout.
 */
export default function ClankBot(): JSX.Element {
    const giveaway_module_features: GuildFeature[][] = [[
        { src: "/images/icons/small/lightning-32w.webp", alt: "Lightning Icon - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server",
          titleKey: "tip_1_title", descKey: "tip_1_desc", animation: "animate__fadeInLeft animate__slower" },
        { src: "/images/icons/small/timer-32w.webp", alt: "Timer Icon - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server",
          titleKey: "tip_2_title", descKey: "tip_2_desc", animation: "animate__fadeInDown animate__slower" },
        { src: "/images/icons/small/color-palette-32w.webp", alt: "Color Palette Icon - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server",
          titleKey: "tip_3_title", descKey: "tip_3_desc", animation: "animate__fadeInRight animate__slower" }],
       [{ src: "/images/icons/small/chart-32w.webp", alt: "Chart Icon - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server",
          titleKey: "tip_4_title", descKey: "tip_4_desc", animation: "animate__fadeInLeft animate__slower" },
        { src: "/images/icons/small/confetti-32w.webp", alt: "Confetti Icon - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server",
          titleKey: "tip_5_title", descKey: "tip_5_desc", animation: "animate__fadeInUp animate__slower" },
        { src: "/images/icons/small/note-32w.webp", alt: "Note Icon - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server",
          titleKey: "tip_6_title", descKey: "tip_6_desc", animation: "animate__fadeInRight animate__slower" }]]
    const support_module_features: GuildFeature[][] = [[
        { src: "/images/icons/small/info-32w.webp", alt: "Info Icon - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server",
          titleKey: "tip_1_title", descKey: "tip_1_desc", animation: "animate__fadeInLeft animate__slower" },
        { src: "/images/icons/small/battery-32w.webp", alt: "Battery Icon - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server",
          titleKey: "tip_2_title", descKey: "tip_2_desc", animation: "animate__fadeInDown animate__slower" },
        { src: "/images/icons/small/button-32w.webp", alt: "Button Icon - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server",
          titleKey: "tip_3_title", descKey: "tip_3_desc", animation: "animate__fadeInRight animate__slower" }],
        [{ src: "/images/icons/small/medal-32w.webp", alt: "Medal Icon - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server",
           titleKey: "tip_4_title", descKey: "tip_4_desc", animation: "animate__fadeInLeft animate__slower" },
         { src: "/images/icons/small/sleep-32w.webp", alt: "Sleep Icon - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server",
           titleKey: "tip_5_title", descKey: "tip_5_desc", animation: "animate__fadeInUp animate__slower" },
         { src: "/images/icons/small/headset-32w.webp", alt: "Headset Icon - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server",
           titleKey: "tip_6_title", descKey: "tip_6_desc", animation: "animate__fadeInRight animate__slower" }]]
    const security_module_features: GuildFeature[][] = [[
        { src: "/images/icons/small/siren-32w.webp", alt: "Siren Icon - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server",
          titleKey: "tip_1_title", descKey: "tip_1_desc", animation: "animate__fadeInLeft animate__slower" },
        { src: "/images/icons/small/letter-32w.webp", alt: "Letter Icon - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server",
          titleKey: "tip_2_title", descKey: "tip_2_desc", animation: "animate__fadeInDown animate__slower" },
        { src: "/images/icons/small/books-32w.webp", alt: "Books Icon - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server",
          titleKey: "tip_3_title", descKey: "tip_3_desc", animation: "animate__fadeInRight animate__slower" }],
        [{ src: "/images/icons/small/verify-32w.webp", alt: "Verify Icon - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server",
           titleKey: "tip_4_title", descKey: "tip_4_desc", animation: "animate__fadeInLeft animate__slower" },
         { src: "/images/icons/small/police-32w.webp", alt: "Police Icon - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server",
           titleKey: "tip_5_title", descKey: "tip_5_desc", animation: "animate__fadeInUp animate__slower" },
         { src: "/images/icons/small/server-32w.webp", alt: "Server Icon - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server",
           titleKey: "tip_6_title", descKey: "tip_6_desc", animation: "animate__fadeInRight animate__slower" }]]

    return (
        <>
            {/* Header - allow navigation to other pages */}
            <Header />

            {/* Container for sections with transition overlay */}
            <div className="relative">
                {/* Hero section of this page */}
                <ClankHero />

                {/* Bot feature sections TODO: real data */}
                <SingleFeatureSection translationNamespace="ClankSupportSection" particlesEnabled={false} ctaEnabled={false}
                                      imagePosition="right" imageSrc="/images/bg/support-bot-preview-600w.webp" titleEmoji="🚔"
                                      guildFeatures={support_module_features} sectionId="ticket-tool" planetDecoration={1}
                                      imageAlt="Discord Support Bot - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                                      customStatistics={[{ end: 1919, suffix: '+', icon: '🎟️', label: 'ticketsEnded' },
                                          { end: 94, suffix: '+', icon: '📡', label: 'ticketsStarted' },
                                          { end: 13, suffix: '+', icon: '📝', label: 'ticketsActive' }]} />
                <SingleFeatureSection translationNamespace="ClankGiveawaysSection" particlesEnabled={false} ctaEnabled={false}
                                      imagePosition="left" imageSrc="/images/bg/giveaway-bot-preview-508w.webp" titleEmoji="🎁"
                                      guildFeatures={giveaway_module_features} sectionId="giveaways" planetDecoration={2}
                                      imageAlt="Discord Giveaway Bot - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                                      customStatistics={[{ end: 993, suffix: '+', icon: '🎁', label: 'giveawaysEnded' },
                                                         { end: 16, suffix: '+', icon: '⏰', label: 'giveawaysPlanned' },
                                                         { end: 5, suffix: '+', icon: '🎀', label: 'giveawaysActive' }]} />
                <SingleFeatureSection translationNamespace="ClankSecuritySection" particlesEnabled={false} ctaEnabled={false}
                                      imagePosition="right" imageSrc="/images/bg/security-bot-preview-600w.webp" titleEmoji="🚨"
                                      guildFeatures={security_module_features} sectionId="security" planetDecoration={3}
                                      imageAlt="Discord Security Bot - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                                      customStatistics={[{ end: 634, suffix: '+', icon: '🛑', label: 'securityPunished' },
                                                         { end: 34, suffix: '+', icon: '📚', label: 'securityLog' },
                                                         { end: 10, suffix: '+', icon: '🤖', label: 'securityAutoMod' }]} />

                {/* Section for server member reviews */}
                <TestimonialSection />
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
    return {
        props: {
            messages: (await import(`../../../../messages/${locale}.json`)).default,
        },
    };
}
