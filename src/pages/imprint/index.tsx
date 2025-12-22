import {JSX} from "react";
import Header from "@/components/elements/layout/Header";
import Footer from "@/components/elements/layout/Footer";
import {GetStaticPropsContext} from "next";
import ImprintSection from "@/components/sections/imprint/ImprintSection";
import {ParticlesBackground} from "@/components/animations/ParticlesBackground";
import MetaHead from "@/components/elements/MetaHead";
import {useTranslations} from "next-intl";

/**
 * Imprint page component that composes a site "header" and the imprint section.
 *
 * It includes a decorative particles background on large screens and wraps the main
 * content in a relative container to support overlay transitions and consistent layout.
 *
 * @return {JSX.Element} The rendered Imprint page element tree.
 */
export default function Imprint(): JSX.Element {
    const tSEO = useTranslations("SEO")

    return (
        <>
            <MetaHead title={tSEO('imprintTitle')} description="Auf dieser Seite findest du alle gesetzlich vorgeschriebenen Angaben zu unseren Diensten sowie umfassende Informationen zum Schutz deiner personenbezogenen Daten. Du erhältst transparente Einblicke in die verantwortliche Stelle, Kontaktmöglichkeiten, rechtliche Hinweise sowie Details zu verwendeten Cookies und Drittanbieter-Diensten. Darüber hinaus erläutert die Datenschutzerklärung, welche Daten erfasst werden, zu welchem Zweck dies geschieht und welche Rechte dir als Nutzer zustehen." />

            {/* Header - allow navigation to other pages */}
            <Header />

            {/* Container for sections with transition overlay */}
            <div className="relative">
                {/* some decoration for the page */}
                <ParticlesBackground className="z-0 animate__animated animate__fadeIn animate__slower hidden xl:block" />

                <ImprintSection />
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
