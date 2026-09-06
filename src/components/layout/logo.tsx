import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="grid h-7 w-7 place-items-center rounded-md bg-foreground text-background">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path d="M4 6h10v4H8v8H4V6zm10 8h6v4h-6v-4z" fill="currentColor" />
        </svg>
      </span>
      <span className="text-lg font-bold tracking-tight">Gizen Creative</span>
    </Link>
  );
}
