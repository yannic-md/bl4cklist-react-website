import { JSX } from "react";

import index from '../../styles/components/index.module.css'

/**
 * ButtonHover - A component for animating button corners on hover.
 * 
 * This component renders four animated corner elements for use as a hover effect
 * on button designs such as "white_gray" and "black_purple".
 * 
 * When the parent button is hovered (using Tailwind's `group-hover` utility), each
 * corner smoothly transitions into view and shifts outward, creating a dynamic
 * border or corner highlight effect. The corners use additional classes
 * (`showcase_top_edge`, `showcase_bottom_edge`) for their visual styling, and each
 * is rotated appropriately to fit its position (top-left, bottom-left, bottom-right, top-right).
 * 
 * @returns {JSX.Element} The ButtonHover component with animated corners.
 */
export default function ButtonHover(): JSX.Element {
    return (
        <>
            {/* Button Hover Corners */}
            <div className="absolute z-[1] w-2.5 h-2.5 -left-0 -top-0 opacity-0 
                            group-hover:opacity-100 group-hover:-left-[5px] group-hover:-top-[5px]
                            transition-all duration-200">
                <div className={`${index.showcase_top_edge}`}></div>
                <div className={`${index.showcase_bottom_edge}`}></div>
            </div>
            <div className="absolute z-[1] w-2.5 h-2.5 -left-0 -bottom-0 opacity-0 
                            group-hover:opacity-100 group-hover:-left-[5px] group-hover:-bottom-[5px]
                            transition-all duration-200 -rotate-90">
                <div className={`${index.showcase_top_edge}`}></div>
                <div className={`${index.showcase_bottom_edge}`}></div>
            </div>
            <div className="absolute z-[1] w-2.5 h-2.5 -right-0 -bottom-0 opacity-0 
                            group-hover:opacity-100 group-hover:-right-[5px] group-hover:-bottom-[5px]
                            transition-all duration-200 rotate-180">
                <div className={`${index.showcase_top_edge}`}></div>
                <div className={`${index.showcase_bottom_edge}`}></div>
            </div>
            <div className="absolute z-[1] w-2.5 h-2.5 -right-0 -top-0 opacity-0 
                            group-hover:opacity-100 group-hover:-right-[5px] group-hover:-top-[5px]
                            transition-all duration-200 rotate-90">
                <div className={`${index.showcase_top_edge}`}></div>
                <div className={`${index.showcase_bottom_edge}`}></div>
            </div>
        </>
    )
}