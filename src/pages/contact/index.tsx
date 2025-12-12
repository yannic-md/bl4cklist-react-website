import {JSX} from "react";
import Header from "@/components/elements/layout/Header";
import Footer from "@/components/elements/layout/Footer";
import {GetStaticPropsContext} from "next";
import ContactHero from "@/components/sections/imprint/ContactHero";

/**
 * Contact page component that composes Header, ContactHero and Footer.
 * Renders the main contact section and a tall spacer section for layout/visual separation.
 *
 * @returns {JSX.Element} The rendered Contact page element.
 */
export default function Contact(): JSX.Element {

    return (
        <>
            {/* Header - allow navigation to other pages */}
            <Header />

            {/* Container for sections with transition overlay */}
            <div className="relative">
                {/* Start of the page; greet the visitor & explain our project quick */}
                <ContactHero />

                <div className="h-[90vh] bg-black"></div>
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
            messages: (await import(`../../../messages/${locale}.json`)).default,
        },
    };
}
