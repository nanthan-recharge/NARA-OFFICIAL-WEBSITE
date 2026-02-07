import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateLocales } from "./locale-validator.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..", "..");
const validateAll = process.argv.includes("--all");

const result = validateLocales({
  projectRoot,
  useManagedScope: !validateAll,
});

console.log(
  `Validated ${result.stats.localeFileCount} locale files across ${result.stats.languagesValidated} localized languages.`,
);
console.log(
  validateAll ? "Scope: full locale set." : "Scope: managed locale set.",
);

if (result.warnings.length > 0) {
  console.log("\nWarnings:");
  for (const warning of result.warnings) {
    console.log(`- ${warning}`);
  }
}

if (result.errors.length > 0) {
  console.error("\nLocalization validation failed:");
  for (const error of result.errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("Localization validation passed.");
