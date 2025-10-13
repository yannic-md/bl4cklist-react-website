import Image from 'next/image';
import {JSX} from "react";

interface TimelineItemProps {
    date: string;
    title: string;
    description: string;
    logoSrc?: string;
    logoAlt?: string;
    borderShadowClass: string;
}

/**
 * A functional React component that represents an individual item in a timeline.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.date - The date associated with the timeline item.
 * @param {string} props.title - The title of the timeline item.
 * @param {string} props.description - A brief description of the timeline item.
 * @param {string} [props.logoSrc] - The optional source URL for the logo image.
 * @param {string} [props.logoAlt] - The optional alt text for the logo image.
 * @param {string} props.borderShadowClass - The TailwindCSS class for the border shadow effect.
 *
 * @returns {JSX.Element} The rendered JSX element for the timeline item.
 */
export default function TimelineItem({date, title, description, logoSrc, logoAlt, borderShadowClass}: TimelineItemProps): JSX.Element {
    return (
        <div className="relative flex flex-col gap-4 pl-[63px]">
            <div className={`relative flex p-3 bg-[#04070d] rounded-2xl shadow-[inset_0_2px_1px_0_rgba(207,231,255,0.2)]
                            ${borderShadowClass} hover:-translate-y-1 transition-all duration-200`}>
                <div>
                    {/* Date of Item start */}
                    <p className="opacity-50 mb-2 ml-1">{date}</p>

                    {/* Title for the item */}
                    <h3 className="text-[clamp(1.375rem,1.1989rem+.7512vw,1.5rem)] font-semibold">
                        {title}
                    </h3>

                    {/* description */}
                    <p className="text-[#969cb1] mb-6 break-words max-w-2xl">
                        {description}
                    </p>
                </div>

                {/* optional image shown on the right corner of the container */}
                {logoSrc && (
                    <div className="absolute -top-8 -right-8 w-24 h-24 z-10">
                        <Image src={logoSrc} width={96} height={96} alt={logoAlt || 'Logo'}
                            className="w-full h-full object-contain drop-shadow-2xl hover:opacity-100
                                       hover:scale-110 transition-all duration-300 opacity-80" />
                    </div>
                )}

                {/* light color gradient for more depth */}
                <div className="absolute top-0 right-0 w-[437px] h-[306px] pointer-events-none opacity-[0.1] rounded-tr-2xl
                        bg-[radial-gradient(50%_50%_at_93.7%_8.1%,#b8c7d980_0%,rgba(4,7,13,0)_100%)]" />
            </div>

            {/* Some decoration to highlight the item on the timeline */}
            <div className="w-[10px] absolute top-[47%] -left-[4px]">
                <div className="aspect-square rounded-full w-full
                                bg-[radial-gradient(circle_farthest-corner_at_50%_50%,#fff,#e5e5e5_54%,#a3a3a3)]" />
                <div className="w-[40px] h-[2px] absolute top-1/2 right-0 translate-x-full -translate-y-1/2
                                bg-gradient-to-r from-white/80 via-white/50 via-21% to-transparent to-92%" />
                <div className="w-[2px] h-[40px] absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full
                                bg-gradient-to-t from-white/60 to-transparent to-80%" />
                <div className="w-[2px] h-[40px] absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full
                                bg-gradient-to-b from-white/60 to-transparent to-80%" />
            </div>
        </div>
    );
}
