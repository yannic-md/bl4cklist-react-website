import {JSX, useEffect, useState} from "react";
import {AnimateOnView} from "@/components/animations/AnimateOnView";
import {AnimatedTextReveal} from "@/components/animations/TextReveal";
import index from "@/styles/components/index.module.css";
import colors from "@/styles/util/colors.module.css";
import buttons from "@/styles/util/buttons.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ButtonHover from "@/components/elements/ButtonHover";
import {
    faEnvelope,
    faGavel,
    faHeart,
    faIdCard,
    faMessage,
    faUser,
    faUserShield
} from "@fortawesome/free-solid-svg-icons";
import {FormType} from "@/pages/contact";
import {faHandcuffs} from "@fortawesome/free-solid-svg-icons/faHandcuffs";
import {faReply} from "@fortawesome/free-solid-svg-icons/faReply";
import {useTranslations} from "next-intl";
import {faQuestionCircle} from "@fortawesome/free-regular-svg-icons/faQuestionCircle";

interface ContactFormSectionProps {
    selectedForm: FormType;
}

/**
 * Renders the contact form section for the imprint page, choosing between an unban request form,
 * a general contact form, or an informational placeholder when no form type is selected.
 *
 * The layout, animations, and text content adapt based on the selected form type and the current
 * viewport size, including responsive heading styles for very large screens.
 *
 * @returns {JSX.Element} containing the fully composed contact section with dynamic form content
 * and descriptive information panel.
*/
export default function ContactFormSection({ selectedForm }: ContactFormSectionProps): JSX.Element {
    const tMisc = useTranslations("Misc");
    const tForm = useTranslations("Form");
    const tContactForm = useTranslations("ContactForm")
    const isUnbanForm: boolean = selectedForm === 'unban';
    const [is2XL, setIs2XL] = useState(false);
    // TODO: Real functionality for the forms.


    /**
     * Effect: synchronize `is2XL` state with the current viewport width.
     *
     * - Sets `is2XL` to `true` when `window.innerWidth >= 1536` (Tailwind `2xl` breakpoint),
     *   otherwise sets it to `false`.
     * - Runs once on mount to initialize the value.
     * - Adds a `resize` event listener to update the state when the viewport resizes.
     * - Cleans up the event listener on unmount.
     */
    useEffect((): () => void => {
        const checkScreenSize: () => void = (): void => {
            setIs2XL(window.innerWidth >= 1536); // 2xl breakpoint
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return (): void => window.removeEventListener('resize', checkScreenSize);
    }, []);

    /**
     * Renders a placeholder section when no contact form type is selected.
     *
     * Displays a heading, explanatory text, and a short description that guides the user
     * to choose one of the available contact forms above.
     *
     * @returns {JSX.Element} React fragment containing the info section shown if no form is selected.
     */
    const noForm: () => JSX.Element = (): JSX.Element => (
        <>
            <section className="pr-8 pl-8 pb-40 pt-32 bg-slate-900/20 relative" id="really-cool-thing">
                <div className="mx-auto w-full xl:max-w-[1400px] min-h-[400px] flex flex-col items-center justify-center">
                    <div className="font-bold tracking-wider mb-3 self-center xl:self-auto">
                        {/* Tag */}
                        <AnimateOnView animation="animate__fadeInLeft animate__slower">
                            <AnimatedTextReveal text={tContactForm('infoTagEmpty')}
                                                className="text-sm text-[coral] uppercase text-center lg:text-start
                                                           pb-3 lg:pb-0"
                                                shadowColor="rgba(255,127,80,0.35)" />
                        </AnimateOnView>
                    </div>

                    {/* Title */}
                    <AnimateOnView animation="animate__fadeInLeft animate__slower">
                        <h2 className={`${index.head_border_center} max-w-[26ch] bg-clip-text text-transparent mb-6 
                                        ${colors.text_gradient_gray} my-0 font-semibold leading-[1.1]  
                                        text-[clamp(2rem,_1.3838rem_+_2.6291vw,_2.75rem)] text-center xl:text-start`}>
                            <span className="inline-block align-middle leading-none text-white">
                                ❓</span>- {tContactForm('titleEmpty')}
                        </h2>
                    </AnimateOnView>

                    {/* Desc */}
                    <AnimateOnView animation="animate__fadeInLeft animate__slower">
                        <p className="text-[#969cb1] mb-6 break-words max-w-full xl:max-w-3xl text-center xl:text-start">
                            {tContactForm('descriptionEmpty')}
                            <br /><br />
                            {tContactForm('descriptionEmpty2')}
                        </p>
                    </AnimateOnView>
                </div>

                {/* Bottom border for this section */}
                <div className="bg-[radial-gradient(50%_50%_at_50%_50%,#d8e7f212_0%,#04070d_100%)] z-10
                            flex-none h-1 absolute bottom-0 left-0 right-0"></div>
            </section>
        </>
    );

    /**
     * Renders the unban request form for users who want to appeal a Discord-server ban.
     *
     * The form collects the user's Discord name and ID, optional information about
     * the ban reason and responsible moderator, and a detailed apology text.
     *
     * @returns {JSX.Element} The JSX structure for the unban request form.
     */
    const unbanForm: () => JSX.Element = (): JSX.Element => (
        <>
            <form className="relative z-10 flex flex-col gap-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Discord Name Field */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="discord-name" className="text-sm font-medium text-gray-300">
                            {tForm('textDiscordName')}
                        </label>

                        <div className="relative flex items-center bg-slate-800/50 border border-slate-700 rounded-lg
                                        focus-within:border-zinc-300 focus-within:ring-1 focus-within:ring-zinc-300
                                        transition-colors duration-200">
                            <div className="flex items-center justify-center pl-4 pr-3">
                                <FontAwesomeIcon icon={faUser} className="text-gray-400 text-sm" />
                            </div>

                            <div className="h-8 w-px bg-slate-700"></div>
                            <input type="text" id="discord-name" name="discord-name" placeholder="yannicde"
                                   className="flex-1 bg-transparent px-4 py-3 text-gray-100 placeholder-gray-500
                                              focus:outline-none" />
                        </div>
                    </div>

                    {/* Discord ID */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="discord-id" className="text-sm font-medium text-gray-300">
                            {tForm('textDiscordID')}
                            <a href="https://support.discord.com/hc/articles/206346498#h_01HRSTXPS5H5D7JBY2QKKPVKNA" target="_blank">
                                <FontAwesomeIcon icon={faQuestionCircle} className="ml-1 text-gray-500 cursor-pointer" />
                            </a>
                        </label>

                        <div className="relative flex items-center bg-slate-800/50 border border-slate-700 rounded-lg
                                        focus-within:border-zinc-300 focus-within:ring-1 focus-within:ring-zinc-300
                                        transition-colors duration-200">
                            <div className="flex items-center justify-center pl-4 pr-3">
                                <FontAwesomeIcon icon={faIdCard} className="text-gray-400 text-sm" />
                            </div>

                            <div className="h-8 w-px bg-slate-700"></div>
                            <input type="text" id="discord-id" name="discord-id" placeholder="775415193760169995"
                                   className="flex-1 bg-transparent px-4 py-3 text-gray-100 placeholder-gray-500
                                              focus:outline-none" />
                        </div>
                    </div>
                </div>

                {/* Optional fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Reason of punishment (optional) */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="ban-reason" className="text-sm font-medium text-gray-300">
                            {tForm('textReason')} <span className="text-gray-500">(Optional)</span>
                        </label>

                        <div className="relative flex items-center bg-slate-800/50 border border-slate-700 rounded-lg
                                        focus-within:border-zinc-300 focus-within:ring-1 focus-within:ring-zinc-300
                                        transition-colors duration-200">
                            <div className="flex items-center justify-center pl-4 pr-3">
                                <FontAwesomeIcon icon={faGavel} className="text-gray-400 text-sm" />
                            </div>

                            <div className="h-8 w-px bg-slate-700"></div>
                            <input type="text" id="ban-reason" name="ban-reason" placeholder={tForm('placeholderReason')}
                                   className="flex-1 bg-transparent px-4 py-3 text-gray-100 placeholder-gray-500
                                              focus:outline-none" />
                        </div>
                    </div>

                    {/* Punished by (optional) */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="banned-by" className="text-sm font-medium text-gray-300">
                            {tForm('textPunishedBy')} <span className="text-gray-500">(Optional)</span>
                        </label>

                        <div className="relative flex items-center bg-slate-800/50 border border-slate-700 rounded-lg
                                        focus-within:border-zinc-300 focus-within:ring-1 focus-within:ring-zinc-300
                                        transition-colors duration-200">
                            <div className="flex items-center justify-center pl-4 pr-3">
                                <FontAwesomeIcon icon={faUserShield} className="text-gray-400 text-sm" />
                            </div>

                            <div className="h-8 w-px bg-slate-700"></div>
                            <input type="text" id="banned-by" name="banned-by" placeholder="xlonestar.888"
                                   className="flex-1 bg-transparent px-4 py-3 text-gray-100 placeholder-gray-500
                                              focus:outline-none" />
                        </div>
                    </div>
                </div>

                {/* Your excuse MANDATORY FIELD */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="apology" className="text-sm font-medium text-gray-300">
                        {tForm('textExcuse')}
                    </label>

                    <div className="relative flex bg-slate-800/50 border border-slate-700 rounded-lg
                                    focus-within:border-zinc-300 focus-within:ring-1 focus-within:ring-zinc-300
                                    transition-colors duration-200">
                        <div className="flex items-start justify-center my-auto pl-4 pr-3">
                            <FontAwesomeIcon icon={faHeart} className="text-gray-400 text-sm" />
                        </div>

                        <div className="h-auto w-px bg-slate-700 mt-3 mb-3"></div>
                        <textarea id="apology" name="apology" rows={5} placeholder={tForm('placeholderExcuse')}
                                  className="flex-1 bg-transparent px-4 py-3 text-gray-100 placeholder-gray-500
                                             focus:outline-none resize-none" />
                    </div>
                </div>


                {/* Submit Button */}
                <div className="flex flex-col lg:flex-row-reverse mt-2 gap-6">
                    {/* Example Success Message */}
                    <span className="text-sm font-medium text-green-400 w-full self-center opacity-0">
                        {tForm('successFormSent')}
                    </span>

                    {/* Submit button */}
                    <div className="flex flex-col items-end relative group z-[20] drop-shadow-xl
                                    drop-shadow-white/5">
                        <a href="https://discord.gg/bl4cklist" target="_blank"
                           className="flex flex-col items-end w-full">
                            <button type="submit" className={`relative w-full lg:w-fit ${buttons.white_gray}`}>
                                <FontAwesomeIcon icon={faHandcuffs} className="text-gray-100" />
                                <p className="whitespace-pre">{tForm('buttonUnban')}</p>
                            </button>
                        </a>

                        <ButtonHover />
                    </div>
                </div>
            </form>
        </>
    );

    /**
     * Renders the general contact form used for non-unban related requests.
     *
     * The form contains input fields for the user's name, email address,
     * and a free-text message area, as well as a submit button.
     *
     * @returns {JSX.Element} containing the complete general contact form layout.
     */
    const generalForm: () => JSX.Element = (): JSX.Element => (
        <>
            <form className="relative z-10 flex flex-col gap-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Name Field */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="name" className="text-sm font-medium text-gray-300">
                            {tForm('textName')}
                        </label>

                        <div className="relative flex items-center bg-slate-800/50 border border-red-500 rounded-lg
                                        focus-within:border-zinc-300 focus-within:ring-1 focus-within:ring-zinc-300
                                        transition-colors duration-200">
                            <div className="flex items-center justify-center pl-4 pr-3">
                                <FontAwesomeIcon icon={faUser} className="text-gray-400 text-sm" />
                            </div>

                            <div className="h-8 w-px bg-slate-700"></div>
                            <input type="text" id="name" name="name" placeholder={tForm('placeholderName')}
                                   className="flex-1 bg-transparent px-4 py-3 text-gray-100 placeholder-gray-500
                                              focus:outline-none" />
                        </div>
                        {/* Example error message */}
                        <span className="text-xs text-red-400">Bitte gib deinen Namen ein</span>
                    </div>

                    {/* Email Field */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-sm font-medium text-gray-300">
                            {tForm('textEmail')}
                        </label>

                        <div className="relative flex items-center bg-slate-800/50 border border-slate-700 rounded-lg
                                        focus-within:border-zinc-300 focus-within:ring-1 focus-within:ring-zinc-300
                                        transition-colors duration-200">
                            <div className="flex items-center justify-center pl-4 pr-3">
                                <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 text-sm" />
                            </div>

                            <div className="h-8 w-px bg-slate-700"></div>
                            <input type="email" id="email" name="email" placeholder={tForm('placeholderEmail')}
                                   className="flex-1 bg-transparent px-4 py-3 text-gray-100 placeholder-gray-500
                                              focus:outline-none" />
                        </div>
                    </div>
                </div>

                {/* Message Field */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="text-sm font-medium text-gray-300">
                        {tForm('textMessage')}
                    </label>

                    <div className="relative flex bg-slate-800/50 border border-slate-700 rounded-lg
                                    focus-within:border-zinc-300 focus-within:ring-1 focus-within:ring-zinc-300
                                    transition-colors duration-200">
                        <div className="flex items-start justify-center my-auto pl-4 pr-3">
                            <FontAwesomeIcon icon={faMessage} className="text-gray-400 text-sm" />
                        </div>

                        <div className="h-auto w-px bg-slate-700 mt-3 mb-3"></div>
                        <textarea id="message" name="message" rows={5} placeholder={tForm('placeholderMessage')}
                                  className="flex-1 bg-transparent px-4 py-3 text-gray-100 placeholder-gray-500
                                             focus:outline-none resize-none" />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col lg:flex-row mt-2 gap-6">
                    {/* Example Success Message */}
                    <span className="text-sm font-medium text-green-400 w-full self-center">
                        {tForm('successFormSent')}
                    </span>

                    {/* Submit button */}
                    <div className="flex flex-col items-end relative group z-[20] drop-shadow-xl
                                    drop-shadow-white/5">
                        <a href="https://discord.gg/bl4cklist" target="_blank"
                           className="flex flex-col items-end w-full">
                            <button type="submit" className={`relative w-full lg:w-fit ${buttons.white_gray}`}>
                                <FontAwesomeIcon icon={faReply} className="text-gray-100" />
                                <p className="whitespace-pre">{tMisc('send')}</p>
                            </button>
                        </a>

                        <ButtonHover />
                    </div>
                </div>
            </form>
        </>
    );

    if (!selectedForm) { return noForm(); }  // No form was selected

    return (
        <section className="pr-8 pl-8 pb-40 pt-32 bg-slate-900/20 relative xl:scroll-m-24 overflow-clip"
                 id="really-cool-thing">
            <div className="mx-auto w-full xl:max-w-[1400px]">
                <div className="flex flex-col-reverse xl:grid xl:auto-cols-[1fr] xl:grid-cols-[1fr_1fr]
                                xl:grid-rows-[auto_auto] xl:gap-x-[106px] gap-y-18 xl:gap-y-4 items-center">

                    {/* Form content - Position based on selected form type */}
                    <div className={`relative flex flex-col gap-14 ${isUnbanForm ? 'xl:order-1' : 'xl:order-2'}`}>

                        <AnimateOnView animation={`animate__fadeIn${isUnbanForm ? 'Left' : 'Right'} animate__slower`}>
                            <div className="shadow-[0_10px_25px_rgba(0,0,0,1)] w-full">
                                <div className="relative flex flex-col p-8 bg-[#04070d] rounded-2xl w-full
                                                shadow-[inset_0_2px_1px_0_rgba(207,231,255,0.2)]">

                                    {/* Container gradient in right corner for more depth */}
                                    <div className="absolute top-0 right-0 w-[437px] h-[306px] pointer-events-none opacity-[0.1] rounded-tr-2xl
                                                    bg-[radial-gradient(50%_50%_at_93.7%_8.1%,#b8c7d980_0%,rgba(4,7,13,0)_100%)]" />

                                    {/* Select the correct form */}
                                    {isUnbanForm ? (unbanForm()) : (generalForm())}
                                </div>
                            </div>
                        </AnimateOnView>
                    </div>

                    {/* Contact form information - Position based on selected form type */}
                    <div className={`flex flex-col justify-start items-start gap-2.5 px-0 md:px-20 xl:px-0 
                                     ${isUnbanForm ? 'xl:order-2' : 'xl:order-1'}`}>
                        <div className="font-bold tracking-wider mb-1 self-center xl:self-auto">
                            {/* Tag */}
                            <AnimateOnView animation={`animate__fadeIn${isUnbanForm ? 'Right' : 'Left'} animate__slower`}>
                                <AnimatedTextReveal text={isUnbanForm ? tContactForm('infoTagUnban') :
                                                                        tContactForm('infoTagGeneral')}
                                                    className="text-sm text-[coral] uppercase text-center
                                                               lg:text-start pb-3 lg:pb-0"
                                                    shadowColor="rgba(255,127,80,0.35)" />
                            </AnimateOnView>
                        </div>

                        {/* Title */}
                        <AnimateOnView animation={`animate__fadeIn${isUnbanForm ? 'Right' : 'Left'} animate__slower w-full`}>
                            <h2 className={`${is2XL ? index.head_border : index.head_border_center} max-w-[30ch] 
                                            bg-clip-text text-transparent mb-6 w-full ${colors.text_gradient_gray} my-0 
                                            font-semibold leading-[1.1] text-center xl:text-start 
                                            text-[clamp(2rem,_1.3838rem_+_2.6291vw,_3rem)]`}>
                                <span className="inline-block align-middle leading-none text-white">
                                    {isUnbanForm ? '🔓' : '💌'}</span> - {isUnbanForm ? tContactForm('titleUnban')
                                                                                       : tContactForm('titleGeneral')}
                            </h2>
                        </AnimateOnView>

                        {/* Desc */}
                        <AnimateOnView animation={`animate__fadeIn${isUnbanForm ? 'Right' : 'Left'} animate__slower`}>
                            <p className="text-[#969cb1] mb-6 break-words max-w-full xl:max-w-2xl">
                                {isUnbanForm ? tContactForm("descriptionUnban") : tContactForm("descriptionGeneral")}
                                <br /><br />
                                {isUnbanForm ? tContactForm("descriptionUnban2") : tContactForm("descriptionGeneral2")}
                            </p>
                        </AnimateOnView>
                    </div>
                </div>
            </div>

            {/* Bottom border for this section */}
            <div className="bg-[radial-gradient(50%_50%_at_50%_50%,#d8e7f212_0%,#04070d_100%)] z-10
                            flex-none h-1 absolute bottom-0 left-0 right-0"></div>
        </section>
    );
}