import '../styles/globals.css'
import type { AppProps } from "next/app";
import {Inter, DM_Sans, IBM_Plex_Sans, JetBrains_Mono} from 'next/font/google'
import {NextFontWithVariable} from "next/dist/compiled/@next/font";

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { NextIntlClientProvider } from 'next-intl';
import {NextRouter, useRouter} from 'next/router';
import PageLoader from "@/components/elements/misc/PageLoader";
import ScrollToTopButton from "@/components/elements/misc/ScrollToTop";
import EasterMenu from "@/components/elements/misc/EasterMenu";
import {JSX, useEffect} from "react";
import {MILESTONES} from "@/data/milestones";
import {isMilestoneUnlocked} from "@/lib/milestones/MilestoneEvents";
import {unlockMilestone} from "@/lib/milestones/MilestoneService";
config.autoAddCss = false

const inter: NextFontWithVariable = Inter({ subsets: ['latin'], variable: '--font-inter' })
const dmSans: NextFontWithVariable = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' })
const plexSans: NextFontWithVariable = IBM_Plex_Sans({ subsets: ['latin'], variable: '--font-ibm-plex-sans' })
const jetbrainsMono: NextFontWithVariable = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' })

export default function App({ Component, pageProps }: AppProps): JSX.Element {
    const router: NextRouter = useRouter();

    /**
     * Adds and removes a hover event listener to elements with the `data-cursor-special` attribute to unlock a milestone.
     *
     * This effect attaches an async `mouseenter` event to all elements matching `[data-cursor-special]`.
     * When hovered, it checks if a specific one is already unlocked and unlocks it if not.
     * The event listeners are cleaned up when the component unmounts or dependencies change.
     */
    useEffect((): () => void => {
        const handleHover: () => Promise<void> = async (): Promise<void> => {
            const alreadyUnlocked: boolean = await isMilestoneUnlocked(MILESTONES.PIXELBUG.id);
            if (!alreadyUnlocked) {
                await unlockMilestone(MILESTONES.PIXELBUG.id, MILESTONES.PIXELBUG.imageKey,
                    (router.locale === "de" || router.locale === "en") ? router.locale : "de");
            }
        };

        const imgs: NodeListOf<HTMLImageElement> = document.querySelectorAll('[data-cursor-special]');
        imgs.forEach(img => img.addEventListener('mouseenter', handleHover));

        return (): void => {
            imgs.forEach(img => img.removeEventListener('mouseenter', handleHover));
        };
    });
    
    return (
        <main className={`${inter.variable} ${dmSans.variable} ${plexSans.variable} ${jetbrainsMono.variable} antialiased`}>
            <PageLoader />

            <NextIntlClientProvider locale={router.locale} timeZone="Europe/Berlin" messages={pageProps.messages}>
                <Component {...pageProps} />

                <EasterMenu />
            </NextIntlClientProvider>

            <ScrollToTopButton />
        </main>
    )
}