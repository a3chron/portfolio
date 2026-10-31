"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/util/utils";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Projects", href: "/projects" },
  { name: "Blog", href: "/blog" },
];

const Navigation = ({ className }: { className?: string }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    // Sticky inside each page's scroll container, so the page scrolls behind it.
    <nav
      className={cn(
        "sticky top-0 z-20 w-full h-24 border-b-2 border-faint-line",
        className,
      )}
    >
      {/* The glass sits on its own layer: a backdrop-filter on <nav> itself
          would trap the fixed mobile-menu overlay inside the header. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-header-glass backdrop-blur-2xl"
      />
      <div className="max-w-384 w-full flex flex-row items-center justify-between p-4 md:px-12 lg:px-24 mx-auto">
        <Link
          href="/"
          className="mt-0 w-fit flex flex-col items-center justify-center text-text font-bold font-plex text-[1.7rem] whitespace-nowrap no-underline!"
        >
          <span className="text-[1.35rem] leading-tight font-fraunces font-normal">
            Kurt Schambach
          </span>
          <span className="pl-6 leading-tight">a3chron</span>
        </Link>
        <div>
          {menuOpen && (
            <div
              onClick={() => setMenuOpen(false)}
              className="z-30 bg-transparent backdrop-blur-xl fixed left-0 top-0 w-screen h-screen flex md:hidden items-center justify-center"
            >
              <ul className="flex flex-col items-center justify-center gap-8 bg-mantle p-8 px-12 rounded-3xl border-2 border-crust">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-xl font-medium font-fraunces duration-500 text-text hover:text-hover"
                  >
                    {item.name}
                  </Link>
                ))}
              </ul>
            </div>
          )}
          <ul className="hidden md:flex items-center justify-center gap-8">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-xl font-medium font-fraunces duration-500 hover:underline decoration-2"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          <div
            onClick={() => setMenuOpen((prevBool) => !prevBool)}
            className="z-40 sticky block md:hidden bg-mantle p-4 cursor-pointer rounded-xl text-text hover:text-hover duration-500"
          >
            {menuOpen ? <X /> : <Menu />}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
