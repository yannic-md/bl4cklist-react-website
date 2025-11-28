import {GetStaticPropsContext} from "next";
import {JSX} from "react";
import Header from "@/components/elements/layout/Header";
import TestimonialSection from "@/components/sections/TestimonialSection";
import Footer from "@/components/elements/layout/Footer";
import ComHero from "@/components/sections/community-page/ComHero";
import MemberList from "@/components/sections/community-page/MemberList";
import {Member} from "@/types/Member";

export default function Community(): JSX.Element {
    const birthday_users: Member[] = [
        {username: "luna.sky", display_name: "Luna Skylar", rank: "BIRTHDAY", user_id: "284617239018",
         avatar_url: "https://cdn.discordapp.com/avatars/1018150165489668227/7a539208b433b1ee0e4dcccffcf73a2a.png?size=1024"},
        {username: "neo.matrix", display_name: "Leon Kramer", rank: "BIRTHDAY", user_id: "593847201945",
         avatar_url: "https://cdn.discordapp.com/avatars/327176944640720906/a_c261a382dc3b0ebe95d6304eb452c854.gif?size=128"},
        {username: "pixie.coder", display_name: "Emily Rhodes", rank: "BIRTHDAY", user_id: "901273648512",
         avatar_url: "https://cdn.discordapp.com/avatars/981918775651745832/4ef47e4b6c4bcb1f0d23ec0ec2112109.png?size=1024"},
        {username: "shadowbyte", display_name: "Noah Fischer", rank: "BIRTHDAY", user_id: "732849105627",
         avatar_url: "https://cdn.discordapp.com/avatars/941998396934340619/a_8ff9c5ac2c403d5b9927f90837b36658.gf?size=1024"},
        {username: "nova.chan", display_name: "Sofia Hartmann", rank: "BIRTHDAY", user_id: "457201938746",
         avatar_url: "https://cdn.discordapp.com/guilds/616655040614236160/users/806086469268668437/avatars/a_25e1338be5c8a0c953b18c94ec92b91c.gif?size=1024"},
        {username: "bytewizard", display_name: "Jonas Weber", rank: "BIRTHDAY", user_id: "620194857320",
         avatar_url: "https://cdn.discordapp.com/guilds/616655040614236160/users/880436867357622292/avatars/a_6944984ee59435315ce7184411485cd9.gif?size=1024"},
        {username: "aris.dev", display_name: "Aris Müller", rank: "BIRTHDAY", user_id: "519384720196",
         avatar_url: "https://cdn.discordapp.com/avatars/339254240012664832/0cfec781df368dbce990d440d075a2d7.png?size=1024"},
        {username: "celeste.codes", display_name: "Celeste Wagner", rank: "BIRTHDAY", user_id: "874520139468",
         avatar_url: "https://cdn.discordapp.com/avatars/1116303639728889857/56020f7cc7736d8657032d07e13f76ac.png?size=1024"},
        {username: "orbit.ray", display_name: "Ray Schneider", rank: "BIRTHDAY", user_id: "395720184963",
         avatar_url: "https://cdn.discordapp.com/avatars/981918775651745832/4ef47e4b6c4bcb1f0d23ec0ec2112109.png?size=1024"},
        {username: "emberline", display_name: "Mara Schulz", rank: "BIRTHDAY", user_id: "608271945320",
         avatar_url: "https://cdn.discordapp.com/avatars/941998396934340619/a_8ff9c5ac2c403d5b9927f90837b36658.gif?size=1024"},
        {username: "zenith.x", display_name: "Felix Brandt", rank: "BIRTHDAY", user_id: "719203845617",
         avatar_url: "https://cdn.discordapp.com/avatars/339254240012664832/0cfec781df368dbce990d440d075a2d7.png?size=1024"},
    ];

    return (
        <>
            {/* Header - allow navigation to other pages */}
            <Header />

            {/* Container for sections with transition overlay */}
            <div className="relative">
                {/* Start of the page; greet the visitor & explain this page */}
                <ComHero />

                {/* Member List sections */}
                <MemberList members={birthday_users} />

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
