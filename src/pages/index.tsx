import Header from "@/components/elements/header/Header";
import WelcomeHero from "@/components/sections/index/WelcomeHero";
import {JSX} from "react";
import {GetStaticPropsContext} from "next";
import IntroSection from "@/components/sections/index/IntroSection";
import TeamSection from "@/components/sections/index/TeamSection";

/**
 * Renders the home page of the project.
 * Displays a welcome hero section to greet visitors and briefly explain the project.
 *
 * @returns {JSX.Element} The home page component.
 */
export default function Home(): JSX.Element {
    return (
        <>
            {/* Header - allow navigation to other pages */}
            <Header />

            {/* Container for sections with transition overlay */}
            <div className="relative">
                {/* Start of the page; greet the visitor & explain our project quick */}
                <WelcomeHero />

                {/* Container for IntroSection with shadow overlay */}
                <div className="relative">
                    {/* Smooth transition shadow overlay - positioned at the top of IntroSection */}
                    <div className="absolute top-0 left-0 right-0 h-20 z-[2] pointer-events-none
                                    bg-gradient-to-b from-transparent via-gray-950/75 to-transparent 
                                    transform -translate-y-1/2"></div>

                    {/* Short description of our discord-server with some statistics */}
                    <IntroSection />

                    {/* Presentation of the server-team */}
                    <TeamSection />

                </div>
            </div>

            {/* Testing purposes*/}
            <div className="h-[100vh]"></div>
            
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
            messages: (await import(`../../messages/${locale}.json`)).default,
        },
    };
}
