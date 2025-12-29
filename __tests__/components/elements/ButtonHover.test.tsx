import { render } from '@testing-library/react';
import ButtonHover from "@/components/elements/ButtonHover";

// Mock
jest.mock('@/styles/components/index.module.css', () => ({
    showcase_top_edge: 'mock-showcase-top-edge',
    showcase_bottom_edge: 'mock-showcase-bottom-edge',
}));

describe('ButtonHover', () => {
    it('should render component', () => {
        const { container } = render(<ButtonHover />);

        const corners = container.querySelectorAll('.absolute.z-\\[1\\]');
        expect(corners).toHaveLength(4);
    });
});