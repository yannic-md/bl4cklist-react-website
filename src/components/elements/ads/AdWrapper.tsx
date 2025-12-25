import {JSX, ReactNode} from "react";

/**
 * Renders a centered ad wrapper.
 *
 * Renders a responsive container that centers advertisement content horizontally,
 * constrains its maximum width and provides spacing to ensure consistent layout.
 *
 * @param {ReactNode} children - The content to be rendered inside the ad container.
 * @returns {JSX.Element} - The rendered ad container element wrapping the provided children.
 */
export const AdContainer = ({ children }: { children: ReactNode }): JSX.Element => (
    <div className="w-full flex justify-center px-4 overflow-hidden max-h-[128px]">
        <div className="max-w-7xl w-full">
            {children}
        </div>
    </div>
);