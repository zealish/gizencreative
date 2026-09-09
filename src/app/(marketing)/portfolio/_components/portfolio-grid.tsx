import Image from "next/image";
import { getPublishedPortfolio } from "@/lib/portfolio";

export async function PortfolioGrid() {
  const items = await getPublishedPortfolio();

  return (
    <section className="px-4 pb-14 sm:pb-20">
      <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.id}
            className="card-elegant group overflow-hidden rounded-3xl"
          >
            <div className="relative aspect-[16/9] overflow-hidden bg-accent-soft">
              {item.coverImage ? (
                <Image
                  src={item.coverImage}
                  alt={item.projectName}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div
                  className="absolute inset-0 bg-gradient-to-br from-accent-soft to-background"
                  aria-hidden="true"
                />
              )}
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold">{item.projectName}</h3>
              <dl className="mt-4 space-y-2 text-sm text-muted">
                <div className="flex justify-between gap-4">
                  <dt>Year</dt>
                  <dd>{item.year}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Client</dt>
                  <dd>{item.clientCompany}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Services</dt>
                  <dd>{item.services.join(", ")}</dd>
                </div>
              </dl>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
