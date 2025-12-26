import React from 'react';
import { render, screen } from '@testing-library/react';
import {AdContainer} from "@/components/elements/ads/AdWrapper";

describe('AdContainer', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
    });

    it('should render the container with children', () => {
        render(
            <AdContainer>
                <span>Ad Content</span>
            </AdContainer>
        );

        expect(screen.getByText('Ad Content')).toBeInTheDocument();

        const outerDiv = screen.getByText('Ad Content').parentElement?.parentElement;
        expect(outerDiv).toHaveClass('w-full', 'flex', 'justify-center', 'px-4', 'overflow-hidden', 'max-h-[128px]');

        const innerDiv = screen.getByText('Ad Content').parentElement;
        expect(innerDiv).toHaveClass('max-w-7xl', 'w-full');
    });
});
