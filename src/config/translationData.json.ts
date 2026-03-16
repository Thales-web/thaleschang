/**
 * * Configuration of the i18n system data files and text translations
 * Example translations below are for English and French, with textTranslations used in src/layouts/BlogLayoutCenter.astro and src/components/Hero/[hero].astro
 */

/**
 * * Data file configuration for the i18n system
 * Every {Data} key must exist in the below object
 */
import testimonialDataKo from "./ko/testimonialData.json";
import siteDataKo from "./ko/siteData.json";
import navDataKo from "./ko/navData.json";
import faqDataKo from "./ko/faqData.json";
import faqDataEn from "./en/faqData.json";
import navDataEn from "./en/navData.json";
import siteDataEn from "./en/siteData.json";
import testimonialDataEn from "./en/testimonialData.json";
import footerDataKo from "./ko/footerData.json";
import footerDataEn from "./en/footerData.json";

import sidebarNavDataKo from "@/docs/config/ko/sidebarNavData.json";
import sidebarNavDataEn from "@/docs/config/en/sidebarNavData.json";


export const dataTranslations = {
  ko: {
    faqData: faqDataKo,
    navData: navDataKo,
    siteData: siteDataKo,
    testimonialData: testimonialDataKo,
    footerData: footerDataKo,
    sidebarNavData: sidebarNavDataKo,
  },
  en: {
    siteData: siteDataEn,
    navData: navDataEn,
    testimonialData: testimonialDataEn,
    faqData: faqDataEn,
    footerData: footerDataEn,
    sidebarNavData: sidebarNavDataEn,
  },

} as const;

/**
 * * Text translations are used with the `useTranslation` function from src/js/i18nUtils.ts to translate various strings on your site.
 *
 * ## Example
 *
 * ```ts
 * import { getLocaleFromUrl } from "@/js/localeUtils";
 * import { useTranslations } from "@/js/translationUtils";
 * const currLocale = getLocaleFromUrl(Astro.url);
 * const t = useTranslations(currLocale);
 * t("back_to_all_posts"); // this would be "Retour à tous les articles" if the current locale is "fr"
 * ```
 * or
 * ```ts
 * import { useTranslations } from "@/js/translationUtils";
 * const t = useTranslations("fr");
 * t("back_to_all_posts"); // this would be "Retour à tous les articles"
 * ```
 */
export const textTranslations = {
  ko: {
    hero_text: "멋진 웹사이트를 위한 모든 것.",
    hero_description: `아이디어를 아름답고 기능적인 디자인으로 변환하여 오래 기억에 남는 인상을 남깁니다.`,

    // blog
    back_to_all_posts: "전체 글 보기",
    updated: "수정일",
    share_this_article: "이 글 공유하기",
    table_of_contents: "목차",
    tags: "태그",
    related_posts: "관련 글",
    min_read: "분 소요",
    share: "공유",

    // docs
    docs_title: "문서",
    docs_previous: "이전",
    docs_next: "다음",
    docs_on_this_page: "이 페이지에서",
    docs_search_placeholder: "문서 검색...",

    // related content
    related_content: "관련 콘텐츠",
    related_type_service: "서비스",
    related_type_project: "프로젝트",
    related_type_blog: "블로그",

    // project page
    project_technologies: "사용 기술",
    project_key_features: "주요 기능",
    project_completed_on: "완료일:",
    project_live_demo: "라이브 데모",
    project_view_source: "소스 보기",

    // nav & cta
    get_all_access: "상담 신청",
    cta_heading: "지금 시작하세요",
    cta_description: "SEO 최적화된 고성능 웹사이트로 비즈니스를 성장시키세요. 무료 상담을 통해 맞춤 솔루션을 제안드립니다.",
    cta_button: "무료 상담 받기",
    hero_cta_secondary: "서비스 보기",
    subscribe: "구독하기",
    subscribe_newsletter: "뉴스레터 구독",
    subscribe_description: "최신 뉴스와 업데이트를 받아보세요.",
    subscribe_placeholder: "이메일 주소를 입력하세요",
    subscribe_disclaimer: "구독 시 최신 업데이트를 받게 됩니다. 스팸은 보내지 않습니다!",

    // contact form
    form_name: "이름",
    form_name_placeholder: "홍길동",
    form_email: "이메일",
    form_email_placeholder: "example@email.com",
    form_phone: "전화번호",
    form_phone_placeholder: "010-1234-5678",
    form_reason: "문의 유형",
    form_reason_placeholder: "문의 유형을 선택하세요",
    form_reason_website: "웹사이트 제작 문의",
    form_reason_seo: "SEO 컨설팅",
    form_reason_maintenance: "유지보수/관리",
    form_reason_partnership: "제휴/파트너십",
    form_reason_other: "기타",
    form_message: "메시지",
    form_message_placeholder: "어떻게 도와드릴까요?",
    form_consent: "개인정보 수집 및 이용에 동의합니다",
    form_submit: "문의하기",
    form_success: "문의가 성공적으로 전송되었습니다. 빠른 시일 내에 답변 드리겠습니다.",

    // forms
    sign_in: "로그인",
    sign_up: "회원가입",
    sign_in_title: "계정에 로그인",
    sign_up_title: "무료 계정 만들기",
    password_reset_title: "비밀번호 재설정",
    email_address: "이메일 주소",
    password: "비밀번호",
    your_name: "이름",
    create_account: "계정 만들기",
    forgot_password: "비밀번호를 잊으셨나요?",
    already_have_account: "이미 계정이 있으신가요?",
    dont_have_account: "계정이 없으신가요?",
    create_free_account: "무료 계정 만들기",
    already_know_password: "비밀번호를 알고 계신가요?",
    submit: "제출",
    or: "또는",
    sign_in_with_google: "Google로 로그인",
    sign_up_with_google: "Google로 회원가입",

    // contact
    contact_us: "문의하기",
    contact_description: "오늘 바로 시작하세요!",
    send_message: "메시지 보내기",
    book_appointment: "예약하기",
    book_appointment_description: "모든 필요에 도움을 드립니다. 예약을 요청하거나 질문을 남겨주세요.",
    office_hours: "영업 시간",
    contact_info: "연락처",
    phone: "전화",
    email: "이메일",
    our_location: "위치",
    emergency_hotline: "긴급 상황 시 24시간 핫라인으로 연락하세요:",

    // about
    years_in_business: "업력",
    happy_patients: "만족한 고객",
    expert_doctors: "전문가",
    convenient_location: "편리한 위치",
    what_makes_different: "우리가 특별한 이유",

    // team
    meet_providers: "전문가 소개",
    team_subtitle: "최고의 전문가 팀",

    // testimonials
    words_from_patients: "고객의 한마디",

    // feature steps
    three_easy_steps: "간단한 세 단계",
    get_started: "시작하기",

    // share buttons
    share_on_twitter: "트위터에 공유",
    share_on_facebook: "페이스북에 공유",
    share_on_linkedin: "링크드인에 공유",
    share_on_pinterest: "핀터레스트에 공유",
    share_on_whatsapp: "왓츠앱에 공유",
    share_by_email: "이메일로 공유",

    // cookie consent
    cookie_message: "이 사이트는 더 나은 경험을 위해 쿠키를 사용합니다. 자세한 내용은",
    cookie_privacy_policy: "개인정보처리방침",
    cookie_message_suffix: "을 참조하세요.",
    cookie_accept: "동의",
    cookie_decline: "거부",

    // 404
    "404_title": "404 - 페이지를 찾을 수 없습니다",
    "404_description": "요청하신 페이지를 찾을 수 없습니다.",
    "404_message": "요청하신 페이지를 찾을 수 없습니다.",
    "404_button": "홈으로 돌아가기",
    "404_recent_posts": "최근 게시글",
  },
  en: {
    hero_text: "Everything you need for an amazing website.",
    hero_description: `Transforming ideas into beautiful, functional designs that leave lasting impressions.`,

    // blog
    back_to_all_posts: "Back to all posts",
    updated: "Updated",
    share_this_article: "Share this article",
    table_of_contents: "Table of Contents",
    tags: "Tags",
    related_posts: "Related Posts",
    min_read: "min read",
    share: "Share",

    // docs
    docs_title: "Documentation",
    docs_previous: "Previous",
    docs_next: "Next",
    docs_on_this_page: "On this page",
    docs_search_placeholder: "Search docs...",

    // related content
    related_content: "Related Content",
    related_type_service: "Service",
    related_type_project: "Project",
    related_type_blog: "Blog",

    // project page
    project_technologies: "Technologies Used",
    project_key_features: "Key Features",
    project_completed_on: "Completed on:",
    project_live_demo: "Live Demo",
    project_view_source: "View Source",

    // nav & cta
    get_all_access: "Contact Us",
    cta_heading: "Get Started Today",
    cta_description: "Grow your business with an SEO-optimized, high-performance website. Get a free consultation for a tailored solution.",
    cta_button: "Free Consultation",
    hero_cta_secondary: "Our Services",
    subscribe: "Subscribe",
    subscribe_newsletter: "Subscribe to our newsletter",
    subscribe_description: "Enjoy the latest news and updates from our team and community.",
    subscribe_placeholder: "Enter your email address",
    subscribe_disclaimer: "By subscribing, you agree to receive our latest updates. No spam, promise!",

    // contact form
    form_name: "Full Name",
    form_name_placeholder: "John Doe",
    form_email: "Email Address",
    form_email_placeholder: "example@email.com",
    form_phone: "Phone Number",
    form_phone_placeholder: "+1 (555) 123-4567",
    form_reason: "Reason for Contact",
    form_reason_placeholder: "Select a reason",
    form_reason_website: "Website Development",
    form_reason_seo: "SEO Consulting",
    form_reason_maintenance: "Maintenance & Support",
    form_reason_partnership: "Partnership",
    form_reason_other: "Other",
    form_message: "Your Message",
    form_message_placeholder: "How can we help you?",
    form_consent: "I consent to having my submitted information stored",
    form_submit: "Send Message",
    form_success: "Your message has been sent successfully. We'll get back to you soon.",

    // forms
    sign_in: "Sign In",
    sign_up: "Sign Up",
    sign_in_title: "Log in to your account",
    sign_up_title: "Create your free account",
    password_reset_title: "Reset password",
    email_address: "Email Address",
    password: "Password",
    your_name: "Your name",
    create_account: "Create Account",
    forgot_password: "Forgot Password?",
    already_have_account: "Already have an account?",
    dont_have_account: "Don't have an account?",
    create_free_account: "Create a free account",
    already_know_password: "Already know your password?",
    submit: "Submit",
    or: "OR",
    sign_in_with_google: "Sign in with Google",
    sign_up_with_google: "Sign up with Google",

    // contact
    contact_us: "Contact Us",
    contact_description: "Contact us today to get started!",
    send_message: "Send Us A Message",
    book_appointment: "Book Your Appointment",
    book_appointment_description: "We're here to help with all your needs. Feel free to request an appointment or ask us a question.",
    office_hours: "Office Hours",
    contact_info: "Contact Information",
    phone: "Phone",
    email: "Email",
    our_location: "Our Location",
    emergency_hotline: "For emergencies, please call our 24/7 hotline:",

    // about
    years_in_business: "Years In Business",
    happy_patients: "Happy Patients",
    expert_doctors: "Expert Doctors",
    convenient_location: "Convenient Location",
    what_makes_different: "What Makes Our Practice Different",

    // team
    meet_providers: "Meet Our Providers",
    team_subtitle: "A Team Of Expert Specialists",

    // testimonials
    words_from_patients: "Words From Our Patients",

    // feature steps
    three_easy_steps: "Three easy steps",
    get_started: "Get Started",

    // share buttons
    share_on_twitter: "Share on Twitter",
    share_on_facebook: "Share on Facebook",
    share_on_linkedin: "Share on Linkedin",
    share_on_pinterest: "Share on Pinterest",
    share_on_whatsapp: "Share on Whatsapp",
    share_by_email: "Share through email",

    // cookie consent
    cookie_message: "We use cookies to improve your experience on this site. To learn more, see our",
    cookie_privacy_policy: "Privacy Policy",
    cookie_message_suffix: ".",
    cookie_accept: "Accept",
    cookie_decline: "Decline",

    // 404
    "404_title": "404 - Page Not Found",
    "404_description": "The page you are looking for could not be found.",
    "404_message": "Sorry, the page you are looking for could not be found.",
    "404_button": "Return Home",
    "404_recent_posts": "Recent Posts",
  },
  
} as const;

/**
 * * Route translations are used to translate route names for the language switcher component
 * This can be useful for SEO reasons. The key does not matter, it just needs to match between languages
 *
 * These routes must be everything after the base domain. So if this is "atlas.com/blog", the route would be "blog"
 * Or if this is "atlas.com/legal/privacy", the route would be "legal/privacy"
 *
 * This also supports wildcards. For example, "categories/*" would match "categories/1" or "categories/2" etc for that language.
 *
 * Note: This works in conjunction with the localizedCollections object below
 */
export const routeTranslations = {
  ko: {
    aboutKey: "about",
    categoryKey: "categories",
    categoryKey2: "categories/*",
    categoryKey3: "categories",
    tagKey: "tags",
    tagKey2: "tags/*",
    tagKey3: "tags",
    blogKey: "blog",
    servicesKey: "services",
    projectsKey: "projects",
    docsKey: "docs",
    docsKey2: "docs/*",
  },
  en: {
    aboutKey: "about",
    categoryKey: "categories",
    categoryKey2: "categories/*",
    categoryKey3: "categories",
    tagKey: "tags",
    tagKey2: "tags/*",
    tagKey3: "tags",
    blogKey: "blog",
    servicesKey: "services",
    projectsKey: "projects",
    docsKey: "docs",
    docsKey2: "docs/*",
  },
  
} as const;

/**
 * * Content collection translations used by the language switcher and hreflang generator
 *
 * Per-collection, per-locale route base mapping (collections to localize are the keys)
 *
 * If you have a key of "blog" then the blog content collection will be localized. This will look
 * for a "mappingKey" in the entry metadata, and use that to map the entry to the correct locale
 *
 * You can use the locale value to map the collection to a different route if desired
 */
export const localizedCollections = {
  blog: {
		en: "blog",
		ko: "blog"
	},
  services: {
		en: "services",
		ko: "services"
	},
  projects: {
		en: "projects",
		ko: "projects"
	},
  docs: {
		en: "docs",
		ko: "docs"
	},
} as const;
