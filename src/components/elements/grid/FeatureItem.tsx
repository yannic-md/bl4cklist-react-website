import {JSX} from "react";
import Image from "next/image";
import coding from "@/styles/components/coding.module.css";

interface FeatureItemProps {
    iconSrc: string;
    title: string;
    description: string;
    link?: string;
    altText: string;
}

/**
 * FeatureItem component displays a single feature card with icon, title, and description.
 * Optionally supports clickable titles with links.
 *
 * @param {FeatureItemProps} props - The component props
 * @returns {JSX.Element} The rendered feature item
 */
export default function FeatureItem({ iconSrc, title, description, link, altText }: FeatureItemProps): JSX.Element {
    return (
        <div className={`relative px-8 pt-6 pb-9 ${coding.feature_card} hover:bg-gradient-to-b
                         hover:from-transparent hover:to-slate-900/30 transition-all duration-300`}>
            {/* Icon */}
            <Image src={iconSrc} width={40} height={40} className="mb-5 pointer-events-none" alt={altText} />

            {/* Title (optional with link) */}
            <div className={`font-medium text-white mb-1 ${link ? 'hover:text-[coral] transition-colors duration-200' : ''}`}>
                {link ? <a href={link}>{title}</a> : title}
            </div>

            {/* Description */}
            <div className="text-[#969cb1] text-base">{description}</div>
        </div>
    );
}
