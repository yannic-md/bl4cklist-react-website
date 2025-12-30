// noinspection DuplicatedCode

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import ImprintSection from "@/components/sections/imprint/ImprintSection";

// Mock react-icons
jest.mock('react-icons/fa', () => ({
    FaChevronDown: ({ className, size }: any) => (
        <div data-testid="chevron-icon" className={className} data-size={size}>ChevronDown</div>
    ),
}));

// Mock imprint data
jest.mock('@/data/imprintData', () => ({
    imprintData: [
        {
            id: 'section-1',
            title: 'Parent Section 1',
            content: 'Parent content 1',
            children: [
                { id: 'section-1-1', title: 'Child Section 1.1', content: 'Child content 1.1' },
                { id: 'section-1-2', title: 'Child Section 1.2', content: 'Child content 1.2' },
            ],
        },
        {
            id: 'section-2',
            title: 'Parent Section 2',
            content: 'Parent content 2',
        },
        {
            id: 'section-3',
            title: 'Parent Section 3',
            content: 'Parent content 3',
            children: [
                { id: 'section-3-1', title: 'Child Section 3.1', content: 'Child content 3.1' },
            ],
        },
    ],
}));

describe('ImprintSection', () => {
    let intersectionObserverCallback: IntersectionObserverCallback;
    let mockObserve: jest.Mock;
    let mockUnobserve: jest.Mock;
    let mockDisconnect: jest.Mock;

    beforeEach(() => {
        mockObserve = jest.fn();
        mockUnobserve = jest.fn();
        mockDisconnect = jest.fn();

        // Mock IntersectionObserver
        const mockIntersectionObserver = jest.fn((callback: IntersectionObserverCallback) => {
            intersectionObserverCallback = callback;
            return {observe: mockObserve, unobserve: mockUnobserve, disconnect: mockDisconnect};
        });

        global.IntersectionObserver = mockIntersectionObserver as any;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render header with correct title and description', () => {
        render(<ImprintSection />);

        expect(screen.getByText('Impressum & Datenschutz')).toBeInTheDocument();
        expect(screen.getByText(/Auf dieser Seite findest du alle gesetzlich/i)).toBeInTheDocument();
        expect(screen.getByText(/DIESE SEITE IST NUR IN DER DEUTSCHEN SPRACHE VERFÜGBAR/i)).toBeInTheDocument();
        expect(screen.getByText(/Aktualisiert am: 9. Dezember 2025 um 21:23 Uhr/i)).toBeInTheDocument();
    });

    it('should render all parent sections in sidebar and content', () => {
        render(<ImprintSection />);

        expect(screen.getByText('Parent Section 1')).toBeInTheDocument();
        expect(screen.getByText('Parent Section 2')).toBeInTheDocument();
        expect(screen.getByText('Parent Section 3')).toBeInTheDocument();
        expect(screen.getByText('Parent content 1')).toBeInTheDocument();
        expect(screen.getByText('Parent content 2')).toBeInTheDocument();
        expect(screen.getByText('Parent content 3')).toBeInTheDocument();
    });

    it('should render all child sections initially expanded', () => {
        render(<ImprintSection />);

        expect(screen.getByText('Child Section 1.1')).toBeInTheDocument();
        expect(screen.getByText('Child Section 1.2')).toBeInTheDocument();
        expect(screen.getByText('Child Section 3.1')).toBeInTheDocument();
        expect(screen.getByText('Child content 1.1')).toBeInTheDocument();
        expect(screen.getByText('Child content 1.2')).toBeInTheDocument();
        expect(screen.getByText('Child content 3.1')).toBeInTheDocument();
    });

    it('should render chevron icons only for parent sections with children', () => {
        render(<ImprintSection />);

        const chevrons = screen.getAllByTestId('chevron-icon');
        // Section 1 and Section 3 have children, Section 2 does not
        expect(chevrons).toHaveLength(2);
    });

    it('should collapse child sections when chevron is clicked', () => {
        render(<ImprintSection />);

        const chevronButtons = screen.getAllByLabelText('Close');

        // Click first chevron (section-1)
        fireEvent.click(chevronButtons[0]);

        // Child sections should be hidden
        expect(screen.queryByText('Child Section 1.1')).not.toBeInTheDocument();
        expect(screen.queryByText('Child Section 1.2')).not.toBeInTheDocument();

        // Other sections should still be visible
        expect(screen.getByText('Child Section 3.1')).toBeInTheDocument();
    });

    it('should expand child sections when chevron is clicked again', () => {
        render(<ImprintSection />);

        const chevronButtons = screen.getAllByLabelText('Close');

        // Collapse
        fireEvent.click(chevronButtons[0]);
        expect(screen.queryByText('Child Section 1.1')).not.toBeInTheDocument();

        // Expand
        const openButton = screen.getByLabelText('Open');
        fireEvent.click(openButton);

        expect(screen.getByText('Child Section 1.1')).toBeInTheDocument();
        expect(screen.getByText('Child Section 1.2')).toBeInTheDocument();
    });

    it('should prevent default navigation when clicking chevron', () => {
        render(<ImprintSection />);

        const chevronButton = screen.getAllByLabelText('Close')[0];
        const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
        const preventDefaultSpy = jest.spyOn(clickEvent, 'preventDefault');

        fireEvent(chevronButton, clickEvent);

        expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should render correct paragraph counts for parent sections', () => {
        render(<ImprintSection />);

        // Parent sections should have "1.", "2.", "3."
        const sidebar = screen.getByRole('complementary');
        expect(sidebar.textContent).toContain('1.');
        expect(sidebar.textContent).toContain('2.');
        expect(sidebar.textContent).toContain('3.');
    });

    it('should render correct paragraph counts for child sections', () => {
        render(<ImprintSection />);

        const sidebar = screen.getByRole('complementary');
        // Child sections should have "1.1", "1.2", "3.1"
        expect(sidebar.textContent).toContain('1.1');
        expect(sidebar.textContent).toContain('1.2');
        expect(sidebar.textContent).toContain('3.1');
    });

    it('should set active section when IntersectionObserver detects intersection', () => {
        render(<ImprintSection />);

        const entry: Partial<IntersectionObserverEntry> = {
            isIntersecting: true,
            target: { id: 'section-1-1' } as HTMLElement,
        };

        act(() => {
            intersectionObserverCallback([entry as IntersectionObserverEntry], {} as IntersectionObserver);
        });

        // Active section should have text-zinc-100 class
        const activeLink = screen.getByRole('link', { name: /1.1 Child Section 1.1/i });
        expect(activeLink).toHaveClass('text-zinc-100');
    });

    it('should not set active section when IntersectionObserver detects no intersection', () => {
        render(<ImprintSection />);

        const entry: Partial<IntersectionObserverEntry> = {
            isIntersecting: false,
            target: { id: 'section-1-1' } as HTMLElement,
        };

        act(() => {
            intersectionObserverCallback([entry as IntersectionObserverEntry], {} as IntersectionObserver);
        });

        // Link should have default text-zinc-400 class
        const link = screen.getByRole('link', { name: /1.1 Child Section 1.1/i });
        expect(link).toHaveClass('text-zinc-400');
    });

    it('should highlight parent section when child section is active', () => {
        render(<ImprintSection />);

        const entry: Partial<IntersectionObserverEntry> = {
            isIntersecting: true,
            target: { id: 'section-1-1' } as HTMLElement,
        };

        act(() => {
            intersectionObserverCallback([entry as IntersectionObserverEntry], {} as IntersectionObserver);
        });

        // Parent section should also be highlighted
        const parentLink = screen.getByRole('link', { name: /1. Parent Section 1/i });
        expect(parentLink).toHaveClass('text-zinc-100');
    });

    it('should observe all article sections on mount', () => {
        render(<ImprintSection />);

        // 3 parent sections + 3 child sections = 6 total
        expect(mockObserve).toHaveBeenCalledTimes(6);
    });

    it('should disconnect IntersectionObserver on unmount', () => {
        const { unmount } = render(<ImprintSection />);

        unmount();

        expect(mockDisconnect).toHaveBeenCalledTimes(1);
    });

    it('should render articles with correct heading sizes for parent sections', () => {
        render(<ImprintSection />);

        const parentHeadings = screen.getAllByRole('heading', { level: 2 });
        const parentHeading = parentHeadings.find(h => h.textContent === '1. Parent Section 1');

        expect(parentHeading).toHaveClass('text-3xl');
        expect(parentHeading).toHaveClass('lg:text-4xl');
    });

    it('should render articles with correct heading sizes for child sections', () => {
        render(<ImprintSection />);

        const childHeadings = screen.getAllByRole('heading', { level: 2 });
        const childHeading = childHeadings.find(h => h.textContent === '1.1 Child Section 1.1');

        expect(childHeading).toHaveClass('text-xl');
        expect(childHeading).toHaveClass('lg:text-2xl');
    });

    it('should render section content with dangerouslySetInnerHTML', () => {
        render(<ImprintSection />);

        const contentParagraphs = screen.getAllByText((content, element) => {
            return element?.tagName.toLowerCase() === 'p' &&
                element.innerHTML.includes('Parent content 1');
        });

        expect(contentParagraphs.length).toBeGreaterThan(0);
    });

    it('should apply correct href to sidebar links', () => {
        render(<ImprintSection />);

        const link = screen.getByRole('link', { name: /1. Parent Section 1/i });
        expect(link).toHaveAttribute('href', '#section-1');
    });

    it('should toggle chevron rotation class when section is collapsed', () => {
        render(<ImprintSection />);

        const chevronButton = screen.getAllByLabelText('Close')[0];
        const chevronIcon = chevronButton.querySelector('[data-testid="chevron-icon"]');

        expect(chevronIcon).not.toHaveClass('-rotate-90');

        fireEvent.click(chevronButton);

        const collapsedChevronIcon = screen.getByLabelText('Open').querySelector('[data-testid="chevron-icon"]');
        expect(collapsedChevronIcon).toHaveClass('-rotate-90');
    });

    it('should handle multiple intersection events correctly', () => {
        render(<ImprintSection />);

        const entry1: Partial<IntersectionObserverEntry> = {
            isIntersecting: true,
            target: { id: 'section-1' } as HTMLElement,
        };

        const entry2: Partial<IntersectionObserverEntry> = {
            isIntersecting: true,
            target: { id: 'section-2' } as HTMLElement,
        };

        act(() => {
            intersectionObserverCallback([entry1 as IntersectionObserverEntry], {} as IntersectionObserver);
        });

        act(() => {
            intersectionObserverCallback([entry2 as IntersectionObserverEntry], {} as IntersectionObserver);
        });

        // Last intersecting section should be active
        const activeLink = screen.getByRole('link', { name: /2. Parent Section 2/i });
        expect(activeLink).toHaveClass('text-zinc-100');
    });

    it('should render parent section without children correctly in sidebar', () => {
        render(<ImprintSection />);

        const section2Link = screen.getByRole('link', { name: /2. Parent Section 2/i });

        // Should not have ml-4 class (only children have it)
        expect(section2Link).not.toHaveClass('ml-4');

        // Should not have chevron button
        const chevronButtons = screen.getAllByLabelText(/Close|Open/i);
        expect(chevronButtons).toHaveLength(2); // Only section-1 and section-3 have children
    });

    it('should calculate paragraph count correctly when childIndex is undefined', () => {
        render(<ImprintSection />);

        const sidebar = screen.getByRole('complementary');

        // Parent sections (childIndex undefined) should end with "."
        expect(sidebar.textContent).toContain('1.');
        expect(sidebar.textContent).toContain('2.');
        expect(sidebar.textContent).toContain('3.');
    });

    it('should calculate paragraph count correctly when childIndex is defined', () => {
        render(<ImprintSection />);

        const sidebar = screen.getByRole('complementary');

        // Child sections (childIndex defined) should have format "N.M"
        expect(sidebar.textContent).toContain('1.1');
        expect(sidebar.textContent).toContain('1.2');
        expect(sidebar.textContent).toContain('3.1');
    });

    it('should set ref for each article section', () => {
        const { container } = render(<ImprintSection />);

        const articles = container.querySelectorAll('article');

        // Should have 6 articles (3 parents + 3 children)
        expect(articles).toHaveLength(6);

        // All articles should have an id
        articles.forEach((article) => {
            expect(article.id).toBeTruthy();
        });
    });
});