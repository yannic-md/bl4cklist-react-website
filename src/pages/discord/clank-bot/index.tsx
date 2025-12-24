import {GetStaticPropsContext} from "next";
import {JSX} from "react";
import Header from "@/components/elements/layout/Header";
import TestimonialSection from "@/components/sections/TestimonialSection";
import Footer from "@/components/elements/layout/Footer";
import ClankHero from "@/components/sections/clank-page/ClankHero";
import SingleFeatureSection from "@/components/sections/SingleFeatureSection";
import {
    giveaway_module_features,
    globalchat_module_features,
    security_module_features,
    support_module_features
} from "@/types/ClankBotFeatures";
import {APIStatistics} from "@/types/APIResponse";
import {fetchGuildStatistics} from "@/lib/api";
import MetaHead from "@/components/elements/MetaHead";
import {useTranslations} from "next-intl";

interface ClankBotProps {
    guildStats: APIStatistics | null;
}

/**
 * Renders the Clank Bot landing page with header, hero content,
 * testimonials and footer as a static React component.
 *
 * This page is statically generated via `getStaticProps` and does not
 * accept any runtime props.
 *
 * @param {HomeProps} props - Component configuration
 * @param {APIStatistics | null} props.guildStats - The API loaded stats about the guild.
 * @returns {JSX.Element} The clank-bot page component.
 */
export default function ClankBot({ guildStats }: ClankBotProps): JSX.Element {
    const tClankHero = useTranslations('ClankHero')

    // fallback for SSR
    const ticketsCount: number = guildStats?.tickets_count ?? 1919;
    const ticketsOpenCount: number = guildStats?.tickets_open_count ?? 94;
    const ticketsClaimedCount: number = guildStats?.tickets_claimed_count ?? 13;
    const giveawaysCount: number = guildStats?.giveaways_count ?? 993;
    const giveawaysScheduledCount: number = guildStats?.giveaways_scheduled_count ?? 16;
    const giveawaysActiveCount: number = guildStats?.giveaways_active_count ?? 5;
    const backupCount: number = guildStats?.backup_count ?? 34;
    const logCount: number = guildStats?.log_count ?? 63;
    const globalMessageCount: number = guildStats?.global_message_count ?? 5893487;
    const globalUsersCount: number = guildStats?.global_users_count ?? 17272;
    const globalChatsCount: number = guildStats?.global_chats_count ?? 324;

    return (
        <>
            <MetaHead title="Clank Discord-Bot" description={tClankHero('description')} />

            {/* Header - allow navigation to other pages */}
            <Header />

            {/* Container for sections with transition overlay */}
            <div className="relative">
                {/* Hero section of this page */}
                <ClankHero />

                {/* Bot feature sections */}
                <SingleFeatureSection translationNamespace="ClankSupportSection" particlesEnabled={false} ctaEnabled={false}
                                      imagePosition="right" imageSrc="/images/bg/support-bot-preview-600w.webp" titleEmoji="🚔"
                                      guildFeatures={support_module_features} sectionId="ticket-tool" planetDecoration={1}
                                      imageAlt="Discord Support Bot - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                                      customStatistics={[{ end: ticketsCount, suffix: '+', icon: '🎟️', label: 'ticketsEnded' },
                                                         { end: ticketsOpenCount, suffix: '+', icon: '📡', label: 'ticketsStarted' },
                                                         { end: ticketsClaimedCount, suffix: '+', icon: '📝', label: 'ticketsActive' }]} />
                <SingleFeatureSection translationNamespace="ClankGiveawaysSection" particlesEnabled={false} ctaEnabled={false}
                                      imagePosition="left" imageSrc="/images/bg/giveaway-bot-preview-508w.webp" titleEmoji="🎁"
                                      guildFeatures={giveaway_module_features} sectionId="giveaways" planetDecoration={2}
                                      imageAlt="Discord Giveaway Bot - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                                      customStatistics={[{ end: giveawaysCount, suffix: '+', icon: '🎁', label: 'giveawaysEnded' },
                                                         { end: giveawaysScheduledCount, suffix: '+', icon: '⏰', label: 'giveawaysPlanned' },
                                                         { end: giveawaysActiveCount, suffix: '+', icon: '🎀', label: 'giveawaysActive' }]} />
                <SingleFeatureSection translationNamespace="ClankSecuritySection" particlesEnabled={false} ctaEnabled={false}
                                      imagePosition="right" imageSrc="/images/bg/security-bot-preview-600w.webp" titleEmoji="🚨"
                                      guildFeatures={security_module_features} sectionId="security" planetDecoration={3}
                                      imageAlt="Discord Security Bot - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                                      customStatistics={[{ end: backupCount, suffix: '+', icon: '📂', label: 'securityBackups' },
                                                         { end: logCount, suffix: '+', icon: '📚', label: 'securityLog' },
                                                         { end: 10, suffix: '+', icon: '🤖', label: 'securityAutoMod' }]} />
                <SingleFeatureSection translationNamespace="ClankGlobalSection" particlesEnabled={false} ctaEnabled={false}
                                      imagePosition="left" imageSrc="/images/bg/global-chat-preview-546w.webp" titleEmoji="🌍"
                                      guildFeatures={globalchat_module_features} sectionId="global-chat" planetDecoration={4}
                                      imageAlt="Discord Global-Chat Bot - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                                      customStatistics={[{ end: globalMessageCount, suffix: '+', icon: '💬', label: 'globalMessages' },
                                                         { end: globalUsersCount, suffix: '+', icon: '👥', label: 'globalUsers' },
                                                         { end: globalChatsCount, suffix: '+', icon: '📡', label: 'globalActive' }]} />

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
    const [guildStats] = await Promise.all([fetchGuildStatistics()]);

    return {
        props: {
            messages: (await import(`../../../../messages/${locale}.json`)).default,
            guildStats }, revalidate: 3600 // regenerate http request cache every 5 minutes
    };
}
