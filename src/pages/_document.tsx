import { Html, Head, Main, NextScript } from "next/document";
import {JSX} from "react";

export default function Document(): JSX.Element {
    return (
        <Html lang="en">
            <Head>
                <title>Startseite ~ Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server</title>
                <meta name="description" content="Unser deutscher Discord-Server für Technik und Gaming ist die perfekte Community für alle, die sich für Programmierung, Coding-Hilfe und aktuelle Gaming-Trends interessieren." />

                {/* Favicons */}
                <link rel="icon" href="/images/brand/favicon/favicon.ico" />
                <link rel="icon" type="image/png" sizes="32x32" href="/images/brand/favicon/logo-32w.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/images/brand/favicon/logo-16w.png" />
                <link rel="apple-touch-icon" href="/images/brand/favicon/logo-32w.png" />
            </Head>
            <body className="antialiased">
            <Main />
            <NextScript />
            </body>
        </Html>
    );
}