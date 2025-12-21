import {JSX} from "react";
import Link from "next/link";
import Image from "next/image";
import {faDiscord} from "@fortawesome/free-brands-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTiktok} from "@fortawesome/free-brands-svg-icons/faTiktok";
import {faInstagram} from "@fortawesome/free-brands-svg-icons/faInstagram";
import {faYoutube} from "@fortawesome/free-brands-svg-icons/faYoutube";
import {useTranslations} from "next-intl";
import {AnimateOnView} from "@/components/animations/AnimateOnView";
import {faGithub} from "@fortawesome/free-brands-svg-icons/faGithub";

/**
 * Renders the site's footer containing:
 * - Logo and a localized description (using `useTranslations('Footer')`)
 * - Social media links with FontAwesome icons
 * - A divider and copyright/legal links
 * - A decorative moon image positioned absolutely
 *
 * Accessibility & behavior notes:
 * - Uses a semantic `<footer>` element.
 * - External links open in a new tab via `target="_blank"` (consider adding `rel="noopener noreferrer"` if needed).
 *
 * @returns {JSX.Element} The footer element.
 */
export default function Footer(): JSX.Element {
    const tFooter = useTranslations('Footer');

    return (
        <footer className="bg-slate-900/30 relative overflow-hidden">
            <div className="container mx-auto px-4 py-8">
                {/* Main Content Row */}
                <AnimateOnView animation="animate__fadeInUp animate__slower">
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-8 mb-6">
                        {/* Logo and Description */}
                        <div className="flex-1 flex flex-col items-center md:items-start max-w-lg">
                            <Image src="/images/brand/logo-64w.avif" width={64} height={64}
                                   className="mb-4 !cursor-pointer hover:scale-110 transition-all duration-200"
                                   alt="Logo Footer ~ Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server" />
                            <p className="text-[#969cb1] text-sm break-words opacity-70 text-center md:text-start">
                                {tFooter('description')}
                            </p>
                        </div>

                        {/* Social Media Icons */}
                        <div className="flex flex-row gap-4">
                            <Link href="https://www.tiktok.com/@discord.bl4cklist" target="_blank"
                                  className="text-gray-400 hover:text-white hover:scale-110 transition-all duration-200">
                                <FontAwesomeIcon icon={faTiktok} size={'lg'}/>
                            </Link>
                            <Link href="https://www.instagram.com/discord.bl4cklist/" target="_blank"
                                  className="text-gray-400 hover:text-white hover:scale-110 transition-all duration-200">
                                <FontAwesomeIcon icon={faInstagram} size={'lg'}/>
                            </Link>
                            <Link href="https://www.youtube.com/@razzerde" target="_blank"
                                  className="text-gray-400 hover:text-white hover:scale-110 transition-all duration-200">
                                <FontAwesomeIcon icon={faYoutube} size={'lg'}/>
                            </Link>
                            <Link href="https://github.com/yannic-md?tab=repositories" target="_blank"
                                  className="text-gray-400 hover:text-white hover:scale-110 transition-all duration-200">
                                <FontAwesomeIcon icon={faGithub} size={'lg'}/>
                            </Link>
                            <Link href="https://discord.gg/bl4cklist" target="_blank"
                                  className="text-gray-400 hover:text-white hover:scale-110 transition-all duration-200">
                                <FontAwesomeIcon icon={faDiscord} size={'lg'}/>
                            </Link>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-800 mb-6"></div>

                    {/* Copyright Notice */}
                    <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-4 text-sm
                                  text-[#969cb1] opacity-80">
                        <p>© {new Date().getFullYear()}&nbsp;
                            <Link href="/" className="hover:text-white transition-colors">
                                Bl4cklist.de
                            </Link> {tFooter('copyright')}</p>

                        <div className="flex gap-6 justify-center md:justify-end">
                            <Link href="/imprint" className="hover:text-white transition-colors">
                                {tFooter('imprint')}
                            </Link>
                            <Link href="/contact" className="hover:text-white transition-colors">
                                {tFooter('contact')}
                            </Link>
                        </div>
                    </div>
                </AnimateOnView>
            </div>

            {/* Decorational moon image */}
            <div className="absolute left-1/2 -bottom-24 opacity-25 transform -translate-x-1/2
                            pointer-events-none select-none">
                <Image src="/images/bg/moon.svg" alt="Moon ~ Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                       className="w-48 h-48" width={192} height={192} />
            </div>
        </footer>
    );
}