import {JSX} from "react";
import {AnimateOnView} from "@/components/animations/AnimateOnView";
import Image from "next/image";

interface BentoBoxItemProps {
    animation: string;
    backgroundImage: string;
    showcaseImage: string;
    showcaseAlt: string;
    showcaseTitle?: string;
    title: string;
    description: string;
    maxWidth?: string;
    minHeight?: string;
    showcaseWidth?: number;
    showcaseHeight?: number;
    hoverRotation?: "left" | "right";
    showcaseMaxWidth?: string;
}

/**
 * Renders an animated, responsive card containing:
 *  - a full-bleed background image,
 *  - a centered showcase image with optional hover rotation/scale effects,
 *  - and a title with a short description overlay.
 *
 * Props:
 * @param {BentoBoxItemProps} props - The used props
 * @param {string} props.animation - Animation name passed to AnimateOnView.
 * @param {string} props.backgroundImage - URL or import for the background Image component.
 * @param {string} props.showcaseImage - URL or import for the showcase Image component.
 * @param {string} props.showcaseAlt - Alt text for the showcase Image.
 * @param {string} [props.showcaseTitle] - Optional title attribute for the showcase Image.
 * @param {string} props.title - Heading text displayed above the description.
 * @param {string} props.description - Supporting descriptive text.
 * @param {string} [props.maxWidth='w-full'] - Tailwind width utility applied to the root container.
 * @param {string} [props.minHeight='min-h-[376px]'] - Tailwind min-height utility applied to the root container.
 * @param {number} [props.showcaseWidth=594] - Intrinsic width forwarded to Next/Image for the showcase.
 * @param {number} [props.showcaseHeight=301] - Intrinsic height forwarded to Next/Image for the showcase.
 * @param {'left'|'right'} [props.hoverRotation='left'] - Determines hover rotation direction for the showcase image.
 * @param {string} [props.showcaseMaxWidth] - Tailwind max-width utilities for the showcase container.
 *
 * @returns {JSX.Element} The composed, animated card element.
 */
export default function BentoBoxItem({animation, backgroundImage, showcaseImage, showcaseAlt, showcaseTitle, title,
                                      description, maxWidth = "w-full", minHeight = "min-h-[376px]", showcaseWidth = 594,
                                      showcaseHeight = 301, hoverRotation = "left",
                                      showcaseMaxWidth = "max-w-[320px] sm:max-w-[400px] md:max-w-[450px] " +
                                                         "lg:max-w-[500px] xl:max-w-full"}: BentoBoxItemProps): JSX.Element {
    const rotationClass: "hover:-rotate-1" | "hover:rotate-1" = hoverRotation === "left" ? "hover:-rotate-1" : "hover:rotate-1";

    return (
        <AnimateOnView animation={animation} className={`relative flex flex-col justify-end items-start overflow-hidden 
                                                         w-full transition-all duration-200 ${maxWidth} ${minHeight} p-6 
                                                         border border-white/[0.08] rounded-lg group`}>
            {/* Background Image Wrapper */}
            <div className="absolute inset-0 -z-10">
                <Image src={backgroundImage} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 602px"
                    alt={`Bentobox Background - ${title}`} className="object-cover object-center pointer-events-none
                                                                      group-hover:brightness-125 transition-all duration-200" />
            </div>

            {/* Showcase Image */}
            <div className={`inline-block self-center my-auto mt-0 max-h-[70%] overflow-hidden border-2
                             border-gray-700/50 rounded-4xl drop-shadow-2xl transition-all duration-200
                             ${rotationClass} hover:-translate-y-1 hover:scale-105 w-full
                             ${showcaseMaxWidth} mb-7 xl:mb-auto`}>
                <Image src={showcaseImage} width={showcaseWidth} height={showcaseHeight} unoptimized alt={showcaseAlt}
                       title={showcaseTitle} data-cursor-special
                       className="w-full h-auto object-contain opacity-65 transition-opacity duration-200 hover:opacity-100" />
            </div>

            {/* Description */}
            <div className="relative z-[2] text-lg text-center w-full">
                <span className="font-medium text-white">{title}</span><br />
                <span className="text-base text-[#969cb1]">{description}</span>
            </div>
        </AnimateOnView>
    );
}
