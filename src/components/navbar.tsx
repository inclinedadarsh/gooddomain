import { cn } from "@/lib/utils";
import { SiGithub, SiX } from "@icons-pack/react-simple-icons";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { ViewContainer } from "./ui/view-container";

const Navbar = () => {
	return (
		<nav id="navbar" className="my-10">
			<ViewContainer className="flex justify-between items-center">
				<span className="font-bold text-xl">GoodDomain</span>
				<div className="flex items-center gap-4">
					<Link
						href="https://x.com/inclinedadarsh"
						className={cn(
							buttonVariants({
								variant: "outline",
								size: "icon",
							}),
						)}
						target="_blank"
						rel="noopener noreferrer"
					>
						<SiX />
					</Link>
					<Link
						href="https://github.com/inclinedadarsh/gooddomain"
						className={cn(buttonVariants({ variant: "outline" }))}
						target="_blank"
						rel="noopener noreferrer"
					>
						<SiGithub />
						GitHub
					</Link>
				</div>
			</ViewContainer>
		</nav>
	);
};

export default Navbar;
