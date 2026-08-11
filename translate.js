const fs = require("fs");
const path = require("path");
const translate = require("@vitalets/google-translate-api");

// Configurable
const sourceLang = "en";
const targetLanguages = ["af", "ar", "ur", "fr", "de"];
const sourceFileName = "common.json";
const sourceDir = path.join(__dirname, "public/locales", sourceLang);
const targetBaseDir = path.join(__dirname, "public/locales");

async function readJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

async function writeJSON(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

async function translateText(text, lang) {
  // Optional: add retries for robustness
  const maxRetries = 3;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await translate(text, { from: sourceLang, to: lang });
      return res.text;
    } catch (err) {
      console.error(
        `Error translating "${text}" to ${lang} (attempt ${attempt}):`,
        err
      );
      if (attempt === maxRetries) throw err;
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
}

// Main execution
(async () => {
  const sourcePath = path.join(sourceDir, sourceFileName);
  const sourceData = await readJSON(sourcePath);

  for (const lang of targetLanguages) {
    console.log(`Translating to ${lang}...`);
    const translatedData = {};

    const keys = Object.keys(sourceData);
    // Translate all keys in parallel
    await Promise.all(
      keys.map(async (key) => {
        try {
          const translatedText = await translateText(sourceData[key], lang);
          translatedData[key] = translatedText;
          console.log(`Translated "${key}" to "${lang}": ${translatedText}`);
        } catch (err) {
          console.error(`Failed to translate "${key}" to ${lang}:`, err);
          translatedData[key] = sourceData[key]; // fallback
        }
      })
    );

    // Save translated JSON
    const targetDir = path.join(targetBaseDir, lang);
    const targetPath = path.join(targetDir, sourceFileName);
    await writeJSON(targetPath, translatedData);
    console.log(`Saved ${lang} translation at ${targetPath}`);
  }

  console.log("All translations completed.");
})();
