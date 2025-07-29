"use client";

import { ExternalLink, Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";
import { Block } from "../block";

const ContactSection = () => {
  const socials = [
    {
      icon: <Mail size={20} />,
      href: "mailto:kurt.schambach@gmail.com",
      label: "Email",
      handle: "kurt.schambach@gmail.com",
    },
    {
      icon: <Github size={20} />,
      href: "https://github.com/a3chron",
      label: "Github",
      handle: "a3chron",
    },
    {
      icon: <Linkedin size={20} />,
      href: "https://www.linkedin.com/in/kurt-schambach/",
      label: "LinkedIn",
      handle: "Kurt Schambach",
    },
  ];

  return (
    <Block className="bg-yellow selection:text-yellow">
      <div className="w-dvw 2xl:w-384 h-fit min-h-dvh p-24 flex flex-col item-center justify-center">
        <h1 className="uppercase text-6xl text-yellow bg-crust mb-24 w-fit p-1 px-2">
          #5 Contact
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              Let&apos;s Get In Touch
            </h1>
            <p className="text-2xl font-semibold mt-12 w-2/3">
              Have a question or want to work together? Feel free to reach out
              :)
            </p>
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
  handle,
}: {
  icon: React.ReactNode;
  href: string;
  label: string;
  handle: string;
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
        <p className="text-subtext">{handle}</p>
      </div>
      <div className="ml-auto">
        <ExternalLink size={20} className="text-gray-400" />
      </div>
    </Link>
  );
}

export default ContactSection;
