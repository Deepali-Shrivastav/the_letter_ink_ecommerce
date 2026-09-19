"use client";

import Link from "next/link";

export function GiftingLandingClient() {
  return (
    <>
<div className="flex flex-col w-full">
{/*  Editorial Hero Section with Soft Blush Wash Backdrop  */}
<section className="relative w-full bg-paper-tint overflow-hidden">
<div className="max-w-[1440px] mx-auto px-margin-mobile lg:px-margin py-space-lg lg:py-space-xl">
<div className="flex flex-col lg:flex-row items-center gap-space-lg">
{/*  Left Column: Typography & Intentional Cadence  */}
<div className="w-full lg:w-7/12 flex flex-col items-start z-10">
<nav aria-label="Breadcrumb" className="mb-space-sm">
<ol className="flex items-center space-x-2">
<li className="">
<a className="font-label-sm text-label-sm uppercase text-secondary hover:text-primary transition-colors" href="#">Home</a>
</li>
<li className="text-secondary font-label-sm">/</li>
<li aria-current="page" className="font-label-sm text-label-sm uppercase text-primary font-semibold">Gifting</li>
</ol>
</nav>
<span className="inline-block bg-tertiary-fixed text-on-tertiary-fixed px-4 py-1 font-label-sm text-label-sm uppercase tracking-widest rounded-full mb-space-sm">
            Curated Gifting Atelier
          </span>
<h1 className="font-display-hero text-display-hero text-primary mb-space-sm tracking-wide">
            Artisanal Gifts for Every Milestone
          </h1>
<p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mb-space-md">
            Meaningful, hand-inscribed treasures crafted with timeless scripts, botanical wax seals, and heirloom framing designed to hold love across generations.
          </p>
<div className="flex flex-wrap items-center gap-space-xs">
<a className="bg-tertiary-fixed hover:bg-surface-container-lowest text-primary px-7 py-3.5 font-label-lg text-label-lg uppercase tracking-wider transition-colors inline-flex items-center gap-2" href="#gift-guide">
              Explore Gift Guide
              <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
</a>
<a className="bg-surface-container-lowest hover:bg-tertiary-fixed text-primary px-7 py-3.5 font-label-lg text-label-lg uppercase tracking-wider transition-colors inline-flex items-center gap-2" href="#corporate-consult">
              Corporate &amp; Bulk Gifting
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
</a>
</div>
{/*  Subtle Atelier Stat Strip  */}
<div className="grid grid-cols-3 gap-6 pt-space-lg mt-space-lg w-full max-w-lg">
<div>
<span className="font-display-hero-mobile text-display-hero-mobile text-primary block">100%</span>
<span className="font-label-sm text-label-sm uppercase text-secondary">Pure Cotton Paper</span>
</div>
<div>
<span className="font-display-hero-mobile text-display-hero-mobile text-primary block">48 hr</span>
<span className="font-label-sm text-label-sm uppercase text-secondary">Atelier Drafting</span>
</div>
<div>
<span className="font-display-hero-mobile text-display-hero-mobile text-primary block">24k</span>
<span className="font-label-sm text-label-sm uppercase text-secondary">Gold Foil Finishes</span>
</div>
</div>
</div>
{/*  Right Column: Tactile Visual Composition  */}
<div className="w-full lg:w-5/12 relative">
<div className="relative w-full aspect-[4/5] bg-surface-container-lowest overflow-hidden shadow-sm">
<img className="w-full h-full object-cover" data-alt="Editorial close-up of a handmade deckle edge cotton paper letter inscribed in fine Spencerian black ink calligraphy, sealed with a rose gold floral wax seal and paired with silk ribbon and dried wild eucalyptus sprigs on a soft linen atelier table." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBU1M2U6YRXPmpopy_4vY66woUD8yQ6EIKGnPAUpWJ0QYTzSANMzHSkUjyqExbxaYvrRrf5w8sfOlFWiIJMRzlmmsMfAc8DMXOmpLgi9dimvZ3jEmcXr06RRzKe6CicHvMxv3MEvLq5E0kwn6arSvEcXV6o_csnQTqWirojbkwi0Ey8VCRkjKyeYPyfpKR7si77AOOweGCygBffC6hHKwz2q2Y_hy-dgFTElkfZXdP5boS2k7MN-XM" />
<div className="absolute bottom-4 left-4 right-4 bg-surface-container-lowest/95 backdrop-blur-sm p-4 text-left">
<p className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">Signature Atelier Presentation</p>
<p className="font-headline-sm text-headline-sm text-primary">Deckle Parchment &amp; Custom Sealant</p>
</div>
</div>
{/*  Decorative Blush Plate  */}
<div className="hidden sm:block absolute -bottom-6 -right-6 w-44 h-44 bg-tertiary-fixed -z-10"></div>
</div>
</div>
</div>
</section>
{/*  Gifting by Occasion: 4 Rich Visual Cards  */}
<section className="w-full py-space-xl bg-background overflow-hidden" id="gift-guide">
<div className="max-w-[1440px] mx-auto px-margin-mobile lg:px-margin">
{/*  Section Header with Slider Controls  */}
<div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg gap-4">
<div>
<span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary block mb-1">ARTISANAL CURATIONS &amp; TRUNKS</span>
<h2 className="font-headline-lg text-headline-lg text-primary">Bespoke Keepsake Hampers</h2>
<p className="font-body-md text-body-md text-on-surface-variant max-w-xl mt-2">
Hand-assembled willow baskets, botanical wooden chests, and luxury trunks filled with hand-penned scrolls, wax seals, crystal, and confectionery treasures.
</p>
</div>
<div className="flex items-center gap-4 shrink-0">
<span className="font-label-md text-label-md uppercase tracking-wider text-secondary" id="hamper-counter">01 / 04</span>
<div className="flex items-center gap-2">
<button aria-label="Previous Hamper" className="w-10 h-10 rounded-full border border-secondary flex items-center justify-center text-primary hover:bg-tertiary-fixed hover:border-primary transition-colors cursor-pointer"  type="button">
<span className="material-symbols-outlined text-[20px]">west</span>
</button>
<button aria-label="Next Hamper" className="w-10 h-10 rounded-full border border-secondary flex items-center justify-center text-primary hover:bg-tertiary-fixed hover:border-primary transition-colors cursor-pointer"  type="button">
<span className="material-symbols-outlined text-[20px]">east</span>
</button>
</div>
</div>
</div>

{/*  Hamper Slider Cards Track  */}
<div className="flex gap-gutter overflow-x-auto pb-4 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none]" id="hamper-track">
{/*  Card 1  */}
<div className="min-w-[300px] sm:min-w-[340px] lg:min-w-[360px] max-w-[360px] bg-surface-container-lowest flex flex-col justify-between shadow-sm group shrink-0 border border-border-vellum">
<div className="relative aspect-[4/5] overflow-hidden bg-surface-container">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="The Sovereign Atelier Keepsake Trunk" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBU1M2U6YRXPmpopy_4vY66woUD8yQ6EIKGnPAUpWJ0QYTzSANMzHSkUjyqExbxaYvrRrf5w8sfOlFWiIJMRzlmmsMfAc8DMXOmpLgi9dimvZ3jEmcXr06RRzKe6CicHvMxv3MEvLq5E0kwn6arSvEcXV6o_csnQTqWirojbkwi0Ey8VCRkjKyeYPyfpKR7si77AOOweGCygBffC6hHKwz2q2Y_hy-dgFTElkfZXdP5boS2k7MN-XM" />
<span className="absolute top-4 left-4 bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 font-label-sm text-[11px] uppercase tracking-wider font-semibold">
BESTSELLER • SIGNATURE CURATION
</span>
</div>
<div className="p-space-sm flex flex-col flex-grow justify-between">
<div>
<div className="flex items-baseline justify-between gap-2 mb-2">
<h3 className="font-headline-sm text-headline-sm text-primary">The Sovereign Atelier Keepsake Trunk</h3>
<div className="text-right shrink-0">
<span className="font-headline-sm text-headline-sm text-primary font-medium block">₹3,800</span>
<span className="font-body-sm text-[12px] text-secondary line-through block">₹4,600</span>
</div>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">
Hand-woven blush wire hamper featuring custom dip-pen calligraphy, personalized wax seal, pure 24k gold leaf illumination, and bespoke botanical accents.
</p>
<div className="flex flex-wrap gap-1.5 mb-space-sm">
<span className="bg-surface-container-low px-2.5 py-1 font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">Custom Vow Scrolls</span>
<span className="bg-surface-container-low px-2.5 py-1 font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">Brass Seal Stamp</span>
<span className="bg-surface-container-low px-2.5 py-1 font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">French Lavender</span>
</div>
</div>
<div className="pt-space-xs border-t border-border-vellum">
<button className="w-full bg-tertiary-fixed hover:bg-primary hover:text-on-primary text-primary py-2.5 font-label-md text-label-md uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2" type="button">
VIEW HAMPER DETAILS
<span className="material-symbols-outlined text-[16px]">north_east</span>
</button>
</div>
</div>
</div>

{/*  Card 2  */}
<div className="min-w-[300px] sm:min-w-[340px] lg:min-w-[360px] max-w-[360px] bg-surface-container-lowest flex flex-col justify-between shadow-sm group shrink-0 border border-border-vellum">
<div className="relative aspect-[4/5] overflow-hidden bg-surface-container">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="The Bridal Epistolary Hamper" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmN0585oPlkvTnE6ZZgZ3E_mcmJxmoAl4Lm7gf4ch59NhAbsYEh5Grsnhj6aUmVxlNW92T23VKUhUqmnhndVDNgPL9G2IPS3XM5sWpJFOcMr-MxYD_GQ_3sKsjUxQL3mepkwfcm1RoKq-EGCVy2oIzYj265Ni9nf_gsCE78ntmqE8xgy4GSCThwSpkW94yQFORm7nnU5w4LrzR6YOrgSMz74y7rByMSAMf17NUbaODpkVfaXYr2yo" />
<span className="absolute top-4 left-4 bg-surface-container-lowest text-primary px-3 py-1 font-label-sm text-[11px] uppercase tracking-wider font-semibold">
BRIDAL &amp; TROUSSEAU
</span>
</div>
<div className="p-space-sm flex flex-col flex-grow justify-between">
<div>
<div className="flex items-baseline justify-between gap-2 mb-2">
<h3 className="font-headline-sm text-headline-sm text-primary">The Bridal Epistolary Hamper</h3>
<span className="font-headline-sm text-headline-sm text-primary font-medium shrink-0">₹4,200</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">
Delicate tulle-wrapped tiered gift hamper with hand-bound deckle vow books, his &amp; hers engraved champagne flutes, and hand-poured botanical sealing wax.
</p>
<div className="flex flex-wrap gap-1.5 mb-space-sm">
<span className="bg-surface-container-low px-2.5 py-1 font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">Pair of Flutes</span>
<span className="bg-surface-container-low px-2.5 py-1 font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">Silk Ribbon Suite</span>
<span className="bg-surface-container-low px-2.5 py-1 font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">Gold Mica Ink</span>
</div>
</div>
<div className="pt-space-xs border-t border-border-vellum">
<button className="w-full bg-tertiary-fixed hover:bg-primary hover:text-on-primary text-primary py-2.5 font-label-md text-label-md uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2" type="button">
VIEW HAMPER DETAILS
<span className="material-symbols-outlined text-[16px]">north_east</span>
</button>
</div>
</div>
</div>

{/*  Card 3  */}
<div className="min-w-[300px] sm:min-w-[340px] lg:min-w-[360px] max-w-[360px] bg-surface-container-lowest flex flex-col justify-between shadow-sm group shrink-0 border border-border-vellum">
<div className="relative aspect-[4/5] overflow-hidden bg-surface-container">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="Almond &amp; Gilded Scribe Chest" src="https://lh3.googleusercontent.com/aida-public/AB6AXuARitCH9kBoLcMfeQQ43dzjODtYzBXbDtF00v3EeYuwg9yXfJKMUEoTymO7NRYceq4eahaTo-XEHVdI57_KAnBk31_bOArVgHz6Kj5bWbWruJbqRtLopWIpKlS8-lRMkEKiCQFpNccJeq6Ev4O3FnuN2E4yh7FD_PvcovM7THYu3YGRYbWL6Qht71Yqq3RM0_y9jawbaFVdgFfuARedTkNAxbSqQvHTFgB3dq4y32SZwH8pauxq7lQ" />
<span className="absolute top-4 left-4 bg-surface-container-lowest text-primary px-3 py-1 font-label-sm text-[11px] uppercase tracking-wider font-semibold">
FESTIVE EDITION
</span>
</div>
<div className="p-space-sm flex flex-col flex-grow justify-between">
<div>
<div className="flex items-baseline justify-between gap-2 mb-2">
<h3 className="font-headline-sm text-headline-sm text-primary">Almond &amp; Gilded Scribe Chest</h3>
<span className="font-headline-sm text-headline-sm text-primary font-medium shrink-0">₹2,400</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">
Hexagonal presentation trunk with artisanal confectionery tin, turned dip-pen, brass melting ladle, imported flex nibs, and gold illuminated greeting.
</p>
<div className="flex flex-wrap gap-1.5 mb-space-sm">
<span className="bg-surface-container-low px-2.5 py-1 font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">Artisanal Confectionery</span>
<span className="bg-surface-container-low px-2.5 py-1 font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">Dip Pen &amp; Nibs</span>
<span className="bg-surface-container-low px-2.5 py-1 font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">Sealing Beads</span>
</div>
</div>
<div className="pt-space-xs border-t border-border-vellum">
<button className="w-full bg-tertiary-fixed hover:bg-primary hover:text-on-primary text-primary py-2.5 font-label-md text-label-md uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2" type="button">
VIEW HAMPER DETAILS
<span className="material-symbols-outlined text-[16px]">north_east</span>
</button>
</div>
</div>
</div>

{/*  Card 4  */}
<div className="min-w-[300px] sm:min-w-[340px] lg:min-w-[360px] max-w-[360px] bg-surface-container-lowest flex flex-col justify-between shadow-sm group shrink-0 border border-border-vellum">
<div className="relative aspect-[4/5] overflow-hidden bg-surface-container">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="The Grand Scribe Desk Valet" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRXdxOcOZPhzCFrSVx-PRPSJbsERWjmdC7x4dLe4yS6NJnIcmcsRKg_9Hk7gx9OMz2yG0NkUpymyDRsvlA1Z355GpqR2d_ZqLfizIhNvwNrCt4Cd2_Vm28Vsd5Fd8GqODZ5STK4ZqDg5zV_D4F5X22lxXGCidHLAce35hMycTbleZ8mXfWUM9QioYep8qD1GIKS0syuj_utCLjz92ATxIuK9G0oLWpvVOYq_weUh_EzirnP91MFig" />
<span className="absolute top-4 left-4 bg-surface-container-lowest text-primary px-3 py-1 font-label-sm text-[11px] uppercase tracking-wider font-semibold">
EXECUTIVE PRESTIGE
</span>
</div>
<div className="p-space-sm flex flex-col flex-grow justify-between">
<div>
<div className="flex items-baseline justify-between gap-2 mb-2">
<h3 className="font-headline-sm text-headline-sm text-primary">The Grand Scribe Desk Valet</h3>
<span className="font-headline-sm text-headline-sm text-primary font-medium shrink-0">₹5,200</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">
Italian leather desk blotter, custom carved marble paperweight, monogrammed wax seal kit, and archival correspondence note cards in keepsake oak box.
</p>
<div className="flex flex-wrap gap-1.5 mb-space-sm">
<span className="bg-surface-container-low px-2.5 py-1 font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">Oak Presentation Box</span>
<span className="bg-surface-container-low px-2.5 py-1 font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">Engraved Stamp</span>
<span className="bg-surface-container-low px-2.5 py-1 font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">Archival Cards</span>
</div>
</div>
<div className="pt-space-xs border-t border-border-vellum">
<button className="w-full bg-tertiary-fixed hover:bg-primary hover:text-on-primary text-primary py-2.5 font-label-md text-label-md uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2" type="button">
VIEW HAMPER DETAILS
<span className="material-symbols-outlined text-[16px]">north_east</span>
</button>
</div>
</div>
</div>
</div>

{/*  Bottom Controls & Callout Bar  */}
<div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-space-md pt-space-sm border-t border-border-vellum">
<div className="flex items-center gap-2">
<span className="w-8 h-1 bg-primary"></span>
<span className="w-4 h-1 bg-surface-container-highest"></span>
<span className="w-4 h-1 bg-surface-container-highest"></span>
<span className="w-4 h-1 bg-surface-container-highest"></span>
<span className="font-label-sm text-label-sm text-secondary ml-2">Swipe or use arrows to view all trunks</span>
</div>
<a className="bg-surface-container-lowest hover:bg-tertiary-fixed text-primary px-6 py-3 font-label-lg text-label-lg uppercase tracking-wider transition-colors inline-flex items-center gap-2 border border-border-vellum" href="#concierge">
BUILD BESPOKE HAMPER
<span className="material-symbols-outlined text-[18px]">arrow_forward</span>
</a>
</div>
</div>
</section>{/*  Curated By Occasion Grid Section  */}
<section className="w-full py-space-xl bg-paper-tint border-t border-border-vellum" id="curated-occasions">
  <div className="max-w-[1440px] mx-auto px-margin-mobile lg:px-margin">
    {/*  Top Section Header matching sketch header 'Occasion'  */}
    <div className="mb-space-lg text-left">
      <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary block mb-1">Bespoke Curations by Celebration</span>
      <h2 className="font-display-hero text-headline-lg lg:text-display-hero text-primary tracking-wide">Occasion</h2>
      <div className="w-20 h-[1px] bg-primary mt-2"></div>
    </div>

    <div className="flex flex-col gap-space-xl">
      {/*  Row 1: Wedding  */}
      <div className="flex flex-col">
        <div className="flex items-baseline justify-between mb-space-sm border-b border-border-vellum pb-2">
          <div className="flex items-center gap-3">
            <h3 className="font-headline-lg text-headline-lg text-primary tracking-wide">Wedding</h3>
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest hidden sm:inline-block">(Weddings &amp; Vows Suite)</span>
          </div>
          <a className="font-label-sm text-label-sm uppercase text-primary hover:text-secondary inline-flex items-center gap-1 tracking-wider transition-colors" href="#">
            View All Wedding Curations
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </a>
        </div>

        {/*  4 Grid Cards  */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {/*  Wedding Card 1  */}
          <div className="bg-surface-container-lowest border border-border-vellum shadow-sm flex flex-col justify-between group hover:border-primary transition-colors">
            <div>
              <div className="relative aspect-square overflow-hidden bg-surface-container">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Bespoke Wedding Vow Suite" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbPwrH7ohCeXQTtAq-sj-6R6uSkr52oj1nFDzx6qHLjw1_AMB9-0_80GWIhI9OE_z4SHuDsjoShKFXLbyM9cMAqaJCg0h2JADi1OtbdEjK0eJ575-HQUJyzoMwZ0epStHBqOFN3VB6TudYujHdQb-b3GPqCCdwNlYtBS0q3QG6CUps39Za8_BVJoJJtWj1EPNJE8uMWOow8sc1Ss2TzrqVNCXNAVzXcSKiXE0RylVoyYqj4J5ztts" />
                <span className="absolute top-3 left-3 bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-[11px] uppercase tracking-wider px-2 py-0.5">Atelier Classic</span>
              </div>
              <div className="p-4">
                <h4 className="font-headline-sm text-[18px] text-primary mb-1">Bespoke Wedding Vow Suite</h4>
                <p className="font-body-sm text-[13px] text-on-surface-variant line-clamp-2 mb-3">Hand-lettered vow scrolls on deckle-edge cotton rag paper with gold wax crest.</p>
                <span className="font-headline-sm text-[18px] text-primary font-medium block">₹3,950</span>
              </div>
            </div>
            <div className="p-4 pt-0">
              <button className="w-full bg-tertiary-fixed hover:bg-primary hover:text-on-primary text-primary py-2 font-label-md text-[12px] uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-1.5" type="button">
                Order Online
                <span className="material-symbols-outlined text-[14px]">north_east</span>
              </button>
            </div>
          </div>

          {/*  Wedding Card 2  */}
          <div className="bg-surface-container-lowest border border-border-vellum shadow-sm flex flex-col justify-between group hover:border-primary transition-colors">
            <div>
              <div className="relative aspect-square overflow-hidden bg-surface-container">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Luxury Wedding Flutes Suite" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmN0585oPlkvTnE6ZZgZ3E_mcmJxmoAl4Lm7gf4ch59NhAbsYEh5Grsnhj6aUmVxlNW92T23VKUhUqmnhndVDNgPL9G2IPS3XM5sWpJFOcMr-MxYD_GQ_3sKsjUxQL3mepkwfcm1RoKq-EGCVy2oIzYj265Ni9nf_gsCE78ntmqE8xgy4GSCThwSpkW94yQFORm7nnU5w4LrzR6YOrgSMz74y7rByMSAMf17NUbaODpkVfaXYr2yo" />
                <span className="absolute top-3 left-3 bg-surface-container-lowest text-primary font-label-sm text-[11px] uppercase tracking-wider px-2 py-0.5 border border-border-vellum">Bridal Favorite</span>
              </div>
              <div className="p-4">
                <h4 className="font-headline-sm text-[18px] text-primary mb-1">Luxury Wedding Flutes</h4>
                <p className="font-body-sm text-[13px] text-on-surface-variant line-clamp-2 mb-3">Hand-engraved his &amp; hers crystal stemware paired with botanical silk wraps.</p>
                <span className="font-headline-sm text-[18px] text-primary font-medium block">₹2,800</span>
              </div>
            </div>
            <div className="p-4 pt-0">
              <button className="w-full bg-tertiary-fixed hover:bg-primary hover:text-on-primary text-primary py-2 font-label-md text-[12px] uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-1.5" type="button">
                Customize
                <span className="material-symbols-outlined text-[14px]">tune</span>
              </button>
            </div>
          </div>

          {/*  Wedding Card 3  */}
          <div className="bg-surface-container-lowest border border-border-vellum shadow-sm flex flex-col justify-between group hover:border-primary transition-colors">
            <div>
              <div className="relative aspect-square overflow-hidden bg-surface-container">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Monogram Glass Keepsake Box" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBU1M2U6YRXPmpopy_4vY66woUD8yQ6EIKGnPAUpWJ0QYTzSANMzHSkUjyqExbxaYvrRrf5w8sfOlFWiIJMRzlmmsMfAc8DMXOmpLgi9dimvZ3jEmcXr06RRzKe6CicHvMxv3MEvLq5E0kwn6arSvEcXV6o_csnQTqWirojbkwi0Ey8VCRkjKyeYPyfpKR7si77AOOweGCygBffC6hHKwz2q2Y_hy-dgFTElkfZXdP5boS2k7MN-XM" />
              </div>
              <div className="p-4">
                <h4 className="font-headline-sm text-[18px] text-primary mb-1">Monogram Glass Keepsake Box</h4>
                <p className="font-body-sm text-[13px] text-on-surface-variant line-clamp-2 mb-3">Brass-edged vintage vitrine with gold calligraphy monogram and velvet lining.</p>
                <span className="font-headline-sm text-[18px] text-primary font-medium block">₹3,450</span>
              </div>
            </div>
            <div className="p-4 pt-0">
              <button className="w-full bg-tertiary-fixed hover:bg-primary hover:text-on-primary text-primary py-2 font-label-md text-[12px] uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-1.5" type="button">
                Order Online
                <span className="material-symbols-outlined text-[14px]">north_east</span>
              </button>
            </div>
          </div>

          {/*  Wedding Card 4  */}
          <div className="bg-surface-container-lowest border border-border-vellum shadow-sm flex flex-col justify-between group hover:border-primary transition-colors">
            <div>
              <div className="relative aspect-square overflow-hidden bg-surface-container">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="His &amp; Hers Keepsake Trunk" src="https://lh3.googleusercontent.com/aida-public/AB6AXuARitCH9kBoLcMfeQQ43dzjODtYzBXbDtF00v3EeYuwg9yXfJKMUEoTymO7NRYceq4eahaTo-XEHVdI57_KAnBk31_bOArVgHz6Kj5bWbWruJbqRtLopWIpKlS8-lRMkEKiCQFpNccJeq6Ev4O3FnuN2E4yh7FD_PvcovM7THYu3YGRYbWL6Qht71Yqq3RM0_y9jawbaFVdgFfuARedTkNAxbSqQvHTFgB3dq4y32SZwH8pauxq7lQ" />
              </div>
              <div className="p-4">
                <h4 className="font-headline-sm text-[18px] text-primary mb-1">His &amp; Hers Keepsake Trunk</h4>
                <p className="font-body-sm text-[13px] text-on-surface-variant line-clamp-2 mb-3">Trousseau wooden chest with personalized seals, leather journals, and gold ink.</p>
                <span className="font-headline-sm text-[18px] text-primary font-medium block">₹4,600</span>
              </div>
            </div>
            <div className="p-4 pt-0">
              <button className="w-full bg-tertiary-fixed hover:bg-primary hover:text-on-primary text-primary py-2 font-label-md text-[12px] uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-1.5" type="button">
                Order Online
                <span className="material-symbols-outlined text-[14px]">north_east</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/*  Row 2: Anniversary  */}
      <div className="flex flex-col">
        <div className="flex items-baseline justify-between mb-space-sm border-b border-border-vellum pb-2">
          <div className="flex items-center gap-3">
            <h3 className="font-headline-lg text-headline-lg text-primary tracking-wide">Anniversary</h3>
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest hidden sm:inline-block">(Anniversaries &amp; Romance Suite)</span>
          </div>
          <a className="font-label-sm text-label-sm uppercase text-primary hover:text-secondary inline-flex items-center gap-1 tracking-wider transition-colors" href="#">
            View All Anniversary Curations
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </a>
        </div>

        {/*  4 Grid Cards  */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {/*  Anniversary Card 1  */}
          <div className="bg-surface-container-lowest border border-border-vellum shadow-sm flex flex-col justify-between group hover:border-primary transition-colors">
            <div>
              <div className="relative aspect-square overflow-hidden bg-surface-container">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Personalized Handwritten Scroll" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBU1M2U6YRXPmpopy_4vY66woUD8yQ6EIKGnPAUpWJ0QYTzSANMzHSkUjyqExbxaYvrRrf5w8sfOlFWiIJMRzlmmsMfAc8DMXOmpLgi9dimvZ3jEmcXr06RRzKe6CicHvMxv3MEvLq5E0kwn6arSvEcXV6o_csnQTqWirojbkwi0Ey8VCRkjKyeYPyfpKR7si77AOOweGCygBffC6hHKwz2q2Y_hy-dgFTElkfZXdP5boS2k7MN-XM" />
                <span className="absolute top-3 left-3 bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-[11px] uppercase tracking-wider px-2 py-0.5">Bestseller</span>
              </div>
              <div className="p-4">
                <h4 className="font-headline-sm text-[18px] text-primary mb-1">Personalized Handwritten Scroll</h4>
                <p className="font-body-sm text-[13px] text-on-surface-variant line-clamp-2 mb-3">Spencerian script poetry or love letter on hand-distressed 150 GSM cotton rag.</p>
                <span className="font-headline-sm text-[18px] text-primary font-medium block">₹2,950</span>
              </div>
            </div>
            <div className="p-4 pt-0">
              <button className="w-full bg-tertiary-fixed hover:bg-primary hover:text-on-primary text-primary py-2 font-label-md text-[12px] uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-1.5" type="button">
                Order Online
                <span className="material-symbols-outlined text-[14px]">north_east</span>
              </button>
            </div>
          </div>

          {/*  Anniversary Card 2  */}
          <div className="bg-surface-container-lowest border border-border-vellum shadow-sm flex flex-col justify-between group hover:border-primary transition-colors">
            <div>
              <div className="relative aspect-square overflow-hidden bg-surface-container">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Romance Monogram Wax Seal Kit" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZabnPI_5wzJDPgcHI4JJQ5yK5Hf0Y0NQTVLakCSVZr9CMT37qgbRAtnXMe0x0ZzE49YCsglc5cKMwzCBhijQ17I85aqakqfqJIPqghYu7PQaAnOKfvF3pfd45XHF0lvaWMcOZX-EqvXvtHnKYUPfbjeu6h7_-YYXbM3rAir9cd0vgmuP7bsJApp0Jc1a1SpS8BiiayJ4_tdf0ftvypqh5q93PzjmVnU2lPOfJ8cX7QFv3p_htW2I" />
              </div>
              <div className="p-4">
                <h4 className="font-headline-sm text-[18px] text-primary mb-1">Romance Wax Seal Stamper Kit</h4>
                <p className="font-body-sm text-[13px] text-on-surface-variant line-clamp-2 mb-3">Solid brass seal stamper with couple's initials, rose gold wax beads, and spoon.</p>
                <span className="font-headline-sm text-[18px] text-primary font-medium block">₹2,200</span>
              </div>
            </div>
            <div className="p-4 pt-0">
              <button className="w-full bg-tertiary-fixed hover:bg-primary hover:text-on-primary text-primary py-2 font-label-md text-[12px] uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-1.5" type="button">
                Customize
                <span className="material-symbols-outlined text-[14px]">tune</span>
              </button>
            </div>
          </div>

          {/*  Anniversary Card 3  */}
          <div className="bg-surface-container-lowest border border-border-vellum shadow-sm flex flex-col justify-between group hover:border-primary transition-colors">
            <div>
              <div className="relative aspect-square overflow-hidden bg-surface-container">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Antiqued Wooden Slide Box" src="https://lh3.googleusercontent.com/aida-public/AB6AXuARitCH9kBoLcMfeQQ43dzjODtYzBXbDtF00v3EeYuwg9yXfJKMUEoTymO7NRYceq4eahaTo-XEHVdI57_KAnBk31_bOArVgHz6Kj5bWbWruJbqRtLopWIpKlS8-lRMkEKiCQFpNccJeq6Ev4O3FnuN2E4yh7FD_PvcovM7THYu3YGRYbWL6Qht71Yqq3RM0_y9jawbaFVdgFfuARedTkNAxbSqQvHTFgB3dq4y32SZwH8pauxq7lQ" />
              </div>
              <div className="p-4">
                <h4 className="font-headline-sm text-[18px] text-primary mb-1">Antiqued Wooden Slide Box</h4>
                <p className="font-body-sm text-[13px] text-on-surface-variant line-clamp-2 mb-3">Handmade pine slide case holding archival notes, dried blooms, and seal tokens.</p>
                <span className="font-headline-sm text-[18px] text-primary font-medium block">₹3,150</span>
              </div>
            </div>
            <div className="p-4 pt-0">
              <button className="w-full bg-tertiary-fixed hover:bg-primary hover:text-on-primary text-primary py-2 font-label-md text-[12px] uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-1.5" type="button">
                Order Online
                <span className="material-symbols-outlined text-[14px]">north_east</span>
              </button>
            </div>
          </div>

          {/*  Anniversary Card 4  */}
          <div className="bg-surface-container-lowest border border-border-vellum shadow-sm flex flex-col justify-between group hover:border-primary transition-colors">
            <div>
              <div className="relative aspect-square overflow-hidden bg-surface-container">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Gilded Memory Folio" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRXdxOcOZPhzCFrSVx-PRPSJbsERWjmdC7x4dLe4yS6NJnIcmcsRKg_9Hk7gx9OMz2yG0NkUpymyDRsvlA1Z355GpqR2d_ZqLfizIhNvwNrCt4Cd2_Vm28Vsd5Fd8GqODZ5STK4ZqDg5zV_D4F5X22lxXGCidHLAce35hMycTbleZ8mXfWUM9QioYep8qD1GIKS0syuj_utCLjz92ATxIuK9G0oLWpvVOYq_weUh_EzirnP91MFig" />
              </div>
              <div className="p-4">
                <h4 className="font-headline-sm text-[18px] text-primary mb-1">Gilded Memory Folio</h4>
                <p className="font-body-sm text-[13px] text-on-surface-variant line-clamp-2 mb-3">Accordion linen folio album tipped in 24k gold leaf calligraphy and photo mounts.</p>
                <span className="font-headline-sm text-[18px] text-primary font-medium block">₹3,800</span>
              </div>
            </div>
            <div className="p-4 pt-0">
              <button className="w-full bg-tertiary-fixed hover:bg-primary hover:text-on-primary text-primary py-2 font-label-md text-[12px] uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-1.5" type="button">
                Order Online
                <span className="material-symbols-outlined text-[14px]">north_east</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/*  Row 3: Birthday  */}
      <div className="flex flex-col">
        <div className="flex items-baseline justify-between mb-space-sm border-b border-border-vellum pb-2">
          <div className="flex items-center gap-3">
            <h3 className="font-headline-lg text-headline-lg text-primary tracking-wide">Birthday</h3>
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest hidden sm:inline-block">(Milestone Celebrations Suite)</span>
          </div>
          <a className="font-label-sm text-label-sm uppercase text-primary hover:text-secondary inline-flex items-center gap-1 tracking-wider transition-colors" href="#">
            View All Birthday Curations
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </a>
        </div>

        {/*  4 Grid Cards  */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {/*  Birthday Card 1  */}
          <div className="bg-surface-container-lowest border border-border-vellum shadow-sm flex flex-col justify-between group hover:border-primary transition-colors">
            <div>
              <div className="relative aspect-square overflow-hidden bg-surface-container">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Name Frame Royal Large" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBU1M2U6YRXPmpopy_4vY66woUD8yQ6EIKGnPAUpWJ0QYTzSANMzHSkUjyqExbxaYvrRrf5w8sfOlFWiIJMRzlmmsMfAc8DMXOmpLgi9dimvZ3jEmcXr06RRzKe6CicHvMxv3MEvLq5E0kwn6arSvEcXV6o_csnQTqWirojbkwi0Ey8VCRkjKyeYPyfpKR7si77AOOweGCygBffC6hHKwz2q2Y_hy-dgFTElkfZXdP5boS2k7MN-XM" />
                <span className="absolute top-3 left-3 bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-[11px] uppercase tracking-wider px-2 py-0.5">Custom Milestone</span>
              </div>
              <div className="p-4">
                <h4 className="font-headline-sm text-[18px] text-primary mb-1">Name Frame Royal (Large)</h4>
                <p className="font-body-sm text-[13px] text-on-surface-variant line-clamp-2 mb-3">Hand-illuminated calligraphic name crest with gold-leaf filigree in solid teak frame.</p>
                <span className="font-headline-sm text-[18px] text-primary font-medium block">₹3,600</span>
              </div>
            </div>
            <div className="p-4 pt-0">
              <button className="w-full bg-tertiary-fixed hover:bg-primary hover:text-on-primary text-primary py-2 font-label-md text-[12px] uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-1.5" type="button">
                Customize
                <span className="material-symbols-outlined text-[14px]">tune</span>
              </button>
            </div>
          </div>

          {/*  Birthday Card 2  */}
          <div className="bg-surface-container-lowest border border-border-vellum shadow-sm flex flex-col justify-between group hover:border-primary transition-colors">
            <div>
              <div className="relative aspect-square overflow-hidden bg-surface-container">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Name Frame Classic Small" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZabnPI_5wzJDPgcHI4JJQ5yK5Hf0Y0NQTVLakCSVZr9CMT37qgbRAtnXMe0x0ZzE49YCsglc5cKMwzCBhijQ17I85aqakqfqJIPqghYu7PQaAnOKfvF3pfd45XHF0lvaWMcOZX-EqvXvtHnKYUPfbjeu6h7_-YYXbM3rAir9cd0vgmuP7bsJApp0Jc1a1SpS8BiiayJ4_tdf0ftvypqh5q93PzjmVnU2lPOfJ8cX7QFv3p_htW2I" />
              </div>
              <div className="p-4">
                <h4 className="font-headline-sm text-[18px] text-primary mb-1">Name Frame Classic (Small)</h4>
                <p className="font-body-sm text-[13px] text-on-surface-variant line-clamp-2 mb-3">Delicate brass desktop floating frame with hand-penned birthday blessing scroll.</p>
                <span className="font-headline-sm text-[18px] text-primary font-medium block">₹1,850</span>
              </div>
            </div>
            <div className="p-4 pt-0">
              <button className="w-full bg-tertiary-fixed hover:bg-primary hover:text-on-primary text-primary py-2 font-label-md text-[12px] uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-1.5" type="button">
                Order Online
                <span className="material-symbols-outlined text-[14px]">north_east</span>
              </button>
            </div>
          </div>

          {/*  Birthday Card 3  */}
          <div className="bg-surface-container-lowest border border-border-vellum shadow-sm flex flex-col justify-between group hover:border-primary transition-colors">
            <div>
              <div className="relative aspect-square overflow-hidden bg-surface-container">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Artisanal Confectionery Trunk" src="https://lh3.googleusercontent.com/aida-public/AB6AXuARitCH9kBoLcMfeQQ43dzjODtYzBXbDtF00v3EeYuwg9yXfJKMUEoTymO7NRYceq4eahaTo-XEHVdI57_KAnBk31_bOArVgHz6Kj5bWbWruJbqRtLopWIpKlS8-lRMkEKiCQFpNccJeq6Ev4O3FnuN2E4yh7FD_PvcovM7THYu3YGRYbWL6Qht71Yqq3RM0_y9jawbaFVdgFfuARedTkNAxbSqQvHTFgB3dq4y32SZwH8pauxq7lQ" />
              </div>
              <div className="p-4">
                <h4 className="font-headline-sm text-[18px] text-primary mb-1">Artisanal Confectionery Trunk</h4>
                <p className="font-body-sm text-[13px] text-on-surface-variant line-clamp-2 mb-3">Hexagonal trunk with roasted almonds, chocolate pralines, and celebration scroll.</p>
                <span className="font-headline-sm text-[18px] text-primary font-medium block">₹2,400</span>
              </div>
            </div>
            <div className="p-4 pt-0">
              <button className="w-full bg-tertiary-fixed hover:bg-primary hover:text-on-primary text-primary py-2 font-label-md text-[12px] uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-1.5" type="button">
                Order Online
                <span className="material-symbols-outlined text-[14px]">north_east</span>
              </button>
            </div>
          </div>

          {/*  Birthday Card 4  */}
          <div className="bg-surface-container-lowest border border-border-vellum shadow-sm flex flex-col justify-between group hover:border-primary transition-colors">
            <div>
              <div className="relative aspect-square overflow-hidden bg-surface-container">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Executive Scribe Valet" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRXdxOcOZPhzCFrSVx-PRPSJbsERWjmdC7x4dLe4yS6NJnIcmcsRKg_9Hk7gx9OMz2yG0NkUpymyDRsvlA1Z355GpqR2d_ZqLfizIhNvwNrCt4Cd2_Vm28Vsd5Fd8GqODZ5STK4ZqDg5zV_D4F5X22lxXGCidHLAce35hMycTbleZ8mXfWUM9QioYep8qD1GIKS0syuj_utCLjz92ATxIuK9G0oLWpvVOYq_weUh_EzirnP91MFig" />
              </div>
              <div className="p-4">
                <h4 className="font-headline-sm text-[18px] text-primary mb-1">Executive Scribe Valet</h4>
                <p className="font-body-sm text-[13px] text-on-surface-variant line-clamp-2 mb-3">Italian leather desk journal, turned walnut brass dip pen, and custom ink well.</p>
                <span className="font-headline-sm text-[18px] text-primary font-medium block">₹4,800</span>
              </div>
            </div>
            <div className="p-4 pt-0">
              <button className="w-full bg-tertiary-fixed hover:bg-primary hover:text-on-primary text-primary py-2 font-label-md text-[12px] uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-1.5" type="button">
                Order Online
                <span className="material-symbols-outlined text-[14px]">north_east</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
{/*  Interactive Gifting Concierge: 3-Step Bespoke Customizer  */}

{/*  Best-Selling Gifting Sets (Grid of Curated Bundles)  */}

{/*  Corporate & Bulk Orders Consultation Banner  */}
<section className="w-full py-space-xl bg-paper-tint" id="corporate-consult">
<div className="max-w-[1440px] mx-auto px-margin-mobile lg:px-margin">
<div className="bg-surface-container-lowest p-8 sm:p-12 lg:p-16 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-space-lg">
<div className="w-full lg:w-7/12">
<span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary block mb-2">Corporate &amp; Large Gatherings</span>
<h2 className="font-headline-lg text-headline-lg text-primary mb-space-xs">Prestige Brand Gifting &amp; Bulk Suites</h2>
<p className="font-body-md text-body-md text-on-surface-variant max-w-xl mb-space-md">
            Elevate luxury brand activations, gala dinner place cards, VIP client holiday hampers, and partner appreciation with authentic dip-pen craftsmanship. We handle volume orders from 25 to 2,500+ customized pieces with seamless project coordination.
          </p>
<div className="flex flex-wrap gap-4">
<a className="bg-tertiary-fixed hover:bg-primary hover:text-on-primary text-primary px-6 py-3 font-label-lg text-label-lg uppercase tracking-wider transition-colors inline-flex items-center gap-2" href="#">
<span className="material-symbols-outlined text-[18px]">download</span>
              Download 2025 Gifting Lookbook
            </a>
<button className="bg-surface-container-low hover:bg-surface-container-highest text-primary px-6 py-3 font-label-lg text-label-lg uppercase tracking-wider transition-colors inline-flex items-center gap-2"  type="button">
<span className="material-symbols-outlined text-[18px]">calendar_month</span>
              Book Gifting Concierge
            </button>
</div>
</div>
<div className="w-full lg:w-5/12 bg-paper-tint p-6">
<h3 className="font-label-md text-label-md uppercase text-primary tracking-widest mb-4">Direct Atelier Inquiries</h3>
<form className="space-y-3" >
<div>
<label className="font-label-sm text-label-sm uppercase text-secondary block mb-1">Company / Host Name</label>
<input className="w-full bg-surface-container-lowest p-2.5 font-body-sm text-body-sm text-on-surface border border-secondary focus:outline-none focus:border-primary" placeholder="Acme Luxury or Couple Names" required type="text" />
</div>
<div>
<label className="font-label-sm text-label-sm uppercase text-secondary block mb-1">Work Email or WhatsApp</label>
<input className="w-full bg-surface-container-lowest p-2.5 font-body-sm text-body-sm text-on-surface border border-secondary focus:outline-none focus:border-primary" placeholder="client@luxurybrand.com" required type="email" />
</div>
<div className="grid grid-cols-2 gap-3">
<div>
<label className="font-label-sm text-label-sm uppercase text-secondary block mb-1">Estimated Units</label>
<select className="w-full bg-surface-container-lowest p-2.5 font-body-sm text-body-sm text-on-surface border border-secondary">
<option>10 – 50 pieces</option>
<option>50 – 200 pieces</option>
<option>200 – 1000+ pieces</option>
</select>
</div>
<div>
<label className="font-label-sm text-label-sm uppercase text-secondary block mb-1">Target Date</label>
<input className="w-full bg-surface-container-lowest p-2.5 font-body-sm text-body-sm text-on-surface border border-secondary focus:outline-none focus:border-primary" type="date" />
</div>
</div>
<button className="w-full bg-primary text-on-primary py-3 font-label-md text-label-md uppercase tracking-wider hover:bg-tertiary-fixed hover:text-primary transition-colors mt-2" type="submit">
              Submit Corporate Brief
            </button>
</form>
</div>
</div>
</div>
</section>
{/*  Client Testimonial Quotes from Gift Recipients  */}
<section className="w-full py-space-xl bg-background">
<div className="max-w-[1440px] mx-auto px-margin-mobile lg:px-margin">
<div className="text-center max-w-xl mx-auto mb-space-lg">
<span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary block mb-1">Recipient Words</span>
<h2 className="font-headline-lg text-headline-lg text-primary">Echoes of Delight</h2>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
{/*  Quote 1  */}
<div className="bg-paper-tint p-8 flex flex-col justify-between shadow-sm relative">
<span className="material-symbols-outlined text-[36px] text-tertiary-fixed-dim select-none">format_quote</span>
<blockquote className="font-headline-sm text-headline-sm text-primary my-4 italic">
            “My husband presented our wedding vows inscribed on cotton deckle paper for our first anniversary. Unrolling that scroll brought every tear back. The wax seal is pure poetry.”
          </blockquote>
<div className="border-t border-border-vellum pt-4">
<p className="font-label-md text-label-md uppercase text-primary">Ananya &amp; Rohan Mehta</p>
<p className="font-body-sm text-body-sm text-secondary">1st Anniversary Heirloom Box, Mumbai</p>
</div>
</div>
{/*  Quote 2  */}
<div className="bg-paper-tint p-8 flex flex-col justify-between shadow-sm relative">
<span className="material-symbols-outlined text-[36px] text-tertiary-fixed-dim select-none">format_quote</span>
<blockquote className="font-headline-sm text-headline-sm text-primary my-4 italic">
            “We ordered 120 personalized lettered gift boxes for our executive retreat in Udaipur. The attendees were mesmerized by having their personal monograms hand-pressed into stone.”
          </blockquote>
<div className="border-t border-border-vellum pt-4">
<p className="font-label-md text-label-md uppercase text-primary">Vikram Singhania</p>
<p className="font-body-sm text-body-sm text-secondary">Director of Brand Experience, Singhania Capital</p>
</div>
</div>
{/*  Quote 3  */}
<div className="bg-paper-tint p-8 flex flex-col justify-between shadow-sm relative">
<span className="material-symbols-outlined text-[36px] text-tertiary-fixed-dim select-none">format_quote</span>
<blockquote className="font-headline-sm text-headline-sm text-primary my-4 italic">
            “The Spencerian family tree frame was the centerpiece of my mother’s 70th birthday. The golden ink flourishes and delicate preservation glass made it a genuine museum piece.”
          </blockquote>
<div className="border-t border-border-vellum pt-4">
<p className="font-label-md text-label-md uppercase text-primary">Devika Chawla</p>
<p className="font-body-sm text-body-sm text-secondary">Family Lineage Commission, Delhi</p>
</div>
</div>
</div>
</div>
</section>
{/*  Interactive Customizer Script Logic  */}

</div>
    </>
  );
}
