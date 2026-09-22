"use client";

import Link from "next/link";
import { useState } from "react";

export function BlogPageClient() {
    return (
        <>
            <main className="w-full pt-36 bg-background"><div className="flex flex-col w-full">
{/* Top Breadcrumb & Archival Label */}
<section className="max-w-[1440px] mx-auto w-full px-margin-mobile lg:px-margin pt-space-xs pb-space-sm">
<div className="flex items-center space-x-space-xs text-secondary">
<a className="font-label-sm text-label-sm uppercase tracking-[0.16em] hover:text-primary transition-colors" data-path="home" href="#">Home</a>
<span className="text-outline-variant font-label-sm text-label-sm">/</span>
<span className="font-label-sm text-label-sm uppercase tracking-[0.16em] text-primary font-medium">Blog &amp; Chronicles</span>
</div>
</section>
{/* Editorial Hero Section */}
<section className="relative max-w-[1440px] mx-auto w-full px-margin-mobile lg:px-margin pb-space-lg overflow-hidden">
{/* Subtle Ambient Watercolor Wash Emulation */}
<div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[640px] h-[320px] bg-tertiary-fixed/35 rounded-full blur-3xl pointer-events-none -z-10"></div>
<div className="max-w-4xl mx-auto text-center space-y-space-xs">
<div className="inline-flex items-center gap-space-xs px-4 py-1.5 rounded-full bg-paper-tint text-on-surface-variant shadow-sm">
<span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim"></span>
<span className="font-label-sm text-label-sm uppercase tracking-[0.24em] text-on-surface">The Atelier Chronicles &amp; Journal</span>
</div>
<h1 className="font-display-hero text-headline-lg lg:text-display-hero text-primary tracking-[0.06em] uppercase font-normal leading-tight">
        Musings on Pointed Pen, Ink, <br className="hidden sm:inline"/>&amp; Tactile Memory
      </h1>
<p className="font-body-lg text-body-lg text-secondary max-w-2xl mx-auto leading-relaxed">
        Intimate essays on archival materials, the quiet discipline of hand-rendering, behind-the-scenes studio dispatches, and films from our Maharashtra atelier.
      </p>
{/* Topic Filter Tabs / Pills */}
<div className="pt-space-sm flex flex-wrap items-center justify-center gap-2" id="blog-filter-bar">
<button className="filter-btn active-filter px-5 py-2 rounded-full font-label-sm text-label-sm uppercase tracking-[0.15em] bg-primary text-on-primary transition-colors shadow-sm" data-filter="all" type="button">
          All Musings
        </button>
<button className="filter-btn px-5 py-2 rounded-full font-label-sm text-label-sm uppercase tracking-[0.15em] bg-tertiary-fixed text-on-tertiary-fixed hover:bg-primary hover:text-on-primary transition-colors shadow-sm" data-filter="scribe" type="button">
          The Scribe’s Craft
        </button>
<button className="filter-btn px-5 py-2 rounded-full font-label-sm text-label-sm uppercase tracking-[0.15em] bg-tertiary-fixed text-on-tertiary-fixed hover:bg-primary hover:text-on-primary transition-colors shadow-sm" data-filter="wedding" type="button">
          Wedding Paper &amp; Etiquette
        </button>
<button className="filter-btn px-5 py-2 rounded-full font-label-sm text-label-sm uppercase tracking-[0.15em] bg-tertiary-fixed text-on-tertiary-fixed hover:bg-primary hover:text-on-primary transition-colors shadow-sm" data-filter="studio" type="button">
          Behind the Easel
        </button>
<button className="filter-btn px-5 py-2 rounded-full font-label-sm text-label-sm uppercase tracking-[0.15em] bg-tertiary-fixed text-on-tertiary-fixed hover:bg-primary hover:text-on-primary transition-colors shadow-sm" data-filter="reels" type="button">
          Reels &amp; Studio Motion
        </button>
<button className="filter-btn px-5 py-2 rounded-full font-label-sm text-label-sm uppercase tracking-[0.15em] bg-tertiary-fixed text-on-tertiary-fixed hover:bg-primary hover:text-on-primary transition-colors shadow-sm" data-filter="archival" type="button">
          Archival Wisdom
        </button>
</div>
</div>
</section>
{/* SECTION 1: WRITTEN BLOGS & ESSAYS */}
<section className="w-full bg-paper-tint py-space-lg shadow-sm">
<div className="max-w-[1440px] mx-auto px-margin-mobile lg:px-margin space-y-space-md">
{/* Section Header */}
<div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
<div>
<span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-secondary block">Folio Vol. IV • Dispatches</span>
<h2 className="font-headline-lg text-headline-lg text-primary tracking-wide uppercase">Written Chronicles</h2>
</div>
<div className="flex items-center gap-space-xs text-secondary">
<span className="font-label-sm text-label-sm uppercase tracking-widest">Showing 7 Selected Essays</span>
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
<span className="font-label-sm text-label-sm uppercase tracking-widest">Handcrafted in India</span>
</div>
</div>
{/* Hero Featured Essay */}
<article className="bg-surface-container-lowest shadow-sm rounded-none overflow-hidden transition-all duration-300 group">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
<div className="lg:col-span-7 relative h-80 sm:h-96 lg:h-[480px] overflow-hidden bg-surface-container-high">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" data-alt="Editorial overhead photograph of antique brass calligraphy nib dripping real 24 karat liquid gold gouache onto thick raw deckle edge handmade cotton rag paper with subtle rose watercolor stains, glass ink wells, and soft directional atelier daylight casting quiet shadows." src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5p9YKXHZ_lFyC5fabjVhtgxLBLRCQcdBhRu7__0dUd54R2fRwX-iUZlv_fPppvH28Tb7ueh1hXUEbm1H2KK9h4cqVa5U-H68QVPG1FPORvdvMV1P3r7oueyMKHZOV1I6nJtk9WOphSF50fnm-K6YJyCaifhQc-zuHVwbazpjGMUn4c47R1oidIlSxKhoxKG5r9oDA0zKKhiJJjr5JmGBdbEsz7HR7HjT8S3RNDOKwsR4zZ9FS-bc"/>
</div>
<div className="lg:col-span-5 p-space-sm sm:p-space-md flex flex-col justify-between bg-surface-container-lowest">
<div className="space-y-space-xs">
<div className="flex items-center space-x-2 text-secondary">
<span className="font-label-sm text-label-sm uppercase tracking-[0.16em] text-on-tertiary-container font-semibold">Archival Wisdom</span>
<span>•</span>
<span className="font-label-sm text-label-sm uppercase tracking-[0.12em]">8 Min Read</span>
<span>•</span>
<span className="font-label-sm text-label-sm uppercase tracking-[0.12em]">By Master Scribe</span>
</div>
<h3 className="font-headline-lg text-headline-md lg:text-headline-lg text-primary font-normal leading-tight group-hover:text-tertiary-container transition-colors">
                The Alchemy of 24k Gold Flakes &amp; Oak Gall Ink on Deckle-Edge Cotton Rag
              </h3>
<p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Exploring how hand-ground iron gall formulas interact with 300 GSM Indian handmade khadi paper, and the unwavering patience required for genuine copperplate swells under natural monsoonal humidity.
              </p>
</div>
<div className="pt-space-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
<Link className="inline-flex items-center justify-center h-[49px] px-7 bg-tertiary-fixed text-on-tertiary-fixed font-label-lg text-label-lg uppercase tracking-[0.15em] hover:bg-primary hover:text-on-primary transition-all duration-200 shadow-sm" href="/blog/preserving-glass-engraving">
                Read Article
              </Link>
<span className="font-body-sm text-body-sm text-secondary italic">Dispatched Oct 24, 2024</span>
</div>
</div>
</div>
</article>
{/* 6-Article Grid (3 Columns) */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
{/* Article 1 */}
<article className="bg-surface-container-lowest shadow-sm flex flex-col justify-between p-6 group transition-all duration-300">
<div className="space-y-4">
<Link href="/blog/preserving-glass-engraving" className="block relative h-60 overflow-hidden bg-surface-container">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Delicate close-up of handwritten wedding vows on natural cream deckle paper with ivory silk ribbons and a dried botanical rose sprig, soft morning studio lighting in quiet neutral tones." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXsCT-gBBWhNqL15AIEuUKKsdw7R3jN2QyoThP-BtbO7rmQ1AgSorPJAk21sY7qMinllo8tTxer0naGx-Ue41sFHaZ6YdrlYRAyx80EFisbA2QQtgOJbQ9-t_m7KHZxHpXe748s8A7DfcL54OrVp6r8m8czSO7twvAnNICp9JiYg1HVKRECj7W-LWgt6DVH6pSFZhuNafjg3gBz3fndzcQWYR3YFnSu_pnv9f52nY6_te3-VxrS2Q"/>
</Link>
<div className="flex items-center space-x-2 text-secondary font-label-sm text-label-sm uppercase tracking-wider">
<span>5 Min Read</span>
<span>•</span>
<span>Oct 18, 2024</span>
</div>
<Link href="/blog/preserving-glass-engraving">
<h4 className="font-headline-lg text-headline-sm text-primary group-hover:text-on-tertiary-container transition-colors leading-snug">
              The Sacred Geometry of Wedding Vow Keepsakes: Why Handwritten Still Matters
            </h4>
</Link>
<p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3 leading-relaxed">
              In an age of luminous screens and ephemeral text, a bride and groom’s vows committed to archival cotton paper become the singular physical heirloom passed down through generations.
            </p>
</div>
<div className="pt-6 mt-6 flex items-center justify-between">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">Etiquette &amp; Vows</span>
<Link className="font-label-md text-label-md uppercase tracking-[0.14em] text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform" href="/blog/preserving-glass-engraving">
              Read Essay <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</Link>
</div>
</article>
{/* Article 2 */}
<article className="bg-surface-container-lowest shadow-sm flex flex-col justify-between p-6 group transition-all duration-300">
<div className="space-y-4">
<Link href="/blog/preserving-glass-engraving" className="block relative h-60 overflow-hidden bg-surface-container">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Macro capture of hand engraved crystal champagne flutes with delicate micro serif calligraphy, tiny diamond burr dust reflections, illuminated by warm side lamp on dark wooden desk." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdyFwtW9JSQTC4CuMdNu8hiQjy1_v24mQGR7g0KQk6LUcWlPk9CCVxsVDhtAEvgD_U7qIGfRkhxFZj8zdPRJFnbUVTzewhPzqF_QcbvDyb_zpPE-gAhkvuV1lG2jtF_QZCAGyjMpJVoRIq0F7FUa6eH8Xy2HDGsRO-gG_zPO06wKNmi4ZZEd-_XSik15oN8Jnyr7k9MJT1gyANe1V_uAgTE8-u4620UrnMYUB9hobY7gVgGUwGiRY"/>
</Link>
<div className="flex items-center space-x-2 text-secondary font-label-sm text-label-sm uppercase tracking-wider">
<span>4 Min Read</span>
<span>•</span>
<span>Oct 11, 2024</span>
</div>
<Link href="/blog/preserving-glass-engraving">
<h4 className="font-headline-lg text-headline-sm text-primary group-hover:text-on-tertiary-container transition-colors leading-snug">
              Preserving Glass Engraving: Caring for Hand-Etched Flutes &amp; Victorian Crystal
            </h4>
</Link>
<p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3 leading-relaxed">
              A comprehensive conservatory guide to washing, handling, and buffering personalized glassware etched with micro-drill burs to prevent clouding and micro-fractures.
            </p>
</div>
<div className="pt-6 mt-6 flex items-center justify-between">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">Conservation</span>
<Link className="font-label-md text-label-md uppercase tracking-[0.14em] text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform" href="/blog/preserving-glass-engraving">
              Read Essay <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</Link>
</div>
</article>
{/* Article 3 */}
<article className="bg-surface-container-lowest shadow-sm flex flex-col justify-between p-6 group transition-all duration-300">
<div className="space-y-4">
<Link href="/blog/preserving-glass-engraving" className="block relative h-60 overflow-hidden bg-surface-container">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Artisanal glass jars filled with rich amber walnut ink, wooden pestle with dried walnut husks, droppers, and vintage nib boxes on an antique stone workspace in Maharashtra atelier." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHSMgV-aAM-4dORpA-AQp9OdfWS7pbze56a22DCnsqtuhjJEKyQW3udkfH2LGYmGCz25JlAkLVMDeOp8UuncvbkGQTHkFXQBurAsiJUSsg2DxYz1LINIVhR24k5oVj6dP0Kc_p5xIYLXVageO6OhO9PsSkNdd45PEb9G9rfzmNbmgJ7TjGFOrk-3gaOvZwxNzb5Q4bqMhTlf5AQsUnlxSkOxXoisq7BEKvFrL9tOipJgySAdidFug"/>
</Link>
<div className="flex items-center space-x-2 text-secondary font-label-sm text-label-sm uppercase tracking-wider">
<span>6 Min Read</span>
<span>•</span>
<span>Sep 29, 2024</span>
</div>
<Link href="/blog/preserving-glass-engraving">
<h4 className="font-headline-lg text-headline-sm text-primary group-hover:text-on-tertiary-container transition-colors leading-snug">
              From Raw Pigments to Fluid Script: Crafting Custom Walnut Inks in Bhusawal
            </h4>
</Link>
<p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3 leading-relaxed">
              Inside our slow distillation ritual: simmering sun-dried green hulls, balancing clove oil preservatives, and calibrating gum arabic for optimal nib hairspring flow.
            </p>
</div>
<div className="pt-6 mt-6 flex items-center justify-between">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">Studio Recipes</span>
<Link className="font-label-md text-label-md uppercase tracking-[0.14em] text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform" href="/blog/preserving-glass-engraving">
              Read Essay <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</Link>
</div>
</article>
{/* Article 4 */}
<article className="bg-surface-container-lowest shadow-sm flex flex-col justify-between p-6 group transition-all duration-300">
<div className="space-y-4">
<Link href="/blog/preserving-glass-engraving" className="block relative h-60 overflow-hidden bg-surface-container">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Melted soft rose and sage green sealing wax poured onto textured handmade paper with solid brass stamp engraved with ornate royal monogram, melting spoon over flickering candle flame." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYUapVE1ZDcy_yfdbUv70EnECSykN03HP7y75sYhAWpnFa8KwG0yMQ9oBE2lKfmJGKtTdYCR3ViqxEp9g5D6Qnl1gxMugjn2KqwTIYNuUds-he8cMt9LEnHA0LqQEeGycM-tyW1emc-Nj6iRdyIzvFbaOyMpuE-YzF47XE0VDNhqxavO7FrWLzFERGFpcM05yoBrfmXjF7iPzElmxQanYLZP5bOpX18JXrev6G8ZYI6JvmOcw87_M"/>
</Link>
<div className="flex items-center space-x-2 text-secondary font-label-sm text-label-sm uppercase tracking-wider">
<span>7 Min Read</span>
<span>•</span>
<span>Sep 15, 2024</span>
</div>
<Link href="/blog/preserving-glass-engraving">
<h4 className="font-headline-lg text-headline-sm text-primary group-hover:text-on-tertiary-container transition-colors leading-snug">
              The Quiet Art of Sealing: Natural Beeswax, Shellac &amp; Hand-Turned Brass Stamps
            </h4>
</Link>
<p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3 leading-relaxed">
              Why flexible resin formulations matter for international postal handling, and how our atelier sources cold-pressed beeswax from sustainable Indian apiaries.
            </p>
</div>
<div className="pt-6 mt-6 flex items-center justify-between">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">Wax Artistry</span>
<Link className="font-label-md text-label-md uppercase tracking-[0.14em] text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform" href="/blog/preserving-glass-engraving">
              Read Essay <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</Link>
</div>
</article>
{/* Article 5 */}
<article className="bg-surface-container-lowest shadow-sm flex flex-col justify-between p-6 group transition-all duration-300">
<div className="space-y-4">
<Link href="/blog/preserving-glass-engraving" className="block relative h-60 overflow-hidden bg-surface-container">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Analytical top-down calligraphy practice sheet showing 55 degree slant guide lines, delicate hairline flourishes in Higgins eternal black ink, contrasting Spencerian hand with bold Copperplate shades." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHyJ-DzIwXdykKhGrC1awUoaWsx7KH3fIhY5uzHDeQi-6jW_1Ugf5ArQhqDzd__JKmHw0326_fZ6FTyE8kCH2pT3eX7OC-mGRLP09zucgVe5mtRwHRilYor9CYeV41Ck6BFRFBp4_Myjj_1O2sH0gwup5fzpoLOuqTr-pseE3T1iuml0ZBqHuIZQUAYcqeRRAyEkjVvZTh4ec8vN5xqo7nq5-gnJdaCYqqpGmXn0tHOwA3Mmc1Bg8"/>
</Link>
<div className="flex items-center space-x-2 text-secondary font-label-sm text-label-sm uppercase tracking-wider">
<span>10 Min Read</span>
<span>•</span>
<span>Aug 30, 2024</span>
</div>
<Link href="/blog/preserving-glass-engraving">
<h4 className="font-headline-lg text-headline-sm text-primary group-hover:text-on-tertiary-container transition-colors leading-snug">
              Flourishing with Restraint: Spencerian vs. Copperplate Principles
            </h4>
</Link>
<p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3 leading-relaxed">
              Deconstructing arm movement versus finger dexterity: understanding the mathematical oval geometry that prevents ornate flourishing from cluttering legibility.
            </p>
</div>
<div className="pt-6 mt-6 flex items-center justify-between">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">Penmanship</span>
<Link className="font-label-md text-label-md uppercase tracking-[0.14em] text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform" href="/blog/preserving-glass-engraving">
              Read Essay <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</Link>
</div>
</article>
{/* Article 6 */}
<article className="bg-surface-container-lowest shadow-sm flex flex-col justify-between p-6 group transition-all duration-300">
<div className="space-y-4">
<Link href="/blog/preserving-glass-engraving" className="block relative h-60 overflow-hidden bg-surface-container">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Artisanal packaging session showing handmade wooden shadowbox lined with natural linen, tissue wrapping, dried rose petals, personalized thank you letter with wax seal ready for delivery." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnnOZq7wnhLKqHMnaMBqGEl6fkeH6N0E9ikAmx1vAu20IAbSpKBwHuyU_vu5aX58SBnkNQVXbFE1ekdh-wiLpr1pvuWEGa5RWTJXhxApJTp-fALku-CoiL_JrvnkPwC-wK5pbh83V929uvi7wC0hdiHso6D64KVmqzbcgSzCK_YIsvaKmUdr2HDuWWFw32-MagzLlwCZiMIe1Qq6_m-beBvN-hVODISbVGIrjDhdB5V9kO5d_af2g"/>
</Link>
<div className="flex items-center space-x-2 text-secondary font-label-sm text-label-sm uppercase tracking-wider">
<span>4 Min Read</span>
<span>•</span>
<span>Aug 14, 2024</span>
</div>
<Link href="/blog/preserving-glass-engraving">
<h4 className="font-headline-lg text-headline-sm text-primary group-hover:text-on-tertiary-container transition-colors leading-snug">
              How We Prepare Custom Shadowbox Packaging for Pan-India Courier
            </h4>
</Link>
<p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3 leading-relaxed">
              A glimpse into the unboxing architecture: layering museum conservation acid-free matboards, moisture-lock liners, and protective wooden framing.
            </p>
</div>
<div className="pt-6 mt-6 flex items-center justify-between">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">Atelier Logistics</span>
<Link className="font-label-md text-label-md uppercase tracking-[0.14em] text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform" href="/blog/preserving-glass-engraving">
              Read Essay <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</Link>
</div>
</article>
</div>
</div>
</section>
{/* SECTION 2: STUDIO MOTION & VISUAL REPOSITORIES (UNEVEN MASONRY WALL) */}
<section className="max-w-[1440px] mx-auto w-full px-margin-mobile lg:px-margin py-space-xl space-y-space-md">
{/* Section Headline & Gallery Filter */}
<div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-space-xs">
<div className="space-y-2 max-w-2xl">
<div className="inline-flex items-center gap-2 text-tertiary-container">
<span className="material-symbols-outlined text-[18px]">motion_photos_on</span>
<span className="font-label-sm text-label-sm uppercase tracking-[0.22em] font-semibold">Cinematography &amp; Visual Reel Wall</span>
</div>
<h2 className="font-headline-lg text-headline-lg lg:text-headline-lg text-primary tracking-wide uppercase">
          Studio Motion &amp; Visual Repositories
        </h2>
<p className="font-body-md text-body-md text-secondary leading-relaxed">
          Uneven glimpses into daily atelier rhythm, wet ink macro captures, slow penmanship reels, and fleeting studio moments captured in our Bhusawal studio.
        </p>
</div>
{/* Media Filter Controls */}
<div className="flex flex-wrap gap-2" id="media-filter-bar">
<button className="media-btn active-media px-4 py-2 rounded-full font-label-sm text-label-sm uppercase tracking-[0.14em] bg-primary text-on-primary transition-colors shadow-sm" data-media="all" type="button">
          All Media (10)
        </button>
<button className="media-btn px-4 py-2 rounded-full font-label-sm text-label-sm uppercase tracking-[0.14em] bg-surface-container text-on-surface hover:bg-tertiary-fixed transition-colors shadow-sm" data-media="reels" type="button">
          Process Reels (9:16)
        </button>
<button className="media-btn px-4 py-2 rounded-full font-label-sm text-label-sm uppercase tracking-[0.14em] bg-surface-container text-on-surface hover:bg-tertiary-fixed transition-colors shadow-sm" data-media="shorts" type="button">
          Studio Shorts &amp; Videos
        </button>
<button className="media-btn px-4 py-2 rounded-full font-label-sm text-label-sm uppercase tracking-[0.14em] bg-surface-container text-on-surface hover:bg-tertiary-fixed transition-colors shadow-sm" data-media="stills" type="button">
          Macro Photos
        </button>
</div>
</div>
{/* Asymmetrical / Uneven Multi-Column Masonry Wall */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-gutter items-start">
{/* COLUMN 1: Width 4 / 12 */}
<div className="lg:col-span-4 flex flex-col gap-gutter">
{/* Media Item 1: Tall 9:16 Vertical Reel */}
<div className="media-card group relative bg-surface-container-lowest shadow-sm overflow-hidden" data-category="reels">
<div className="relative w-full aspect-[9/16] bg-primary-container overflow-hidden">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-90" data-alt="Vertical 9:16 video still macro of antique pointed dip pen dipping into shimmering pure gold gouache with wet droplets and ink bottle reflection in warm candlelit studio." src="https://lh3.googleusercontent.com/aida-public/AB6AXuChs4cz1xrWv-z47HhzbZgOGWXcXgHUHjKS8rdIKGYmSrkIpbSBeIof32OPBl5A0b5VlliHQQPvaH-PoyKDog-SHBtA0zOSk4YGTplP-vOolCc8R6_twNwFIvExZEOJNB3b1wsIEFjK_QoninTzeL9Us7nXQ80l79B8SvxXOsFHYtGuuRq4eIlJHjPF9_YqyKwYjnerduo5AJHq8J1__L4MACZuzOZm-FbCsnLvcMC9R2k2Bh8gH_U"/>
<div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent"></div>
{/* Reel Badge & Audio indicator */}
<div className="absolute top-4 left-4 right-4 flex items-center justify-between text-on-primary">
<span className="inline-flex items-center gap-1 px-2.5 py-1 bg-tertiary-container/80 backdrop-blur-sm rounded-full font-label-sm text-[10px] tracking-wider uppercase">
<span className="material-symbols-outlined text-[14px]">movie</span>
                Instagram Reel
              </span>
<span className="flex items-center gap-1 font-label-sm text-[11px] bg-primary/40 px-2 py-0.5 rounded backdrop-blur-sm">
<span className="material-symbols-outlined text-[14px]">volume_up</span> 0:34
              </span>
</div>
{/* Central Hover Play Button */}
<div className="absolute inset-0 flex items-center justify-center">
<div className="w-14 h-14 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined text-[28px] translate-x-0.5" style={{ fontVariationSettings: "\'FILL\' 1" }}>play_arrow</span>
</div>
</div>
{/* Bottom Video Metadata */}
<div className="absolute bottom-4 left-4 right-4 text-on-primary space-y-1">
<p className="font-label-sm text-label-sm uppercase tracking-widest text-tertiary-fixed">48.2k Views</p>
<h4 className="font-headline-sm text-headline-sm font-medium leading-snug">
                Dipping into 24k gold leaf gouache in slow motion
              </h4>
<p className="font-body-sm text-[12px] text-surface-variant line-clamp-1">#calligraphymotion #gildedink #maharashtrastudio</p>
</div>
</div>
</div>
{/* Media Item 2: Standard Aspect Ratio Photo */}
<div className="media-card group relative bg-surface-container-lowest shadow-sm p-4 overflow-hidden" data-category="stills">
<div className="relative w-full aspect-[4/3] bg-surface-container overflow-hidden">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Extreme macro textured photograph showing wet rich black sumi ink settling into the fibers of raw torn deckle edge paper with natural cotton seeds visible in paper pulp." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDILBvJvTP7pFN8Q8AB9yn6fJknIwSIg0T5igpUeSzCrbuXGc5UgP6Txh_dtwI4pQ53tdKmnG4clSwrW88oSvqK8d5Nmov3F4EYnkgxEU7-nRdxUsfESM7DITV60d3cHYW8sMZqqUERkB0M6DPhRTe6RMHDrXw4onFBpBuo3_g__Kun13vb_y2wPKgqnM435pz0r-cT1ggqjKVx6529MlChAAAWgt3nRY4ygtlF5Dr8OVceHZ1hxg"/>
<span className="absolute top-3 right-3 bg-paper-tint/90 backdrop-blur-sm text-primary p-1.5 rounded-full shadow-sm">
<span className="material-symbols-outlined text-[16px]">filter_vintage</span>
</span>
</div>
<div className="pt-3">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">Macro Study #41</span>
<p className="font-body-sm text-body-sm text-primary font-medium mt-1">
              Capillary action of sumi ink on 320 GSM Indian Khadi paper.
            </p>
</div>
</div>
{/* Media Item 3: Tall 9:16 Vertical Reel */}
<div className="media-card group relative bg-surface-container-lowest shadow-sm overflow-hidden" data-category="reels">
<div className="relative w-full aspect-[9/16] bg-primary-container overflow-hidden">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-90" data-alt="Vertical 9:16 cinematic video still of master calligrapher executing a dramatic flourished capital A on a blush handmade envelope using an oblique walnut penholder." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCp7YXt3ZfbD-bk1UOrXMkgzYdcdFQpJN2LpGrCgRlGhJKZpOg40TBJOGavEyycgZoj4xoNKmTGi8U4Bq3fcV6hRfcSV6tSvvBRtiCbRdvoPl9iOwWz5TVgg3a9aVwpmr8Fhi_5WI3-NhBOfxPKSMEPp17J1fRjukn1qejz0Jdk1ro6Py5iOyjn0JcqS0nI_1ha9GWNTgLAyVW00VjPr6lwlPhZi3Fpi6brhX-0bNXmcP6ZgNxXbBY"/>
<div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent"></div>
<div className="absolute top-4 left-4 right-4 flex items-center justify-between text-on-primary">
<span className="inline-flex items-center gap-1 px-2.5 py-1 bg-tertiary-container/80 backdrop-blur-sm rounded-full font-label-sm text-[10px] tracking-wider uppercase">
<span className="material-symbols-outlined text-[14px]">movie</span>
                Process Reel
              </span>
<span className="font-label-sm text-[11px] bg-primary/40 px-2 py-0.5 rounded backdrop-blur-sm">0:45</span>
</div>
<div className="absolute inset-0 flex items-center justify-center">
<div className="w-14 h-14 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined text-[28px] translate-x-0.5" style={{ fontVariationSettings: "\'FILL\' 1" }}>play_arrow</span>
</div>
</div>
<div className="absolute bottom-4 left-4 right-4 text-on-primary space-y-1">
<p className="font-label-sm text-label-sm uppercase tracking-widest text-tertiary-fixed">29.1k Views</p>
<h4 className="font-headline-sm text-headline-sm font-medium leading-snug">
                Copperplate capital “A” flourishing on handmade cotton envelope
              </h4>
</div>
</div>
</div>
</div>
{/* COLUMN 2: Width 5 / 12 (Central Asymmetric Anchor) */}
<div className="lg:col-span-5 flex flex-col gap-gutter">
{/* Media Item 4: Wide 16:9 Cinema Studio Short */}
<div className="media-card group relative bg-surface-container-lowest shadow-sm overflow-hidden" data-category="shorts">
<div className="relative w-full aspect-video bg-primary overflow-hidden">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="Wide cinematic 16:9 studio video still showing calligrapher holding high speed rotary micro drill engraving delicate floral monograms onto crystal perfume flutes with diamond dust sparkling." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHMy6zUuhgQo5FIj9guot2ofYVdg5n8NTkO-6iGZ4upP6reT-sG7rqxxeu8ZWcSJ80F1F3AkXWu2o-pZuOM8pQD5dl3-1DXM6Q9XXaaeXxgMlBwFTtmHQ1dvjDNXdKLMkKjCO8WL-EXQx79w_2KlwSZhEOTlNrtcQ_2QrN5r1mSgunUF-FxkOQJTFOzWiSY7fVia4NUd7RcQTfGGtrtQ-wH9UHvOyvkLYRkYZNUm4aoJCnTcQDCg4"/>
<div className="absolute inset-0 bg-primary/30 group-hover:bg-primary/20 transition-colors"></div>
<div className="absolute top-4 left-4 bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 font-label-sm text-label-sm uppercase tracking-wider shadow-sm flex items-center gap-1.5">
<span className="material-symbols-outlined text-[16px]">videocam</span> Studio Cinema
            </div>
<div className="absolute top-4 right-4 bg-primary/70 text-on-primary px-2.5 py-1 font-label-sm text-[11px] rounded backdrop-blur-sm">
              2:15 Mastercut
            </div>
<div className="absolute inset-0 flex items-center justify-center">
<div className="w-16 h-16 rounded-full bg-paper-tint text-primary flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined text-[32px] translate-x-0.5" style={{ fontVariationSettings: "\'FILL\' 1" }}>play_arrow</span>
</div>
</div>
<div className="absolute bottom-4 left-4 right-4 text-on-primary">
<h4 className="font-headline-sm text-headline-sm font-normal">
                Atelier Session: Drilling floral monograms onto crystal perfume flutes
              </h4>
<p className="font-body-sm text-[12px] text-surface-variant mt-1">Live personalized event commission for royal gala.</p>
</div>
</div>
</div>
{/* Media Item 5: Square 1:1 Flatlay Photo */}
<div className="media-card group relative bg-surface-container-lowest shadow-sm p-4 overflow-hidden" data-category="stills">
<div className="relative w-full aspect-square bg-surface-container overflow-hidden">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Overhead flatlay composition of rare vintage Gillott 303 nibs, turned zebrawood oblique calligraphy penholder, amber walnut ink droppers, and dried pink rosebuds on stone atelier table." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCswTqtZmDwwP8ku2wExBs6i96W9Q5_Ysa1iJu_X0iK8XmZPdzKIFc_qpRjGJgasy9Due7qnqcVrmjNYJYI6lcVAiQR2QWEiKiJgalQLhdd2JHtqGJPvAagCBNGXeBjP9u-yX2R5EkjxYC4CMsAN2KNA8KVjhvwHTJFA01h8Dq6reW4UEvdcRSToZ1gs6_SJ6kYzzDKgXqy4sdP-dznf3PMljaBnMg25gpQBcGY9lK7YBjU6iuiEz8"/>
</div>
<div className="pt-4 flex items-center justify-between">
<div>
<span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">Atelier Tools</span>
<p className="font-headline-sm text-headline-sm text-primary mt-0.5">The Daily Scribe Arsenal</p>
</div>
<a className="w-9 h-9 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors" href="#">
<span className="material-symbols-outlined text-[18px]">zoom_in</span>
</a>
</div>
</div>
{/* Media Item 6: Wide Documentary Short Video */}
<div className="media-card group relative bg-surface-container-lowest shadow-sm overflow-hidden" data-category="shorts">
<div className="relative w-full aspect-[16/10] bg-primary overflow-hidden">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="Cinematic still from documentary showing calligraphy artisan grinding natural raw pigments on slate stone in sunlit atelier courtyard in Bhusawal Maharashtra." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMhf7vc3vMqaDr6qFjN4dnk-rpdD596UfLWJRAiVsUZN60AteKEG7UxtzLybWKeLFGA1563_fdK7nv-rTqVmGMVUvdPOSpz_3UFB6tfJrNh9BmPoVvJHpteW7MUqA2eXx3N5zynSU_GZB882vXbDNfC2pVVoLMaZI8V6OzxNPwO8FupfpZHgtTUirlI3qiCk4lAwHW0l9ZFYdx055Mw5vACGW1vvYCJTZTmpuTirJ6iqrWp7ZLn6g"/>
<div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/30 to-transparent"></div>
<div className="absolute top-4 left-4 bg-tertiary-container text-on-tertiary px-3 py-1 font-label-sm text-label-sm uppercase tracking-wider shadow-sm flex items-center gap-1.5">
<span className="material-symbols-outlined text-[16px]">movie_edit</span> Mini Documentary
            </div>
<div className="absolute top-4 right-4 bg-primary/60 text-on-primary px-2.5 py-1 font-label-sm text-[11px] rounded backdrop-blur-sm">
              5:20 Runtime
            </div>
<div className="absolute inset-0 flex items-center justify-center">
<div className="w-16 h-16 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined text-[32px] translate-x-0.5" style={{ fontVariationSettings: "\'FILL\' 1" }}>play_arrow</span>
</div>
</div>
<div className="absolute bottom-4 left-4 right-4 text-on-primary">
<span className="font-label-sm text-label-sm uppercase tracking-widest text-tertiary-fixed block">Bhusawal Studio Archives</span>
<h4 className="font-headline-lg text-headline-sm font-normal">
                48 Hours in the Bhusawal Atelier with our Master Scribe
              </h4>
</div>
</div>
</div>
</div>
{/* COLUMN 3: Width 3 / 12 */}
<div className="lg:col-span-3 flex flex-col gap-gutter">
{/* Media Item 7: Tall 9:16 Vertical Reel */}
<div className="media-card group relative bg-surface-container-lowest shadow-sm overflow-hidden" data-category="reels">
<div className="relative w-full aspect-[9/16] bg-primary-container overflow-hidden">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-90" data-alt="Vertical 9:16 video still of hand pouring hot melted sage green and rose beeswax onto an envelope fold and pressing an engraved brass monogram seal leaving a crisp relief impression." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyLb2absOj549RlAABGZyqZiALsHcjcr2thyn6uWyluP18s1MbAiWDII_yNSp31d5yI_fyXclEyrVwTuz2Ac7OjE0AMC2oK0f9QrD5CndBYjCGKx4tr0kyo6K8OgL9pzFBt31aRWwU1ifx3ppWl5Oys-zv6jEfY6WKvID-JzLgyR8vLKeoiGhItfUpRit1OaLy6LvqcCK2iW0wxWPXI46PU4jppraVtOg00TdSbWXXN-UbdqDYRQM"/>
<div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent"></div>
<div className="absolute top-4 left-4 right-4 flex items-center justify-between text-on-primary">
<span className="inline-flex items-center gap-1 px-2.5 py-1 bg-tertiary-container/80 backdrop-blur-sm rounded-full font-label-sm text-[10px] tracking-wider uppercase">
<span className="material-symbols-outlined text-[14px]">movie</span>
                Wax Seal Reel
              </span>
<span className="font-label-sm text-[11px] bg-primary/40 px-2 py-0.5 rounded backdrop-blur-sm">0:28</span>
</div>
<div className="absolute inset-0 flex items-center justify-center">
<div className="w-14 h-14 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined text-[28px] translate-x-0.5" style={{ fontVariationSettings: "\'FILL\' 1" }}>play_arrow</span>
</div>
</div>
<div className="absolute bottom-4 left-4 right-4 text-on-primary space-y-1">
<p className="font-label-sm text-label-sm uppercase tracking-widest text-tertiary-fixed">18.5k Plays</p>
<h4 className="font-headline-sm text-headline-sm font-medium leading-snug">
                Melting forest sage beeswax with brass initial stamp
              </h4>
</div>
</div>
</div>
{/* Media Item 8: Vertical 3:4 Wedding Vow Stack Photo */}
<div className="media-card group relative bg-surface-container-lowest shadow-sm p-4 overflow-hidden" data-category="stills">
<div className="relative w-full aspect-[3/4] bg-surface-container overflow-hidden">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Vertical photograph of bespoke illuminated wedding vow booklets tied in raw mulberry frayed silk ribbons and stamped with gold wax crest on ivory handmade paper." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTI5Z4RsFznIS5u3CQ12dpZiD7C59bUbDi_Q8HFhb0VG-MAVr7qDLWztBYXlJc0ymLabmE1kEgJ5eZ5IzckhDYlBmkgfKXxprF5GNMIjYmRL4FFfiG_QAEAhuSMUZ9edqnyxFR2aB6hmSXTh9uC3p02Oz71-3pW4Bu2XH2gA9htOIHYKAFeBlPktG_-lRlTucXgX9ElMc6hqDJv-bPL4CNrecypfWsexQt_4NNvt-iDHOUV7wBtx4"/>
<div className="absolute bottom-3 left-3 bg-paper-tint/95 text-primary px-3 py-1 font-label-sm text-label-sm uppercase tracking-wider shadow-sm">
              Commission Suite
            </div>
</div>
<div className="pt-3">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">Archive Suite 109</span>
<p className="font-body-sm text-body-sm text-primary font-medium mt-1">
              Illuminated wedding vow folios in raw silk.
            </p>
</div>
</div>
{/* Media Item 9: Tall 9:16 Vertical Reel */}
<div className="media-card group relative bg-surface-container-lowest shadow-sm overflow-hidden" data-category="reels">
<div className="relative w-full aspect-[9/16] bg-primary-container overflow-hidden">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-90" data-alt="Vertical 9:16 video still of studio artisan gently packing an ornate framed calligraphy parchment into wooden gift crate lined with dried jasmine flowers and kraft cushioning." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqyyBo_Db3cSDzMkJfPRk49mW_33wNR024frU7E9BMGT_p7tlSVlCZhPwmgBXJyUa5pL0v1tcI7av4YiydqHErcK8K31ggz9Yjm4vCyB1_MaS3LKuqVTcWMuBqdQV-wNfV1NGGaCcDkISB-k24wIB07jtnh6Dps-ATKwDaRK5ucZnRduJcjGNl3zB5Z6zOEXOk6t80V4U5I2dniHpronp9W0QR2CnnVZV8_HwQJ14JIRTuRnRzLg8"/>
<div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent"></div>
<div className="absolute top-4 left-4 right-4 flex items-center justify-between text-on-primary">
<span className="inline-flex items-center gap-1 px-2.5 py-1 bg-tertiary-container/80 backdrop-blur-sm rounded-full font-label-sm text-[10px] tracking-wider uppercase">
<span className="material-symbols-outlined text-[14px]">package_2</span>
                Dispatch Reel
              </span>
<span className="font-label-sm text-[11px] bg-primary/40 px-2 py-0.5 rounded backdrop-blur-sm">0:39</span>
</div>
<div className="absolute inset-0 flex items-center justify-center">
<div className="w-14 h-14 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined text-[28px] translate-x-0.5" style={{ fontVariationSettings: "\'FILL\' 1" }}>play_arrow</span>
</div>
</div>
<div className="absolute bottom-4 left-4 right-4 text-on-primary space-y-1">
<p className="font-label-sm text-label-sm uppercase tracking-widest text-tertiary-fixed">34.8k Views</p>
<h4 className="font-headline-sm text-headline-sm font-medium leading-snug">
                Packing a royal bespoke name frame in triple-cushioned wooden crating
              </h4>
</div>
</div>
</div>
</div>
</div>
{/* Instagram Feed Callout CTA Button */}
<div className="pt-space-md flex flex-col items-center justify-center text-center space-y-4">
<div className="flex items-center gap-2 text-secondary font-label-sm text-label-sm uppercase tracking-[0.2em]">
<span className="w-8 h-[1px] bg-secondary"></span>
        Daily Atelier Stories
        <span className="w-8 h-[1px] bg-secondary"></span>
</div>
<a className="inline-flex items-center gap-3 px-8 py-3.5 bg-tertiary-fixed text-on-tertiary-fixed font-label-lg text-label-lg uppercase tracking-[0.16em] hover:bg-primary hover:text-on-primary transition-all duration-200 shadow-sm" href="#">
<span className="material-symbols-outlined text-[20px]">photo_camera</span>
        Watch More on Instagram Reels @the_letter_ink
      </a>
<p className="font-body-sm text-body-sm text-secondary">
        Updated every Tuesday &amp; Friday with raw studio takes and lettering process clips.
      </p>
</div>
</section>
{/* SECTION 3: EDITORIAL GAZETTE CALLOUT (ROSE WATERCOLOR EMULATION) */}
<section className="w-full bg-tertiary-fixed/20 py-space-xl relative overflow-hidden">
{/* Concentric Decorative Hairlines reminiscent of calligraphy flourishes */}
<div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-tertiary-fixed/40 blur-2xl pointer-events-none"></div>
<div className="absolute -left-24 -bottom-24 w-96 h-96 rounded-full bg-tertiary-fixed/40 blur-2xl pointer-events-none"></div>
<div className="max-w-4xl mx-auto px-margin-mobile lg:px-margin text-center relative z-10 space-y-space-xs">
{/* Monogram Stamp Accent Inspired by User Inspiration Image */}
<div className="w-20 h-20 mx-auto rounded-full bg-tertiary-fixed flex items-center justify-center shadow-sm relative">
<div className="w-16 h-16 rounded-full bg-paper-tint flex items-center justify-center">
<span className="font-display-hero text-headline-md text-primary italic select-none">T</span>
</div>
</div>
<span className="font-label-sm text-label-sm uppercase tracking-[0.24em] text-on-tertiary-container block font-semibold">
        Private Scribe Communiqué
      </span>
<h3 className="font-headline-lg text-headline-lg text-primary tracking-wide uppercase font-normal">
        Subscribe to The Atelier Journal Dispatches
      </h3>
<p className="font-body-md text-body-md text-secondary max-w-xl mx-auto leading-relaxed">
        Be the first to receive long-form essays on botanical inks, seasonal calligraphy masterclasses, and private access to our seasonal wedding stationery slots.
      </p>
<form className="max-w-md mx-auto pt-4 flex flex-col sm:flex-row gap-2" onSubmit={(e) => { e.preventDefault(); alert('Gratitude. You have been added to our private atelier ledger.'); }}>
<input className="flex-1 bg-surface-container-lowest px-4 py-3.5 font-body-sm text-body-sm text-primary placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary shadow-sm" placeholder="ENTER YOUR CORRESPONDENCE EMAIL" required="" type="email"/>
<button className="bg-primary text-on-primary font-label-md text-label-md uppercase tracking-[0.16em] px-7 py-3.5 hover:bg-tertiary-fixed hover:text-on-tertiary-fixed transition-colors shadow-sm" type="submit">
          Dispatch
        </button>
</form>
<div className="pt-2 flex items-center justify-center gap-4 text-secondary font-label-sm text-[11px] tracking-wider uppercase">
<span>No digital spam</span>
<span>•</span>
<span>Quarterly dispatches</span>
<span>•</span>
<span>Archival advice</span>
</div>
</div>
</section>
</div>
{/* Client-side Interactive Filter Script */}
</main>
        </>
    );
}
