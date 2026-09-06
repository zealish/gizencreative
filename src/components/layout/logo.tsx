import Image from "next/image";
import Link from "next/link";

export function Logo({ logoUrl }: { logoUrl?: string | null }) {
  return (
    <Link href="/" className="flex items-center gap-2">
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt="Gizen Creative"
          width={160}
          height={40}
          className="h-8 w-auto object-contain"
          priority
        />
      ) : (
        <>
          <span className="grid h-7 w-7 place-items-center rounded-md bg-foreground text-background">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4 6h10v4H8v8H4V6zm10 8h6v4h-6v-4z"
                fill="currentColor"
              />
            </svg>
          </span>
          <span className="text-lg font-bold tracking-tight">
            Gizen Creative
          </span>
        </>
      )}
    </Link>
  );
}
