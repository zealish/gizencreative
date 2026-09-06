# DESIGN.md — Gizen Creative Design System

Referensi paten untuk seluruh UI. Semua halaman/komponen baru **wajib** mengikuti dokumen ini. Sumber kebenaran token: `src/app/globals.css`.

---

## 1. Fondasi

### 1.1 Warna (CSS Variables)

Didefinisikan di `:root` / `.dark`, diekspos ke Tailwind via `@theme inline` (`bg-background`, `text-foreground`, `bg-accent`, `bg-accent-soft`, `text-muted`).

| Token | Light | Dark | Kegunaan |
|---|---|---|---|
| `--background` | `#f6f5f2` (off-white hangat) | `#101214` | Latar halaman |
| `--foreground` | `#16181a` (near-black) | `#f3f4f5` | Teks utama, tombol primer, kartu gelap |
| `--accent` | `#10a56b` (hijau) | `#14c07f` | CTA layanan, badge, indikator, bintang rating |
| `--accent-soft` | `#e3f4ec` | `#12332a` | Latar badge/gradien lembut |
| `--muted` | `#6b7076` | `#9aa0a6` | Teks sekunder/deskripsi |

Aturan:
- **Jangan** hardcode warna hex baru. Gunakan token, atau turunan opacity (`text-foreground/70`, `bg-white/5`, `border-black/5`).
- Warna dekoratif kecil (avatar, gradien visual) boleh pakai palet Tailwind pastel (`bg-emerald-200`, dst.).

### 1.2 Tipografi

- **Sans**: Lato (`--font-lato`), weight 300/400/700/900 — default body.
- **Mono**: Geist Mono (`--font-geist-mono`) — hanya untuk konten teknis.

Tipografi mobile-first: mulai dari ukuran kecil, naikkan via `sm:`/`md:`.

| Peran | Kelas |
|---|---|
| H1 hero | `text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl` |
| H2 section | `text-3xl font-bold tracking-tight sm:text-5xl` (sering `text-center`) |
| H2 besar (scroll section) | `text-4xl font-bold tracking-tight sm:text-6xl` |
| H2 dua baris | baris kedua di-mute: `<span className="text-foreground/50">…</span>` |
| H3 kartu | `text-lg font-bold` atau `text-2xl font-bold` (kartu besar) |
| Eyebrow/label | `text-xs font-bold uppercase tracking-wider text-accent` |
| Lead paragraph | `text-base text-muted sm:text-lg`, dibatasi `max-w-xl`/`max-w-2xl` |
| Body kartu | `text-sm text-muted` |
| Micro copy | `text-xs font-semibold uppercase tracking-wider text-muted` |

### 1.3 Dark Mode

- Berbasis class `.dark` di `<html>` (custom variant `@custom-variant dark`), diinisialisasi lewat inline script di `src/app/layout.tsx` sebelum paint (localStorage → prefers-color-scheme).
- Pola wajib pada kartu putih: `dark:border-white/10 dark:bg-white/5 dark:shadow-none`.
- Kartu gelap (bg-foreground) di dark mode jadi glass: `dark:border dark:border-white/10 dark:bg-white/5 dark:text-foreground`.

---

## 2. Layout

Mobile-first: nilai dasar untuk mobile, `sm:` ke atas untuk desktop.

- Container: `mx-auto max-w-6xl` (default section), `max-w-3xl` (konten naratif/FAQ/hero copy), `max-w-5xl` (navbar scrolled), `max-w-7xl` (navbar top).
- Section: `px-4 py-14 sm:py-20` (hero: `px-4 pb-14 pt-28 sm:pb-16 sm:pt-36` karena navbar fixed).
- Jarak heading → konten: `mt-10 sm:mt-14`.
- Padding kartu: `p-6 sm:p-8`.
- Grid: `grid gap-5 lg:grid-cols-3` (bento), `grid items-center gap-8 sm:gap-12 lg:grid-cols-2` (split section, alternasi via `lg:[&>*:first-child]:order-2`), `sm:grid-cols-2 lg:grid-cols-3` (kartu Why Choose Us).
- Anchor section: `id="layanan"`, `id="portofolio"`, `id="kenapa-kami"`, `id="kontak"` — link internal `/#<id>`.
- Urutan homepage: Hero → TechMarquee → Services → Bento → Testimonials → UseCases → WhyChooseUs → Faq → CtaDark.

---

## 3. Komponen Pola Baku

### 3.1 Radius

| Elemen | Radius |
|---|---|
| Tombol, pill, badge | `rounded-full` |
| Kartu utama | `rounded-3xl` |
| Kartu kecil/nested/FAQ | `rounded-2xl` |
| Panel CTA besar | `rounded-3xl sm:rounded-[2.5rem]` |
| Kartu testimonial | `rounded-[2rem]` |

### 3.2 Tombol

Semua tombol: `rounded-full`, teks `text-xs`/`text-sm` `font-bold uppercase tracking-wide`.

**Semua elemen yang bisa diklik (button, icon button, item dropdown, toggle, dsb.) wajib `cursor-pointer`** — `<button>` di Tailwind v4 default `cursor: default`, jadi tambahkan eksplisit.

| Varian | Kelas |
|---|---|
| Primer (foreground) | `bg-foreground text-background shadow-lg transition-opacity hover:opacity-85` + `px-7 py-3.5` (besar) / `px-5 py-2.5` (navbar) |
| Accent | `bg-accent text-white shadow-lg shadow-accent/25 transition-opacity hover:opacity-90` + `px-6 py-3` |
| Outline | `border border-black/10 bg-white hover:border-black/30 dark:border-white/15 dark:bg-white/5 dark:hover:border-white/40` |
| Ghost/tekstual | `text-sm font-semibold uppercase tracking-wide text-muted hover:text-foreground` + panah `<span aria-hidden="true">→</span>` |
| Di atas panel gelap | putih solid `bg-white text-foreground` + outline `border border-white/25 hover:border-white/60` |

### 3.3 Kartu

- **Kartu elegan (`card-elegant`)** — **default untuk semua kartu putih**: class global di `globals.css` — background putih polos (tanpa gradient), border tipis `rgba(22,24,26,0.05)`, shadow tipis netral (`0 1px 2px` + `0 10px 30px -12px rgba(22,24,26,0.08)`), hover lift `-2px` dengan shadow sedikit lebih dalam (transisi `box-shadow`/`transform` 0.3s ease). Varian dark otomatis (glass `bg-white/5`, border `white/[0.09]`, shadow hitam) — **tidak perlu** menambah `dark:*` manual.
  - Pemakaian standar: `card-elegant rounded-3xl p-6 sm:p-8` (Bento, Why Choose Us, About, Contact, Offerings/Process layanan, Admin dashboard, Login).
  - Kartu bergambar (blog/portfolio): `card-elegant group overflow-hidden rounded-3xl` — tanpa padding di wrapper, media `aspect-[16/9]`/`aspect-[4/3]` di atas, padding di body konten.
  - Panel lebar (features layanan): `card-elegant rounded-3xl p-6 sm:rounded-[2.5rem] sm:p-12`.
  - Dropdown/popover kecil (user menu): `card-elegant rounded-2xl p-2` + positioning absolut.
- **Kartu putih standar (legacy)**: `rounded-3xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none sm:p-8` — hanya untuk elemen nested di dalam `card-elegant` atau saat hover lift tidak diinginkan; kartu baru pakai `card-elegant`.
- **Kartu gelap**: `bg-foreground text-background` + overlay radial accent + dark-mode glass (lihat §1.3). Teks sekunder: `text-background/70 dark:text-foreground/70`.
- **Kartu gradien accent**: `bg-gradient-to-b from-white to-accent-soft` (atau `bg-gradient-to-br`), dark: `dark:from-white/5`.
- **Kartu featured (pricing)**: `border-accent/40 bg-white shadow-xl shadow-accent/10` + badge diskon absolut `-top-3 left-1/2 -translate-x-1/2 bg-accent`.
- **Kartu testimonial (stack)**: `rounded-[2rem] border border-black/5 bg-white dark:border-white/10 dark:bg-[#1c2023]`, transform/opacity/shadow dihitung dari progress scroll (inline style), `will-change-transform`.

### 3.4 Badge & Pill

- Badge accent: `rounded-full bg-accent-soft px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-accent` (di panel gelap: `bg-accent/20`).
- Bullet/feature pill: dot `h-1.5 w-1.5 rounded-full bg-accent` + label `text-sm font-medium text-foreground/80`.
- Checklist: `✓` berwarna `text-accent`, item `text-sm text-foreground/80`.
- Icon chip kartu: `grid h-12 w-12 place-items-center rounded-2xl bg-accent-soft text-accent` + SVG inline stroke `currentColor` 22px, `aria-hidden="true"` (lihat Why Choose Us).
- **Step list (numbered)**: item `flex items-center gap-3 rounded-xl border border-transparent bg-background px-4 py-3 text-sm font-medium dark:bg-white/5` — tanpa border terlihat, hanya background lembut; nomor `text-xs font-bold text-accent` (`01`, `02`, …) + divider vertikal `h-4 w-px bg-black/10 dark:bg-white/15` + label `flex-1` + status dot kanan `h-2 w-2 rounded-full` (`bg-accent` untuk step aktif, `bg-accent/25` untuk lainnya). Step aktif/pertama di-highlight: `first:border-accent/40 first:bg-accent-soft/60` (dark: `dark:first:bg-accent-soft/40`). Divider & dot `aria-hidden="true"`. Referensi: Process card di Bento, stats card di Admin Dashboard.

### 3.5 Panel CTA Gelap

`rounded-3xl bg-foreground px-5 py-16 text-center text-background sm:rounded-[2.5rem] sm:px-6 sm:py-24` (dibungkus `ScrollScale`, dark-mode glass) + overlay:

```
bg-[radial-gradient(circle_at_50%_120%,rgba(16,165,107,0.4),transparent_60%)]
```

Overlay dekoratif selalu `aria-hidden="true"` + `pointer-events-none absolute inset-0`, konten dibungkus `relative`.

### 3.6 Marquee

- Wrapper: `marquee-mask overflow-hidden`, track: `flex w-max gap-4/5` + `animate-marquee` (40s) / `animate-marquee-slow` (60s) / `animate-marquee-reverse`.
- Item diduplikasi (`[...items, ...items]`) agar loop mulus.
- Item pill: `rounded-full border border-black/5 bg-white px-5 py-2.5 text-sm font-semibold text-foreground/80 shadow-sm` + dot accent (lihat `TechMarquee`).

### 3.7 FAQ

`<details className="faq-item group rounded-2xl border … px-5 py-4 sm:px-6 sm:py-5">` + `<summary>` flex dengan ikon `+` (class `faq-icon`, rotasi 45° saat open via CSS globals).

### 3.8 Navbar

- `fixed inset-x-0 top-0 z-50`, transisi saat scroll: dari `max-w-7xl bg-transparent` menjadi `mt-3 max-w-5xl rounded-2xl bg-white/90 shadow-lg backdrop-blur-md dark:bg-background/90`.
- Link nav: `text-xs font-semibold uppercase tracking-wide text-foreground/70 hover:text-foreground`.

### 3.9 Hero Particles

- `HeroParticles` (client) lazy-load `ParticlesCanvas` (tsparticles slim) saat browser idle (`requestIdleCallback`, timeout 3s) agar tidak mengganggu LCP.
- **Skip total** pada `prefers-reduced-motion` dan mobile (`max-width: 767px` / `pointer: coarse`).
- Warna partikel mengikuti dark mode via `MutationObserver` pada class `<html>`; canvas `pointer-events` hanya untuk hover grab.

### 3.10 Scroll-Driven Sections

Dua pola sticky-scroll (client component, tanpa library):

- **Testimonials (card stack)**: section tinggi `${count * 55 + 100}vh`, konten `sticky top-0 h-svh`. Progress = `-rect.top / (height - vh)`, dipetakan ke offset/scale/opacity/zIndex tiap kartu. Kartu non-aktif `aria-hidden`.
- **Use Cases (panel stack)**: tiap panel `sticky top-0 h-svh`; coverage panel berikutnya (`1 - top/vh`) mengendalikan scale/opacity/borderRadius panel di bawahnya. Nomor besar dekoratif `text-white/5`, gradient overlay bawah untuk kontras teks.

Aturan bersama: listener `scroll`/`resize` dengan throttle `requestAnimationFrame` (`if (!raf) raf = requestAnimationFrame(update)`), `{ passive: true }`, cleanup lengkap, `will-change-transform` pada elemen yang di-transform.

---

## 4. Motion

| Pola | Implementasi |
|---|---|
| Smooth scroll | Lenis via `<SmoothScroll />` di root layout |
| Scroll reveal | Komponen `Reveal` / class `.reveal` → fade + translateY(24px), 0.6s ease-out; stagger via prop `delay={index * 100}` (FAQ: `Math.min(index * 60, 300)`) |
| Scroll scale | Komponen `ScrollScale` (panel CTA) |
| Sticky scroll | Testimonials & Use Cases — lihat §3.10; wajib rAF-throttled + passive listener |
| Hero particles | Lihat §3.9 — idle-loaded, desktop-only, hormati reduced motion |
| Hover | Hanya `transition-opacity` / `transition-colors` / `transition-transform`, tanpa animasi berat |
| Reduced motion | `.reveal` dinonaktifkan lewat `prefers-reduced-motion` — wajib dipertahankan untuk animasi baru |

---

## 5. Konten & Bahasa

- Semua copy UI lewat **next-intl** (`useTranslations` / `getTranslations` untuk metadata) — **jangan** hardcode string di komponen. Sumber: `messages/id.json` & `messages/en.json`.
- Bahasa utama **Indonesia**; istilah teknis/nama layanan tetap Inggris (Website Development, Social Media Management, SEO).
- Nada: percaya diri, singkat, berorientasi hasil ("Tumbuh Digital. Lebih Cepat.").
- CTA baku: "Konsultasi Gratis" (primer), "Mulai Sekarang" (pricing), ghost link + `→`.
- Social proof: rating `★★★★★` accent + angka bold, avatar stack `-space-x-2 border-2 border-background`.
- Kontak: WhatsApp (`https://wa.me/…`) sebagai CTA utama panel gelap, email sebagai sekunder.

---

## 6. Aksesibilitas

- Elemen dekoratif (overlay, dot, panah, ikon) selalu `aria-hidden="true"`.
- Link ikon tanpa teks wajib `aria-label`.
- SVG inline: `stroke="currentColor"` agar mengikuti warna teks.
- FAQ pakai elemen native `<details>/<summary>`.

---

## 7. Checklist Komponen Baru

1. Warna hanya dari token/opacity turunan — tanpa hex baru.
2. Kartu putih pakai `card-elegant` (dark mode otomatis); elemen non-kartu tetap butuh varian dark manual (`dark:border-white/10 dark:bg-white/5 dark:shadow-none`).
3. Radius sesuai §3.1, tombol sesuai §3.2.
4. Section `px-4 py-14 sm:py-20` + container `max-w-6xl`; spacing mobile-first (§2).
5. Heading `font-bold tracking-tight`, eyebrow accent uppercase.
6. Semua copy via next-intl (`useTranslations`), key ditambah ke `messages/id.json` + `messages/en.json`.
7. Animasi masuk pakai `Reveal`; animasi scroll berat: rAF-throttle + hormati `prefers-reduced-motion`.
8. Client component (`"use client"`) hanya jika perlu state/efek; sisanya server component.
9. Elemen dekoratif `aria-hidden`; kartu carousel non-aktif juga `aria-hidden`.
