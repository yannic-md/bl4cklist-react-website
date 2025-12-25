import {JSX, RefObject, useEffect, useRef, useState} from 'react';
import {useRouter} from "next/router";

interface AdBannerProps {
    dataAdSlot: string;
    dataAdFormat?: string;
    dataFullWidthResponsive?: boolean;
    className?: string;
}

/**
 * Renders a Google AdSense banner and conditionally hides it when unfilled.
 *
 * This React component injects an `ins.adsbygoogle` element using the supplied slot and format,
 * initializes the `adsbygoogle` queue and polls the inserted node to detect whether an ad was
 * filled. If the ad is unfilled or its rendered height is zero within a short timeout, the
 * component hides itself to avoid leaving empty space in the layout. Side effects are handled
 * inside a `useEffect` hook and the banner is re-keyed on route changes.
 *
 * @param {AdBannerProps} props - Component configuration
 * @param {string} props.dataAdSlot - The AdSense slot id to render.
 * @param {string} [props.dataAdFormat='auto'] - The `data-ad-format` attribute for the ad.
 * @param {boolean} [props.dataFullWidthResponsive=true] - Whether the ad should be full-width responsive.
 * @param {string} [props.className=''] - Optional additional CSS class for the container.
 * @returns {JSX.Element | null} - The ad banner element when visible, or `null` when hidden.
 */
export default function AdBanner({dataAdSlot, dataAdFormat = 'auto', dataFullWidthResponsive = true,
                                  className = '',}: AdBannerProps): JSX.Element | null {
    const [isVisible, setIsVisible] = useState(true);
    const adRef: RefObject<HTMLModElement | null> = useRef<HTMLModElement>(null);
    const { asPath } = useRouter();

    /**
     * Initialize and validate an AdSense ad slot, hiding the container if unfilled.
     *
     * This function queries the DOM for the `ins` element matching the provided ad slot,
     * checks for the global `adsbygoogle` queue and either pushes an initialization request
     * when the element has a positive client width or hides the banner when the ad is
     * unfilled or the script is unavailable. Any errors (e.g. blocked script) result in
     * the banner being hidden to avoid empty space.
     *
     * @param {string} dataAdSlot - The AdSense slot id used to query the DOM for the ad element.
     */
    useEffect((): () => void => {
        setIsVisible(true);

        const loadAd: () => void = (): void => {
            try {
                const adElement: HTMLModElement | null = document.querySelector(`ins[data-ad-slot="${dataAdSlot}"]`);
                const adsbygoogle: any = (window as any).adsbygoogle;
                if (!adsbygoogle) { return setIsVisible(false); }

                if (adElement && adElement.clientWidth > 0) {
                    adsbygoogle.push({});
                } else {
                    setIsVisible(false);
                }
            } catch (e) {
                console.warn("AdSense push failed (likely blocked):", e);
                setIsVisible(false);
            }
        };

        const timer: NodeJS.Timeout = setTimeout(loadAd, 500);
        return (): void => clearTimeout(timer);
    }, [asPath, dataAdSlot]);

    if (!isVisible) return null;

    return (
        <div className={`ad-container ${className}`} style={{ minHeight: '100px', width: '100%', overflow: 'hidden' }}>
            <ins ref={adRef} className="adsbygoogle mt-12" style={{ display: 'block', minWidth: '250px' }}
                 data-ad-format={dataAdFormat} data-ad-client={`ca-pub-${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
                 data-ad-slot={dataAdSlot} data-full-width-responsive={dataFullWidthResponsive.toString()} />
        </div>
    );
}