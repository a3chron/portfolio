import Link from "next/link";
import { Block } from "../block";

const InfoSection = () => {
  return (
    <Block className="bg-mauve selection:text-mauve">
      <div className="w-dvw 2xl:w-384 h-fit min-h-dvh p-4 md:py-12 md:px-24 flex flex-col item-center justify-center">
        <h1 className="uppercase text-4xl md:text-6xl text-mauve bg-crust -mt-16 md:-mt-24 mb-6 md:mb-24 w-fit p-1 px-2">
          #1 About Me
        </h1>
        <h1 className="text-2xl md:text-4xl font-bold space-y-4 md:space-y-0">
          Hi, my name is Kurt Schambach. <br />
          I am a Software Developer working at{" "}
          <Link
            target="_blank"
            href="https://www.titanom.com"
            className="underline text-crust"
          >
            Titanom Solutions
          </Link>
          .
        </h1>
        <p className="text-xl md:text-2xl font-semibold font-plex mt-12 w-full md:w-2/3">
          I mostly focus on Web-Development and LLMs, but from time to time I
          happen to do some other stuff too.
        </p>
        <p className="text-xl md:text-2xl font-semibold font-plex mt-12 w-full md:w-2/3">
          I&apos;m currently pursuing my Bachelor&apos;s degree in Computer
          Science at{" "}
          <Link
            href="https://www.tum.de"
            target="_blank"
            className="underline text-crust"
          >
            TUM
          </Link>
          .
        </p>
        <p className="text-xl md:text-2xl font-semibold font-plex mt-12 w-full md:w-2/3">
          In my free time, I work on some of my own{" "}
          <Link href="/projects" className="underline text-crust">
            Projects
          </Link>{" "}
          or I write articles for my{" "}
          <Link href="/blog" className="underline text-crust">
            Blog
          </Link>
          .
        </p>
      </div>
    </Block>
  );
};

export default InfoSection;
