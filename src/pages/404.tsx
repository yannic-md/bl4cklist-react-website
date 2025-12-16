import NotFound from "@/components/sections/errors/404-NotFound";
import {JSX} from "react";
import {GetStaticPropsContext} from "next";
import {fetchGuildStatistics} from "@/lib/api";
import {APIStatistics} from "@/types/APIResponse";

interface NotFoundProps {
    guildStats: APIStatistics | null;
}

/**
 * Custom 404 page component.
 *
 * Renders the project's NotFound section when a route is not matched.
 *
 * @param {NotFoundProps} props - Component configuration
 * @param {APIStatistics | null} props.guildStats - The API fetched stats about the guild.
 * @returns {JSX.Element} The NotFound component.
 */
export default function Custom404({ guildStats }: NotFoundProps): JSX.Element {
    return <NotFound guildStats={guildStats} />
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
            messages: (await import(`../../messages/${locale}.json`)).default,
            guildStats }, revalidate: 300 // regenerate http request cache every 5 minutes
    };
}
