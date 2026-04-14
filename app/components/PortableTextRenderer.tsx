import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

const components = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) return null;
      return (
        <div className="my-8">
          <Image
            src={urlFor(value).width(1200).url()}
            alt={value.alt || ""}
            width={1200}
            height={675}
            className="rounded-lg w-full h-auto"
          />
          {value.caption && (
            <p className="text-center text-sm mt-2" style={{ color: 'var(--color-text-muted)' }}>
              {value.caption}
            </p>
          )}
        </div>
      );
    },
  },
  marks: {
    link: ({ children, value }: any) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: 'var(--color-accent)' }}
        className="underline underline-offset-2"
      >
        {children}
      </a>
    ),
  },
};

export default function PortableTextRenderer({ value }: { value: any }) {
  return (
    <div className="prose">
      <PortableText value={value} components={components} />
    </div>
  );
}
