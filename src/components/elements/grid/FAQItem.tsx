import {JSX} from "react";
import Image from "next/image";
import {FaChevronDown} from "react-icons/fa";

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
 * @param {number} props.index - Zero-based index of this FAQ item.
 * @param {boolean} props.isOpen - Whether the answer is currently expanded.
 * @param {string} props.title - The question/title text to display.
 * @param {string} props.description - HTML string for the answer.
 * @param {(index: number) => void} props.onToggle - Callback invoked when the item header is clicked.
 * @returns {JSX.Element} - The rendered FAQ item
 */
export default function FAQItem({ index, isOpen, title, description, onToggle }: FAQItemProps): JSX.Element {
    return (
        <div className="relative p-px drop-shadow-white/1 drop-shadow-xl">
            <div className="relative rounded-lg z-10 p-8 cursor-pointer" onClick={(): void => onToggle(index)}>
                {/* Background Image Wrapper */}
                <div className="absolute inset-0 -z-10 select-none">
                    <Image src="/images/containers/bentobox-tl-339w.avif" fill
                           alt="Bentobox BG - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                           className="object-cover object-center pointer-events-none group-hover:brightness-125
                                      transition-all duration-200" />
                </div>

                {/* Title */}
                <div className="flex justify-between items-center cursor-pointer">
                    <h3 className="text-xl font-medium select-none">{title}</h3>
                    <span className={`transform transition-transform duration-300 text-[#969cb1]
                                      ${isOpen ? 'rotate-180' : ''}`}>
                        <FaChevronDown />
                    </span>
                </div>

                {/* Description */}
                <div className={`overflow-hidden transition-all duration-300 cursor-default
                                 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="w-5/6 mx-auto h-px bg-gradient-to-r from-slate-900 via-slate-300
                                  to-slate-900 rounded-full opacity-40 my-6"></div>
                    <div className="max-w-full text-[#969cb1] select-none"
                         dangerouslySetInnerHTML={{ __html: description }} />

                    {index === 999 && (
                        <Image src={"/images/bg/ignore-me-606w.webp"} width={606} height={221}
                               className="mt-8 justify-self-center"
                               alt="Ignore Me IMG - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server" />
                    )}
                </div>
            </div>

            {/* Border Gradient */}
            <div className="absolute inset-0 rounded-lg opacity-40 bg-white/[0.05] bg-gradient-to-r
                            from-transparent via-white/60 to-transparent select-none"></div>
        </div>
    );
}
