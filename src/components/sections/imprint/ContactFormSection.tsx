import {JSX} from "react";
import {AnimateOnView} from "@/components/animations/AnimateOnView";
import {AnimatedTextReveal} from "@/components/animations/TextReveal";
import index from "@/styles/components/index.module.css";
import colors from "@/styles/util/colors.module.css";
import {FormType} from "@/pages/contact";
import {useTranslations} from "next-intl";
import {createValidationSchemas} from "@/lib/formValidation";
import ContactForm from "@/components/elements/form/ContactForm";
import {FaHandcuffs} from "react-icons/fa6";
import {FaReply} from "react-icons/fa";
import {useMediaQuery} from "@/hooks/useMediaQuery";

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
    const is2XL: boolean = useMediaQuery();

    const validationSchemas = createValidationSchemas(tForm);

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
                                    <ContactForm formType={selectedForm}
                                                 turnstileAlign={isUnbanForm ? 'lg:self-start' : 'lg:self-end'}
                                                 validationSchema={isUnbanForm ? validationSchemas.unban : validationSchemas.general}
                                                 submitIcon={isUnbanForm ? FaHandcuffs : FaReply}
                                                 submitText={isUnbanForm ? tForm('buttonUnban') : tMisc('send')} />
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