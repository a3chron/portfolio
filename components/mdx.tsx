import * as React from "react";
import Image from "next/image";
import { useMDXComponent } from "next-contentlayer2/hooks";
import { FlameIcon, InfoIcon, TriangleAlertIcon } from "lucide-react";

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
      const typeConfigs = {
        info: {
          prefix: "[INFO]",
          icon: <InfoIcon />,
          className:
            "border-blue bg-blue/5 text-blue! selection:bg-blue! selection:text-black",
        },
        warning: {
          prefix: "[WARNING]",
          icon: <TriangleAlertIcon />,
          className:
            "border-yellow bg-yellow/5 text-yellow! selection:bg-yellow selection:text-black",
        },
        new: {
          prefix: "[NEW]",
          icon: <FlameIcon />,
          className:
            "border-mauve bg-mauve/5 text-mauve! selection:bg-mauve! selection:text-black",
        },
      };

      type BlockquoteType = keyof typeof typeConfigs;

      const extractTypeInfo = (children: React.ReactNode) => {
        const childrenArray = children as React.ReactNode[];
        if (!Array.isArray(childrenArray) || !childrenArray[1]) {
          return { type: "default", title: "", content: children };
        }

        const secondChild = childrenArray[1];
        if (
          !React.isValidElement(secondChild) ||
          typeof (secondChild.props as any)?.children !== "string"
        ) {
          return { type: "default", title: "", content: children };
        }

        const childString = (secondChild.props as any).children as string;
        for (const [typeName, config] of Object.entries(typeConfigs)) {
          if (childString.startsWith(config.prefix)) {
            const lines = childString.split("\n");
            const title = lines[0].replace(config.prefix, "").trim();
            const remainingContent = lines.slice(1).join("\n");

            // Only create new child if there's actual content
            const content = [];
            if (remainingContent.trim()) {
              const newChild = React.cloneElement(
                secondChild,
                {},
                remainingContent,
              );
              content.push(newChild);
            }
            content.push(...childrenArray.slice(2));

            return {
              type: typeName as keyof typeof typeConfigs,
              title,
              content,
            };
          }
        }
        return { type: "default", title: "", content: children };
      };

      const { type, title, content } = extractTypeInfo(children);

      const processContent = (content: React.ReactNode) => {
        if (!Array.isArray(content)) return content;

        const contentWithKeys = content
          .map((child, idx) =>
            React.isValidElement(child)
              ? React.cloneElement(child, { key: idx })
              : child,
          )
          .filter((child) => {
            if (React.isValidElement(child)) {
              const props = child.props as any;
              if (
                props?.children === "" ||
                (typeof props?.children === "string" &&
                  props.children.trim() === "")
              ) {
                return false;
              }
            }
            if (typeof child === "string") {
              return child.trim() !== "";
            }
            return child != null;
          });

        return contentWithKeys.length === 0 ? undefined : contentWithKeys;
      };

      const processedContent = processContent(content);

      const getTypeClassName = () => {
        if (type !== "default" && type in typeConfigs) {
          return typeConfigs[type as BlockquoteType].className;
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
          {type !== "default" && (
            <span className="flex gap-2 items-center">
              {typeConfigs[type as BlockquoteType].icon}
              {title}
            </span>
          )}
          {processedContent}
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
