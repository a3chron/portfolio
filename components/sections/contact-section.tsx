"use client";

import {
  ExternalLink,
  FilmIcon,
  Github,
  KeyboardIcon,
  Linkedin,
  LucideBellRing,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { HoverItalic } from "@/components/hover-italic";
import { Section } from "./section";

type SocialType = {
  icon: React.ReactNode;
  href: string;
  label: string;
  desc: string;
};

const ContactSection = () => {
  const socials: SocialType[] = [
    {
      icon: <Mail size={20} />,
      href: "mailto:kurt.schambach@gmail.com",
      label: "Email",
      desc: "kurt.schambach@gmail.com",
    },
    {
      icon: <Github size={20} />,
      href: "https://github.com/a3chron",
      label: "Github",
      desc: "The interesting one",
    },
    {
      icon: <Linkedin size={20} />,
      href: "https://www.linkedin.com/in/kurt-schambach/",
      label: "LinkedIn",
      desc: "The not so interesting one",
    },
    {
      icon: <FilmIcon size={20} />,
      href: "https://letterboxd.com/a3chron/",
      label: "Letterboxd",
      desc: "For the movie people",
    },
    {
      icon: <ChessPawn size={20} />,
      href: "https://www.chess.com/member/a3chron",
      label: "Chess.com",
      desc: "For the chess people",
    },
    /*{
      icon: <KeyboardIcon size={20} />,
      href: "https://monkeytype.com/profile/a3chron",
      label: "Monkeytype",
      desc: "For the monkeys"
    },
    {
      icon: <LucideBellRing size={20} />,
      href: "https://www.producthunt.com/@a3chron",
      label: "Producthunt",
      desc: "I usually post my projects here as well"
    }*/
  ];

  return (
    <Section title="Contact">
      <p className="text-2xl md:text-4xl font-medium font-fraunces">
        Let&apos;s Get In Touch
      </p>
      <p className="text-xl md:text-2xl font-semibold mt-12">
        Have a question or want to work together? Feel free to reach out :)
      </p>
      <div className="mt-12 flex flex-col gap-6">
        {socials.map((social) => (
          <SocialCard key={social.label} {...social} />
        ))}
      </div>
    </Section>
  );
};

function SocialCard({
  icon,
  href,
  label,
  desc,
}: {
  icon: React.ReactNode;
  href: string;
  label: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      className="group bg-mantle text-text flex items-center gap-6 p-6 rounded-xl hover:no-underline"
    >
      <div className="bg-text text-bg p-4 rounded-full">{icon}</div>
      <div>
        <h3 className="text-xl font-medium font-fraunces">
          <HoverItalic>{label}</HoverItalic>
        </h3>
        <p className="text-subtext italic break-all max-w-full">{desc}</p>
      </div>
      <div className="ml-auto">
        <ExternalLink size={20} className="text-subtext" />
      </div>
    </Link>
  );
}

export default ContactSection;

// lucide-react has no chess pieces in the version we use; a pawn drawn in
// the same 24px / 2px-stroke style as its icons.
function ChessPawn({ size = 24 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="6" r="4" />
      <path d="M7 10h10" />
      <path d="m9.5 10-1.5 8" />
      <path d="m14.5 10 1.5 8" />
      <path d="M5 20a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z" />
    </svg>
  );
}
