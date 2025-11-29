import {JSX, ReactNode} from "react";
import {AnimateOnView} from "@/components/animations/AnimateOnView";
import {AnimatedTextReveal} from "@/components/animations/TextReveal";
import index from "@/styles/components/index.module.css";
import colors from "@/styles/util/colors.module.css";
import {Member} from "@/types/Member";
import {MemberCard} from "@/components/elements/grid/MemberCard";
import Image from "next/image";
import {useTranslations} from "next-intl";

type MemberListPosition = 'left' | 'right';

interface MemberListProps {
    members: Member[];
    section_id: string;
    category: string;
    position?: MemberListPosition;
    planetVariant?: 1 | 2 | 3 | 4;
}

/**
 * Renders a member section with animated elements and member cards.
 *
 * Displays a headline, description, and a responsive grid of members with individual animations.
 * Supports flexible positioning (left/right) and different decorative planet variants.
 * If the number of members is odd, the last member card is centered and spans both grid columns.
 *
 * @param members - Array of member objects to display
 * @param section_id - The ID of the section to allow header navigation.
 * @param category - The category for the used translations.
 * @param position - Layout position: 'left' or 'right' (default: 'right')
 * @param planetVariant - Decorative planet position variant (1-4, default: 1)
 * @returns A React JSX element containing the member section with decorative elements.
 */
export default function MemberList({members, section_id, category, position = 'right',
                                    planetVariant = 1}: MemberListProps): JSX.Element {
    const tMemberListSection = useTranslations('MemberListSection');
    const isOddCount: boolean = members.length % 2 !== 0;
    const isLeftPosition: boolean = position === 'left';

    /**
     * Returns the appropriate planet decoration configuration based on the variant.
     */
    const getPlanetConfigs = (): Array<{ src: string; className: string; alt: string }> => {
        const baseConfigs = {
            1: [
                {
                    src: '/images/bg/moon.svg',
                    className: `absolute ${isLeftPosition ? 'right-0 top-56' : 'left-12 top-46'} z-[3] pointer-events-none opacity-25`,
                    alt: 'Moon ~ Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server'
                },
                {
                    src: '/images/bg/earth-128w.webp',
                    className: `absolute ${isLeftPosition ? 'left-10 bottom-40' : 'right-28 bottom-40'} z-[3] pointer-events-none opacity-15`,
                    alt: 'Earth ~ Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server'
                }
            ],
            2: [
                {
                    src: '/images/bg/uranus-128w.webp',
                    className: `absolute ${isLeftPosition ? 'left-12 bottom-40 rotate-6' : 'right-0 bottom-40'} z-[3] pointer-events-none opacity-15`,
                    alt: 'Uranus ~ Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server'
                },
                {
                    src: '/images/bg/jupiter-128w.webp',
                    className: `absolute ${isLeftPosition ? 'right-26 top-26 rotate-12' : 'left-5 top-72'} z-[3] pointer-events-none opacity-10`,
                    alt: 'Jupiter ~ Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server'
                }
            ],
            3: [
                {
                    src: '/images/bg/mars-128w.webp',
                    className: `absolute ${isLeftPosition ? 'right-10 top-72' : 'left-16 top-56'} z-[3] pointer-events-none opacity-10`,
                    alt: 'Mars ~ Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server'
                },
                {
                    src: '/images/bg/neptune-128w.webp',
                    className: `absolute ${isLeftPosition ? 'left-0 bottom-56' : 'right-12 bottom-56 rotate-24'} z-[3] pointer-events-none opacity-18`,
                    alt: 'Neptune ~ Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server'
                }
            ],
            4: [
                {
                    src: '/images/bg/venus-128w.webp',
                    className: `absolute ${isLeftPosition ? 'left-5 top-64' : 'right-5 top-96'} z-[3] pointer-events-none opacity-20`,
                    alt: 'Venus ~ Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server'
                },
                {
                    src: '/images/bg/pluto-128w.webp',
                    className: `absolute ${isLeftPosition ? 'right-12 bottom-32' : 'left-0 bottom-32'} z-[3] pointer-events-none opacity-10 scale-95`,
                    alt: 'Pluto ~ Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server'
                }
            ]
        };
        return baseConfigs[planetVariant];
    };
    const planetConfigs = getPlanetConfigs();

    return (
        <section className="relative py-16 md:py-24 lg:py-36 bg-slate-900/30" id={section_id}>
            {/* Decorative Planets - Hidden on mobile for better performance */}
            {planetConfigs.map((config, index: number): JSX.Element => (
                <AnimateOnView key={index} animation="animate__fadeIn animate__slower">
                    <div className={`${config.className} hidden lg:block`}>
                        <Image src={config.src} alt={`${config.alt} ~ Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server`}
                               className={`w-32 h-32 lg:w-48 lg:h-48 ${isLeftPosition ? (index === 0 ? 'mr-10' : 'ml-10') :
                                   (index === 0 ? 'ml-10' : 'mr-10')}`}
                               width={192} height={192} />
                    </div>
                </AnimateOnView>
            ))}

            <div className="mx-auto px-4 sm:px-6 lg:px-7 !max-w-[1450px] overflow-x-clip">
                <div className={`flex flex-col xl:grid xl:grid-rows-[auto_auto] xl:gap-12 xl:auto-cols-[1fr]
                                 ${isLeftPosition ? 'xl:grid-cols-[1fr_0.65fr]' : 'xl:grid-cols-[0.65fr_1fr]'}`}>

                    {/* Introduction content - Left or Right based on position */}
                    <div className={`flex justify-start items-start flex-col gap-3 sm:gap-4 lg:gap-5 xl:sticky xl:top-36 
                                     [flex-flow:column] mt-6 sm:mt-8 lg:mt-10 xl:self-start px-0 sm:px-10 md:px-20 xl:px-0 
                                     ${isLeftPosition ? 'xl:order-2' : 'xl:order-1'}`}>
                        <div className="font-bold tracking-wider w-full">
                            <AnimateOnView animation={`animate__fadeIn${isLeftPosition ? 'Right' : 'Left'} animate__slower`}>
                                <AnimatedTextReveal text={tMemberListSection('infoTag' + category)}
                                                    className={`text-xs sm:text-sm text-[coral] uppercase text-center
                                                                xl:text-start pb-2 lg:pb-3
                                                                xl:text-${isLeftPosition ? 'end' : 'start'}`}
                                                    shadowColor="rgba(255,127,80,0.35)" />
                            </AnimateOnView>
                        </div>

                        {/* Title */}
                        <AnimateOnView animation={`animate__fadeIn${isLeftPosition ? 'Right' : 'Left'} animate__slower 
                                                   self-center xl:self-auto`}>
                            <h2 className={`${index.head_border} bg-clip-text text-transparent mb-2
                                            text-center xl:text-start sm:text-[2rem] 
                                            ${colors.text_gradient_gray} my-0 font-semibold leading-[1.1] text-[1.75rem] 
                                            md:text-[2.5rem] lg:text-[clamp(1.75rem,_1.3838rem_+_2.6291vw,_2.50rem)] w-full`}>
                                <span className="inline-block align-middle leading-none -mx-[3px] sm:-mx-[5px]
                                                 -mt-[3px] sm:-mt-[5px] text-white text-2xl sm:text-3xl">
                                    {category === 'Birthday' ? '🍰' :
                                     category === "Leaders"  ? '🔥' :
                                     category === 'Levels'   ? '🏆' : '👴🏻'}
                                </span> - {tMemberListSection('title' + category)}
                            </h2>
                        </AnimateOnView>

                        {/* Description */}
                        <AnimateOnView animation={`animate__fadeIn${isLeftPosition ? 'Right' : 'Left'} animate__slower`}>
                            <p className={`text-[#969cb1] pt-2 sm:pt-3 break-words max-w-full xl:max-w-lg text-xs 
                                           sm:text-sm text-center lg:text-start xl:text-start md:text-base mx-auto 
                                           xl:mx-0 `}>
                                {tMemberListSection('description1' + category)}
                                <br /><br />
                                {tMemberListSection.rich('description2' + category, {
                                    code: (chunks: ReactNode): JSX.Element => (
                                        <code className="font-mono bg-slate-800/70 px-1 sm:px-1.5 py-0.5 rounded
                                                         text-[0.85em] sm:text-[0.9em]">
                                            {chunks}
                                        </code>
                                    )
                                })}
                            </p>
                        </AnimateOnView>
                    </div>

                    {/* User List */}
                    <AnimateOnView animation={`animate__fadeIn${isLeftPosition ? 'Left' : 'Right'} animate__slower`}
                                   className={`mt-8 sm:mt-10 xl:mt-0 ${isLeftPosition ? 'xl:order-1' : 'xl:order-2'}`}>
                        <div className={`grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 grid-rows-[auto]
                                         ${isOddCount ? 'sm:[&>*:last-child]:col-span-2 sm:[&>*:last-child]:w-full ' +
                                                        'md:[&>*:last-child]:w-[75%] lg:[&>*:last-child]:w-[50%] ' +
                                                        'sm:[&>*:last-child]:mx-auto' : ''}`}>
                            {members.map((member: Member): JSX.Element => (
                                <MemberCard key={member.user_id} member={member} />
                            ))}
                        </div>
                    </AnimateOnView>
                </div>
            </div>

            {/* Border for better transition & Light shape for depth */}
            <div className="bg-[radial-gradient(50%_50%_at_50%_50%,#d8e7f212_0%,#04070d_100%)] z-[1]
                            flex-none h-1 absolute bottom-0 left-0 right-0"></div>
            <div className="bg-[radial-gradient(50%_50%_at_50%_50%,#d5dbe6b3_0%,#04070d00_100%)]
                            opacity-10 pointer-events-none z-[1] rounded-[10px] flex-none w-[793px] h-[499px]
                            absolute -bottom-[249px] left-[calc(50%-396.5px)] hidden md:block
                            [clip-path:inset(0_0_249px_0)]"></div>
        </section>
    );
}
