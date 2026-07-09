import {
  InfoIcon,
  LightbulbIcon,
  MessageSquareWarningIcon,
  OctagonAlertIcon,
  TriangleAlertIcon,
} from "lucide-react";
import Image from "next/image";
import { useMDXComponent } from "next-contentlayer2/hooks";
import * as React from "react";

export function clsx(...args: (string | undefined)[]) {
  return args.filter(Boolean).join(" ");
}

interface MdxProps {
  code: string;
  page: "project" | "blog";
}

export function Mdx({ code, page }: MdxProps) {
  const Component = useMDXComponent(code);

  const components = {
    h1: ({ className, ...props }: { className: string }) => (
      <h1
        className={clsx(
          "not-first:mt-16 scroll-m-20 text-4xl font-bold tracking-tight text-text group/heading",
          className,
        )}
        {...props}
      />
    ),
    h2: ({ className, ...props }: { className: string }) => (
      <h2
        className={clsx(
          "mt-12 scroll-m-10 underline text-text pb-1 text-3xl font-semibold tracking-tight first:mt-0 group/heading",
          className,
        )}
        {...props}
      />
    ),
    h3: ({ className, ...props }: { className: string }) => (
      <h3
        className={clsx(
          "mt-8 scroll-m-10 text-2xl text-text font-semibold tracking-tight group/heading",
          className,
        )}
        {...props}
      />
    ),
    h4: ({ className, ...props }: { className: string }) => (
      <h4
        className={clsx(
          "mt-8 scroll-m-10 text-xl text-text font-semibold tracking-tight group/heading",
          className,
        )}
        {...props}
      />
    ),
    h5: ({ className, ...props }: { className: string }) => (
      <h5
        className={clsx(
          "mt-8 scroll-m-10 text-lg text-text font-semibold tracking-tight group/heading",
          className,
        )}
        {...props}
      />
    ),
    h6: ({ className, ...props }: { className: string }) => (
      <h6
        className={clsx(
          "mt-8 scroll-m-10 text-text font-semibold tracking-tight group/heading",
          className,
        )}
        {...props}
      />
    ),
    a: ({ className, ...props }: { className: string }) => (
      <a
        className={clsx(
          "font-medium underline",
          page === "blog" ? "text-sapphire" : "text-teal",
          className,
        )}
        {...props}
      />
    ),
    p: ({ className, ...props }: { className: string }) => (
      <p
        className={clsx("leading-7 text-inherit not-first:mt-6", className)}
        {...props}
      />
    ),
    ul: ({ className, ...props }: { className: string }) => (
      <ul
        className={clsx(
          "my-6 ml-6 marker:text-inherit text-inherit list-disc",
          className,
        )}
        {...props}
      />
    ),
    ol: ({ className, ...props }: { className: string }) => (
      <ol
        className={clsx(
          "my-6 ml-6 marker:text-inherit text-inherit list-decimal",
          className,
        )}
        {...props}
      />
    ),
    li: ({ className, ...props }: { className: string }) => (
      <li className={clsx("mt-2 text-inherit", className)} {...props} />
    ),
    blockquote: ({
      className,
      children,
      ...props
    }: {
      className?: string;
      children: React.ReactNode;
    }) => {
      // GitHub-style alert types (`[!NOTE]`, `[!TIP]`, `[!IMPORTANT]`,
      // `[!WARNING]`, `[!CAUTION]`). An optional custom title may follow the
      // marker on the same line; otherwise the type's default label is shown.
      const typeConfigs = {
        note: {
          label: "Note",
          icon: <InfoIcon className="size-5 shrink-0" />,
          className:
            "border-blue bg-blue/5 text-blue! selection:bg-blue selection:text-black",
        },
        info: {
          label: "Note",
          icon: <InfoIcon className="size-5 shrink-0" />,
          className:
            "border-blue bg-blue/5 text-blue! selection:bg-blue selection:text-black",
        },
        tip: {
          label: "Tip",
          icon: <LightbulbIcon className="size-5 shrink-0" />,
          className:
            "border-green bg-green/5 text-green! selection:bg-green selection:text-black",
        },
        important: {
          label: "Important",
          icon: <MessageSquareWarningIcon className="size-5 shrink-0" />,
          className:
            "border-mauve bg-mauve/5 text-mauve! selection:bg-mauve selection:text-black",
        },
        warning: {
          label: "Warning",
          icon: <TriangleAlertIcon className="size-5 shrink-0" />,
          className:
            "border-yellow bg-yellow/5 text-yellow! selection:bg-yellow selection:text-black",
        },
        caution: {
          label: "Caution",
          icon: <OctagonAlertIcon className="size-5 shrink-0" />,
          className:
            "border-error bg-error/5 text-error! selection:bg-error selection:text-black",
        },
      };

      type BlockquoteType = keyof typeof typeConfigs;

      // The marker lives at the start of the first text node of the first
      // paragraph. Matching only that text node (rather than requiring the
      // whole paragraph to be a plain string) means inline elements like
      // links or bold text in the callout body are preserved.
      const markerRegex = /^\[!(\w+)\][^\S\n]*([^\n]*)\n?/;

      let type: BlockquoteType | "default" = "default";
      let title = "";
      let markerHandled = false;

      const content = React.Children.toArray(children)
        .map((child) => {
          if (markerHandled || !React.isValidElement(child)) return child;

          const para = child as React.ReactElement<{
            children?: React.ReactNode;
          }>;
          const paraChildren = React.Children.toArray(para.props.children);
          const first = paraChildren[0];
          if (typeof first !== "string") return child;

          const match = first.match(markerRegex);
          if (!match) return child;

          const typeKey = match[1].toLowerCase();
          if (!(typeKey in typeConfigs)) return child;

          markerHandled = true;
          type = typeKey as BlockquoteType;
          title = match[2].trim();

          const remainder = first.slice(match[0].length);
          const rebuilt = [remainder, ...paraChildren.slice(1)].filter(
            (c) => !(typeof c === "string" && c.trim() === ""),
          );

          return rebuilt.length > 0
            ? React.cloneElement(para, {}, ...rebuilt)
            : null;
        })
        .filter((child) => child != null);

      // Read through an explicitly-typed const: control-flow analysis would
      // otherwise narrow `type` to its `"default"` initializer at the JSX
      // reads below, since the reassignment happens inside the map closure.
      const activeType = type as BlockquoteType | "default";

      const getTypeClassName = () => {
        if (activeType !== "default") {
          return typeConfigs[activeType].className;
        }
        return page === "blog"
          ? "border-sapphire bg-sapphire/5 text-sapphire selection:bg-sapphire selection:text-black"
          : "border-teal bg-teal/5 text-teal selection:bg-teal selection:text-black";
      };

      return (
        <blockquote
          className={clsx(
            "mt-4 border-l-2 not-italic pl-6 py-2",
            getTypeClassName(),
            className,
          )}
          {...props}
        >
          {activeType !== "default" && (
            <span className="flex gap-2 items-center font-semibold">
              {typeConfigs[activeType].icon}
              {title || typeConfigs[activeType].label}
            </span>
          )}
          {content}
        </blockquote>
      );
    },
    img: ({
      className,
      alt,
      ...props
    }: React.ImgHTMLAttributes<HTMLImageElement>) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        className={clsx("rounded-xl border-2 border-mantle", className)}
        alt={alt}
        {...props}
      />
    ),
    hr: ({ ...props }) => (
      <hr
        className="my-4 md:my-8 border-none h-px bg-gradient-to-r from-transparent via-overlay to-transparent w-full"
        {...props}
      />
    ),
    table: ({
      className,
      ...props
    }: React.HTMLAttributes<HTMLTableElement>) => (
      <div className="w-full my-6 overflow-y-auto">
        <table className={clsx("w-full", className)} {...props} />
      </div>
    ),
    tr: ({
      className,
      ...props
    }: React.HTMLAttributes<HTMLTableRowElement>) => (
      <tr
        className={clsx("m-0 border-t border-crust p-0 even:bg-bg", className)}
        {...props}
      />
    ),
    th: ({ className, ...props }: { className: string }) => (
      <th
        className={clsx(
          "border border-text px-4 py-2 text-crust bg-text text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
          className,
        )}
        {...props}
      />
    ),
    td: ({ className, ...props }: { className: string }) => (
      <td
        className={clsx(
          "border border-text px-4 py-2 text-text bg-mantle text-left [&[align=center]]:text-center [&[align=right]]:text-right",
          className,
        )}
        {...props}
      />
    ),
    pre: ({ className, ...props }: { className: string }) => (
      <pre
        className={clsx("overflow-x-auto rounded-2xl bg-crust! p-2", className)}
        {...props}
      />
    ),
    strong: ({ className, ...props }: { className: string }) => (
      <strong
        className={clsx(
          "font-bold",
          page === "blog" ? "text-sapphire" : "text-teal",
          className,
        )}
        {...props}
      />
    ),
    code: ({ className, ...props }: { className: string }) => (
      <code
        className={clsx(
          "relative rounded bg-crust text-text inline-block px-2 font-mono font-light",
          className,
        )}
        {...props}
      />
    ),
    Image,
  };

  return (
    <div className="mdx">
      <Component components={components} />
    </div>
  );
}
