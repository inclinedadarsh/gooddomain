"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ViewContainer } from "@/components/ui/view-container";
import { descriptionAtom, domainsAtom, isLoadingAtom } from "@/jotai";
import { useAtom } from "jotai";
import { Loader2 } from "lucide-react";

export default function Home() {
	const [description, setDescription] = useAtom(descriptionAtom);
	const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
	const [domains, setDomains] = useAtom(domainsAtom);

	const handleClick = async () => {
		setIsLoading(true);
		try {
			await fetch("/api/domains", {
				method: "POST",
				body: JSON.stringify({ description }),
				headers: {
					"Content-Type": "application/json",
				},
			}).then(response => {
				response.json().then(json => {
					setDomains(json.domains);
					setIsLoading(false);
				});
			});
		} catch (error) {
			console.log(error);
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
				<Textarea
					placeholder="Enter your cool project's description here..."
					value={description}
					onChange={e => setDescription(e.target.value)}
				/>
				<Button
					type="button"
					className="mt-10 w-full"
					onClick={handleClick}
					disabled={isLoading}
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
								className="bg-card rounded-lg p-5"
							>
								<h3 className="text-xl font-bold">
									{domain.projectName}
								</h3>
								<p className="text-muted-foreground">
									{domain.description}
								</p>
							</div>
						))}
					</div>
				</div>
			)}
		</ViewContainer>
	);
}
