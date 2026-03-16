// site data types
export interface SiteDataProps {
  name: string;
  title: string;
  description: string;
  author: {
    // used for blog post purposes
    name: string;
    email: string;
    twitter: string; // used for twitter cards when sharing a blog post on twitter
  };
  defaultImage: {
    src: string;
    alt: string;
  };
}

// --------------------------------------------------------
// nav data types
export interface navLinkItem {
  text: string;
  link: string;
  newTab?: boolean; // adds target="_blank" rel="noopener noreferrer" to link
  icon?: string; // adds an icon to the left of the text
}

export interface navDropdownItem {
  text: string;
  dropdown: navLinkItem[];
}

export interface navMegaDropdownColumn {
  title: string;
  items: navLinkItem[];
}

export interface navMegaDropdownItem {
  text: string;
  megaMenuColumns: navMegaDropdownColumn[];
}

export type navItem = navLinkItem | navDropdownItem | navMegaDropdownItem;

// --------------------------------------------------------
// footer data types
export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface FooterSocialItem {
  href: string;
  icon: string;
  label: string;
}

export interface FooterDataProps {
  description: string;
  columns: FooterColumn[];
  socials: FooterSocialItem[];
}

// --------------------------------------------------------
// faq data types
export interface FaqItem {
  question: string; // this is the question of the accordion
  answer: string; // these are the details seen after expanding the accordion
}

// --------------------------------------------------------
// testimonial data types
export interface TestimonialItem {
  avatar: ImageMetadata; // an imported image
  name: string;
  title: string;
  testimonial: string;
}

// --------------------------------------------------------
// site settings types
export interface SiteSettingsProps {
  useViewTransitions?: boolean;
  useAnimations?: boolean;
}

// --------------------------------------------------------
// client config types - central configuration for SEO/GEO/AEO
export interface ClientAddress {
  streetAddress: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}

export interface ClientGeo {
  latitude: number;
  longitude: number;
}

export type BusinessType =
  | "Organization"
  | "LocalBusiness"
  | "ProfessionalService"
  | "MedicalBusiness"
  | "Restaurant"
  | "Store"
  | "EducationalOrganization"
  | "FinancialService"
  | "RealEstateAgent"
  | "LegalService"
  | "AutoRepair"
  | "BeautySalon"
  | "FitnessCenter";

export interface ClientConfigProps {
  business: {
    name: string;
    legalName?: string;
    type: BusinessType;
    description: string;
    foundingDate?: string;
    address?: ClientAddress;
    phone?: string;
    email?: string;
    url: string;
    logo: string;
    image?: string;
    priceRange?: string;
    openingHours?: string[];
    geo?: ClientGeo;
  };
  social: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    github?: string;
    naver?: string;
  };
  analytics: {
    googleAnalyticsId?: string;
    googleTagManagerId?: string;
    googleSearchConsoleVerification?: string;
    naverSearchAdvisorVerification?: string;
    naverAnalyticsId?: string;
    microsoftClarityId?: string;
    facebookPixelId?: string;
    kakaoPixelId?: string;
    customHeadCode?: string;
  };
  seo: {
    enableLocalBusiness: boolean;
    enableFaqSchema: boolean;
    enableBreadcrumbSchema: boolean;
  };
  aiCrawlers: {
    allowGPTBot: boolean;
    allowClaudeBot: boolean;
    allowPerplexityBot: boolean;
    allowGoogleExtended: boolean;
  };
}
