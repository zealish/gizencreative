import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { eq } from "drizzle-orm";
import { db } from "../src/lib/db";
import { blogPost } from "../src/lib/db/schema";

type PostMessages = {
  title: string;
  excerpt: string;
};

type Messages = { blog: { posts: Record<string, PostMessages> } };

const contentId: Record<string, string> = {
  websiteGuide: `
<p>Website sering menjadi <strong>kesan pertama</strong> pelanggan terhadap bisnis Anda. Memilih partner pengembangan yang tepat menentukan apakah kesan itu membangun kepercayaan — atau justru mengusir pengunjung.</p>
<h2>Mulai dari Portofolio</h2>
<p>Portofolio adalah bukti paling jujur. Sebelum menandatangani kontrak, periksa:</p>
<ul>
<li><strong>Proyek yang masih live</strong> — bukan sekadar mockup di galeri.</li>
<li><strong>Konsistensi kualitas</strong> di berbagai proyek, bukan satu karya terbaik saja.</li>
<li><strong>Industri serupa</strong> dengan bisnis Anda, agar mereka paham konteksnya.</li>
</ul>
<h2>Lihat di Balik Tampilan</h2>
<h3>Teknologi &amp; Performa</h3>
<p>Tanyakan <em>technology stack</em>, kecepatan halaman, dan responsivitas mobile. Situs cantik yang lambat akan kehilangan pengunjung sebelum sempat dilihat.</p>
<h3>Fondasi Sejak Hari Pertama</h3>
<p>Pastikan agensi mencakup dasar SEO, SSL, dan analytics sejak awal — bukan sebagai biaya tambahan di kemudian hari.</p>
<blockquote><p>Website yang bagus bukan proyek sekali jadi, melainkan aset yang terus dirawat.</p></blockquote>
<hr>
<p>Terakhir, perjelas <strong>dukungan berkelanjutan</strong>: pembaruan, patch keamanan, dan perubahan konten. Partner yang baik menawarkan ketentuan maintenance yang jelas agar investasi Anda terus bekerja lama setelah peluncuran.</p>
`,
  instagramStrategy: `
<p>Algoritma Instagram terus berubah, tetapi satu prinsip tetap sama: <strong>konten yang memicu percakapan selalu menang</strong>. Di 2026, video pendek masih mendominasi jangkauan, sementara carousel paling efektif untuk edukasi dan storytelling produk.</p>
<h2>Konsistensi Mengalahkan Viralitas</h2>
<p>Brand yang posting 3&ndash;5 kali per minggu dengan struktur pilar konten yang jelas tumbuh stabil, sedangkan posting sporadis mengulang momentum dari nol. Susun pilar Anda di sekitar:</p>
<ol>
<li><strong>Edukasi</strong> — tips dan insight yang layak disimpan.</li>
<li><strong>Bukti sosial</strong> — testimoni dan studi kasus.</li>
<li><strong>Behind the scenes</strong> — sisi manusia dari brand.</li>
<li><strong>Penawaran</strong> — promosi dengan ajakan yang jelas.</li>
</ol>
<blockquote><p>Viralitas adalah bonus. Konsistensi adalah strategi.</p></blockquote>
<h2>Ukur yang Benar-Benar Penting</h2>
<p><em>Saves</em>, <em>shares</em>, dan kunjungan profil menandakan minat asli jauh lebih baik daripada likes. Tinjau insight setiap bulan dan gandakan format yang benar-benar direspons audiens Anda.</p>
<hr>
<p>Strategi terbaik adalah yang bertahan: pilih ritme yang sanggup Anda jaga selama enam bulan, bukan enam hari.</p>
`,
  seoBasics: `
<p>SEO adalah praktik membuat website Anda mudah <strong>ditemukan, dipahami, dan direkomendasikan</strong> oleh mesin pencari. Panduan ini merangkum langkah-langkah yang benar-benar menggerakkan peringkat.</p>
<h2>1. Riset Keyword</h2>
<p>Semuanya dimulai dari menemukan frasa persis yang diketik pelanggan saat mencari produk atau jasa seperti milik Anda. Fokus pada <em>search intent</em>, bukan sekadar volume.</p>
<h2>2. Optimasi On-Page</h2>
<p>Judul, heading, meta description, dan konten yang benar-benar menjawab pertanyaan pencari. Contoh meta tag yang baik:</p>
<pre><code>&lt;title&gt;Jasa Pembuatan Website Jakarta | Gizen Creative&lt;/title&gt;
&lt;meta name="description"
  content="Website profesional, cepat, dan SEO-ready untuk UMKM." /&gt;</code></pre>
<h3>Kesehatan Teknis</h3>
<ul>
<li>Loading cepat di jaringan seluler.</li>
<li>Layout ramah mobile.</li>
<li>Struktur URL bersih seperti <code>/blog/panduan-seo</code>.</li>
</ul>
<h2>3. Bangun Otoritas</h2>
<p>Otoritas dibangun seiring waktu lewat backlink berkualitas dan publikasi yang konsisten.</p>
<blockquote><p>SEO adalah maraton, bukan sprint — tetapi trafik yang terakumulasi menjadikannya salah satu kanal dengan ROI tertinggi.</p></blockquote>
`,
  speedTips: `
<p>Setiap detik ekstra waktu muat <strong>mengorbankan konversi</strong>. Penyebab terbesar biasanya gambar terlalu besar, script yang memblokir render, dan hosting murahan. Mulailah dengan audit lewat PageSpeed Insights untuk melihat ke mana waktu terbuang.</p>
<h2>7 Teknik yang Terbukti</h2>
<ol>
<li><strong>Kompres gambar</strong> dan gunakan format modern seperti WebP atau AVIF.</li>
<li><strong>Lazy-load</strong> gambar di bawah layar pertama.</li>
<li><strong>Tunda JavaScript non-kritis</strong> dengan <code>defer</code> atau <code>async</code>.</li>
<li><strong>Gunakan CDN</strong> agar file lebih dekat ke pengunjung di seluruh nusantara.</li>
<li><strong>Aktifkan caching browser</strong> untuk aset statis.</li>
<li><strong>Caching sisi server</strong> atau static generation bila memungkinkan.</li>
<li><strong>Upgrade hosting</strong> — server lambat membatasi semua optimasi lain.</li>
</ol>
<h3>Contoh Lazy Loading</h3>
<pre><code>&lt;img src="produk.webp" loading="lazy"
  width="800" height="600" alt="Foto produk" /&gt;</code></pre>
<blockquote><p>Ukur ulang setelah setiap perubahan — kerja performa itu iteratif, dan kemenangan kecil terakumulasi.</p></blockquote>
<hr>
<p>Caching adalah pengganda terakhir: gabungan caching browser, server, dan static generation bisa memangkas waktu muat hingga separuhnya.</p>
`,
  socialBranding: `
<p>Branding di media sosial lebih dari sekadar logo dan palet warna. Ia adalah <strong>suara, gaya visual, dan nilai</strong> yang konsisten dialami audiens di setiap postingan.</p>
<h2>Definisikan Kepribadian Brand</h2>
<p>Mulailah dengan tiga kata sifat yang menggambarkan bagaimana brand Anda seharusnya terasa — misalnya <em>hangat</em>, <em>ahli</em>, dan <em>berani</em>. Ketiganya menjadi filter untuk setiap keputusan konten.</p>
<h2>Bangun Sistem Visual</h2>
<ul>
<li>Template feed yang konsisten.</li>
<li>Tipografi dan penggunaan warna yang seragam.</li>
<li>Gaya foto atau ilustrasi yang khas.</li>
</ul>
<p>Feed yang kohesif menandakan profesionalisme bahkan sebelum pengunjung membaca satu caption pun.</p>
<h3>Suara Melengkapi Gambar</h3>
<p>Playful atau berwibawa — jaga caption tetap konsisten dan balas komentar dengan nada yang sama.</p>
<blockquote><p>Konsistensi mengubah followers menjadi komunitas yang langsung mengenali Anda.</p></blockquote>
<hr>
<p>Audit feed Anda setiap kuartal: apakah sepuluh postingan terakhir masih terasa seperti satu brand yang sama?</p>
`,
  localKeyword: `
<p>Riset keyword lokal berfokus pada frasa dengan <strong>niat geografis</strong> — misalnya <em>jasa website Jakarta</em> atau <em>coffee shop dekat saya</em>. Pencarian seperti ini terkonversi jauh lebih baik karena pencarinya sering kali sudah siap membeli.</p>
<h2>Susun Daftar Keyword Anda</h2>
<p>Mulai dari layanan inti, lalu lapisi dengan modifier lokasi:</p>
<ul>
<li>Kota — <code>jasa seo bandung</code></li>
<li>Kecamatan atau area — <code>catering kemang</code></li>
<li>Landmark — <code>florist dekat grand indonesia</code></li>
</ul>
<h3>Alat Gratis yang Cukup Ampuh</h3>
<p>Google Keyword Planner dan saran autocomplete mengungkap apa yang benar-benar diketik warga lokal — tanpa biaya berlangganan.</p>
<h2>Jangan Lupakan Google Business Profile</h2>
<p>Optimalkan profil bisnis bersamaan dengan website: nama, alamat, dan nomor telepon yang konsisten, foto segar, dan ulasan asli.</p>
<blockquote><p>SEO lokal memberi imbalan pada bisnis yang terlihat aktif dan tepercaya.</p></blockquote>
<hr>
<p>Menangkan kota Anda dulu — otoritas lokal yang kuat menjadi fondasi untuk ekspansi ke pasar yang lebih luas.</p>
`,
};

const contentEn: Record<string, string> = {
  websiteGuide: `
<p>A website is often the <strong>first impression</strong> customers get of your business. Choosing the right development partner determines whether that impression builds trust — or drives visitors away.</p>
<h2>Start with the Portfolio</h2>
<p>A portfolio is the most honest evidence. Before signing anything, check for:</p>
<ul>
<li><strong>Live projects</strong> — not just mockups in a gallery.</li>
<li><strong>Consistent quality</strong> across projects, not one best piece.</li>
<li><strong>Similar industries</strong> to yours, so they understand the context.</li>
</ul>
<h2>Look Beyond the Visuals</h2>
<h3>Technology &amp; Performance</h3>
<p>Ask about the <em>technology stack</em>, page speed, and mobile responsiveness. A beautiful site that loads slowly will lose visitors before they ever see it.</p>
<h3>Foundations from Day One</h3>
<p>Make sure the agency covers SEO fundamentals, SSL, and analytics from the start — not as paid add-ons later.</p>
<blockquote><p>A great website is not a one-off project; it is an asset that keeps being maintained.</p></blockquote>
<hr>
<p>Finally, clarify <strong>ongoing support</strong>: updates, security patches, and content changes. A good partner offers clear maintenance terms so your investment keeps performing long after launch.</p>
`,
  instagramStrategy: `
<p>Instagram's algorithm keeps evolving, but one principle stays constant: <strong>content that starts conversations wins</strong>. In 2026, short-form video still dominates reach, while carousels convert best for education and product storytelling.</p>
<h2>Consistency Beats Virality</h2>
<p>Brands that post 3&ndash;5 times per week with a clear content pillar structure grow steadily, while sporadic posting resets momentum. Build your pillars around:</p>
<ol>
<li><strong>Education</strong> — tips and insights worth saving.</li>
<li><strong>Social proof</strong> — testimonials and case studies.</li>
<li><strong>Behind the scenes</strong> — the human side of the brand.</li>
<li><strong>Offers</strong> — promotions with a clear call to action.</li>
</ol>
<blockquote><p>Virality is a bonus. Consistency is a strategy.</p></blockquote>
<h2>Measure What Actually Matters</h2>
<p><em>Saves</em>, <em>shares</em>, and profile visits signal genuine interest far better than likes. Review insights monthly and double down on the formats your audience actually responds to.</p>
<hr>
<p>The best strategy is the one you can sustain: pick a rhythm you can keep for six months, not six days.</p>
`,
  seoBasics: `
<p>SEO is the practice of making your website easy for search engines to <strong>find, understand, and recommend</strong>. This guide covers the steps that actually move rankings.</p>
<h2>1. Keyword Research</h2>
<p>Everything starts with discovering the exact phrases your customers type when looking for products or services like yours. Focus on <em>search intent</em>, not just volume.</p>
<h2>2. On-Page Optimization</h2>
<p>Titles, headings, meta descriptions, and content that genuinely answers the searcher's question. A good meta tag looks like this:</p>
<pre><code>&lt;title&gt;Website Development Jakarta | Gizen Creative&lt;/title&gt;
&lt;meta name="description"
  content="Professional, fast, SEO-ready websites for SMEs." /&gt;</code></pre>
<h3>Technical Health</h3>
<ul>
<li>Fast loading on mobile networks.</li>
<li>Mobile-friendly layout.</li>
<li>Clean URL structure like <code>/blog/seo-guide</code>.</li>
</ul>
<h2>3. Build Authority</h2>
<p>Authority is built over time through quality backlinks and consistent publishing.</p>
<blockquote><p>SEO is a marathon, not a sprint — but the compounding traffic makes it one of the highest-ROI channels available.</p></blockquote>
`,
  speedTips: `
<p>Every extra second of load time <strong>costs conversions</strong>. The biggest culprits are usually oversized images, render-blocking scripts, and cheap hosting. Start with an audit using PageSpeed Insights to see exactly where time is spent.</p>
<h2>7 Proven Techniques</h2>
<ol>
<li><strong>Compress images</strong> and serve modern formats like WebP or AVIF.</li>
<li><strong>Lazy-load</strong> images below the first screen.</li>
<li><strong>Defer non-critical JavaScript</strong> with <code>defer</code> or <code>async</code>.</li>
<li><strong>Use a CDN</strong> to place files closer to visitors across the archipelago.</li>
<li><strong>Enable browser caching</strong> for static assets.</li>
<li><strong>Server-side caching</strong> or static generation where possible.</li>
<li><strong>Upgrade hosting</strong> — a slow server caps every other optimization.</li>
</ol>
<h3>Lazy Loading Example</h3>
<pre><code>&lt;img src="product.webp" loading="lazy"
  width="800" height="600" alt="Product photo" /&gt;</code></pre>
<blockquote><p>Measure again after each change — performance work is iterative, and small wins compound.</p></blockquote>
<hr>
<p>Caching is the final multiplier: combining browser caching, server caching, and static generation can cut load time in half.</p>
`,
  socialBranding: `
<p>Branding on social media goes beyond a logo and color palette. It is the <strong>consistent voice, visual style, and values</strong> your audience experiences in every post.</p>
<h2>Define Your Brand Personality</h2>
<p>Start with three adjectives that describe how your brand should feel — for example <em>warm</em>, <em>expert</em>, and <em>bold</em>. They become the filter for every content decision.</p>
<h2>Build a Visual System</h2>
<ul>
<li>Consistent feed templates.</li>
<li>Uniform typography and color usage.</li>
<li>A recognizable photo or illustration style.</li>
</ul>
<p>A cohesive feed signals professionalism before a visitor reads a single caption.</p>
<h3>Voice Completes the Picture</h3>
<p>Playful or authoritative — keep captions consistent and reply to comments in the same tone.</p>
<blockquote><p>Consistency turns followers into a community that recognizes you instantly.</p></blockquote>
<hr>
<p>Audit your feed every quarter: do the last ten posts still feel like one and the same brand?</p>
`,
  localKeyword: `
<p>Local keyword research focuses on phrases with <strong>geographic intent</strong> — think <em>jasa website Jakarta</em> or <em>coffee shop near me</em>. These searches convert far better because the searcher is often ready to buy.</p>
<h2>Build Your Keyword List</h2>
<p>Start with your core services, then layer in location modifiers:</p>
<ul>
<li>City — <code>seo services bandung</code></li>
<li>District or area — <code>catering kemang</code></li>
<li>Landmark — <code>florist near grand indonesia</code></li>
</ul>
<h3>Free Tools That Go a Long Way</h3>
<p>Google Keyword Planner and autocomplete suggestions reveal what locals actually type — no subscription required.</p>
<h2>Don't Forget Your Google Business Profile</h2>
<p>Optimize your business profile alongside your website: consistent name, address, and phone number, fresh photos, and genuine reviews.</p>
<blockquote><p>Local SEO rewards businesses that look active and trustworthy.</p></blockquote>
<hr>
<p>Win your city first — strong local authority becomes the foundation for expanding into bigger markets.</p>
`,
};

const seedPosts = [
  {
    slug: "cara-memilih-jasa-pembuatan-website",
    key: "websiteGuide",
    category: "website",
    tags: ["design", "ux"],
    date: "2026-08-28",
  },
  {
    slug: "strategi-konten-instagram-2026",
    key: "instagramStrategy",
    category: "social",
    tags: ["instagram", "content"],
    date: "2026-08-14",
  },
  {
    slug: "panduan-seo-untuk-pemula",
    key: "seoBasics",
    category: "seo",
    tags: ["keyword", "ranking"],
    date: "2026-07-30",
  },
  {
    slug: "cara-mempercepat-website-lambat",
    key: "speedTips",
    category: "website",
    tags: ["performance", "ux"],
    date: "2026-07-11",
  },
  {
    slug: "membangun-branding-di-social-media",
    key: "socialBranding",
    category: "social",
    tags: ["branding", "content"],
    date: "2026-06-25",
  },
  {
    slug: "riset-keyword-untuk-bisnis-lokal",
    key: "localKeyword",
    category: "seo",
    tags: ["keyword", "local"],
    date: "2026-06-05",
  },
];

function loadMessages(locale: string): Messages {
  const file = path.join(process.cwd(), "messages", `${locale}.json`);
  return JSON.parse(readFileSync(file, "utf8")) as Messages;
}

function compactHtml(html: string): string {
  return html.trim().replace(/\n(?![^<]*<\/(?:pre|code)>)/g, "");
}

const WORDS_PER_MINUTE = 200;

function computeReadMinutes(html: string): number {
  const text = html.replace(/<[^>]*>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.min(60, Math.max(1, Math.ceil(words / WORDS_PER_MINUTE)));
}

async function seedBlog() {
  const id = loadMessages("id");
  const en = loadMessages("en");

  for (const seed of seedPosts) {
    const idPost = id.blog.posts[seed.key];
    const enPost = en.blog.posts[seed.key];
    const htmlId = contentId[seed.key];
    const htmlEn = contentEn[seed.key];
    if (!idPost || !enPost || !htmlId || !htmlEn) {
      console.log(`Skipped (missing content): ${seed.slug}`);
      continue;
    }

    const values = {
      contentId: compactHtml(htmlId),
      contentEn: compactHtml(htmlEn),
      readMinutes: computeReadMinutes(compactHtml(htmlId)),
    };

    const existing = await db
      .select({ id: blogPost.id })
      .from(blogPost)
      .where(eq(blogPost.slug, seed.slug))
      .limit(1);
    if (existing.length > 0) {
      await db
        .update(blogPost)
        .set({ ...values, updatedAt: new Date() })
        .where(eq(blogPost.id, existing[0].id));
      console.log(`Updated content: ${seed.slug}`);
      continue;
    }

    await db.insert(blogPost).values({
      id: randomUUID(),
      slug: seed.slug,
      category: seed.category,
      tags: seed.tags,
      titleId: idPost.title,
      titleEn: enPost.title,
      excerptId: idPost.excerpt,
      excerptEn: enPost.excerpt,
      ...values,
      published: true,
      publishedAt: new Date(seed.date),
    });
    console.log(`Seeded: ${seed.slug}`);
  }
}

seedBlog()
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
