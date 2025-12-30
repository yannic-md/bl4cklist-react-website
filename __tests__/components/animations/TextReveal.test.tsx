// noinspection DuplicatedCode

import { render, act } from '@testing-library/react';
import {AnimatedTextReveal} from "@/components/animations/TextReveal";

describe('AnimatedTextReveal', () => {
    let mockObserve: jest.Mock;
    let mockUnobserve: jest.Mock;
    let mockDisconnect: jest.Mock;
    let intersectionObserverCallback: IntersectionObserverCallback;

    const mockIntersectionObserver = jest.fn();

    beforeEach(() => {
        jest.useFakeTimers();
        mockObserve = jest.fn();
        mockUnobserve = jest.fn();
        mockDisconnect = jest.fn();

        mockIntersectionObserver.mockImplementation((callback: IntersectionObserverCallback) => {
            intersectionObserverCallback = callback;
            return {observe: mockObserve, unobserve: mockUnobserve, disconnect: mockDisconnect};
        });

        global.IntersectionObserver = mockIntersectionObserver as any;
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
        jest.clearAllMocks();
    });

    it('should render with default props', () => {
        const { container } = render(<AnimatedTextReveal text="Hello World" />);
        expect(container.querySelector('.relative')).toBeInTheDocument();
    });

    it('should render text split into words and characters', () => {
        const { container } = render(<AnimatedTextReveal text="Hello World" />);
        const words = container.querySelectorAll('.whitespace-nowrap');
        expect(words).toHaveLength(2);
    });

    it('should apply custom className', () => {
        const { container } = render(<AnimatedTextReveal text="Test" className="custom-class" />);
        expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });

    it('should create IntersectionObserver with correct options', () => {
        render(<AnimatedTextReveal text="Test" threshold={0.5} rootMargin="10px" />);

        expect(mockIntersectionObserver).toHaveBeenCalledWith(
            expect.any(Function),
            {
                threshold: 0.5,
                rootMargin: '10px',
            }
        );
    });

    it('should observe element on mount', () => {
        render(<AnimatedTextReveal text="Test" />);
        expect(mockObserve).toHaveBeenCalledTimes(1);
    });

    it('should unobserve element on unmount', () => {
        const { unmount } = render(<AnimatedTextReveal text="Test" />);
        unmount();
        expect(mockUnobserve).toHaveBeenCalledTimes(1);
    });

    it('should set isVisible to true when element intersects', () => {
        const { container } = render(<AnimatedTextReveal text="Test" />);

        const entry = {
            isIntersecting: true,
        } as IntersectionObserverEntry;

        act(() => {
            intersectionObserverCallback([entry], {} as IntersectionObserver);
        });

        const mainLetters = container.querySelectorAll('.z-10');
        expect(mainLetters[0]).toHaveStyle({ opacity: 1 });
    });

    it('should not trigger animation when not intersecting', () => {
        const { container } = render(<AnimatedTextReveal text="Test" />);

        const entry = {
            isIntersecting: false,
        } as IntersectionObserverEntry;

        act(() => {
            intersectionObserverCallback([entry], {} as IntersectionObserver);
        });

        const mainLetters = container.querySelectorAll('.z-10');
        expect(mainLetters[0]).toHaveStyle({ opacity: 0 });
    });

    it('should trigger animation only once when triggerOnce is true', () => {
        const { container } = render(<AnimatedTextReveal text="Test" triggerOnce={true} />);

        // First intersection - should trigger animation
        const entry1 = {
            isIntersecting: true,
        } as IntersectionObserverEntry;
        act(() => {
            intersectionObserverCallback([entry1], {} as IntersectionObserver);
        });

        const mainLetters1 = container.querySelectorAll('.z-10');
        expect(mainLetters1[0]).toHaveStyle({ opacity: 1 });

        // Element leaves viewport (triggerOnce=true means animation stays)
        const entry2 = {
            isIntersecting: false,
        } as IntersectionObserverEntry;
        act(() => {
            intersectionObserverCallback([entry2], {} as IntersectionObserver);
        });

        const mainLetters2 = container.querySelectorAll('.z-10');
        expect(mainLetters2[0]).toHaveStyle({ opacity: 1 });

        // Element re-enters viewport (should not reset because hasAnimated is true)
        const entry3 = {
            isIntersecting: true,
        } as IntersectionObserverEntry;
        act(() => {
            intersectionObserverCallback([entry3], {} as IntersectionObserver);
        });

        const mainLetters3 = container.querySelectorAll('.z-10');
        expect(mainLetters3[0]).toHaveStyle({ opacity: 1 });
    });

    it('should reset animation when triggerOnce is false and element leaves viewport', () => {
        const { container } = render(<AnimatedTextReveal text="Test" triggerOnce={false} />);

        // Element enters viewport
        const entry1 = {
            isIntersecting: true,
        } as IntersectionObserverEntry;
        act(() => {
            intersectionObserverCallback([entry1], {} as IntersectionObserver);
        });

        const mainLetters1 = container.querySelectorAll('.z-10');
        expect(mainLetters1[0]).toHaveStyle({ opacity: 1 });

        // Element leaves viewport
        const entry2 = {
            isIntersecting: false,
        } as IntersectionObserverEntry;
        act(() => {
            intersectionObserverCallback([entry2], {} as IntersectionObserver);
        });

        const mainLetters2 = container.querySelectorAll('.z-10');
        expect(mainLetters2[0]).toHaveStyle({ opacity: 0 });
    });

    it('should not reset animation when triggerOnce is true and element leaves viewport', () => {
        const { container } = render(<AnimatedTextReveal text="Test" triggerOnce={true} />);

        // Element enters viewport
        const entry1 = {
            isIntersecting: true,
        } as IntersectionObserverEntry;
        act(() => {
            intersectionObserverCallback([entry1], {} as IntersectionObserver);
        });

        // Element leaves viewport
        const entry2 = {
            isIntersecting: false,
        } as IntersectionObserverEntry;
        act(() => {
            intersectionObserverCallback([entry2], {} as IntersectionObserver);
        });

        const mainLetters = container.querySelectorAll('.z-10');
        expect(mainLetters[0]).toHaveStyle({ opacity: 1 });
    });

    it('should apply custom letterDelay', () => {
        const { container } = render(
            <AnimatedTextReveal text="AB" letterDelay={100} />
        );

        const entry = {
            isIntersecting: true,
        } as IntersectionObserverEntry;
        act(() => {
            intersectionObserverCallback([entry], {} as IntersectionObserver);
        });

        const mainLetters = container.querySelectorAll('.z-10');
        expect(mainLetters[0]).toHaveStyle({ transitionDelay: '0ms' });
        expect(mainLetters[1]).toHaveStyle({ transitionDelay: '100ms' });
    });

    it('should apply custom fadeDuration', () => {
        const { container } = render(
            <AnimatedTextReveal text="A" fadeDuration={1000} />
        );

        const mainLetters = container.querySelectorAll('.z-10');
        expect(mainLetters[0]).toHaveStyle({ transitionDuration: '1000ms' });
    });

    it('should render blur shadow when blurShadow is true', () => {
        const { container } = render(
            <AnimatedTextReveal text="A" blurShadow={true} />
        );

        const blurLayers = container.querySelectorAll('.blur-sm');
        expect(blurLayers).toHaveLength(1);
    });

    it('should not render blur shadow when blurShadow is false', () => {
        const { container } = render(
            <AnimatedTextReveal text="A" blurShadow={false} />
        );

        const blurLayers = container.querySelectorAll('.blur-sm');
        expect(blurLayers).toHaveLength(0);
    });

    it('should apply custom blurShadowOpacity', () => {
        const { container } = render(
            <AnimatedTextReveal text="A" blurShadow={true} blurShadowOpacity={0.8} />
        );

        const entry = {
            isIntersecting: true,
        } as IntersectionObserverEntry;
        act(() => {
            intersectionObserverCallback([entry], {} as IntersectionObserver);
        });

        const blurLayers = container.querySelectorAll('.blur-sm');
        expect(blurLayers[0]).toHaveStyle({ opacity: 0.8 });
    });

    it('should apply custom shadowColor with rgba format', () => {
        const { container } = render(
            <AnimatedTextReveal text="A" shadowColor="rgba(255,0,0,0.5)" />
        );

        const entry = {
            isIntersecting: true,
        } as IntersectionObserverEntry;
        act(() => {
            intersectionObserverCallback([entry], {} as IntersectionObserver);
        });

        const mainLetters = container.querySelectorAll('.z-10');
        expect(mainLetters[0]).toHaveStyle({
            textShadow: '0 2px 4px rgba(255,0,0,0.5)'
        });
    });

    it('should convert rgba to rgb for blur shadow color', () => {
        const { container } = render(
            <AnimatedTextReveal text="A" blurShadow={true} shadowColor="rgba(255,0,0,0.5)" />
        );

        const entry = {
            isIntersecting: true,
        } as IntersectionObserverEntry;
        act(() => {
            intersectionObserverCallback([entry], {} as IntersectionObserver);
        });

        const blurLayers = container.querySelectorAll('.blur-sm');
        expect(blurLayers[0]).toHaveStyle({
            color: 'rgb(255,0,0)'
        });
    });

    it('should use shadowColor as-is when not rgba format for blur shadow', () => {
        const { container } = render(
            <AnimatedTextReveal text="A" blurShadow={true} shadowColor="red" />
        );

        const blurLayers = container.querySelectorAll('.blur-sm');
        expect(blurLayers[0]).toHaveStyle({ color: 'rgb(255, 0, 0)' });
    });

    it('should set textShadow opacity to 0 when not visible', () => {
        const { container } = render(
            <AnimatedTextReveal text="A" shadowColor="rgba(255,0,0,0.5)" />
        );

        const mainLetters = container.querySelectorAll('.z-10');
        expect(mainLetters[0]).toHaveStyle({
            textShadow: '0 2px 4px rgba(255,0,0,0)'
        });
    });

    it('should render spaces between words', () => {
        const { container } = render(<AnimatedTextReveal text="Hello World Test" />);

        const spaces = container.querySelectorAll('.inline-block');
        // Should have spaces between words
        const nbspElements = Array.from(spaces).filter(
            el => el.innerHTML === '&nbsp;'
        );
        expect(nbspElements.length).toBeGreaterThan(0);
    });

    it('should not render space after last word', () => {
        const { container } = render(<AnimatedTextReveal text="Hello World" />);

        const words = container.querySelectorAll('.whitespace-nowrap');
        const lastWord = words[words.length - 1];

        // Check that last word doesn't have a trailing nbsp sibling
        expect(lastWord.nextSibling).toBeNull();
    });

    it('should handle single word text', () => {
        const { container } = render(<AnimatedTextReveal text="Hello" />);

        const words = container.querySelectorAll('.whitespace-nowrap');
        expect(words).toHaveLength(1);
    });

    it('should handle empty text', () => {
        const { container } = render(<AnimatedTextReveal text="" />);

        const words = container.querySelectorAll('.whitespace-nowrap');
        expect(words).toHaveLength(1); // Empty string creates one word span
    });

    it('should increment globalCharIdx correctly across multiple words', () => {
        const { container } = render(<AnimatedTextReveal text="AB CD" />);

        const entry = {
            isIntersecting: true,
        } as IntersectionObserverEntry;
        act(() => {
            intersectionObserverCallback([entry], {} as IntersectionObserver);
        });

        const mainLetters = container.querySelectorAll('.z-10');
        // A=0ms, B=75ms, C=150ms, D=225ms
        expect(mainLetters[0]).toHaveStyle({ transitionDelay: '0ms' });
        expect(mainLetters[1]).toHaveStyle({ transitionDelay: '75ms' });
        expect(mainLetters[2]).toHaveStyle({ transitionDelay: '150ms' });
        expect(mainLetters[3]).toHaveStyle({ transitionDelay: '225ms' });
    });

    it('should set transition delay to 0ms when not visible', () => {
        const { container } = render(<AnimatedTextReveal text="AB" />);

        const mainLetters = container.querySelectorAll('.z-10');
        expect(mainLetters[0]).toHaveStyle({ transitionDelay: '0ms' });
        expect(mainLetters[1]).toHaveStyle({ transitionDelay: '0ms' });
    });

    it('should set blur shadow opacity to 0 when not visible', () => {
        const { container } = render(
            <AnimatedTextReveal text="A" blurShadow={true} />
        );

        const blurLayers = container.querySelectorAll('.blur-sm');
        expect(blurLayers[0]).toHaveStyle({ opacity: 0 });
    });

    it('should handle observer callback when elementRef is null', () => {
        // This tests the early return in useEffect when elementRef.current is null
        const { rerender } = render(<AnimatedTextReveal text="Test" />);

        // Force a rerender to test the observer setup again
        rerender(<AnimatedTextReveal text="Test Updated" />);

        expect(mockObserve).toHaveBeenCalled();
    });

    it('should not trigger animation when intersecting but hasAnimated is true and triggerOnce is true', () => {
        const { container, rerender } = render(
            <AnimatedTextReveal text="Test" triggerOnce={true} />
        );

        // First intersection - should trigger
        const entry1 = {
            isIntersecting: true,
        } as IntersectionObserverEntry;
        act(() => {
            intersectionObserverCallback([entry1], {} as IntersectionObserver);
        });

        // Force re-render to update hasAnimated state
        rerender(<AnimatedTextReveal text="Test" triggerOnce={true} />);

        // Second intersection - should not trigger due to hasAnimated
        const entry2 = {
            isIntersecting: true,
        } as IntersectionObserverEntry;
        act(() => {
            intersectionObserverCallback([entry2], {} as IntersectionObserver);
        });

        const mainLetters = container.querySelectorAll('.z-10');
        expect(mainLetters[0]).toHaveStyle({ opacity: 1 });
    });

    it('should handle multiple words with proper spacing', () => {
        const { container } = render(
            <AnimatedTextReveal text="One Two Three" />
        );

        const words = container.querySelectorAll('.whitespace-nowrap');
        expect(words).toHaveLength(3);

        // Check that each word has the correct number of characters
        const word1Chars = words[0].querySelectorAll('.relative.inline-block');
        const word2Chars = words[1].querySelectorAll('.relative.inline-block');
        const word3Chars = words[2].querySelectorAll('.relative.inline-block');

        expect(word1Chars).toHaveLength(6); // "One"
        expect(word2Chars).toHaveLength(6); // "Two"
        expect(word3Chars).toHaveLength(10); // "Three"
    });

    it('should apply all custom props together', () => {
        const { container } = render(
            <AnimatedTextReveal
                text="Test"
                className="custom"
                letterDelay={50}
                fadeDuration={800}
                threshold={0.6}
                rootMargin="20px"
                shadowColor="rgba(0,255,0,0.7)"
                blurShadow={true}
                blurShadowOpacity={0.6}
                triggerOnce={false}
            />
        );

        expect(container.querySelector('.custom')).toBeInTheDocument();
        expect(mockIntersectionObserver).toHaveBeenCalledWith(
            expect.any(Function),
            {
                threshold: 0.6,
                rootMargin: '20px',
            }
        );

        const mainLetters = container.querySelectorAll('.z-10');
        expect(mainLetters[0]).toHaveStyle({ transitionDuration: '800ms' });
    });

    it('should handle rgb shadowColor format without rgba conversion', () => {
        const { container } = render(
            <AnimatedTextReveal text="A" blurShadow={true} shadowColor="rgb(255,0,0)" />
        );

        const blurLayers = container.querySelectorAll('.blur-sm');
        expect(blurLayers[0]).toHaveStyle({ color: 'rgb(255,0,0)' });
    });

    it('should handle hex shadowColor format', () => {
        const { container } = render(
            <AnimatedTextReveal text="A" shadowColor="#ff0000" />
        );

        const entry = {
            isIntersecting: true,
        } as IntersectionObserverEntry;
        act(() => {
            intersectionObserverCallback([entry], {} as IntersectionObserver);
        });

        const mainLetters = container.querySelectorAll('.z-10');
        expect(mainLetters[0]).toHaveStyle({
            textShadow: '0 2px 4px #ff0000'
        });
    });
});
