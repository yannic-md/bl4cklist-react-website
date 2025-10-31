import {GetStaticPropsContext} from "next";
import {JSX} from "react";
import Header from "@/components/elements/layout/Header";
import Footer from "@/components/elements/layout/Footer";
import CodingHero from "@/components/sections/ coding-page/CodingHero";
import CodingFeatures from "@/components/sections/ coding-page/CodingFeatures";

export default function TechCoding(): JSX.Element {
    return (
        <>
            {/* Header - allow navigation to other pages */}
            <Header />

            {/* Container for sections with transition overlay */}
            <div className="relative">
                {/* Start of the page; greet the visitor & explain our project quick */}
                <CodingHero />

                {/* Explain some important big features related to the coding theme (using bentobox layout) */}
                <CodingFeatures />

                {/* Container for IntroSection with shadow overlay */}
                <div className="bg-transparent h-[100vh]"></div>
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
