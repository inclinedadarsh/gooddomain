import { atom } from "jotai";

export const descriptionAtom = atom("");
export const isLoadingAtom = atom(false);

type Domain = {
	projectName: string;
	domain: string;
	language: string;
	meaning: string;
	tldCountry: string;
};
export const domainsAtom = atom<Domain[]>([]);
export const keywordsAtom = atom<string[]>([]);
