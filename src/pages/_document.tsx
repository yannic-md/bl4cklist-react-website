import { Html, Head, Main, NextScript } from "next/document";
import {JSX} from "react";

export default function Document(): JSX.Element {
    return (
        <Html lang="de">
            <Head>
                {/* Favicons */}
                <link rel="icon" href="/images/brand/favicon/favicon.ico" />
                <link rel="icon" type="image/png" sizes="32x32" href="/images/brand/favicon/logo-32w.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/images/brand/favicon/logo-16w.png" />
                <link rel="apple-touch-icon" href="/images/brand/favicon/logo-32w.png" />

                <link rel="preconnect" href="https://api.clank.dev" />
                <link rel="dns-prefetch" href="https://api.clank.dev" />
                <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
                <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
            </Head>
            <body className="antialiased is-loading">
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}