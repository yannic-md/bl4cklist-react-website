import {RefObject, useEffect, useRef, useState} from 'react';

interface UseKonamiCodeOptions {
    sequence?: string[];
    onSuccess: () => void;
    cooldown?: number; // in milliseconds
}

/**
 * Custom React hook to detect a specific keyboard sequence (e.g. Konami Code) and trigger a callback.
 *
 * This hook listens for a configurable sequence of keyboard events (default: ArrowUp, ArrowUp, ArrowDown, ArrowDown).
 * When the user enters the correct sequence, the provided `onSuccess` callback is executed.
 * To prevent repeated triggers, a cooldown period can be set (default: 30 seconds).
 * The hook automatically resets the sequence after a successful trigger and cleans up the event listener on component unmount.
 *
 * @param {Object} options - Configuration options for the hook.
 * @param {string[]} [options.sequence] - The sequence of keys to detect (default: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown']).
 * @param {() => void} options.onSuccess - Callback function to execute when the sequence is successfully entered.
 * @param {number} [options.cooldown] - Cooldown period in milliseconds before the sequence can be triggered again (default: 30000).
 */
export const useKonamiCode = ({sequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown'],
                               onSuccess, cooldown = 30000}: UseKonamiCodeOptions): void => {
    const [_keys, setKeys] = useState<string[]>([]);
    const lastTriggered: RefObject<number> = useRef<number>(0);

    /**
     * React hook to detect the Konami Code sequence via keyboard input.
     *
     * This hook listens for a specified sequence of keyboard events (default: ArrowUp, ArrowUp, ArrowDown, ArrowDown).
     * When the sequence is entered correctly, it triggers the provided `onSuccess` callback, with an optional cooldown to prevent repeated triggers.
     * The hook automatically resets the sequence after a successful trigger and cleans up the event listener on unmount.
     *
     * @param {Object} options - Configuration options for the hook.
     * @param {string[]} [options.sequence] - The sequence of keys to detect (default: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown']).
     * @param {() => void} options.onSuccess - Callback function to execute when the sequence is successfully entered.
     * @param {number} [options.cooldown] - Cooldown period in milliseconds before the sequence can be triggered again (default: 30000).
     */
    useEffect((): () => void => {
        const handleKeyDown: (e: KeyboardEvent) => void = (e: KeyboardEvent): void => {
            if (!e.key || !e.key.startsWith('Arrow')) return;  // Only track arrow keys
            e.preventDefault();

            setKeys((prevKeys: string[]): string[] => {
                const newKeys: string[] = [...prevKeys, e.key].slice(-sequence.length);

                // check if konami sequence is complete (UP, UP, DOWN, DOWN)
                if (newKeys.length === sequence.length &&
                    newKeys.every((key: string, index: number): boolean => key === sequence[index])) {

                    const now: number = Date.now();
                    const timeSinceLastTrigger: number = now - lastTriggered.current;

                    if (timeSinceLastTrigger >= cooldown) {
                        lastTriggered.current = now;
                        onSuccess();
                        return []; // reset after successful trigger
                    }
                }

                return newKeys;
            });
        };

        window.addEventListener('keydown', handleKeyDown);
        return (): void => window.removeEventListener('keydown', handleKeyDown);
    }, [sequence, onSuccess, cooldown]);
};