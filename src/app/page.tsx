"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ViewContainer } from "@/components/ui/view-container";
import { descriptionAtom, isLoadingAtom } from "@/jotai";
import { useAtom } from "jotai";
import { Loader2 } from "lucide-react";

export default function Home() {
	const [description, setDescription] = useAtom(descriptionAtom);
	const [isLoading, setIsLoading] = useAtom(isLoadingAtom);

	const handleClick = () => {
		setIsLoading(true);
		setTimeout(() => {
			setIsLoading(false);
		}, 2000);
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
		</ViewContainer>
	);
}
