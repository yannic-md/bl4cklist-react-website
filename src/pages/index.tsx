import Header from "@/components/elements/header/Header";
import WelcomeHero from "@/components/sections/index/WelcomeHero";
import {JSX} from "react";
import {GetStaticPropsContext} from "next";

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

            {/* Start of the page; greet the visitor & explain our project quick */}
            <WelcomeHero />

            {/* Testing purposes*/}
            <div className="h-[200vh]"></div>
            
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