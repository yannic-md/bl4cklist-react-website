import Image from 'next/image';
import { JSX } from "react";

import head from '../../styles/components/header.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { faDiscord } from '@fortawesome/free-brands-svg-icons/faDiscord';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';

export default function Header(): JSX.Element {
    return (
        <header className="fixed top-5 lg:top-3 left-0 right-0 mt-0 z-[20] my-0 mx-auto py-0 px-4 lg:!p-0
                           xl:top-5 w-full">
            {/* Header for PCs & Laptops (Big Screens) */}
            <nav aria-label="Header Desktop" className="hidden lg:flex justify-center relative">
                <div className="relative">
                    <ul className={`relative inline-flex lg:flex items-center max-w-full h-14 mx-auto rounded-full 
                                   transition-colors duration-200 ease-in-out backdrop-blur-md z-10 transform-gpu
                                   bg-[rgba(29,30,35,0.8)] ${head.header_border} animate__animated animate__fadeInDown`}>
                        <div className="flex items-center justify-between w-full h-full capitalize py-3 pr-2 pl-3 gap-2">
                            <Link className="block w-8 ml-2" href="/">
                                <Image src="/images/brand/logo-64w.avif" className="object-contain"
                                       width={64} height={64} priority
                                       alt="Logo - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server" />
                            </Link>

                            <div className="flex-shrink-1">
                                <div className="flex items-center justify-between w-full h-full gap-2 capitalize py-3 pr-2 pl-3">
                                    <li>
                                        <Link href="/">
                                            <button className={`flex gap-2 pt-2.5 pr-1.5 pb-2.5 pl-2.5 p-2.5 text-white/70 
                                                                cursor-pointer transition-colors duration-200 hover:text-white 
                                                                hover:[text-shadow:_0_0_1px_currentColor] ${head.active}`}>
                                                <span>Start</span> 
                                                <FontAwesomeIcon icon={faChevronDown} size='2xs' className="self-center opacity-40" />
                                            </button>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/discord/changelog">
                                            <button className="flex gap-2 pt-2.5 pr-1.5 pb-2.5 pl-2.5 p-2.5 text-white/70 
                                                               cursor-pointer transition-all duration-200 hover:text-white 
                                                               hover:[text-shadow:_0_0_1px_currentColor]">
                                                <span>Changelog</span> 
                                            </button>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/discord/tech-coding">
                                            <button className="flex gap-2 pt-2.5 pr-1.5 pb-2.5 pl-2.5 p-2.5 text-white/70 
                                                               cursor-pointer transition-all duration-200 hover:text-white 
                                                               hover:[text-shadow:_0_0_1px_currentColor]">
                                                <span>Tech-& Coding</span> 
                                                <FontAwesomeIcon icon={faChevronDown} size='2xs' className="self-center opacity-40" />
                                            </button>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/discord/community">
                                            <button className="flex gap-2 pt-2.5 pr-1.5 pb-2.5 pl-2.5 p-2.5 text-white/70 
                                                               cursor-pointer transition-all duration-200 hover:text-white 
                                                               hover:[text-shadow:_0_0_1px_currentColor]">
                                                <span>Community</span> 
                                                <FontAwesomeIcon icon={faChevronDown} size='2xs' className="self-center opacity-40" />
                                            </button>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/discord/clank-bot">
                                            <button className="flex gap-2 pt-2.5 pr-1.5 pb-2.5 pl-2.5 p-2.5 text-white/70 
                                                               cursor-pointer transition-all duration-200 hover:text-white 
                                                               hover:[text-shadow:_0_0_1px_currentColor]">
                                                <span>Clank-Bot</span> 
                                                <FontAwesomeIcon icon={faChevronDown} size='2xs' className="self-center opacity-40" />
                                            </button>
                                        </Link>
                                    </li>
                                </div>
                            </div>
                        
                            <div className="flex gap-2 ml-16 items-center mr-2">
                                <div className="flex flex-col items-end relative group w-full sm:w-auto z-[20]">
                                    <a href="https://discord.gg/bl4cklist" target="_blank" 
                                       className="border border-white/5 rounded-[3.125rem] text-white py-1.5 px-4 font-semibold
                                                bg-white/15 transition-all duration-200 ease-in-out -translate-y-[1px]
                                                hover:bg-white/25 hover:border-white/20 hover:[box-shadow:_0_4px_4px_rgba(114,137,218,0.3)]">
                                        <FontAwesomeIcon icon={faDiscord} size='sm' className="mr-2" />Discord-Server</a>
                                </div>
                            </div>
                        </div>
                    </ul>
                </div>
            </nav>

            {/* Header for Mobile Devices (Small Screens) */}
            <nav aria-label="Header Mobile" className="block lg:hidden">
                <div className="relative">
                    <ul className={`inline-flex bg-[rgba(29,30,35,0.8)] items-center w-full ${head.header_border} 
                                    rounded-full backdrop-blur-sm animate__animated animate__fadeInDown transform-gpu`}>
                        <div className="flex items-center justify-between w-full h-full gap-2 capitalize py-3 pl-3 pr-2">
                            <Link className="block w-8 ml-2" href="/">
                                <Image src="/images/brand/logo-64w.avif" className="object-contain"
                                       width={64} height={64} priority
                                       alt="Logo - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server" />
                            </Link>
                            <button type="button" className="flex bg-white/5 p-3 rounded-[3.5rem] mr-1.5">
                                <FontAwesomeIcon icon={faBars} className="text-white/70" />
                            </button>
                        </div>
                    </ul>
                </div>
            </nav>

        </header>
    )
}