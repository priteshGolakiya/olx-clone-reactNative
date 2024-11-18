// //i18n.ts
// import i18n from "i18next";
// import { initReactI18next } from "react-i18next";


// interface Resources {
//     en: {
//         translation: Record<string, string>;
//     };
//     gu: {
//         translation: Record<string, string>;
//     };
//     hi: {
//         translation: Record<string, string>;
//     };
// }

// i18n.use(initReactI18next).init({
//     resources: {
//         en: {
//             translation: require("@/public/lan/en/translations.json")
//         },
//         gu: {
//             translation: require("@/public/lan/gu/translations.json"),
//         },
//         hi: {
//             translation: require("@/public/lan/hi/translations.json"),
//         },
//     } as Resources,
//     lng: "en",
//     fallbackLng: "en",
//     interpolation: {
//         escapeValue: false,
//     },
// });

// export default i18n;

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from 'expo-localization';
import { I18nManager } from 'react-native';
import 'intl-pluralrules';

// Define nested translation type
type TranslationResource = {
    translation: {
        [key: string]: string;
    };
};

// Define the resources type that matches i18next's expected structure
type Resources = {
    [key: string]: TranslationResource;
};

// Create the resources object
const resources: Resources = {
    en: {
        translation: require("@/public/lan/en/translations.json")
    },
    gu: {
        translation: require("@/public/lan/gu/translations.json")
    },
    hi: {
        translation: require("@/public/lan/hi/translations.json")
    }
};

// Get device language
const deviceLanguage = Localization.locale.split('-')[0];

// Initialize i18next
i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: deviceLanguage,
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        },
        compatibilityJSON: 'v3',
        react: {
            useSuspense: false,
        },
    });

// Handle RTL languages if needed
I18nManager.allowRTL(i18n.dir() === 'rtl');
I18nManager.forceRTL(i18n.dir() === 'rtl');

export default i18n;