// constants/languages.ts
export const SUPPORTED_LANGUAGES = [
    {
        code: 'en',
        name: 'English',
        nativeName: 'English',
    },
    {
        code: 'hi',
        name: 'Hindi',
        nativeName: 'हिंदी',
    },
    {
        code: 'gu',
        name: 'Gujarati',
        nativeName: 'ગુજરાતી',
    },
] as const;

export type LanguageCode = typeof SUPPORTED_LANGUAGES[number]['code'];

