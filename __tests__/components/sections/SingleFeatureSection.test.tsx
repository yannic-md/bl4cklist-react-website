import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import SingleFeatureSection, {SingleFeatureSectionProps} from "@/components/sections/SingleFeatureSection";
import {APIStatistics} from "@/types/APIResponse";
import {GuildFeature, GuildStatistic} from "@/types/GuildFeature";

type MockTranslationFunction = jest.Mock<any, [string, any?]> & {
    rich: jest.Mock<any, [string, any]>;
};

// Mock all Next.js and external dependencies
jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));

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

jest.mock('@/components/animations/ParticlesBackground', () => ({
    __esModule: true,
    ParticlesBackground: ({ className }: { className: string }) => <div data-testid="particles-background" className={className} />,
}));

jest.mock('@/components/animations/AnimateOnView', () => {
    const MockAnimate = ({ children, className, animation }: any) => (
        <div data-testid="animate-on-view" className={className} data-animation={animation}>
            {children}
        </div>
    );
    return {__esModule: true, AnimateOnView: MockAnimate};
});

jest.mock('@/components/animations/TextReveal', () => ({
    __esModule: true,
    AnimatedTextReveal: ({ text, className }: any) => <div className={className}>{text}</div>,
}));

jest.mock('@/components/animations/Counter', () => ({
    __esModule: true,
    AnimatedCounter: ({ end, suffix, locale }: any) => (
        <span data-testid="animated-counter" data-end={end} data-suffix={suffix} data-locale={locale}>
            {end}{suffix}
        </span>
    ),
}));

jest.mock('@/components/elements/ButtonHover', () => ({
    __esModule: true,
    default: () => <div data-testid="button-hover" />,
}));

jest.mock('@/components/elements/ads/AdWrapper', () => ({
    __esModule: true,
    AdContainer: ({ children }: any) => <div data-testid="ad-container">{children}</div>,
}));

jest.mock('@/components/elements/ads/AdBanner', () => ({
    __esModule: true,
    default: ({ dataAdSlot, dataAdFormat }: any) => (
        <div data-testid="ad-banner" data-ad-slot={dataAdSlot} data-ad-format={dataAdFormat} />
    ),
}));

jest.mock('@/components/elements/misc/DecorationalImage', () => ({
    __esModule: true,
    default: () => <div data-testid="decorational-image" />,
}));

// Mock style imports
jest.mock('@/styles/components/index.module.css', () => ({
    head_border: 'head_border',
}));

jest.mock('@/styles/util/colors.module.css', () => ({
    text_gradient_gray: 'text_gradient_gray',
}));

jest.mock('@/styles/util/buttons.module.css', () => ({
    white_gray: 'white_gray',
}));

describe('SingleFeatureSection', () => {
    const mockRouter = {
        locale: 'de',
        pathname: '/',
        query: {},
        asPath: '/',
        push: jest.fn(),
    };

    const mockTranslations = {
        WelcomeHero: jest.fn((key: string) => {
            const translations: Record<string, string> = {
                memberCount: 'Mitglieder',
                joinDiscord: 'Discord beitreten',
            };
            return translations[key] || key;
        }),
        default: jest.fn((key: string) => {
            const translations: Record<string, string> = {
                infoTag: 'INFO TAG',
                title: 'Test Title',
                description: 'Test description',
                description2: 'Test description 2',
                count_chat: 'Nachrichten',
            };
            return translations[key] || key;
        }) as unknown as MockTranslationFunction,
    };

    mockTranslations.default.rich = jest.fn();

    const defaultProps: SingleFeatureSectionProps = {
        sectionId: 'test-section',
        translationNamespace: 'TestSection',
        imageSrc: '/test-image.webp',
        imageAlt: 'Test Alt',
        titleEmoji: '🚀',
        guildStats: {
            member_count: 5000,
            online_count: 1200,
            message_count: 9999999,
        } as APIStatistics,
    };

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        (useTranslations as jest.Mock).mockImplementation((namespace: string) => {
            if (namespace === 'WelcomeHero') return mockTranslations.WelcomeHero;
            return mockTranslations.default;
        });

        mockTranslations.default.rich.mockImplementation((key: string, formatters: any) => {
            if (key === 'description') {
                return formatters.strong ? formatters.strong('Bold text') : 'Test description';
            }
            if (key === 'description2') {
                return formatters.strong ? formatters.strong('Bold text 2') : 'Test description 2';
            }
            return key;
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render with default props', () => {
        render(<SingleFeatureSection {...defaultProps} />);

        expect(screen.getByText(/Test Title/i)).toBeInTheDocument();
        expect(screen.getByAltText('Test Alt')).toBeInTheDocument();
    });

    it('should render particles when particlesEnabled is true', () => {
        render(<SingleFeatureSection {...defaultProps} particlesEnabled={true} />);

        expect(screen.getByTestId('particles-background')).toBeInTheDocument();
    });

    it('should not render particles when particlesEnabled is false', () => {
        render(<SingleFeatureSection {...defaultProps} particlesEnabled={false} />);

        expect(screen.queryByTestId('particles-background')).not.toBeInTheDocument();
    });

    it('should render image on the right when imagePosition is right', () => {
        render(<SingleFeatureSection {...defaultProps} imagePosition="right" />);

        const animations = screen.getAllByTestId('animate-on-view');
        const imageAnimation = animations.find(el => el.getAttribute('data-animation')?.includes('fadeInRight'));
        expect(imageAnimation).toBeInTheDocument();
    });

    it('should render image on the left when imagePosition is left', () => {
        render(<SingleFeatureSection {...defaultProps} imagePosition="left" />);

        const animations = screen.getAllByTestId('animate-on-view');
        const imageAnimation = animations.find(el => el.getAttribute('data-animation')?.includes('fadeInLeft'));
        expect(imageAnimation).toBeInTheDocument();
    });

    it('should render CTA button when ctaEnabled is true', () => {
        render(<SingleFeatureSection {...defaultProps} ctaEnabled={true} />);

        expect(screen.getByText('Discord beitreten')).toBeInTheDocument();
        expect(screen.getByTestId('button-hover')).toBeInTheDocument();
    });

    it('should not render CTA button when ctaEnabled is false', () => {
        render(<SingleFeatureSection {...defaultProps} ctaEnabled={false} />);

        expect(screen.queryByText('Discord beitreten')).not.toBeInTheDocument();
        expect(screen.queryByTestId('button-hover')).not.toBeInTheDocument();
    });

    it('should render planet decorations when planetDecoration is 1', () => {
        render(<SingleFeatureSection {...defaultProps} planetDecoration={1} />);

        const planetImages = screen.getAllByAltText(/Planet #[12]/);
        expect(planetImages).toHaveLength(2);
        expect(planetImages[0]).toHaveAttribute('src', '/images/bg/venus-128w.webp');
        expect(planetImages[1]).toHaveAttribute('src', '/images/bg/uranus-128w.webp');
    });

    it('should render planet decorations when planetDecoration is 2', () => {
        render(<SingleFeatureSection {...defaultProps} planetDecoration={2} />);

        const planetImages = screen.getAllByAltText(/Planet #[12]/);
        expect(planetImages[0]).toHaveAttribute('src', '/images/bg/neptune-128w.webp');
        expect(planetImages[1]).toHaveAttribute('src', '/images/bg/pluto-128w.webp');
    });

    it('should render planet decorations when planetDecoration is 3', () => {
        render(<SingleFeatureSection {...defaultProps} planetDecoration={3} />);

        const planetImages = screen.getAllByAltText(/Planet #[12]/);
        expect(planetImages[0]).toHaveAttribute('src', '/images/bg/moon.svg');
        expect(planetImages[1]).toHaveAttribute('src', '/images/bg/mars-128w.webp');
    });

    it('should render planet decorations when planetDecoration is 4', () => {
        render(<SingleFeatureSection {...defaultProps} planetDecoration={4} />);

        const planetImages = screen.getAllByAltText(/Planet #[12]/);
        expect(planetImages[0]).toHaveAttribute('src', '/images/bg/jupiter-128w.webp');
        expect(planetImages[1]).toHaveAttribute('src', '/images/bg/earth-128w.webp');
    });

    it('should not render planet decorations when planetDecoration is none', () => {
        render(<SingleFeatureSection {...defaultProps} planetDecoration="none" />);

        expect(screen.queryByAltText(/Planet #[12]/)).not.toBeInTheDocument();
    });

    it('should render top gradients when showTopGradients is true', () => {
        render(<SingleFeatureSection {...defaultProps} showTopGradients={true} />);

        const gradient = screen.getByAltText(/Colored BG/);
        expect(gradient).toBeInTheDocument();
        expect(gradient).toHaveAttribute('src', '/images/bg/color-gradient-800w.avif');
    });

    it('should not render top gradients when showTopGradients is false', () => {
        render(<SingleFeatureSection {...defaultProps} showTopGradients={false} />);

        expect(screen.queryByAltText(/Colored BG/)).not.toBeInTheDocument();
    });

    it('should render custom statistics when provided', () => {
        const customStats: GuildStatistic[] = [
            { end: 100, suffix: '+', icon: '⭐', label: 'Custom Stat' },
            { end: 200, suffix: 'k', icon: '🎯', label: 'Another Stat' },
        ];

        render(<SingleFeatureSection {...defaultProps} customStatistics={customStats} />);

        expect(screen.getByText('100+')).toBeInTheDocument();
        expect(screen.getByText('200k')).toBeInTheDocument();
        expect(screen.getByText(/Custom Stat/)).toBeInTheDocument();
        expect(screen.getByText(/Another Stat/)).toBeInTheDocument();
    });

    it('should use default statistics when customStatistics is not provided', () => {
        render(<SingleFeatureSection {...defaultProps} />);

        expect(screen.getByText('5000+')).toBeInTheDocument();
        expect(screen.getByText('1200+')).toBeInTheDocument();
        expect(screen.getByText('9999999+')).toBeInTheDocument();
    });

    it('should use fallback values when guildStats is undefined', () => {
        const propsWithoutStats = { ...defaultProps };
        delete propsWithoutStats.guildStats;

        render(<SingleFeatureSection {...propsWithoutStats} />);

        expect(screen.getByText('3533+')).toBeInTheDocument();
        expect(screen.getByText('890+')).toBeInTheDocument();
        expect(screen.getByText('4381784+')).toBeInTheDocument();
    });

    it('should render guild features when provided', () => {
        const guildFeatures: GuildFeature[][] = [
            [
                {
                    src: '/feature1.png',
                    alt: 'Feature 1',
                    titleKey: 'feature1_title',
                    descKey: 'feature1_desc',
                    animation: 'animate__fadeInLeft',
                },
                {
                    src: '/feature2.png',
                    alt: 'Feature 2',
                    titleKey: 'feature2_title',
                    descKey: 'feature2_desc',
                    animation: 'animate__fadeInRight',
                },
            ],
        ];

        render(<SingleFeatureSection {...defaultProps} guildFeatures={guildFeatures} />);

        expect(screen.getByAltText('Feature 1')).toBeInTheDocument();
        expect(screen.getByAltText('Feature 2')).toBeInTheDocument();
        expect(screen.getByText('feature1_title')).toBeInTheDocument();
        expect(screen.getByText('feature2_title')).toBeInTheDocument();
    });

    it('should not render guild features when not provided', () => {
        render(<SingleFeatureSection {...defaultProps} />);

        expect(screen.queryByText('feature1_title')).not.toBeInTheDocument();
    });

    it('should render guild features with empty array', () => {
        render(<SingleFeatureSection {...defaultProps} guildFeatures={[]} />);

        expect(screen.queryByText('feature1_title')).not.toBeInTheDocument();
    });

    it('should render AdBanner when translationNamespace is ClankGiveawaysSection', () => {
        render(<SingleFeatureSection {...defaultProps} translationNamespace="ClankGiveawaysSection" />);

        expect(screen.getByTestId('ad-container')).toBeInTheDocument();
        expect(screen.getByTestId('ad-banner')).toBeInTheDocument();
        const adBanner = screen.getByTestId('ad-banner');
        expect(adBanner).toHaveAttribute('data-ad-slot', '9048181934');
        expect(adBanner).toHaveAttribute('data-ad-format', 'horizontal');
    });

    it('should not render AdBanner when translationNamespace is not ClankGiveawaysSection', () => {
        render(<SingleFeatureSection {...defaultProps} translationNamespace="OtherSection" />);

        expect(screen.queryByTestId('ad-container')).not.toBeInTheDocument();
        expect(screen.queryByTestId('ad-banner')).not.toBeInTheDocument();
    });

    it('should render DecorationalImage when translationNamespace is ClankGlobalSection', () => {
        render(<SingleFeatureSection {...defaultProps} translationNamespace="ClankGlobalSection" />);

        expect(screen.getByTestId('decorational-image')).toBeInTheDocument();
    });

    it('should not render DecorationalImage when translationNamespace is not ClankGlobalSection', () => {
        render(<SingleFeatureSection {...defaultProps} translationNamespace="OtherSection" />);

        expect(screen.queryByTestId('decorational-image')).not.toBeInTheDocument();
    });

    it('should apply smaller font size for long titles', () => {
        mockTranslations.default.mockImplementation((key: string) => {
            if (key === 'title') return 'This is a very long title with more than 15 characters';
            return key;
        });

        const { container } = render(<SingleFeatureSection {...defaultProps} />);

        const heading = container.querySelector('h2');
        expect(heading?.className).toContain('text-[clamp(2rem,_1.3838rem_+_2.6291vw,_2.75rem)]');
    });

    it('should apply larger font size for short titles', () => {
        mockTranslations.default.mockImplementation((key: string) => {
            if (key === 'title') return 'Short';
            return key;
        });

        const { container } = render(<SingleFeatureSection {...defaultProps} />);

        const heading = container.querySelector('h2');
        expect(heading?.className).toContain('text-[clamp(2rem,_1.3838rem_+_2.6291vw,_3.75rem)]');
    });

    it('should translate statistics label for IntroSection namespace', () => {
        const customStats: GuildStatistic[] = [
            { end: 100, suffix: '+', icon: '⭐', label: 'Direct Label' },
        ];

        render(
            <SingleFeatureSection
                {...defaultProps}
                translationNamespace="IntroSection"
                customStatistics={customStats}
            />
        );

        expect(screen.getByText(/Direct Label/)).toBeInTheDocument();
    });

    it('should translate statistics label for non-IntroSection namespace', () => {
        const customStats: GuildStatistic[] = [
            { end: 100, suffix: '+', icon: '⭐', label: 'translationKey' },
        ];

        render(
            <SingleFeatureSection
                {...defaultProps}
                translationNamespace="OtherSection"
                customStatistics={customStats}
            />
        );

        expect(mockTranslations.default).toHaveBeenCalledWith('translationKey');
    });

    it('should pass locale to AnimatedCounter', () => {
        render(<SingleFeatureSection {...defaultProps} />);

        const counters = screen.getAllByTestId('animated-counter');
        counters.forEach(counter => {
            expect(counter).toHaveAttribute('data-locale', 'de');
        });
    });

    it('should render multiple rows of guild features', () => {
        const guildFeatures: GuildFeature[][] = [
            [
                {
                    src: '/feature1.png',
                    alt: 'Feature 1',
                    titleKey: 'feature1_title',
                    descKey: 'feature1_desc',
                    animation: 'animate__fadeInLeft',
                },
            ],
            [
                {
                    src: '/feature2.png',
                    alt: 'Feature 2',
                    titleKey: 'feature2_title',
                    descKey: 'feature2_desc',
                    animation: 'animate__fadeInRight',
                },
            ],
        ];

        render(<SingleFeatureSection {...defaultProps} guildFeatures={guildFeatures} />);

        expect(screen.getByAltText('Feature 1')).toBeInTheDocument();
        expect(screen.getByAltText('Feature 2')).toBeInTheDocument();
    });

    it('should use description2 translation with rich formatting', () => {
        render(<SingleFeatureSection {...defaultProps} />);

        expect(mockTranslations.default.rich).toHaveBeenCalledWith('description2', expect.any(Object));
    });

    it('should render link in description with rich formatting', () => {
        mockTranslations.default.rich = jest.fn((key: string, formatters: any) => {
            if (key === 'description' && formatters.a) {
                return formatters.a('Click here');
            }
            return 'Test';
        });

        const { container } = render(<SingleFeatureSection {...defaultProps} />);

        const link = container.querySelector('a[href="https://bl4cklist.de/invites/clank"]');
        expect(link).toBeInTheDocument();
    });
});