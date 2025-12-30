import { renderHook } from '@testing-library/react';
import {useAvatarUrl} from "@/hooks/useAvatarUrl";

describe('useAvatarUrl', () => {
    it('should return empty string when avatarUrl is not provided', () => {
        const { result } = renderHook(() => useAvatarUrl({ avatarUrl: '' }));
        expect(result.current).toBe('');
    });

    it('should return original URL when not from Discord CDN', () => {
        const externalUrl = 'https://example.com/avatar.png';
        const { result } = renderHook(() => useAvatarUrl({ avatarUrl: externalUrl }));
        expect(result.current).toBe(externalUrl);
    });

    it('should return original URL for embed avatars', () => {
        const embedUrl = 'https://cdn.discordapp.com/embed/avatars/1.png';
        const { result } = renderHook(() => useAvatarUrl({ avatarUrl: embedUrl }));
        expect(result.current).toBe(embedUrl);
    });

    it('should strip query parameters and add size when convertToWebp is false', () => {
        const url = 'https://cdn.discordapp.com/avatars/123/abc.png?size=512';
        const { result } = renderHook(() =>
            useAvatarUrl({ avatarUrl: url, convertToWebp: false, size: 256 })
        );
        expect(result.current).toBe('https://cdn.discordapp.com/avatars/123/abc.png?size=256');
    });

    it('should convert animated GIF to static WebP when not hovered', () => {
        const gifUrl = 'https://cdn.discordapp.com/avatars/123/abc.gif?size=512';
        const { result } = renderHook(() =>
            useAvatarUrl({ avatarUrl: gifUrl, isHovered: false, size: 128 })
        );
        expect(result.current).toBe('https://cdn.discordapp.com/avatars/123/abc.webp?size=128');
    });

    it('should keep animated GIF format when hovered', () => {
        const gifUrl = 'https://cdn.discordapp.com/avatars/123/abc.gif';
        const { result } = renderHook(() =>
            useAvatarUrl({ avatarUrl: gifUrl, isHovered: true, size: 256 })
        );
        expect(result.current).toBe('https://cdn.discordapp.com/avatars/123/abc.gif?size=256');
    });

    it('should convert PNG to WebP for static images', () => {
        const pngUrl = 'https://cdn.discordapp.com/avatars/123/abc.png';
        const { result } = renderHook(() =>
            useAvatarUrl({ avatarUrl: pngUrl, size: 512 })
        );
        expect(result.current).toBe('https://cdn.discordapp.com/avatars/123/abc.webp?size=512');
    });

    it('should convert JPG to WebP for static images', () => {
        const jpgUrl = 'https://cdn.discordapp.com/avatars/123/abc.jpg';
        const { result } = renderHook(() =>
            useAvatarUrl({ avatarUrl: jpgUrl, size: 128 })
        );
        expect(result.current).toBe('https://cdn.discordapp.com/avatars/123/abc.webp?size=128');
    });

    it('should convert JPEG to WebP for static images (case insensitive)', () => {
        const jpegUrl = 'https://cdn.discordapp.com/avatars/123/abc.JPEG';
        const { result } = renderHook(() =>
            useAvatarUrl({ avatarUrl: jpegUrl, size: 128 })
        );
        expect(result.current).toBe('https://cdn.discordapp.com/avatars/123/abc.webp?size=128');
    });

    it('should use default size of 128 when size is not provided', () => {
        const url = 'https://cdn.discordapp.com/avatars/123/abc.png';
        const { result } = renderHook(() =>
            useAvatarUrl({ avatarUrl: url })
        );
        expect(result.current).toBe('https://cdn.discordapp.com/avatars/123/abc.webp?size=128');
    });

    it('should memoize result and not recalculate when inputs are unchanged', () => {
        const url = 'https://cdn.discordapp.com/avatars/123/abc.png';
        const { result, rerender } = renderHook(() =>
            useAvatarUrl({ avatarUrl: url, size: 128 })
        );

        const firstResult = result.current;
        rerender();

        expect(result.current).toBe(firstResult);
    });

    it('should recalculate when avatarUrl changes', () => {
        const url1 = 'https://cdn.discordapp.com/avatars/123/abc.png';
        const url2 = 'https://cdn.discordapp.com/avatars/456/def.png';

        const { result, rerender } = renderHook(
            ({ avatarUrl }) => useAvatarUrl({ avatarUrl }),
            { initialProps: { avatarUrl: url1 } }
        );

        expect(result.current).toBe('https://cdn.discordapp.com/avatars/123/abc.webp?size=128');

        rerender({ avatarUrl: url2 });

        expect(result.current).toBe('https://cdn.discordapp.com/avatars/456/def.webp?size=128');
    });
});