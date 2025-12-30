import { useMemo } from 'react';

interface UseAvatarUrlOptions {
    avatarUrl: string | null | undefined;
    isHovered?: boolean;
    size?: number;
    convertToWebp?: boolean;
}

/**
 * Generate an optimized avatar URL for Discord CDN images - necessary to improve page-load times for big lists.
 *
 * Returns a sized URL for Discord avatars, converting static images to WebP and providing a static WebP preview for
 * animated GIFs when not hovered; the original GIF is returned when hovered. Non-Discord URLs are returned
 * unchanged and existing query parameters are stripped before processing.
 *
 * @param {UseAvatarUrlOptions} options - Options for generating the avatar URL.
 * @param {string|null|undefined} options.avatarUrl - Original avatar URL.
 * @param {boolean} [options.isHovered=false] - Whether the avatar is hovered (controls GIF playback).
 * @param {number} [options.size=128] - Desired size in pixels.
 * @param {boolean} [options.convertToWebp=true] - Whether to convert static images to WebP.
 * @returns {string} - A processed avatar URL or an empty string if none provided.
 */
export function useAvatarUrl({avatarUrl, isHovered = false, size = 128, convertToWebp = true}: UseAvatarUrlOptions): string {
    return useMemo((): string => {
        if (!avatarUrl) return '';
        if (!avatarUrl.startsWith("https://cdn.discordapp.com/") || avatarUrl.includes("/embed/avatars/")) { return avatarUrl; }

        // Strip existing query parameters
        const baseUrl: string = avatarUrl.split('?')[0];
        if (!convertToWebp) { return `${baseUrl}?size=${size}`; }

        // For animated GIFs: Show static WEBP when not hovered OR video version if else
        const isAnimatedGif: boolean = baseUrl.includes('.gif');
        if (isAnimatedGif) {
            if (!isHovered) { return `${baseUrl.replace('.gif', '.webp')}?size=${size}`; }
            else if (isHovered) { return `${baseUrl}?size=${size}`; }
        }

        // For static images (PNG/JPG): convert to WebP
        return `${baseUrl.replace(/\.(png|jpg|jpeg)$/i, '.webp')}?size=${size}`;
    }, [avatarUrl, isHovered, size, convertToWebp]);
}
