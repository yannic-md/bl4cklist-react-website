import {GetStaticPropsContext} from "next";
import {JSX} from "react";
import Header from "@/components/elements/layout/Header";
import TestimonialSection from "@/components/sections/TestimonialSection";
import Footer from "@/components/elements/layout/Footer";
import ComHero from "@/components/sections/community-page/ComHero";

export default function Community(): JSX.Element {
    return (
        <>
            {/* Header - allow navigation to other pages */}
            <Header />

            {/* Container for sections with transition overlay */}
            <div className="relative">
                {/* Start of the page; greet the visitor & explain this page */}
                <ComHero />

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
