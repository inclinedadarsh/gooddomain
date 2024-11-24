import { atom } from "jotai";

export const descriptionAtom = atom("");
export const isLoadingAtom = atom(false);

type Domain = {
	projectName: string;
	domain: string;
	description: string;
	language: string;
};
export const domainsAtom = atom<Domain[]>([]);
