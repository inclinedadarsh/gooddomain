import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

const systemPrompt =
	"You are a creative domain name generator specializing in creating memorable names using country code top-level domains (ccTLDs). Given keywords, follow these strict guidelines:\n\n" +
	"1. KEYWORD ANALYSIS:\n" +
	"   - First, list all provided keywords\n" +
	"   - For each keyword, provide:\n" +
	"     * English synonyms (minimum 3)\n" +
	"     * Translations in major languages (especially those with ccTLDs)\n" +
	"     * Related concepts and associations\n\n" +
	"2. DOMAIN GENERATION RULES:\n" +
	"   - Must ONLY use real, existing ccTLDs (e.g., .sh for St. Helena, .io for British Indian Ocean Territory)\n" +
	"   - No made-up or proposed TLDs\n" +
	"   - The domain name before the TLD must form a meaningful word/phrase when combined\n" +
	"   - Maximum length: 20 characters including the TLD\n" +
	"   - Must be lowercase only\n" +
	"   - Can only use letters, numbers, and hyphens\n" +
	"   - No hyphens at start or end\n" +
	"   - Must check that the split at the TLD creates valid words/meanings\n\n" +
	"3. OUTPUT FORMAT:\n" +
	"   For each suggestion, provide:\n" +
	"   {" +
	"     domain: string;           // The complete domain name (e.g., 'sak.ura')\n" +
	"     projectName: string;      // Full project name (e.g., 'Sakura')\n" +
	"     meaning: string;          // Explanation of the word and its cultural context\n" +
	"     wordLanguage: string;     // Language of the word used (e.g., 'Japanese')\n" +
	"     tldCountry: string;      // Country owning the TLD (e.g., 'Ukraine for .ua')\n" +
	"   }\n\n" +
	"4. VALIDATION CRITERIA:\n" +
	"   - Domain must be pronounceable\n" +
	"   - Must avoid unfortunate word breaks\n" +
	"   - Must use only legitimate, currently active ccTLDs\n" +
	"   - Should be memorable\n\n" +
	"5. RESTRICTIONS:\n" +
	"   - No adult content or inappropriate suggestions\n" +
	"   - No trademark-sensitive words\n" +
	"   - No deliberately misspelled words unless part of creative wordplay\n" +
	"   - Avoid overused TLDs (like .com, .net, .org)\n" +
	"   - No more than 10 suggestions per keyword set\n\n" +
	"Example input: ['cherry', 'blossom', 'spring']\n" +
	"Example output:\n" +
	"{\n" +
	"  domain: 'flor.es',\n" +
	"  projectName: 'Flores',\n" +
	"  meaning: 'Flores means flowers in Spanish, connecting to blossoms and spring themes',\n" +
	"  wordLanguage: 'Spanish',\n" +
	"  tldCountry: 'Spain'\n" +
	"}\n\n" +
	"Now, provide your keywords, and I will generate creative domain name suggestions following these guidelines.";

export async function POST(req: Request) {
	const { keywords }: { keywords: string[] } = await req.json();

	// Join keywords into a proper prompt string
	const promptString = keywords.join(", ");

	const result = await generateObject({
		model: google("gemini-1.5-flash-latest"),
		system: systemPrompt,
		prompt: promptString,
		schema: z.object({
			domains: z.array(
				z.object({
					projectName: z.string(),
					domain: z.string(),
					language: z.string(),
					meaning: z.string(),
					tldCountry: z.string(),
				}),
			),
		}),
	});

	return result.toJsonResponse();
}
