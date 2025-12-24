import {GetStaticPropsContext} from "next";
import {JSX, useEffect, useState} from "react";
import Header from "@/components/elements/layout/Header";
import TestimonialSection from "@/components/sections/TestimonialSection";
import Footer from "@/components/elements/layout/Footer";
import ComHero from "@/components/sections/community-page/ComHero";
import MemberList from "@/components/sections/community-page/MemberList";
import {Member, oldBots} from "@/types/Member";
import {fetchCommunityMembers, fetchGuildStatistics} from "@/lib/api";
import {APICommunity, APIStatistics} from "@/types/APIResponse";
import {useTranslations} from "next-intl";
import MetaHead from "@/components/elements/MetaHead";

interface CommunityProps {
    guildStats: APIStatistics | null;
    apiMembers: APICommunity | null;
}

/**
 * Renders the community overview page with multiple member sections and testimonials.
 *
 * Uses temporary mock data for different member categories (birthdays, ranked users,
 * level users, and former staff) and passes them to the corresponding layout sections.
 *
 * @param {HomeProps} props - Component configuration
 * @param {APIStatistics | null} props.guildStats - The API loaded stats about the guild.
 * @param {APICommunity | null} props.apiMembers - The API loaded stats about the community members.
 * @returns {JSX.Element} The community page component.
 */
export default function Community({ guildStats, apiMembers }: CommunityProps): JSX.Element {
    const [former_staff, setFormerStaffList] = useState<Member[]>([]);
    const tComHero = useTranslations('ComHero');

    // fetched Team member data (or fallback)
    const fallbackMember: Member =
        {user_name: 'Clank#0510', user_display_name: 'Clank', rank: 'LEITUNG', user_id: '775415193760169995', social_media_url: null,
        user_avatar_url: 'https://cdn.discordapp.com/avatars/775415193760169995/731f153c04c2dc5b3f6335382c7206ba.png?size=128'};

    const birthday_users: Member[] = apiMembers?.birthday ?? [{ ...fallbackMember, rank: "BIRTHDAY" }];
    const ranked_users: Member[] = apiMembers?.supporters ?? [{ ...fallbackMember, rank: "SPONSOR" }];
    const level_users: Member[] = apiMembers?.levels ?? [{ ...fallbackMember, rank: "LVL125" }];

    /**
     * Insert a random legacy bot into the former staff list.
     *
     * This effect injects a randomly selected dead bot member (from `oldBots`) into a
     * copy of `base_former_staff` at a random position and updates component state.
     * It runs whenever the `apiMembers?.former` array identity changes.
     */
    useEffect((): void => {
        const base: Member[] = apiMembers?.former ?? [{ ...fallbackMember, rank: "EHEM_LEITUNG" }];
        if (base.length === 0) { return setFormerStaffList(base); }

        const randomGhost: Member = oldBots[Math.floor(Math.random() * oldBots.length)];
        const randomPosition: number = Math.floor(Math.random() * (base.length + 1));

        const listWithGhost: Member[] = [...base];
        listWithGhost.splice(randomPosition, 0, randomGhost);

        setFormerStaffList(listWithGhost);
    }, [apiMembers?.former]);

    return (
        <>
            <MetaHead title='Community' description={tComHero('description')} />

            {/* Header - allow navigation to other pages */}
            <Header />

            {/* Container for sections with transition overlay */}
            <div className="relative">
                {/* Start of the page; greet the visitor & explain this page */}
                <ComHero guildStats={guildStats} />

                {/* Member List sections */}
                <MemberList members={birthday_users} section_id="birthdays" category="Birthday" />
                <MemberList members={ranked_users} section_id="leaders" category="Leaders" position="left" planetVariant={2} />
                <MemberList members={level_users} section_id="levels" category="Levels" planetVariant={3} />
                <MemberList members={former_staff} section_id="staff" category="Staff" position="left" planetVariant={4} />

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
    const [guildStats, apiMembers] = await Promise.all([fetchGuildStatistics(), fetchCommunityMembers()]);

    return {
        props: {
            messages: (await import(`../../../../messages/${locale}.json`)).default,
            guildStats, apiMembers }, revalidate: 3600 // regenerate http request cache every 5 minutes
    };
}
