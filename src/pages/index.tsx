import {JSX} from "react";
import WelcomeHero from "@/components/welcome-hero/WelcomeHero";

/**
 * Renders the home page of the project.
 * Displays a welcome hero section to greet visitors and briefly explain the project.
 *
 * @returns {JSX.Element} The home page component.
 */
export default function Home(): JSX.Element {
    return (
        // Start of the page; greet the visitor & explain our project quick
        <WelcomeHero />
    );
}
