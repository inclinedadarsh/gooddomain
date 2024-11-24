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
import { Loader2, X } from "lucide-react";

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
			await fetch("/api/domains", {
				method: "POST",
				body: JSON.stringify({ keywords }),
				headers: {
					"Content-Type": "application/json",
				},
			}).then(response => {
				response.json().then(json => {
					setDomains(json.domains);
				});
			});
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<ViewContainer>
			<h1 className="text-5xl sm:text-6xl lg:text-7xl text-center mt-20 font-bold">
				Find domains,
				<br />
				<span className="italic">easily!</span>
			</h1>
			<p className="max-w-xl text-center mx-auto my-10 text-muted-foreground">
				Just put the description of your project to get some project
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
								className="flex items-center gap-1 bg-secondary px-3 py-1 rounded-full"
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
			{domains.length > 0 && (
				<div className="mt-10">
					<h2 className="text-3xl font-bold text-center">
						Here are some cool domain names for you!
					</h2>
					<div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
						{domains.map(domain => (
							<div
								key={domain.domain}
								className="bg-card hover:bg-card/80 transition-colors rounded-lg p-5 border"
							>
								<div className="space-y-4">
									<div>
										<h3 className="text-2xl font-bold tracking-tight">
											{domain.projectName}
										</h3>
										<p className="text-lg font-mono text-primary">
											{domain.domain}
										</p>
									</div>
									<div className="space-y-2">
										<p className="text-sm text-muted-foreground">
											{domain.meaning}
										</p>
										<div className="flex gap-2">
											<span className="text-xs px-2 py-1 rounded-full bg-secondary">
												{domain.language}
											</span>
											<span className="text-xs px-2 py-1 rounded-full bg-secondary">
												{domain.tldCountry}
											</span>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</ViewContainer>
	);
}
