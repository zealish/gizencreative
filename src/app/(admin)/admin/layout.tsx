import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1 bg-[#FDF8F1] [background-image:linear-gradient(to_right,#F3E7DF_1px,transparent_1px),linear-gradient(to_bottom,#F3E7DF_1px,transparent_1px)] [background-size:50px_50px] dark:bg-background dark:[background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)]">
      {children}
    </main>
  );
}
