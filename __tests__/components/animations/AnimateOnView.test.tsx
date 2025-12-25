import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import {AnimateOnView} from '@/components/animations/AnimateOnView'

describe('AnimateOnView Component', () => {
    it('should render without crashing', () => {
        const { container } = render(<AnimateOnView {...({} as any)} />);
        expect(container).toBeInTheDocument();
    });
})