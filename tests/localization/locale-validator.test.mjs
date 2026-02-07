import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { validateLocales } from "../../scripts/localization/locale-validator.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..", "..");

test("localized files pass schema, encoding, placeholder, and terminology checks", () => {
  const result = validateLocales({ projectRoot });
  assert.equal(result.errors.length, 0, result.errors.join("\n"));
});

test("Sinhala homepage keeps the canonical freshwater-science wording", () => {
  const siHomePath = path.join(
    projectRoot,
    "src",
    "locales",
    "si",
    "home.json",
  );
  const siHome = JSON.parse(fs.readFileSync(siHomePath, "utf8"));
  const payload = JSON.stringify(siHome);

  assert.match(payload, /මිරිදිය විද්‍යා/u);
  assert.doesNotMatch(payload, /සාගර හා මිරිදිය විද්‍යා/u);
});
