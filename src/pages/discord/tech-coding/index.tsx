import {GetStaticPropsContext} from "next";
import {JSX} from "react";
import Header from "@/components/elements/layout/Header";
import Footer from "@/components/elements/layout/Footer";
import CodingHero from "@/components/sections/coding-page/CodingHero";
import CodingFeatures from "@/components/sections/coding-page/CodingFeatures";
import CodingFAQ from "@/components/sections/coding-page/CodingFAQ";
import TestimonialSection from "@/components/sections/TestimonialSection";
import {fetchGuildStatistics} from "@/lib/api";
import {APIStatistics} from "@/types/APIResponse";
import MetaHead from "@/components/elements/MetaHead";
import {useTranslations} from "next-intl";

interface TechCodingProps {
    guildStats: APIStatistics | null;
}

/**
 * Renders the Tech Coding landing page for the discord guild.
 *
 * @param {HomeProps} props - Component configuration
 * @param {APIStatistics | null} props.guildStats - The API loaded stats about the guild.
 * @returns {JSX.Element} The tech-coding page component.
 */
export default function TechCoding({ guildStats }: TechCodingProps): JSX.Element {
    const tCodingHero = useTranslations('CodingHero');

    return (
        <>
            <MetaHead title='Hardware & Coding' description={tCodingHero('description')} />

            {/* Header - allow navigation to other pages */}
            <Header />

            {/* Container for sections with transition overlay */}
            <div className="relative">
                {/* Start of the page; greet the visitor & explain our project quick */}
                <CodingHero guildStats={guildStats} />

                {/* Explain some important big features related to the coding theme (using bentobox layout) */}
                <CodingFeatures />

                {/* Answer most relevant questions related to Coding and display some small features */}
                <CodingFAQ />

                {/* Section for server member reviews */}
                <TestimonialSection position="right" />
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
