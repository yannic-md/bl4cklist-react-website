import NotFound from "@/components/sections/errors/404-NotFound";
import {JSX} from "react";
import {GetStaticPropsContext} from "next";

/**
 * Custom 404 page component.
 *
 * Renders the project's NotFound section when a route is not matched.
 *
 * @returns {JSX.Element} The NotFound component.
 */
export default function Custom404(): JSX.Element {
    return <NotFound />
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
