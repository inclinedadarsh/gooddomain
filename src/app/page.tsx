"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ViewContainer } from "@/components/ui/view-container";
import {
	descriptionAtom,
	domainsAtom,
	isLoadingAtom,
	keywordsAtom,
} from "@/jotai";
import { useAtom } from "jotai";
import { Earth, Info, Languages, Loader2, X } from "lucide-react";
import { toast } from "sonner";

export default function Home() {
	const [description, setDescription] = useAtom(descriptionAtom);
	const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
	const [domains, setDomains] = useAtom(domainsAtom);
	const [keywords, setKeywords] = useAtom(keywordsAtom);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (value.endsWith(",")) {
			const keyword = value.slice(0, -1).trim();
			if (
				keyword &&
				!keywords.includes(keyword) &&
				keywords.length < 10
			) {
				setKeywords([...keywords, keyword]);
			}
			setDescription("");
		} else {
			setDescription(value);
		}
	};

	const removeKeyword = (keywordToRemove: string) => {
		setKeywords(keywords.filter(k => k !== keywordToRemove));
	};

	const handleClick = async () => {
		setIsLoading(true);
		try {
			const response = await fetch("/api/domains", {
				method: "POST",
				body: JSON.stringify({ keywords }),
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData.message || "Failed to generate domains",
				);
			}

			const data = await response.json();
			if (!data.domains || !Array.isArray(data.domains)) {
				throw new Error("Invalid response format");
			}

			setDomains(data.domains);
		} catch (error) {
			console.error("Domain generation error:", error);
			toast.error(
				error instanceof Error
					? error.message
					: "Failed to generate domain suggestions",
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<ViewContainer className="mb-10">
			<h1 className="text-5xl sm:text-6xl lg:text-8xl text-center mt-10 font-serif font-bold leading-tight">
				Find domains,
				<br />
				<span className="text-primary">easily!</span>
			</h1>
			<p className="max-w-xl text-center mx-auto my-10 text-muted-foreground">
				Enter a few keywords related to your project to get some project
				name ideas along with their creative domain names!
			</p>
			<div className="mx-auto mt-10 max-w-xl">
				<Input
					placeholder={
						keywords.length >= 10
							? "Maximum keywords reached"
							: "Enter keywords and press comma to add..."
					}
					value={description}
					onChange={handleInputChange}
					disabled={keywords.length >= 10}
				/>
				<p className="text-sm text-muted-foreground mt-2">
					{`${keywords.length}/10 keywords used`}
				</p>
				{keywords.length > 0 && (
					<div className="flex flex-wrap gap-2 mt-3">
						{keywords.map(keyword => (
							<div
								key={keyword}
								className="flex items-center gap-1 px-3 py-1 rounded-full border-border border"
							>
								<span>{keyword}</span>
								<button
									onClick={() => removeKeyword(keyword)}
									className="hover:text-destructive"
									type="button"
								>
									<X size={14} />
								</button>
							</div>
						))}
					</div>
				)}
				<Button
					type="button"
					className="mt-10 w-full"
					onClick={handleClick}
					disabled={isLoading || keywords.length < 3}
				>
					{isLoading ? (
						<>
							<Loader2
								className="animate-spin inline-block mr-2"
								size={20}
							/>
							Finding domain names...
						</>
					) : (
						"Inspire me!"
					)}
				</Button>
			</div>
			<div className="my-10">
				{domains.length > 0 && (
					<div className="">
						<h2 className="text-3xl font-bold text-center">
							Here are some{" "}
							<span className="font-serif text-primary">
								cool domain names
							</span>{" "}
							for you!
						</h2>
						<div className="my-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
							{domains.map(domain => (
								<div
									key={domain.domain}
									className="bg-card hover:-translate-y-2 transition-transform rounded-lg p-5 border shadow"
								>
									<div className="space-y-4">
										<div>
											<h3 className="text-2xl font-bold tracking-tight">
												{domain.projectName}
											</h3>
											<p className="text-lg text-primary font-serif">
												{domain.domain}
											</p>
										</div>
										<p className="text-sm text-muted-foreground">
											{domain.meaning}
										</p>
										<div className="flex gap-2">
											<span className="text-sm px-3 py-1 rounded-full flex gap-2 border-border border items-center">
												<Languages size={16} />{" "}
												{domain.language}
											</span>
											{domain.language !== "English" && (
												<span className="text-sm px-3 py-1 rounded-full flex gap-2 border-border border items-center">
													<Earth size={16} />{" "}
													{domain.tldCountry}
												</span>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
						<p className="flex justify-center items-center gap-2 text-muted-foreground">
							<Info size={18} /> GoodDomains can produce incorrect
							results.
						</p>
					</div>
				)}
			</div>
		</ViewContainer>
	);
}
