import '../styles/globals.css'
import type { AppProps } from "next/app";
import {Inter, DM_Sans, IBM_Plex_Sans, JetBrains_Mono} from 'next/font/google'
import {NextFontWithVariable} from "next/dist/compiled/@next/font";

import { NextIntlClientProvider } from 'next-intl';
import {NextRouter, useRouter} from 'next/router';
import ScrollToTopButton from "@/components/elements/misc/ScrollToTop";
import {JSX, lazy, Suspense, useEffect} from "react";
import {MILESTONES} from "@/data/milestones";
import {isMilestoneUnlocked} from "@/lib/milestones/MilestoneEvents";
import {unlockMilestone} from "@/lib/milestones/MilestoneService";
import {useKonamiCode} from "@/hooks/useKonamiCode";
import Script from "next/dist/client/script";
import Head from "next/head";

const inter: NextFontWithVariable = Inter({ subsets: ['latin'], variable: '--font-inter-next', adjustFontFallback: true })
const dmSans: NextFontWithVariable = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans-next', adjustFontFallback: true })
const plexSans: NextFontWithVariable = IBM_Plex_Sans({ subsets: ['latin'], variable: '--font-ibm-plex-sans-next', adjustFontFallback: true })
const jetbrainsMono: NextFontWithVariable = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono-next',
                                                             adjustFontFallback: true, fallback: ["sans-serif"] })

const EasterMenu = lazy(() => import("@/components/elements/misc/EasterMenu"));
const FallingObjects = lazy(() => import("@/components/elements/misc/FallingObjects"));

export default function App({ Component, pageProps }: AppProps): JSX.Element {
    const router: NextRouter = useRouter();

    /**
     * Activates the Konami Code milestone sequence.
     *
     * This hook listens for a specific sequence of key presses (`ArrowUp`, `ArrowUp`, `ArrowDown`, `ArrowDown`).
     * When the sequence is successfully entered, it dispatches a custom event (`triggerFallingObjects`) to the window,
     * which can be used to trigger visual effects. The hook enforces a cooldown period to prevent repeated
     * activation within a short time frame.
     *
     * @param {object} options - Configuration object for the Konami Code hook.
     * @param {string[]} options.sequence - The key sequence to listen for.
     * @param {() => void} options.onSuccess - Callback executed when the sequence is entered correctly.
     * @param {number} options.cooldown - Cooldown time in milliseconds before the sequence can be triggered again.
     */
    useKonamiCode({sequence: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown'],
        onSuccess: async (): Promise<void> => {
            const alreadyUnlocked: boolean = await isMilestoneUnlocked(MILESTONES.BACK80S.id);
            if (!alreadyUnlocked) {
                await unlockMilestone(MILESTONES.BACK80S.id, MILESTONES.BACK80S.imageKey,
                    (router.locale === "de" || router.locale === "en") ? router.locale : "de");
            }

            window.dispatchEvent(new CustomEvent('triggerFallingObjects'));
        }, cooldown: 10000});

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
        <>
            <Head>
                <title>Bl4cklist.de ~ Gaming-& Coding Discord-Server</title>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <meta name="theme-color" content="#FF7F50"/>
                <meta name="author" content="Bl4cklist.de ~ Gaming-& Coding Discord-Server"/>
                <meta property="og:site_name" content="Bl4cklist.de ~ Gaming-& Coding Discord-Server"/>
                <meta name="google-adsense-account" content={`ca-pub-${process.env.NEXT_PUBLIC_ADSENSE_ID}`}/>
            </Head>

            <main className={`${inter.variable} ${dmSans.variable} ${plexSans.variable} ${jetbrainsMono.variable} antialiased`}>
                {/* Google AdSense Main Script */}
                <Script id="adsbygoogle-init" strategy="worker" crossOrigin="anonymous"
                        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${process.env.NEXT_PUBLIC_ADSENSE_ID}`} />

                <NextIntlClientProvider locale={router.locale} timeZone="Europe/Berlin" messages={pageProps.messages}>
                    <Component {...pageProps} />

                    <Suspense fallback={null}>
                        <EasterMenu />
                        <FallingObjects />
                    </Suspense>
                </NextIntlClientProvider>

                <ScrollToTopButton />
            </main>
        </>
    )
}