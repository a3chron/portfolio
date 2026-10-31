import Link from "next/link";
import { Section } from "./section";

const InfoSection = () => {
  return (
    <Section title="About Me" as="p">
      <h1 className="text-2xl md:text-4xl font-medium font-fraunces space-y-4 md:space-y-0">
        Hi, my name is Kurt Schambach. <br />I am a Software Engineer working at{" "}
        <Link
          target="_blank"
          href="https://www.titanom.com"
          className="underline"
        >
          Titanom Solutions
        </Link>
        .
      </h1>
      <p className="text-xl md:text-2xl font-semibold mt-12">
        I mostly focus on Web-Development and LLMs, but from{" "}
        <Link href="/projects/stellar" className="underline">
          time
        </Link>{" "}
        <Link href="/projects/gith" className="underline">
          to
        </Link>{" "}
        <Link href="/projects/kaeru-kitchen" className="underline">
          time
        </Link>{" "}
        I happen to do some other stuff too.
      </p>
      <p className="text-xl md:text-2xl font-semibold mt-12">
        I&apos;m currently pursuing my Bachelor&apos;s degree in Computer
        Science at{" "}
        <Link
          href="https://www.tum.de"
          target="_blank"
          className="underline"
        >
          TUM
        </Link>
        .
      </p>
      <p className="text-xl md:text-2xl font-semibold mt-12">
        In my free time, I work on some of my own{" "}
        <Link href="/projects" className="underline">
          Projects
        </Link>{" "}
        or I write articles for my{" "}
        <Link href="/blog" className="underline">
          Blog
        </Link>
        .
      </p>
    </Section>
  );
};

export default InfoSection;
