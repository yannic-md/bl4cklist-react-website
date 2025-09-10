import '../styles/globals.css'
import type { AppProps } from "next/app";
import {Inter, DM_Sans, IBM_Plex_Sans, JetBrains_Mono} from 'next/font/google'
import {NextFontWithVariable} from "next/dist/compiled/@next/font";

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { NextIntlClientProvider } from 'next-intl';
import {NextRouter, useRouter} from 'next/router';
import PageLoader from "@/components/elements/PageLoader";
config.autoAddCss = false

const inter: NextFontWithVariable = Inter({ subsets: ['latin'], variable: '--font-inter' })
const dmSans: NextFontWithVariable = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' })
const plexSans: NextFontWithVariable = IBM_Plex_Sans({ subsets: ['latin'], variable: '--font-ibm-plex-sans' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' })

export default function App({ Component, pageProps }: AppProps) {
    const router: NextRouter = useRouter();
    
    return (
        <main className={`${inter.variable} ${dmSans.variable} ${plexSans.variable} ${jetbrainsMono.variable} antialiased`}>
            <PageLoader />
            <NextIntlClientProvider locale={router.locale} timeZone="Europe/Berlin" messages={pageProps.messages}>
                <Component {...pageProps} />
            </NextIntlClientProvider>
        </main>
    )
}