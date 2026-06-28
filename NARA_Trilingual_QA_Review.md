# NARA Website — Trilingual (EN · සිංහල · தமிழ்) QA Review

**Prepared:** 2026-06-28 · **Method:** Sri Lanka Sinhala & Tamil translation skill (controlled glossary + style guide)
**Scope:** All 56 locale namespaces × 3 languages (~8,064 keys per language).

> ⚠️ **All Sinhala and Tamil below are AI-prepared drafts. A Sri Lankan native speaker — especially for Tamil — must confirm wording and tone before publishing.** This document is a *review list for the government to approve*; only the items in §6 ("Already applied") have been changed in the code so far.

---

## 1. Headline verdict

The trilingual implementation is in **good health**: ~99.7% structurally complete, Sinhala script quality is high (conjuncts overwhelmingly correct), and there is almost no accidental English leakage in core UI. The items below are **consistency and word-choice upgrades** to bring everything to a uniform senior-editor standard, plus **one notable Tamil convention decision** for the government to make.

| Check | Result |
|---|---|
| Structural completeness | ~99.7% (researchEnhanced gap fixed — see §6) |
| Sinhala broken conjuncts (script errors) | ~5 genuine, site-wide (very low) |
| Glossary inconsistencies (same EN term, different translation) | ~49 SI · ~43 TA instances, clustered in ~12 terms |
| Tamil "fisheries" convention | **Decision needed** — see §4 |

---

## 2. Sinhala — consistency upgrades (recommend "Apply" after review)

One English term should map to one Sinhala term across the whole site (glossary principle #4).

| English | Found as | Recommended (glossary) | Notes |
|---|---|---|---|
| Fisheries | `මාළුපිටි`, `මත්ස්‍ය`, *`fisheries`* (untranslated) | **ධීවර කර්මාන්තය** | "මාළුපිටි" is non-standard; untranslated English must be fixed |
| Aquaculture | `ජලජ වගාව` | **ජලජීවී වගාව** | standard term |
| Downloads | `බාගැනීම්` | **බාගත කිරීම්** | both valid; pick one site-wide |
| Contact Us | `අපව සම්බන්ධ වන්න`, `අප අමතන්න` | **අප හා සම්බන්ධ වන්න** | unify |
| Search (action/button) | `සෙවීම` (noun) | **සොයන්න** (imperative) | keep `සෙවීම` only where it's a *heading*, not a button |
| Services | `සේවා` | **සේවාවන්** | unify |
| About | `ආයතනය පිළිබඳව`, `ආරම්භක තොරතුරු` | **පිළිබඳව** | unify |
| Read more / Learn more | `වැඩිදුර කියවන්න`, `වැඩිදුර ඉගෙන ගන්න` | **වැඩි විස්තර** | unify |
| Apply (action) | `ඉල්ලුම්` (noun) | **අයදුම් කරන්න** | CTAs should be imperative |
| Training | *`training`* (untranslated) | **පුහුණුව** | fix untranslated English |

## 3. Tamil — consistency upgrades (recommend "Apply" after review)

| English | Found as | Recommended (SL Tamil glossary) |
|---|---|---|
| Contact Us | `எங்களை தொடர்புகொள்ள`, `எங்களை தொடர்பு கொள்ளுங்கள்` | **எங்களைத் தொடர்பு கொள்ளவும்** |
| Read more | `மேலும் படிக்க` | **மேலும் அறிக** |
| Search (action) | `தேடல்`, `தேடவும்` | **தேடு** |
| Apply (action) | `விண்ணப்பிக்க`, `விண்ணப்பம்` | **விண்ணப்பிக்கவும்** |
| About | `நிறுவனம் பற்றி`, `அறிமுகம்` | **எங்களைப் பற்றி** |
| Aquaculture | `நீர்வள வளர்ப்பு` | **நீர்வாழ் வளர்ப்பு** |
| Training | *`training`* (untranslated) | **பயிற்சி** |

## 4. Tamil "fisheries" — convention decision (needs government call)

The site uses **`மீன்பிடி` 94 times** but **`கடற்தொழில்` only once**.

- `மீன்பிடி` = *fishing* (the activity) — leans toward Indian-Tamil usage for the sector.
- `கடற்தொழில்` = *fisheries* (the industry/sector) — the **Sri Lankan government** standard (e.g., கடற்தொழில் அமைச்சு = Ministry of Fisheries).

**Recommendation:** where the meaning is the *sector/industry* (ministry, department, "fisheries management", policy), switch to **கடற்தொழில்**; keep `மீன்பிடி` only where it genuinely means the *activity of fishing*. This needs a Tamil reviewer to judge case-by-case — it is **not** a safe blind find-and-replace.

## 5. Sinhala script — conjuncts to verify (≈5 genuine)

Most of the site's conjuncts are correct. These specific words appear to be missing the Zero-Width Joiner and should be checked:

| Namespace | Appears as | Should likely be |
|---|---|---|
| about | `සුප්ර…` | `සුප්‍ර…` (e.g. සුප්‍රකට) |
| vacancies | `උද්යෝ…` | `උද්‍යෝ…` (උද්‍යෝග) |
| about | `…හිස්ය` | verify `ස්‍ය` vs boundary |
| digitalLibrary | `…පත්යක` | verify `ත්‍ය` vs boundary |

*(Note: `ඇතුළත් ය`, `…කරගත් ය`, and `කෙන්යා`/Kenya are correct word boundaries, not errors — leave them.)*

---

## 6. Already applied in code (this engagement)

These were unambiguous and have been fixed and validated:

- **Research portal:** added the missing **"All Areas"** filter (SI + TA); upgraded area names to standard academic terms (Climate Change → `දේශගුණ විපර්යාසය`, Conservation → `සංරක්ෂණය`, Oceanography → `සාගර විද්‍යාව`, Policy → `ප්‍රතිපත්ති` / `கொள்கை`, Fisheries → `ධීවර කර්මාන්තය` / `கடற்தொழில்`); added analytics labels (Citations, Downloads, Monthly Downloads, User access trend).
- **Government Services Portal:** full `feedback` form block in EN + SI + TA; audience filters wired to the existing `audiences.*` locale keys; added `Category` / `Audience` labels.
- **Sinhala script fixes:** `ව්‍යාපෘතිය` (project), `ද්‍රව්‍ය`, `මිශ්‍ර` — corrected ZWJ conjuncts.

## 7. How to proceed

1. A NARA Sinhala reviewer and a NARA Tamil reviewer approve §2–§5 (tick / amend each row).
2. I apply the approved rows as a single batch (it's a controlled find-by-key change), rebuild, and deploy.
3. The §4 Tamil "fisheries" decision is applied case-by-case by the Tamil reviewer's guidance.

**Required note:** Do not publish Sinhala/Tamil changes as final without a Sri Lankan native speaker's confirmation.
