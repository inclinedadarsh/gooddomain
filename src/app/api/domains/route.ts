import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

export async function POST(req: Request) {
	const { description }: { description: string } = await req.json();

	const result = await generateObject({
		model: google("gemini-1.5-flash-latest"),
		system: "You are an advanced language model specializing in creative ideation and keyword extraction. Your task is to assist me in generating a project name and a creatively crafted domain name based on a description I provide. Follow these instructions strictly:\
Extract Keywords:\
            Analyze the project description I provide and identify 3-5 key thematic or functional keywords that define the project's core idea. These keywords must be relevant and concise.\
Generate Project Names:\
            Based on the extracted keywords, suggest 5 unique project names that are:\
            Memorable and easy to pronounce.\
Relevant to the theme and purpose of the project.\
            Ideally, a single word or a creative fusion of two words.\
Craft Domain Names Using ccTLDs:\
            For each project name:\
            Use ccTLDs(country- code top - level domains) to create a short and clever domain name by creatively splitting the project name or using synonyms in other languages.\
Ensure that the ccTLD makes sense contextually or phonetically with the project name.For instance:\
If the project name is “Orbit,” the domain can be orb.it(Italy’s ccTLD).\
If the project name is “Echo,” the domain can be ec.ho(Honduras’ ccTLD).\
Consider international synonyms of keywords(e.g., using “chat” for a communication project could yield cha.t using Thailand’s ccTLD).',\
Additional Notes:\
Ensure all domain names are plausible and use existing ccTLDs.\
Avoid overly generic suggestions; focus on creativity and relevance.\
Do not use invalid or fictional TLDs.",
		prompt: description,
		schema: z.object({
			domains: z.array(
				z.object({
					projectName: z.string(),
					domain: z.string(),
					language: z.string(),
					description: z.string(),
				}),
			),
		}),
	});

	return result.toJsonResponse();
}
