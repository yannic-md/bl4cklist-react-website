import React, { JSX } from "react";

import elements from "../../../styles/util/elements.module.css";
import {usePageLoader} from "@/hooks/usePageLoader";

/**
 * PageLoader component displays a fullscreen loading overlay with a progress bar and animated loader.
 * It fades out smoothly when loading is complete and hides itself after the transition.
 * Uses the usePageLoader hook to track loading state and progress.
 *
 * @returns {JSX.Element} The page loader overlay element.
 */
export default function PageLoader(): JSX.Element {
    const { progress, isLoading } = usePageLoader(300);

    return (
        <section className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden transition-opacity 
                         duration-300 ease-out ${!isLoading ? "opacity-0 pointer-events-none" : "opacity-100"}`}
             aria-hidden={!isLoading} id="page-loader">
            {/* Background for Page Loader */}
            <div className="absolute inset-0 bg-[#1d1e23]"></div>

            {/* Progress Bar checking the page load status */}
            <div className="absolute top-0 left-0 w-full overflow-hidden">
                <div className="w-full bg-gray-700 h-0.5">
                    <div
                        className="bg-[#FF3D00] h-0.5 transition-all duration-200 ease-out"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            {/* Circle Page Loader Icon */}
            <div className="relative z-10 flex flex-col items-center gap-6 px-6 py-8">
                <div className={elements.page_loader}></div>
                <p className="text-sm text-slate-300/90">{progress}%</p>
            </div>
        </section>
    );
}
