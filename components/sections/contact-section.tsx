"use client";

import {
  ExternalLink,
  FilmIcon,
  GamepadIcon,
  Github,
  KeyboardIcon,
  Linkedin,
  LucideBellRing,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { Block } from "../block";

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
      icon: <GamepadIcon size={20} />,
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
    <Block className="bg-yellow selection:text-yellow">
      <div className="w-dvw 2xl:w-384 h-fit min-h-dvh p-4 md:py-12 md:px-24 flex flex-col item-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h1 className="uppercase text-4xl md:text-6xl text-yellow bg-crust my-6 md:mb-16 w-fit p-1 px-2">
              #5 Contact
            </h1>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold flex items-center gap-3">
                Let&apos;s Get In Touch
              </h1>
              <p className="text-xl md:text-2xl font-semibold mt-12 w-full md:w-2/3">
                Have a question or want to work together? Feel free to reach out
                :)
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-8">
            {socials.map((social, index) => (
              <SocialCard key={index} {...social} />
            ))}
          </div>
        </div>
      </div>
    </Block>
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
      className="bg-crust flex items-center gap-6 p-6 rounded-lg hover:shadow-md transition-shadow"
    >
      <div className="bg-yellow text-crust p-4 rounded-full">{icon}</div>
      <div>
        <h3 className="text-lg font-bold text-yellow">{label}</h3>
        <p className="text-subtext break-all max-w-full">{desc}</p>
      </div>
      <div className="ml-auto">
        <ExternalLink size={20} className="text-gray-400" />
      </div>
    </Link>
  );
}

export default ContactSection;
