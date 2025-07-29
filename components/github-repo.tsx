import { Github } from "lucide-react";
import Link from "next/link";

const GithubRepo = () => {
  return (
    <Link
      title="GitHub Repo"
      className="absolute z-10 right-2 bottom-2 rounded-full bg-crust outline-2 outline-offset-2 outline-transparent hover:outline-crust duration-300 text-text p-2 hidden md:block"
      href="https://github.com/a3chron/portfolio/"
      target="_blank"
    >
      <Github />
    </Link>
  );
};

export default GithubRepo;
