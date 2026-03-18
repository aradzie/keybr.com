#!/usr/bin/env node

/**
 * Translate missing "profile.import.*" messages in all language files.
 *
 * This script:
 * 1. Scans all translation files in the translations directory
 * 2. Finds files with missing or untranslated import keys
 * 3. Translates them to the target language using OpenAI API
 * 4. Updates the files in-place while preserving JSON integrity
 *
 * Usage:
 *   node translate-import-keys.mjs [language-code]
 *
 * Examples:
 *   node translate-import-keys.mjs           # Translate all languages
 *   node translate-import-keys.mjs bg        # Translate only Bulgarian
 *   node translate-import-keys.mjs ja ko zh  # Translate specific languages
 */

import { readFile, writeFile, readdir, copyFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { unlinkSync, existsSync, readFileSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Configuration
const REPO_ROOT = '/home/konrad/gallery/keybr-upload';
const TRANSLATIONS_DIR = join(REPO_ROOT, 'packages/keybr-intl/translations');

// Source English strings to translate (import feature keys)
const SOURCE_STRINGS = {
  'profile.import.description': 'Import typing data from a JSON/.stats file.',
  'profile.import.file_error': 'Failed to read file. Please ensure it is a valid export file.',
  'profile.import.json_error': 'Failed to parse JSON file. Please check the file format.',
  'profile.import.merge_success': 'Imported {count} new results (skipped {skipped} duplicates).',
  'profile.import.no_new': 'All results in the file are duplicates. Nothing was imported.',
  'profile.import.replace_success': 'Replaced all data with {count} imported results.',
  'profile.import.validation_error': 'Some results in the file are invalid. Import aborted.',
};

// Language names for OpenAI (ISO 639-1 or common names)
const LANGUAGE_NAMES = {
  'af': 'Afrikaans',
  'ar': 'Arabic',
  'bg': 'Bulgarian',
  'bn': 'Bengali',
  'ca': 'Catalan',
  'cs': 'Czech',
  'da': 'Danish',
  'de': 'German',
  'el': 'Greek',
  'en': 'English',
  'eo': 'Esperanto',
  'es': 'Spanish',
  'et': 'Estonian',
  'fa': 'Persian',
  'fi': 'Finnish',
  'fo': 'Faroese',
  'fr': 'French',
  'ga': 'Irish',
  'he': 'Hebrew',
  'hr': 'Croatian',
  'hu': 'Hungarian',
  'id': 'Indonesian',
  'is': 'Icelandic',
  'it': 'Italian',
  'ja': 'Japanese',
  'ko': 'Korean',
  'lt': 'Lithuanian',
  'mn': 'Mongolian',
  'nb': 'Norwegian Bokmål',
  'ne': 'Nepali',
  'nl': 'Dutch',
  'pl': 'Polish',
  'pt-br': 'Portuguese (Brazil)',
  'pt-pt': 'Portuguese (Portugal)',
  'ro': 'Romanian',
  'ru': 'Russian',
  'sk': 'Slovak',
  'sl': 'Slovenian',
  'sq': 'Albanian',
  'sv': 'Swedish',
  'th': 'Thai',
  'tr': 'Turkish',
  'uk': 'Ukrainian',
  'vi': 'Vietnamese',
  'zh-hans': 'Simplified Chinese',
  'zh-hant': 'Traditional Chinese',
  'zh-tw': 'Traditional Chinese (Taiwan)',
};

// Load OpenAI API key from environment
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.error('Error: OPENAI_API_KEY environment variable not set');
  console.error('Run: export $(grep OPENAI_API_KEY ~/.env | cut -d= -f2)');
  process.exit(1);
}

/**
 * Translate text to a target language using OpenAI API.
 */
async function translate(text, targetLanguage) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a professional translator. Translate the given text to ${targetLanguage}. Only return the translated text, nothing else. Preserve any placeholders like {count} or {skipped} exactly as-is. Preserve technical terms like "JSON" as-is. IMPORTANT: Use curly quotes '' and "" instead of straight quotes ' and ".`
        },
        {
          role: 'user',
          content: text
        }
      ],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${error}`);
  }

  const data = await response.json();
  let translated = data.choices[0].message.content.trim();
  // Replace straight quotes with curly quotes
  translated = translated.replace(/'/g, '’').replace(/"/g, '“');
  return translated;
}

/**
 * Check if a translation file needs updates for a specific key.
 */
function needsTranslation(translations, key, englishText) {
  const current = translations[key];
  // Needs translation if key doesn't exist, matches the English placeholder,
  // contains the old problematic pattern (space + something + space + .stats),
  // or contains straight quotes (should use curly quotes)
  const hasOldPattern = key === 'profile.import.description' &&
    /\s\S+\s+\.stats/.test(current || '');
  const hasStraightSingleQuotes = /'/g.test(current || '');
  const hasStraightDoubleQuotes = /"/g.test(current || '');
  return current === undefined ||
         current === englishText ||
         hasOldPattern ||
         hasStraightSingleQuotes ||
         hasStraightDoubleQuotes;
}

/**
 * Verify JSON integrity by parsing the file.
 * Returns { valid: boolean, error: string | null }
 */
function verifyJsonIntegrity(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    JSON.parse(content);
    return { valid: true, error: null };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

/**
 * Update a single translation file with JSON integrity verification.
 */
async function updateTranslationFile(langCode) {
  const filePath = join(TRANSLATIONS_DIR, `${langCode}.json`);
  const backupPath = join(TRANSLATIONS_DIR, `${langCode}.json.backup`);

  console.log(`\n🌐 Processing ${langCode} (${LANGUAGE_NAMES[langCode] || langCode})...`);

  // Skip English
  if (langCode === 'en') {
    console.log(`  ⏭️  Skipping English (source language)`);
    return null;
  }

  // Verify original file integrity first
  const originalCheck = verifyJsonIntegrity(filePath);
  if (!originalCheck.valid) {
    console.error(`  ❌ Original file is invalid JSON: ${originalCheck.error}`);
    console.error(`  ⚠️  Aborting to preserve file integrity`);
    return null;
  }

  // Read current translations
  const content = await readFile(filePath, 'utf-8');
  const translations = JSON.parse(content);

  let updated = false;
  const updates = {};

  // Check and translate each string
  for (const [key, englishText] of Object.entries(SOURCE_STRINGS)) {
    if (needsTranslation(translations, key, englishText)) {
      console.log(`  📝 Translating: ${key}`);
      console.log(`     English: "${englishText}"`);

      try {
        const targetLanguage = LANGUAGE_NAMES[langCode] || langCode;
        const translated = await translate(englishText, targetLanguage);

        console.log(`     ${langCode}: "${translated}"`);

        translations[key] = translated;
        updates[key] = translated;
        updated = true;
      } catch (error) {
        console.error(`     ❌ Error: ${error.message}`);
      }
    } else {
      console.log(`  ✓ Already translated: ${key}`);
    }
  }

  // Write back to file if updated
  if (updated) {
    // Create backup before writing
    await copyFile(filePath, backupPath);
    console.log(`  💾 Created backup: ${backupPath}`);

    // Preserve file integrity: sort keys alphabetically
    const sorted = {};
    const keys = Object.keys(translations).sort();

    // Reconstruct JSON with proper formatting
    for (const key of keys) {
      sorted[key] = translations[key];
    }

    // Write new content
    await writeFile(
      filePath,
      JSON.stringify(sorted, null, 2) + '\n',
      'utf-8'
    );

    // Verify the written file is valid JSON
    const newCheck = verifyJsonIntegrity(filePath);
    if (!newCheck.valid) {
      console.error(`  ❌ CRITICAL: Written file is invalid JSON: ${newCheck.error}`);
      console.error(`  🔄 Restoring from backup...`);

      // Restore from backup
      await copyFile(backupPath, filePath);
      unlinkSync(backupPath);

      console.error(`  ⚠️  File restored from backup, changes aborted`);
      return null;
    }

    // Clean up backup on success
    if (existsSync(backupPath)) {
      unlinkSync(backupPath);
      console.log(`  🗑️  Cleaned up backup`);
    }

    console.log(`  ✅ Updated: ${filePath}`);
    console.log(`  ✓ JSON integrity verified`);
    return updates;
  } else {
    console.log(`  ℹ️  No changes needed for ${langCode}`);
    return null;
  }
}

/**
 * Main function.
 */
async function main() {
  const args = process.argv.slice(2);

  // Get list of all translation files
  const allFiles = await readdir(TRANSLATIONS_DIR);
  const allLangCodes = allFiles
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''));

  // Determine which languages to process
  let langCodes;
  if (args.length > 0) {
    // Specific languages from command line
    langCodes = args;
    console.log(`Processing specific languages: ${langCodes.join(', ')}`);
  } else {
    // All languages
    langCodes = allLangCodes;
    console.log(`Processing all ${langCodes.length} languages...`);
  }

  // Process each language
  const results = {};
  for (const langCode of langCodes) {
    if (!allLangCodes.includes(langCode)) {
      console.error(`⚠️  Warning: Language code '${langCode}' not found, skipping...`);
      continue;
    }

    try {
      const updates = await updateTranslationFile(langCode);
      if (updates) {
        results[langCode] = updates;
      }
    } catch (error) {
      console.error(`❌ Failed to process ${langCode}: ${error.message}`);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary');
  console.log('='.repeat(60));
  console.log(`Languages processed: ${langCodes.length}`);
  console.log(`Languages updated: ${Object.keys(results).length}`);

  if (Object.keys(results).length > 0) {
    console.log('\n✅ Updated languages:');
    for (const [lang, updates] of Object.entries(results)) {
      console.log(`  - ${lang} (${LANGUAGE_NAMES[lang] || lang})`);
    }
  }
}

// Run
main().catch(console.error);
