import {JSX, useState} from "react";
import Header from "@/components/elements/layout/Header";
import Footer from "@/components/elements/layout/Footer";
import {GetStaticPropsContext} from "next";
import ContactHero from "@/components/sections/imprint/ContactHero";
import ContactFormSection from "@/components/sections/imprint/ContactFormSection";
import Image from "next/image";
import MetaHead from "@/components/elements/MetaHead";
import {useTranslations} from "next-intl";

export type FormType = 'unban' | 'general' | null;

/**
 * Contact page component that composes Header, ContactHero and Footer.
 * Renders the main contact section and a tall spacer section for layout/visual separation.
 *
 * @returns {JSX.Element} The rendered Contact page element.
 */
export default function Contact(): JSX.Element {
    const [selectedForm, setSelectedForm] = useState<FormType>(null);
    const tSEO = useTranslations('SEO');
    const tContactHero = useTranslations('ContactHero')

    /**
     * Handles the selection of a contact form type and scrolls to the form section.
     * The form element uses a "special" ID to help prevent automated spam bot detection.
     *
     * @param {FormType} formType - The type of contact form to display ('unban', 'general', or null)
     */
    const handleFormSelect: (formType: FormType) => void = (formType: FormType): void => {
        if (selectedForm === formType) { return setSelectedForm(null); }
        setSelectedForm(formType);
        document.getElementById('really-cool-thing')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            <MetaHead title={tSEO('contactTitle')} description={tContactHero('description')} />

            {/* Header - allow navigation to other pages */}
            <Header />

            {/* Container for sections with transition overlay */}
            <div className="relative">
                {/* Start of the page; greet the visitor & explain our project quick */}
                <ContactHero onFormSelect={handleFormSelect} />

                <div>
                    {/* Decorational grid image on top of section */}
                    <Image src="/images/bg/grid-1916w.avif" className="absolute grayscale pointer-events-none brightness-125"
                           width={2340} height={280} sizes="100vw" priority loading={"eager"} fetchPriority={"high"}
                           alt="Grid BG ~ Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server" />

                    {/* Dynamic form section for picked topic */}
                    <ContactFormSection selectedForm={selectedForm} />
                </div>
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
