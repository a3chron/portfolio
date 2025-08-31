"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error(error);
  return (
    <div className="w-full h-full bg-bg flex flex-col items-center justify-center">
      <div className="text-text bg-mantle border-2 border-text/60 rounded-2xl p-8 px-12 flex flex-col items-center justify-center gap-6">
        <h2 className="font-bold text-2xl">Something went wrong!</h2>
        <div className="w-full h-fit flex gap-4 items-center justify-center">
          <button
            onClick={() => reset()}
            className="bg-text hover:bg-subtext p-2 px-4 rounded-lg text-crust font-bold w-full text-center cursor-pointer"
          >
            Try again
          </button>
          <Link
            href="/"
            className="bg-text hover:bg-subtext p-2 px-4 rounded-lg text-crust font-bold w-full text-center"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
