import {JSX, ReactNode} from "react";
import Image from 'next/image';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDiscord} from "@fortawesome/free-brands-svg-icons";
import {useTranslations} from "next-intl";
import {useRouter} from "next/router";

import colors from '@/styles/util/colors.module.css';
import buttons from "@/styles/util/buttons.module.css";
import index from '@/styles/components/index.module.css';

import ButtonHover from "@/components/elements/ButtonHover";
import {AnimatedTextReveal} from "@/components/animations/TextReveal";
import {AnimateOnView} from "@/components/animations/AnimateOnView";
import {AnimatedCounter} from "@/components/animations/Counter";
import {ParticlesBackground} from "@/components/animations/ParticlesBackground";
import {GuildFeature, GuildStatistic} from "@/types/GuildFeature";
import {APIStatistics} from "@/types/APIResponse";
import DecorationalImage from "@/components/elements/misc/DecorationalImage";

export interface SingleFeatureSectionProps {
    sectionId: string;
    translationNamespace: string;
    particlesEnabled?: boolean;
    planetDecoration?: 1 | 2 | 3 | 4 | 'none';
    imagePosition?: 'left' | 'right';
    ctaEnabled?: boolean;
    showTopGradients?: boolean;
    imageSrc: string;
    imageAlt: string;
    titleEmoji: string;
    guildFeatures?: GuildFeature[][];
    customStatistics?: GuildStatistic[];
    guildStats?: APIStatistics | null;
}

/**
 * Renders a reusable feature section with configurable layout, decorations, and content.
 * Can display server statistics, feature highlights, CTA button, and customizable visual elements.
 *
 * @param {SingleFeatureSectionProps} props - Component configuration
 * @param {string} props.sectionId - The HTML ID for this section
 * @param {string} props.translationNamespace - Namespace for translation keys
 * @param {boolean} [props.particlesEnabled=true] - Whether to show particle background animation
 * @param {1 | 2 | 3 | 4 | 'none'} [props.planetDecoration='none'] - Planet decoration style (1-4) or 'none'
 * @param {'left' | 'right'} [props.imagePosition='right'] - Position of the image container ('left' or 'right')
 * @param {boolean} [props.ctaEnabled=true] - Whether to display the Discord join CTA button
 * @param {boolean} [props.showTopGradients=false] - Whether to show decorative gradients at the top
 * @param {string} props.imageSrc - Source path for the main feature image
 * @param {string} props.imageAlt - Alt text for the main feature image
 * @param {string} props.titleEmoji - The emoji which will be used in the title.
 * @param {GuildFeature[][]} [props.guildFeatures] - Two-dimensional array of guild features to display
 * @param {GuildStatistic[]} [props.customStatistics] - Custom statistics to display.
 * @param {APIStatistics} [props.guildStats] - The API loaded statistics about the single feature.
 *
 * @returns {JSX.Element} The rendered feature section component
 */
export default function SingleFeatureSection({sectionId, translationNamespace, particlesEnabled = true,
                                              planetDecoration = 'none', imagePosition = 'right', ctaEnabled = true,
                                              showTopGradients = false, imageSrc, imageAlt, titleEmoji,
                                              guildFeatures, customStatistics, guildStats}: SingleFeatureSectionProps): JSX.Element {
    const tWelcome = useTranslations('WelcomeHero');
    const t = useTranslations(translationNamespace);
    const { locale } = useRouter();

    const statistics: GuildStatistic[] = customStatistics ?? [
        { end: guildStats?.member_count ?? 3533, suffix: '+', icon: '👥', label: tWelcome('memberCount') },
        { end: guildStats?.online_count ?? 890, suffix: '+', icon: '🔥', label: 'Online' },
        { end: guildStats?.message_count ?? 4381784, suffix: '+', icon: '💬', label: t('count_chat') }
    ];

    /**
     * Get planet decoration image paths for a given decoration variant.
     *
     * @param {(1|2|3|4|'none')} decoration - Decoration variant (1-4) or 'none' to disable decorations.
     * @returns {{ left: string; right: string } | null} An object containing `left` and `right` image paths, or `null` when decoration is 'none'.
     */
    const getPlanetImages = (decoration: 1 | 2 | 3 | 4 | 'none'):
        { left: string; right: string, position_left: string, position_right: string } | null => {
        const decorations = {
            1: { left: '/images/bg/venus-128w.webp', right: '/images/bg/uranus-128w.webp',
                 position_left: "left-22 top-50 rotate-12", position_right: "right-24 bottom-56 rotate-6" },
            2: { left: '/images/bg/neptune-128w.webp', right: '/images/bg/pluto-128w.webp',
                 position_left: "left-14 bottom-48 rotate-12", position_right: "right-22 top-48 rotate-12" },
            3: { left: '/images/bg/moon.svg', right: '/images/bg/mars-128w.webp',
                 position_left: "left-16 top-56 rotate-12", position_right: "right-18 bottom-72 -rotate-90" },
            4: { left: '/images/bg/jupiter-128w.webp', right: '/images/bg/earth-128w.webp',
                 position_left: "left-14 bottom-36 rotate-12", position_right: "right-40 top-40 -rotate-12"},
        };
        return decoration !== 'none' ? decorations[decoration] : null;
    };

    const planets: {left: string; right: string, position_left: string, position_right: string} | null = getPlanetImages(planetDecoration);

    const textContent: () => JSX.Element = (): JSX.Element => (
        <>
            {/* Animated Tag */}
            <div className="mb-2">
                <div className="font-bold tracking-wider">
                    <AnimateOnView animation={`animate__fadeIn${imagePosition === 'left' ? 'Right' : 'Left'} animate__slower`}>
                        <AnimatedTextReveal text={t('infoTag')} shadowColor="rgba(255,127,80,0.35)"
                                            className="text-sm text-[coral] uppercase text-center lg:text-start
                                                       pb-3 lg:pb-0" />
                    </AnimateOnView>
                </div>
            </div>

            {/* Headline */}
            <AnimateOnView animation={`animate__fadeIn${imagePosition === 'left' ? 'Right' : 'Left'} animate__slower`}>
                <h2 className={`${index.head_border} max-w-2xl bg-clip-text text-transparent mb-6 leading-[1.1] w-full 
                                ${colors.text_gradient_gray} my-0 font-semibold 
                                ${t('title').length < 15 ? 'text-[clamp(2rem,_1.3838rem_+_2.6291vw,_3.75rem)]' : 
                                                                'text-[clamp(2rem,_1.3838rem_+_2.6291vw,_2.75rem)]'}`}>
                    <span className="inline-block align-middle leading-none -mx-[5px] mb-1 text-white">
                        {titleEmoji}</span> - {t('title')}
                </h2>
            </AnimateOnView>

            {/* Description (strong tags in translation are formatted) */}
            <AnimateOnView animation={`animate__fadeIn${imagePosition === 'left' ? 'Right' : 'Left'} animate__slower`}>
                <p className="text-[#969cb1] mb-6 break-words max-w-2xl">
                    {t.rich('description', {
                        strong: (chunks: ReactNode): JSX.Element => <strong>{chunks}</strong>,
                        a: (chunks: ReactNode): JSX.Element =>
                            <a className="text-[coral] hover:brightness-110 transition-all duration-200"
                               href="https://bl4cklist.de/invites/clank" target="_blank">{chunks}</a>
                    })}
                    <br /><br />
                    {t.rich('description2', {
                        strong: (chunks: ReactNode): JSX.Element => <strong>{chunks}</strong>
                    })}
                </p>
            </AnimateOnView>

            {/* Some entertaining discord server statistics */}
            <AnimateOnView animation="animate__fadeInUp animate__slower self-center lg:self-auto">
                <div className="flex justify-center lg:justify-start items-center flex-wrap gap-x-8 gap-y-12">
                    {statistics.map((stat: GuildStatistic, index: number): JSX.Element => (
                        <div key={index} className="flex flex-col items-center text-center px-1">
                            <AnimatedCounter end={stat.end} suffix={stat.suffix} locale={locale} />
                            <span className="text-sm text-[#969cb1] tracking-wide mr-1">
                                {stat.icon} {translationNamespace != 'IntroSection' ? t(stat.label) : stat.label}
                            </span>
                        </div>
                    ))}
                </div>
            </AnimateOnView>

            {/* Join Discord button */}
            {ctaEnabled && (
                <AnimateOnView animation="animate__fadeInUp animate__slower w-full lg:w-auto">
                    <div className="flex flex-col items-end relative group w-full sm:w-auto z-[20] mt-8 drop-shadow-xl
                                    drop-shadow-white/5">
                        <a href="https://discord.gg/bl4cklist" target="_blank" className="flex flex-col items-end w-full">
                            <button className={`relative w-full sm:min-w-52 ${buttons.white_gray}`}>
                                <FontAwesomeIcon icon={faDiscord} className="text-gray-100" />
                                <p className="whitespace-pre">{tWelcome('joinDiscord')}</p>
                            </button>
                        </a>
                        <ButtonHover />
                    </div>
                </AnimateOnView>
            )}
        </>
    );

    const showcaseImage: () => JSX.Element = (): JSX.Element => (
        <AnimateOnView animation={`animate__fadeIn${imagePosition === 'left' ? 'Left' : 'Right'} animate__slower`}>
            <div className={`rounded-xl bg-white/[0.06] drop-shadow-2xl drop-shadow-white/5 p-px relative
                             overflow-hidden ${imagePosition === 'left' ? '-rotate-1' : 'rotate-1'} border border-gray-900`}>
                <div className="rounded-xl">
                    <Image src={imageSrc} width={508} height={508} alt={imageAlt} unoptimized={true}
                           className="h-full rounded-xl brightness-90" key={imageSrc} data-cursor-special />
                </div>
            </div>
        </AnimateOnView>
    );

    return (
        <section className="w-full min-h-full relative overflow-hidden" id={sectionId}>
            {particlesEnabled && <ParticlesBackground className="z-0 animate__animated animate__fadeIn animate__slower" />}

            {/* Optional Planet Background Decoration */}
            {planets && (
                <>
                    <AnimateOnView animation="animate__fadeIn animate__slower">
                        <div className={`absolute ${planets.position_left} opacity-30 pointer-events-none z-[1] 
                                         w-32 h-32 scale-125 hidden lg:block`}>
                            <Image src={planets.left} width={128} height={128}
                                   alt="Planet #1 - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server" />
                        </div>
                    </AnimateOnView>
                    <AnimateOnView animation="animate__fadeIn animate__slower">
                        <div className={`absolute ${planets.position_right} opacity-30 pointer-events-none z-[1] 
                                         w-32 h-32 scale-125 hidden lg:block`}>
                            <Image src={planets.right} width={128} height={128}
                                   alt="Planet #2 - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server" />
                        </div>
                    </AnimateOnView>
                </>
            )}

            {/* Top Gradient to fit more to the upper section (mainly used on index page) */}
            {showTopGradients && (
                <div className="absolute -top-2.5 lg:-top-1.5 left-1/2 transform -translate-x-1/2 opacity-80 grayscale z-10
                                animate__animated animate__fadeInDown pointer-events-none">
                    <Image src="/images/bg/color-gradient-1726w.avif" width={800} height={161} priority={true}
                           sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
                           alt="Colored BG - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                           className="object-contain max-w-[800px] pointer-events-none rotate-180" />
                </div>
            )}

            {/* Main Content area */}
            <div className="bg-slate-900/30 pt-32">
                <div className="px-8 pb-20">
                    <div className="max-w-6xl w-full mx-auto">
                        <div>
                            {/* Order of the two content areas */}
                            <div className="flex mb-20 flex-col lg:flex-row justify-center items-center gap-[60px]">
                                {imagePosition === 'left' ? (
                                    <>
                                        <div className="flex-shrink-0 w-full lg:w-[475px]">{showcaseImage()}</div>
                                        <div className="flex flex-col justify-start items-start flex-shrink-0 w-full
                                                        lg:flex-1 lg:max-w-2xl">{textContent()}</div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex flex-col justify-start items-start flex-shrink-0 w-full
                                                        lg:flex-1 lg:max-w-2xl">{textContent()}</div>
                                        <div className="flex-shrink-0 w-full lg:w-[475px]">{showcaseImage()}</div>
                                    </>
                                )}
                            </div>

                            {/* A few guild features */}
                            {guildFeatures && guildFeatures.length > 0 && (
                                <div className="flex flex-col flex-wrap gap-10">
                                    {guildFeatures.map((row: GuildFeature[], rowIndex: number): JSX.Element => (
                                        <div key={rowIndex} className="flex flex-col lg:flex-row [&>*]:flex-1
                                                                       [&>*]:min-w-[280px] gap-10">
                                            {row.map((feature: GuildFeature, featureIndex: number): JSX.Element => (
                                                <AnimateOnView key={featureIndex} animation={feature.animation}>
                                                    <div className="flex items-start justify-start gap-4">
                                                        <div className="flex-none">
                                                            <Image src={feature.src} className="h-full pointer-events-none"
                                                                   width={32} height={32} alt={feature.alt} />
                                                        </div>
                                                        <div>
                                                            <h3 className="mb-2 text-xl font-semibold leading-[1.5]">
                                                                {t(feature.titleKey)}
                                                            </h3>
                                                            <p className="text-[#969cb1]">{t(feature.descKey)}</p>
                                                        </div>
                                                    </div>
                                                </AnimateOnView>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Border for good looking transition to new section */}
            <div className="bg-[radial-gradient(50%_50%_at_50%_50%,#d8e7f212_0%,#04070d_100%)] z-[1]
                            flex-none h-1 absolute bottom-0 left-0 right-0"></div>

            {/* Rest in peace, old replaced bots.. */}
            {translationNamespace === 'ClankGlobalSection' && <DecorationalImage />}
        </section>
    );
}
