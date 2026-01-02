"use client";

import { Atom, Braces, Check, Rss, RssIcon, X } from "lucide-react";
import { useState } from "react";

const links = [
  { name: "rss", url: "https://a3chron.vercel.app/feed.xml", icon: Rss },
  { name: "atom", url: "https://a3chron.vercel.app/atom.xml", icon: Atom },
  { name: "json", url: "https://a3chron.vercel.app/feed.json", icon: Braces },
];

export default function RSSLinks() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="absolute hidden md:block z-10 right-2 bottom-14 overflow-hidden pt-9">
      <div
        title="Click to copy rss link"
        onClick={() => setIsOpen((prevBool) => !prevBool)}
        className="rounded-3xl bg-crust text-text p-2"
      >
        <div
          className={`absolute flex top-1 text-crust right-3 cursor-pointer duration-500 ${
            !isOpen && "translate-x-full opacity-0 transition-transform"
          }`}
        >
          <span className="text-xs -translate-y-2">Click to copy url</span>
          <X className="shrink-0" />
        </div>
        {isOpen ? (
          <ul className="space-y-2 p-2 px-4">
            {links.map((link) => (
              <li
                onClick={() => copyToClipboard(link.url)}
                key={link.url}
                className="cursor-pointer flex items-center gap-2"
              >
                <link.icon size={12} />
                {link.name}
              </li>
            ))}
          </ul>
        ) : copied ? (
          <Check />
        ) : (
          <RssIcon />
        )}
      </div>
    </div>
  );
}
