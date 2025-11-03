import {JSX} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

interface FAQItemProps {
    index: number;
    isOpen: boolean;
    title: string;
    description: string;
    onToggle: (index: number) => void;
}

/**
 * FAQItem component displays a single FAQ question with expandable answer.
 * Supports HTML content in the description for links and formatting.
 *
 * @param {FAQItemProps} props - The component props
 * @returns {JSX.Element} The rendered FAQ item
 */
export default function FAQItem({ index, isOpen, title, description, onToggle }: FAQItemProps): JSX.Element {
    return (
        <div className="relative p-px drop-shadow-white/1 drop-shadow-xl">
            <div className="relative rounded-lg z-10 p-8 cursor-pointer" onClick={(): void => onToggle(index)}>
                {/* Background Image Wrapper */}
                <div className="absolute inset-0 -z-10">
                    <Image src="/images/containers/bentobox-tl-339w.avif" fill
                           alt="Bentobox BG - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                           className="object-cover object-center pointer-events-none group-hover:brightness-125
                                      transition-all duration-200" />
                </div>

                {/* Title */}
                <div className="flex justify-between items-center cursor-pointer">
                    <h3 className="text-xl font-medium">{title}</h3>
                    <span className={`transform transition-transform duration-300 text-[#969cb1]
                                      ${isOpen ? 'rotate-180' : ''}`}>
                        <FontAwesomeIcon icon={faChevronDown} />
                    </span>
                </div>

                {/* Description */}
                <div className={`overflow-hidden transition-all duration-300 cursor-default
                                 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="w-5/6 mx-auto h-px bg-gradient-to-r from-slate-900 via-slate-300
                                  to-slate-900 rounded-full opacity-40 my-6"></div>
                    <div className="max-w-full text-[#969cb1]"
                         dangerouslySetInnerHTML={{ __html: description }} />
                </div>
            </div>

            {/* Border Gradient */}
            <div className="absolute inset-0 rounded-lg opacity-40 bg-white/[0.05] bg-gradient-to-r
                            from-transparent via-white/60 to-transparent"></div>
        </div>
    );
}
