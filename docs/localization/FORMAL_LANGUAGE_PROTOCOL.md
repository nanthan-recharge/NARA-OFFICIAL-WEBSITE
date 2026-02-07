# Formal Localization Protocol (English | Sinhala | Tamil)

## Scope

- User-facing UI strings must be authored in each language independently.
- High-register formal style is required for Sinhala and Tamil.
- Direct machine-style literal translation is prohibited.

## Register Requirements

| Rule              | English                 | Sinhala (Formal)                       | Tamil (Sentamil Standard)               |
| ----------------- | ----------------------- | -------------------------------------- | --------------------------------------- |
| Tone              | Institutional, precise  | ආයතනික, නිරවද්‍ය, විධිමත්              | நிறுவனத் துல்லியம், இலக்கணத் தெளிவு     |
| Sentence quality  | Human editorial quality | සම්පූර්ණ ව්‍යාකරණ සහ ස්වභාවික පරිච්ඡේද | முழுமையான இலக்கணம், இயல்பான நடையமைப்பு  |
| Forbidden pattern | Word-by-word literalism | අර්ථ විකෘති කරන පද-පද පරිවර්තනය        | பொருள் சிதைக்கும் சொல்-சொல் மொழிமாற்றம் |

## Term Governance

- Canonical terms are defined in `docs/localization/glossary.json`.
- Banned term policy is enforced in validation tests.
- The Sinhala phrase `සාගර හා මිරිදිය විද්‍යා` is banned; use `මිරිදිය විද්‍යා`.

## Engineering Rules

- Keep all locale files in UTF-8.
- Preserve placeholder tokens exactly (e.g., `{{count}}`, `{{name}}`).
- Locale file schemas must match English source schemas.
- No mixed-script leakage unless explicitly whitelisted.

## Review Workflow

1. Write English source copy.
2. Author Sinhala and Tamil independently in formal register.
3. Run `npm run validate:localization`.
4. Run `npm run test:localization`.
5. Run Prettier formatting on touched files.

## Output Structure Rule

When adding new translatable content, use parallel JSON structures across `en`, `si`, and `ta` locale files.
