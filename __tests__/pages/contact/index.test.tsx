import { render, screen, fireEvent } from '@testing-library/react';
import { useTranslations } from 'next-intl';
import Contact, { getStaticProps } from '@/pages/contact';

// Mock all external dependencies
jest.mock('next-intl', () => ({
    useTranslations: jest.fn(),
}));

jest.mock('next/image', () => ({
    __esModule: true,
    default: ({fill, unoptimized, priority, src, alt, ...rest}: any) => {
        // eslint-disable-next-line @next/next/no-img-element
        return ( <img src={src} alt={alt || ""}{...rest} /> );
    },
}));

jest.mock('@/components/sections/imprint/ContactHero', () => ({
    __esModule: true,
    default: ({ onFormSelect }: any) => (
        <div data-testid="contact-hero">
            <button onClick={() => onFormSelect('unban')}>Select Unban</button>
            <button onClick={() => onFormSelect('general')}>Select General</button>
            <button onClick={() => onFormSelect('unban')}>Toggle Same</button>
        </div>
    ),
}));

jest.mock('@/components/sections/imprint/ContactFormSection', () => ({
    __esModule: true,
    default: ({ selectedForm }: any) => (
        <div data-testid="contact-form-section">
            {selectedForm && <div>Form: {selectedForm}</div>}
        </div>
    ),
}));

jest.mock('@/components/elements/layout/Header', () => ({
    __esModule: true,
    default: () => <header data-testid="header">Header</header>,
}));

jest.mock('@/components/elements/layout/Footer', () => ({
    __esModule: true,
    default: () => <footer data-testid="footer">Footer</footer>,
}));

jest.mock('@/components/elements/MetaHead', () => ({
    __esModule: true,
    default: ({ title, description }: any) => (
        <div data-testid="meta-head">
            <span>{title}</span>
            <span>{description}</span>
        </div>
    ),
}));

jest.mock('../../../messages/de.json', () => ({ default: { test: 'nachricht' } }), { virtual: true });
jest.mock('../../../messages/en.json', () => ({ default: { test: 'message' } }), { virtual: true });

describe('Contact Page', () => {
    const mockTSEO = jest.fn();
    const mockTContactHero = jest.fn();
    const mockScrollIntoView = jest.fn();

    beforeEach(() => {
        // Setup translation mocks
        mockTSEO.mockReturnValue('Contact Page Title');
        mockTContactHero.mockReturnValue('Contact page description');
        (useTranslations as jest.Mock).mockImplementation((namespace: string) => {
            if (namespace === 'SEO') return mockTSEO;
            if (namespace === 'ContactHero') return mockTContactHero;
            return jest.fn();
        });

        // Mock scrollIntoView
        Element.prototype.scrollIntoView = mockScrollIntoView;

        // Mock getElementById to return a valid element
        const mockElement = document.createElement('div');
        mockElement.id = 'really-cool-thing';
        jest.spyOn(document, 'getElementById').mockReturnValue(mockElement);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render all main components correctly', () => {
        render(<Contact />);

        expect(screen.getByTestId('meta-head')).toBeInTheDocument();
        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('contact-hero')).toBeInTheDocument();
        expect(screen.getByTestId('contact-form-section')).toBeInTheDocument();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('should render MetaHead with correct translations', () => {
        render(<Contact />);

        expect(mockTSEO).toHaveBeenCalledWith('contactTitle');
        expect(mockTContactHero).toHaveBeenCalledWith('description');
        expect(screen.getByText('Contact Page Title')).toBeInTheDocument();
        expect(screen.getByText('Contact page description')).toBeInTheDocument();
    });

    it('should render background grid image with correct props', () => {
        render(<Contact />);

        const gridImage = screen.getByAltText('Grid BG ~ Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server');
        expect(gridImage).toBeInTheDocument();
        expect(gridImage).toHaveAttribute('src', '/images/bg/grid-1916w.avif');
    });

    it('should handle form selection for unban type', () => {
        render(<Contact />);

        const unbanButton = screen.getByText('Select Unban');
        fireEvent.click(unbanButton);

        expect(screen.getByText('Form: unban')).toBeInTheDocument();
        expect(document.getElementById).toHaveBeenCalledWith('really-cool-thing');
        expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    });

    it('should handle form selection for general type', () => {
        render(<Contact />);

        const generalButton = screen.getByText('Select General');
        fireEvent.click(generalButton);

        expect(screen.getByText('Form: general')).toBeInTheDocument();
        expect(document.getElementById).toHaveBeenCalledWith('really-cool-thing');
        expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    });

    it('should toggle form to null when selecting same form type', () => {
        render(<Contact />);

        // First click - select unban
        const unbanButton = screen.getByText('Select Unban');
        fireEvent.click(unbanButton);
        expect(screen.getByText('Form: unban')).toBeInTheDocument();

        // Second click - toggle same form (should set to null)
        const toggleButton = screen.getByText('Toggle Same');
        fireEvent.click(toggleButton);
        expect(screen.queryByText('Form: unban')).not.toBeInTheDocument();
    });

    it('should not scroll when form element is not found', () => {
        // Mock getElementById to return null
        (document.getElementById as jest.Mock).mockReturnValue(null);

        render(<Contact />);

        const unbanButton = screen.getByText('Select Unban');
        fireEvent.click(unbanButton);

        expect(document.getElementById).toHaveBeenCalledWith('really-cool-thing');
        expect(mockScrollIntoView).not.toHaveBeenCalled();
    });

    it('should pass onFormSelect handler to ContactHero', () => {
        render(<Contact />);

        const contactHero = screen.getByTestId('contact-hero');
        expect(contactHero).toBeInTheDocument();

        // Verify handler works by triggering form selection
        const unbanButton = screen.getByText('Select Unban');
        fireEvent.click(unbanButton);
        expect(screen.getByText('Form: unban')).toBeInTheDocument();
    });

    it('should pass selectedForm state to ContactFormSection', () => {
        render(<Contact />);

        // Initially no form selected
        expect(screen.queryByText(/Form:/)).not.toBeInTheDocument();

        // Select a form
        const generalButton = screen.getByText('Select General');
        fireEvent.click(generalButton);

        // Form section should receive the selected form
        expect(screen.getByText('Form: general')).toBeInTheDocument();
    });

    describe('getStaticProps', () => {
        it('should return messages for the provided locale', async () => {
            const context = {locale: 'de'} as any;

            const response = await getStaticProps(context);

            expect(response).toEqual({
                props: {
                    messages: { default: { test: 'nachricht' } }
                }
            });
        });

        it('should handle a different locale correctly', async () => {
            const context = {locale: 'en'} as any;

            const response = await getStaticProps(context);

            expect(response).toEqual({
                props: {
                    messages: { default: { test: 'message' } }
                }
            });
        });
    });
});
