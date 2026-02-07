import fs from "node:fs";
import path from "node:path";
import { TextDecoder } from "node:util";

const LANGUAGES = ["si", "ta"];
const UTF8_DECODER = new TextDecoder("utf-8", { fatal: true });
const PLACEHOLDER_PATTERN = /\{\{\s*([\w.-]+)\s*\}\}/g;
const SINHALA_SCRIPT = /[\u0D80-\u0DFF]/;
const TAMIL_SCRIPT = /[\u0B80-\u0BFF]/;

const isRecord = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const extractPlaceholders = (value) => {
  const placeholders = [];
  if (typeof value !== "string") {
    return placeholders;
  }

  for (const match of value.matchAll(PLACEHOLDER_PATTERN)) {
    placeholders.push(match[1]);
  }

  return [...new Set(placeholders)].sort();
};

const isMixedScriptAllowed = (allowList, pathKey) => {
  const normalizedPathKey = pathKey.replace(".json", "");
  return allowList.some(
    (allowedPath) =>
      normalizedPathKey.endsWith(allowedPath) || pathKey.endsWith(allowedPath),
  );
};

const isAllowedExtraKey = (allowMap, fileName, pathKey) => {
  const patterns = allowMap?.[fileName];
  if (!Array.isArray(patterns) || patterns.length === 0) {
    return false;
  }

  return patterns.some((pattern) => {
    if (pattern === "*") {
      return true;
    }

    if (pattern.endsWith(".*")) {
      const base = pattern.slice(0, -2);
      return pathKey === base || pathKey.startsWith(`${base}.`);
    }

    return pathKey === pattern;
  });
};

const decodeUtf8Strict = (filePath, errors) => {
  const buffer = fs.readFileSync(filePath);

  try {
    UTF8_DECODER.decode(buffer);
  } catch (error) {
    errors.push(`[encoding] ${filePath}: invalid UTF-8 (${error.message})`);
    return null;
  }

  const text = buffer.toString("utf8");
  if (text.includes("\uFFFD")) {
    errors.push(
      `[encoding] ${filePath}: replacement character detected (possible encoding corruption)`,
    );
  }

  return text;
};

const compareNode = ({
  reference,
  candidate,
  fileName,
  lang,
  pathStack,
  errors,
  warnings,
  allowList,
  allowExtraKeys,
  bannedTerms,
}) => {
  const pathKey = `${fileName}${pathStack.length ? `.${pathStack.join(".")}` : ""}`;

  if (Array.isArray(reference)) {
    if (!Array.isArray(candidate)) {
      errors.push(
        `[shape] ${lang}/${fileName}: expected array at ${pathStack.join(".") || "<root>"}`,
      );
      return;
    }

    if (reference.length !== candidate.length) {
      errors.push(
        `[shape] ${lang}/${fileName}: array length mismatch at ${pathStack.join(".") || "<root>"} (expected ${reference.length}, got ${candidate.length})`,
      );
      return;
    }

    reference.forEach((item, index) => {
      compareNode({
        reference: item,
        candidate: candidate[index],
        fileName,
        lang,
        pathStack: [...pathStack, String(index)],
        errors,
        warnings,
        allowList,
        allowExtraKeys,
        bannedTerms,
      });
    });

    return;
  }

  if (isRecord(reference)) {
    if (!isRecord(candidate)) {
      errors.push(
        `[shape] ${lang}/${fileName}: expected object at ${pathStack.join(".") || "<root>"}`,
      );
      return;
    }

    for (const key of Object.keys(reference)) {
      if (!(key in candidate)) {
        errors.push(
          `[shape] ${lang}/${fileName}: missing key ${[...pathStack, key].join(".")}`,
        );
        continue;
      }

      compareNode({
        reference: reference[key],
        candidate: candidate[key],
        fileName,
        lang,
        pathStack: [...pathStack, key],
        errors,
        warnings,
        allowList,
        allowExtraKeys,
        bannedTerms,
      });
    }

    for (const key of Object.keys(candidate)) {
      if (!(key in reference)) {
        const extraPath = [...pathStack, key].join(".");
        if (!isAllowedExtraKey(allowExtraKeys, fileName, extraPath)) {
          warnings.push(`[shape] ${lang}/${fileName}: extra key ${extraPath}`);
        }
      }
    }

    return;
  }

  if (typeof reference !== typeof candidate) {
    errors.push(
      `[shape] ${lang}/${fileName}: type mismatch at ${pathStack.join(".")} (expected ${typeof reference}, got ${typeof candidate})`,
    );
    return;
  }

  if (typeof reference !== "string" || typeof candidate !== "string") {
    return;
  }

  if (reference.trim().length > 0 && candidate.trim().length === 0) {
    errors.push(
      `[content] ${lang}/${fileName}: empty translation at ${pathStack.join(".")}`,
    );
  }

  const referencePlaceholders = extractPlaceholders(reference);
  const candidatePlaceholders = extractPlaceholders(candidate);
  if (referencePlaceholders.join("|") !== candidatePlaceholders.join("|")) {
    errors.push(
      `[placeholder] ${lang}/${fileName}: mismatch at ${pathStack.join(".")} (expected ${referencePlaceholders.join(", ") || "none"}, got ${candidatePlaceholders.join(", ") || "none"})`,
    );
  }

  for (const bannedTerm of bannedTerms) {
    if (candidate.includes(bannedTerm)) {
      errors.push(
        `[terminology] ${lang}/${fileName}: banned term "${bannedTerm}" found at ${pathStack.join(".")}`,
      );
    }
  }

  if (
    lang === "si" &&
    TAMIL_SCRIPT.test(candidate) &&
    !isMixedScriptAllowed(allowList, pathKey)
  ) {
    errors.push(
      `[script] ${lang}/${fileName}: unexpected Tamil script at ${pathStack.join(".")}`,
    );
  }

  if (
    lang === "ta" &&
    SINHALA_SCRIPT.test(candidate) &&
    !isMixedScriptAllowed(allowList, pathKey)
  ) {
    errors.push(
      `[script] ${lang}/${fileName}: unexpected Sinhala script at ${pathStack.join(".")}`,
    );
  }
};

const listJsonFiles = (dirPath) =>
  fs
    .readdirSync(dirPath)
    .filter((name) => name.endsWith(".json"))
    .sort();

export const validateLocales = ({
  projectRoot,
  includeFiles = null,
  useManagedScope = true,
}) => {
  const errors = [];
  const warnings = [];

  const localeRoot = path.join(projectRoot, "src", "locales");
  const englishRoot = path.join(localeRoot, "en");
  const allEnglishFiles = listJsonFiles(englishRoot);
  const validationScopePath = path.join(
    projectRoot,
    "docs",
    "localization",
    "validation-scope.json",
  );

  let managedFiles = [];
  let allowedExtraKeys = {};
  if (fs.existsSync(validationScopePath)) {
    const scopeRaw = decodeUtf8Strict(validationScopePath, errors);
    if (scopeRaw) {
      try {
        const scope = JSON.parse(scopeRaw);
        managedFiles = Array.isArray(scope?.managedFiles)
          ? scope.managedFiles
          : [];
        allowedExtraKeys = isRecord(scope?.allowedExtraKeys)
          ? scope.allowedExtraKeys
          : {};
      } catch (error) {
        errors.push(
          `[json] docs/localization/validation-scope.json: invalid JSON (${error.message})`,
        );
      }
    }
  }

  const englishFiles = Array.isArray(includeFiles)
    ? allEnglishFiles.filter((fileName) => includeFiles.includes(fileName))
    : useManagedScope && managedFiles.length
      ? allEnglishFiles.filter((fileName) => managedFiles.includes(fileName))
      : allEnglishFiles;

  const glossaryPath = path.join(
    projectRoot,
    "docs",
    "localization",
    "glossary.json",
  );
  const glossaryRaw = decodeUtf8Strict(glossaryPath, errors);
  const glossary = glossaryRaw ? JSON.parse(glossaryRaw) : {};
  const allowLists = glossary?.governance?.mixedScriptAllowlistPaths || {};
  const bannedTermsByLanguage = glossary?.governance?.bannedTerms || {};

  for (const fileName of englishFiles) {
    const englishPath = path.join(englishRoot, fileName);
    const englishRaw = decodeUtf8Strict(englishPath, errors);
    if (!englishRaw) {
      continue;
    }

    let englishJson;
    try {
      englishJson = JSON.parse(englishRaw);
    } catch (error) {
      errors.push(`[json] en/${fileName}: invalid JSON (${error.message})`);
      continue;
    }

    for (const lang of LANGUAGES) {
      const localizedPath = path.join(localeRoot, lang, fileName);
      if (!fs.existsSync(localizedPath)) {
        errors.push(`[file] missing locale file: ${lang}/${fileName}`);
        continue;
      }

      const localizedRaw = decodeUtf8Strict(localizedPath, errors);
      if (!localizedRaw) {
        continue;
      }

      let localizedJson;
      try {
        localizedJson = JSON.parse(localizedRaw);
      } catch (error) {
        errors.push(
          `[json] ${lang}/${fileName}: invalid JSON (${error.message})`,
        );
        continue;
      }

      compareNode({
        reference: englishJson,
        candidate: localizedJson,
        fileName,
        lang,
        pathStack: [],
        errors,
        warnings,
        allowList: allowLists[lang] || [],
        allowExtraKeys: allowedExtraKeys,
        bannedTerms: bannedTermsByLanguage[lang] || [],
      });
    }
  }

  if (!useManagedScope && !Array.isArray(includeFiles)) {
    for (const lang of LANGUAGES) {
      const langDir = path.join(localeRoot, lang);
      const files = new Set(listJsonFiles(langDir));

      for (const fileName of englishFiles) {
        files.delete(fileName);
      }

      for (const extraFile of files) {
        warnings.push(`[file] extra locale file in ${lang}: ${extraFile}`);
      }
    }
  }

  return {
    errors,
    warnings,
    stats: {
      localeFileCount: englishFiles.length,
      languagesValidated: LANGUAGES.length,
    },
  };
};
