"use client";

import Link from "next/link";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";

export function GiftingPageClient() {
  const [priceRange, setPriceRange] = useState([100, 5500]);
  
  return (
    <>
      <div className="flex flex-col w-full">
        {/*  Atelier Breadcrumb & Intro Header Block  */}
        <section className="w-full bg-paper-tint pt-space-md pb-space-lg px-margin-mobile lg:px-margin">
          <div className="max-w-[1440px] mx-auto">
            {/*  Breadcrumbs  */}
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 mb-space-sm"
            >
              <a
                className="font-label-sm text-label-sm uppercase text-secondary hover:text-primary transition-colors tracking-widest"
                href="#"
              >
                Home
              </a>
              <span className="text-outline text-xs font-serif">/</span>
              <a
                className="font-label-sm text-label-sm uppercase text-secondary hover:text-primary transition-colors tracking-widest"
                href="#"
              >
                Products
              </a>
              <span className="text-outline text-xs font-serif">/</span>
              <span className="font-label-sm text-label-sm uppercase text-primary font-semibold tracking-widest">
                Gifting
              </span>
            </nav>
            {/*  Centered Gifting Editorial Header  */}
            <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
              <span className="font-label-sm text-label-sm uppercase tracking-[0.25em] text-on-tertiary-container mb-2">
                Curated Artisanal Offerings
              </span>
              <h1 className="font-headline-lg text-headline-lg lg:text-[44px] lg:leading-[52px] uppercase text-primary tracking-[0.14em]">
                Gifting
              </h1>
              {/*  Ornamental atelier fleuron / divider dots  */}
              <div
                aria-hidden="true"
                className="flex items-center justify-center gap-2.5 my-space-xs text-tertiary-fixed-dim"
              >
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-tertiary-fixed-dim"></span>
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-primary"></span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-tertiary-fixed-dim"></span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl leading-relaxed mt-1">
                Your search for the perfect gift ends here! Choose from our
                range of hand-inscribed hampers, keepsake boxes, bespoke
                lettered frames &amp; gift bags, each of them a carefully
                curated assortment of our bestsellers.
              </p>
            </div>
          </div>
        </section>
        {/*  Main Catalog Area: Sidebar Filters & Catalog Grid  */}
        <section className="w-full bg-background py-space-md lg:py-space-lg px-margin-mobile lg:px-margin">
          <div className="max-w-[1440px] mx-auto">
            {/*  Catalog Control Toolbar  */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-space-sm mb-space-md bg-surface-container-lowest p-4 lg:px-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-[20px]">
                  auto_awesome
                </span>
                <p className="font-label-md text-label-md text-primary tracking-wide">
                  Showing <span className="font-bold">9</span> of{" "}
                  <span className="font-bold">12</span> Heirloom Gift
                  Collections
                </p>
              </div>
              <div className="flex items-center gap-3">
                <label
                  className="font-label-sm text-label-sm uppercase tracking-wider text-secondary"
                  htmlFor="catalog-sort"
                >
                  Sort By:
                </label>
                <div className="relative min-w-[180px]">
                  <select
                    className="w-full bg-surface-container-low text-primary font-body-sm text-body-sm py-2 px-3 pr-8 rounded-none appearance-none focus:outline-none focus:bg-surface-container cursor-pointer shadow-inner"
                    id="catalog-sort"
                  >
                    <option value="featured">Featured / Curated</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="most-gifted">Most Gifted Keepsakes</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-secondary text-[18px]">
                    expand_more
                  </span>
                </div>
              </div>
            </div>
            {/*  Two-Column Master Grid Layout  */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
              {/*  LEFT SIDEBAR: Filters & Atelier Navigation  */}
              <aside className="lg:col-span-3 space-y-space-md">
                {/*  Filters Card  */}
                <div className="bg-surface-container-lowest rounded-lg border border-border-vellum shadow-sm overflow-hidden text-primary font-body-sm">
                  <div className="px-6 py-5 border-b border-border-vellum flex items-center justify-between bg-surface-container-lowest">
                    <h2 className="font-headline-sm text-headline-sm text-primary font-normal tracking-wide">
                      Filter
                    </h2>
                    <button
                      type="button"
                      className="font-label-sm text-[11px] uppercase tracking-widest text-secondary hover:text-primary transition-colors"
                    >
                      Reset
                    </button>
                  </div>
                  <div className="p-6 border-b border-border-vellum">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-label-md text-label-md text-primary font-medium tracking-wide">
                        Price
                      </span>
                      <button
                        type="button"
                        className="text-primary hover:text-secondary flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          remove
                        </span>
                      </button>
                    </div>
                    <div className="flex items-end gap-1 h-12 mb-3 px-1">
                      <div className="flex-1 bg-surface-container rounded-t-sm h-[40%]"></div>
                      <div className="flex-1 bg-surface-container-high rounded-t-sm h-[65%]"></div>
                      <div className="flex-1 bg-tertiary-fixed rounded-t-sm h-[85%]"></div>
                      <div className="flex-1 bg-tertiary-fixed rounded-t-sm h-[100%]"></div>
                      <div className="flex-1 bg-tertiary-fixed rounded-t-sm h-[90%]"></div>
                      <div className="flex-1 bg-tertiary-fixed rounded-t-sm h-[75%]"></div>
                      <div className="flex-1 bg-tertiary-fixed rounded-t-sm h-[60%]"></div>
                      <div className="flex-1 bg-surface-container-high rounded-t-sm h-[50%]"></div>
                      <div className="flex-1 bg-surface-container rounded-t-sm h-[35%]"></div>
                      <div className="flex-1 bg-surface-container rounded-t-sm h-[45%]"></div>
                    </div>
                    <div className="flex items-center justify-between text-secondary font-label-sm text-[11px] mb-2">
                      <span className="">₹ 100</span>
                      <span className="">₹ 10,000+</span>
                    </div>
                    <div className="relative py-2 mb-4 px-2">
                      <Slider
                        defaultValue={[100, 5500]}
                        min={100}
                        max={10000}
                        step={100}
                        value={priceRange}
                        onValueChange={setPriceRange}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="flex flex-col">
                        <span className="font-label-sm text-[10px] text-secondary uppercase tracking-wider mb-1 text-center">
                          Minimum
                        </span>
                        <div className="border border-border-vellum bg-surface-container-lowest px-3 py-2 text-center text-primary font-medium shadow-inner">
                          ₹ {priceRange[0].toLocaleString()}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-label-sm text-[10px] text-secondary uppercase tracking-wider mb-1 text-center">
                          Maximum
                        </span>
                        <div className="border border-border-vellum bg-surface-container-lowest px-3 py-2 text-center text-primary font-medium shadow-inner">
                          ₹ {priceRange[1].toLocaleString()}{priceRange[1] === 10000 ? '+' : ''}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="divide-y divide-border-vellum">
                    <details className="group" open>
                      <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none hover:bg-surface-container-low transition-colors">
                        <span className="font-label-md text-label-md text-primary font-medium tracking-wide">
                          Occasions
                        </span>
                        <span className="material-symbols-outlined text-[18px] text-secondary group-open:!hidden">
                          add
                        </span>
                        <span className="material-symbols-outlined text-[18px] text-secondary !hidden group-open:!inline-block">
                          remove
                        </span>
                      </summary>
                      <div className="px-6 pb-4 pt-1 space-y-2.5">
                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="w-4 h-4 rounded-none accent-primary cursor-pointer"
                          />
                          <span className="text-body-sm text-on-surface hover:text-primary">
                            Festive (Diwali, Karwa Chauth)
                          </span>
                        </label>
                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded-none accent-primary cursor-pointer"
                          />
                          <span className="text-body-sm text-on-surface hover:text-primary">
                            Weddings &amp; Trousseau
                          </span>
                        </label>
                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded-none accent-primary cursor-pointer"
                          />
                          <span className="text-body-sm text-on-surface hover:text-primary">
                            Housewarming Ceremonies
                          </span>
                        </label>
                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded-none accent-primary cursor-pointer"
                          />
                          <span className="text-body-sm text-on-surface hover:text-primary">
                            Sympathy &amp; Remembrance
                          </span>
                        </label>
                      </div>
                    </details>
                    <details className="group">
                      <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none hover:bg-surface-container-low transition-colors">
                        <span className="font-label-md text-label-md text-primary font-medium tracking-wide">
                          Anniversary
                        </span>
                        <span className="material-symbols-outlined text-[18px] text-secondary group-open:!hidden">
                          add
                        </span>
                        <span className="material-symbols-outlined text-[18px] text-secondary !hidden group-open:!inline-block">
                          remove
                        </span>
                      </summary>
                      <div className="px-6 pb-4 pt-1 space-y-2.5">
                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded-none accent-primary cursor-pointer"
                          />
                          <span className="text-body-sm text-on-surface hover:text-primary">
                            1st Paper Anniversary
                          </span>
                        </label>
                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded-none accent-primary cursor-pointer"
                          />
                          <span className="text-body-sm text-on-surface hover:text-primary">
                            5th Wooden &amp; 10th Tin
                          </span>
                        </label>
                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded-none accent-primary cursor-pointer"
                          />
                          <span className="text-body-sm text-on-surface hover:text-primary">
                            Silver (25th) &amp; Golden (50th)
                          </span>
                        </label>
                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded-none accent-primary cursor-pointer"
                          />
                          <span className="text-body-sm text-on-surface hover:text-primary">
                            Bespoke Vow Renewal
                          </span>
                        </label>
                      </div>
                    </details>
                    <details className="group">
                      <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none hover:bg-surface-container-low transition-colors">
                        <span className="font-label-md text-label-md text-primary font-medium tracking-wide">
                          Birthdays
                        </span>
                        <span className="material-symbols-outlined text-[18px] text-secondary group-open:!hidden">
                          add
                        </span>
                        <span className="material-symbols-outlined text-[18px] text-secondary !hidden group-open:!inline-block">
                          remove
                        </span>
                      </summary>
                      <div className="px-6 pb-4 pt-1 space-y-2.5">
                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded-none accent-primary cursor-pointer"
                          />
                          <span className="text-body-sm text-on-surface hover:text-primary">
                            1st &amp; Milestone Birthdays
                          </span>
                        </label>
                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded-none accent-primary cursor-pointer"
                          />
                          <span className="text-body-sm text-on-surface hover:text-primary">
                            Birthday Gifts For Her / Him
                          </span>
                        </label>
                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded-none accent-primary cursor-pointer"
                          />
                          <span className="text-body-sm text-on-surface hover:text-primary">
                            Zodiac &amp; Celestial Lettering
                          </span>
                        </label>
                      </div>
                    </details>
                    <details className="group">
                      <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none hover:bg-surface-container-low transition-colors">
                        <span className="font-label-md text-label-md text-primary font-medium tracking-wide">
                          Sentiments &amp; Celebrations
                        </span>
                        <span className="material-symbols-outlined text-[18px] text-secondary group-open:!hidden">
                          add
                        </span>
                        <span className="material-symbols-outlined text-[18px] text-secondary !hidden group-open:!inline-block">
                          remove
                        </span>
                      </summary>
                      <div className="px-6 pb-4 pt-1 space-y-2.5">
                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded-none accent-primary cursor-pointer"
                          />
                          <span className="text-body-sm text-on-surface hover:text-primary">
                            Love &amp; Romance
                          </span>
                        </label>
                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded-none accent-primary cursor-pointer"
                          />
                          <span className="text-body-sm text-on-surface hover:text-primary">
                            Gratitude &amp; Thank You
                          </span>
                        </label>
                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded-none accent-primary cursor-pointer"
                          />
                          <span className="text-body-sm text-on-surface hover:text-primary">
                            Congratulations &amp; Honors
                          </span>
                        </label>
                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded-none accent-primary cursor-pointer"
                          />
                          <span className="text-body-sm text-on-surface hover:text-primary">
                            Thinking of You
                          </span>
                        </label>
                      </div>
                    </details>
                    <details className="group">
                      <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none hover:bg-surface-container-low transition-colors">
                        <span className="font-label-md text-label-md text-primary font-medium tracking-wide">
                          Keepsake &amp; Script Style
                        </span>
                        <span className="material-symbols-outlined text-[18px] text-secondary group-open:!hidden">
                          add
                        </span>
                        <span className="material-symbols-outlined text-[18px] text-secondary !hidden group-open:!inline-block">
                          remove
                        </span>
                      </summary>
                      <div className="px-6 pb-4 pt-1 space-y-2.5">
                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded-none accent-primary cursor-pointer"
                          />
                          <span className="text-body-sm text-on-surface hover:text-primary">
                            24k Gold Inscribed
                          </span>
                        </label>
                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded-none accent-primary cursor-pointer"
                          />
                          <span className="text-body-sm text-on-surface hover:text-primary">
                            Copperplate Script
                          </span>
                        </label>
                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded-none accent-primary cursor-pointer"
                          />
                          <span className="text-body-sm text-on-surface hover:text-primary">
                            Spencerian Flourished
                          </span>
                        </label>
                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded-none accent-primary cursor-pointer"
                          />
                          <span className="text-body-sm text-on-surface hover:text-primary">
                            Wax Seal &amp; Botanical Sprigs
                          </span>
                        </label>
                      </div>
                    </details>
                  </div>
                </div>
                {/*  Product Categories Sidebar Menu  */}
                <div className="bg-surface-container-lowest p-6 shadow-sm">
                  <div className="pb-3 mb-4 bg-paper-tint px-3 py-2 -mx-6 -mt-6">
                    <h3 className="font-label-md text-label-md uppercase tracking-[0.18em] text-primary">
                      Gifting Categories
                    </h3>
                  </div>
                  <ul className="space-y-2 font-body-sm text-body-sm">
                    <li className="">
                      <a
                        className="flex items-center justify-between py-2 text-primary font-medium bg-tertiary-fixed/30 px-2 transition-colors"
                        href="#"
                      >
                        <span className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[14px]">
                            arrow_right
                          </span>
                          Gifting Hampers &amp; Trunk Baskets
                        </span>
                        <span className="font-label-sm text-[10px] text-secondary">
                          6
                        </span>
                      </a>
                    </li>
                    <li className="">
                      <a
                        className="flex items-center justify-between py-2 text-on-surface-variant hover:text-primary px-2 hover:bg-surface-container transition-colors"
                        href="#"
                      >
                        <span className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[14px] text-secondary">
                            chevron_right
                          </span>
                          Royal Name Frames
                        </span>
                        <span className="font-label-sm text-[10px] text-secondary">
                          4
                        </span>
                      </a>
                    </li>
                    <li className="">
                      <a
                        className="flex items-center justify-between py-2 text-on-surface-variant hover:text-primary px-2 hover:bg-surface-container transition-colors"
                        href="#"
                      >
                        <span className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[14px] text-secondary">
                            chevron_right
                          </span>
                          Bespoke Wedding &amp; Vow Sets
                        </span>
                        <span className="font-label-sm text-[10px] text-secondary">
                          5
                        </span>
                      </a>
                    </li>
                    <li className="">
                      <a
                        className="flex items-center justify-between py-2 text-on-surface-variant hover:text-primary px-2 hover:bg-surface-container transition-colors"
                        href="#"
                      >
                        <span className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[14px] text-secondary">
                            chevron_right
                          </span>
                          Hand-Etched Monogram Glassware
                        </span>
                        <span className="font-label-sm text-[10px] text-secondary">
                          3
                        </span>
                      </a>
                    </li>
                    <li className="">
                      <a
                        className="flex items-center justify-between py-2 text-on-surface-variant hover:text-primary px-2 hover:bg-surface-container transition-colors"
                        href="#"
                      >
                        <span className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[14px] text-secondary">
                            chevron_right
                          </span>
                          Epistolary Letters &amp; Seal Boxes
                        </span>
                        <span className="font-label-sm text-[10px] text-secondary">
                          8
                        </span>
                      </a>
                    </li>
                    <li className="">
                      <a
                        className="flex items-center justify-between py-2 text-on-surface-variant hover:text-primary px-2 hover:bg-surface-container transition-colors"
                        href="#"
                      >
                        <span className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[14px] text-secondary">
                            chevron_right
                          </span>
                          Artisanal Desk Accessories
                        </span>
                        <span className="font-label-sm text-[10px] text-secondary">
                          7
                        </span>
                      </a>
                    </li>
                    <li className="">
                      <a
                        className="flex items-center justify-between py-2 text-on-surface-variant hover:text-primary px-2 hover:bg-surface-container transition-colors"
                        href="#"
                      >
                        <span className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[14px] text-secondary">
                            chevron_right
                          </span>
                          Scribe Starter Kits &amp; Vouchers
                        </span>
                        <span className="font-label-sm text-[10px] text-secondary">
                          2
                        </span>
                      </a>
                    </li>
                    <li className="">
                      <a
                        className="flex items-center justify-between py-2 text-on-surface-variant hover:text-primary px-2 hover:bg-surface-container transition-colors"
                        href="#"
                      >
                        <span className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[14px] text-secondary">
                            chevron_right
                          </span>
                          Festive &amp; Wedding Trousseau
                        </span>
                        <span className="font-label-sm text-[10px] text-secondary">
                          9
                        </span>
                      </a>
                    </li>
                  </ul>
                </div>
                {/*  Studio Trust Badge Panel  */}
                <div className="bg-paper-tint p-5 shadow-sm text-center">
                  <div className="w-10 h-10 mx-auto rounded-full bg-tertiary-fixed flex items-center justify-center text-primary mb-3">
                    <span className="material-symbols-outlined text-[20px]">
                      verified
                    </span>
                  </div>
                  <h4 className="font-label-md text-label-md uppercase tracking-wider text-primary mb-1">
                    Hand-Inscribed Guarantee
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Every card, tag, and keepsake plaque is individually
                    lettered with pointed nib and archival pigment inks by our
                    master scribes.
                  </p>
                </div>
              </aside>
              {/*  RIGHT PRODUCT SHOWCASE: 3-Column Grid Matching Reference Layout  */}
              <main className="lg:col-span-9">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                  {/*  Item 1  */}
                  <article className="bg-surface-container-lowest p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow group">
                    <div>
                      <div className="relative w-full aspect-square overflow-hidden mb-4 bg-surface-container-low">
                        <img
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          data-alt="An artisanal luxury gift hamper basket in pastel blush and mint hues with wire weave and silk tulle ribbon, packed with hand-lettered gold calligraphy desk plaque, brass wax stamp, bespoke ink bottle, and botanical deckle edge cotton envelopes. Elegant studio tabletop lighting with soft shadows, luxury fine stationery styling."
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwR84N8znB31MB3MuiA_TJ0WRQvhzfLDg7_N0llxq2UcYmVcYZDrWBfTJ7zKqsJJfWXJMTlUOYngocqBB_JMu2NIdH5Vt0VZLpzgH1JgVjOPnuYoJ89-BtevRehodonITn-haHVI3CIQbqfNfjsB25SjjBuiZt1XTPyQSpJfL0AV9ypl81Mu_7fMQG0bAiYWSFGjyNxWMrW65M3EtaZ-PY7B5PXG6xDAetmuodspeBfcbk8ZvvNJM"
                        />
                        <div className="absolute top-2.5 left-2.5 bg-primary text-on-primary px-2.5 py-1 font-label-sm text-[10px] uppercase tracking-wider">
                          Bestseller
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <span className="font-label-sm text-[10px] uppercase tracking-widest text-secondary block">
                          Grand Keepsake Trunk
                        </span>
                        <h3 className="font-headline-sm text-headline-sm text-primary group-hover:text-tertiary-fixed-variant transition-colors line-clamp-1">
                          The Sovereign Atelier Hamper Basket
                        </h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                          Hand-woven blush wire hamper with bespoke brass seal,
                          gold-inked desk plaque &amp; walnut ink pot.
                        </p>
                      </div>
                    </div>
                    <div className="pt-5 mt-4 flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="font-label-sm text-[10px] uppercase text-secondary">
                          Price
                        </span>
                        <span className="font-headline-md text-headline-md text-primary font-normal">
                          ₹3,800
                        </span>
                      </div>
                      <button
                        className="bg-tertiary-fixed hover:bg-primary hover:text-on-primary text-primary font-label-md text-label-md uppercase px-4 py-2.5 rounded-full transition-colors shrink-0 shadow-sm"
                        type="button"
                      >
                        Customize &amp; Order
                      </button>
                    </div>
                  </article>
                  {/*  Item 2  */}
                  <article className="bg-surface-container-lowest p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow group">
                    <div>
                      <div className="relative w-full aspect-square overflow-hidden mb-4 bg-surface-container-low">
                        <img
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          data-alt="Hexagonal pastel sage green and blush paper gift box with opened lid showing fine-art gold leaf illuminated name calligraphy frame on handmade cotton rag paper, surrounded by preserved baby breath flora and sealing wax droplets. Warm editorial studio photography."
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAan9khD8_tOb-iQ6OeAKafDWB7dQ_f0ZJQ5of3k2cCgzLdGOmNipiLlDzmNdFaXStu2mlIZzCm2NB5iQ4MlXfHRP8z2gme2sFqluOk6jSus4DbeyBuf9FLr3opNXP5i9GulCeKQqElSkAATkSjkyukx4sJiHvBQtnCl3RHCilsHustPGkfrRXrcnsO96mEuYanXFMH7a0BRI-YV38CVl-mXSU8pQFgd_6o3kVuGj1JQlAq9RBO8Lo"
                        />
                        <div className="absolute top-2.5 right-2.5 bg-paper-tint text-primary px-2 py-0.5 font-label-sm text-[10px] uppercase tracking-widest shadow-sm">
                          Custom Name
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <span className="font-label-sm text-[10px] uppercase tracking-widest text-secondary block">
                          Illuminated Keepsake
                        </span>
                        <h3 className="font-headline-sm text-headline-sm text-primary group-hover:text-tertiary-fixed-variant transition-colors line-clamp-1">
                          Artisanal Royal Name Frame Box
                        </h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                          Hexagonal presentation box with 24k gold leaf
                          illuminated name frame and preserved wild botanicals.
                        </p>
                      </div>
                    </div>
                    <div className="pt-5 mt-4 flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="font-label-sm text-[10px] uppercase text-secondary">
                          Price
                        </span>
                        <span className="font-headline-md text-headline-md text-primary font-normal">
                          ₹2,800
                        </span>
                      </div>
                      <button
                        className="bg-tertiary-fixed hover:bg-primary hover:text-on-primary text-primary font-label-md text-label-md uppercase px-4 py-2.5 rounded-full transition-colors shrink-0 shadow-sm"
                        type="button"
                      >
                        Order Online
                      </button>
                    </div>
                  </article>
                  {/*  Item 3  */}
                  <article className="bg-surface-container-lowest p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow group">
                    <div>
                      <div className="relative w-full aspect-square overflow-hidden mb-4 bg-surface-container-low">
                        <img
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          data-alt="Delicate tiered wedding hamper basket wrapped in ethereal blush pink sheer organza netting with romantic bow tie, paired with handwritten his and her vow notebooks, vintage rose wax stamp, and ribbon on a clean white surface. Soft warm high-key photography."
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5oAGyPXfOTaPUFvhq_aDgLgHdXccN_mrNkgevPxHq1wyPYfGN-vgRmEiimNQ1oLOqwJq0jzhlJuMLjMbnjY-7yJnisgPQbiKOA1X4lqLABDD-Sg1FRzWYMMtWNNbnWaWF5UGjgT0h817s9ZXh_jpxiK06M7j5nd2rEtYHnGRtyAweUKFHCtR2GGRqS7u_KWAf4LJWh5Cwt2siOU7uq3T2lsSdrGlHHbXna5qdl-FlcSDKDxQBQ2U"
                        />
                        <div className="absolute top-2.5 left-2.5 bg-tertiary text-on-tertiary px-2.5 py-1 font-label-sm text-[10px] uppercase tracking-wider">
                          Wedding Edition
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <span className="font-label-sm text-[10px] uppercase tracking-widest text-secondary block">
                          Bridal &amp; Ceremony
                        </span>
                        <h3 className="font-headline-sm text-headline-sm text-primary group-hover:text-tertiary-fixed-variant transition-colors line-clamp-1">
                          Luxury Wedding Vow &amp; Hamper Basket
                        </h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                          Sheer tulle-wrapped tiered gift basket featuring a
                          bespoke pair of vow booklets, wax stamp &amp; flutes.
                        </p>
                      </div>
                    </div>
                    <div className="pt-5 mt-4 flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="font-label-sm text-[10px] uppercase text-secondary">
                          Price
                        </span>
                        <span className="font-headline-md text-headline-md text-primary font-normal">
                          ₹4,200
                        </span>
                      </div>
                      <button
                        className="bg-tertiary-fixed hover:bg-primary hover:text-on-primary text-primary font-label-md text-label-md uppercase px-4 py-2.5 rounded-full transition-colors shrink-0 shadow-sm"
                        type="button"
                      >
                        Order Online
                      </button>
                    </div>
                  </article>
                  {/*  Item 4  */}
                  <article className="bg-surface-container-lowest p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow group">
                    <div>
                      <div className="relative w-full aspect-square overflow-hidden mb-4 bg-surface-container-low">
                        <img
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          data-alt="Open hexagonal mint and blush keepsake hamper set arranged on elevated marble pedestals, filled with calligraphy turned wood oblique dip pen, brass nib container, dark sumi ink, brass wax seal melting furnace, and handmade deckled gift cards. Editorial flat lay perspective."
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBt-wGHhFgL-jt1-CrJ47Eg-UFI2E5xaoayTIKzsa6mgCz4-6JVLtrSxDONImWftnArrpQlmAyFcCGYk3wXGl1fX_6fkeoVyTn-F5F8tIPCYJKQIvoaES-hdKZ2dS2b-t2GfHdIiYi9j_lI8leGi5giQqBo86fgXLeEOemk1Tfz9jGbNGGL6-8TFg1SBGGw4zMTsDm8fY6G-vyfmclW8uhH8Pl-yT4xNJ9Ddi95LB7ZLTjB-uyyL0k"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <span className="font-label-sm text-[10px] uppercase tracking-widest text-secondary block">
                          Calligrapher's Suite
                        </span>
                        <h3 className="font-headline-sm text-headline-sm text-primary group-hover:text-tertiary-fixed-variant transition-colors line-clamp-1">
                          Indulgence Penmanship Gift Hamper
                        </h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                          Turned oblique penholder, imported nibs, sumi ink, and
                          brass wax seal melting stove in satin hamper.
                        </p>
                      </div>
                    </div>
                    <div className="pt-5 mt-4 flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="font-label-sm text-[10px] uppercase text-secondary">
                          Price
                        </span>
                        <span className="font-headline-md text-headline-md text-primary font-normal">
                          ₹3,500
                        </span>
                      </div>
                      <button
                        className="bg-tertiary-fixed hover:bg-primary hover:text-on-primary text-primary font-label-md text-label-md uppercase px-4 py-2.5 rounded-full transition-colors shrink-0 shadow-sm"
                        type="button"
                      >
                        Order Online
                      </button>
                    </div>
                  </article>
                  {/*  Item 5  */}
                  <article className="bg-surface-container-lowest p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow group">
                    <div>
                      <div className="relative w-full aspect-square overflow-hidden mb-4 bg-surface-container-low">
                        <img
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          data-alt="Artisanal pale sage green paper gift bag with illustrated delicate botanical calligraphy motif and satin cord handles, standing next to a rolled handwritten cotton parchment scroll tied with gold thread and small wax seal accessories on a bright pastel background."
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuChR4AWyMtNgEOF73ZXHc28hmfJ8dvOgb7n_-yOdDEp0VSp96q4griTYl6k5zZBU1350SbrFbUH7tqE7jTXz8Z6zs3BibwcCRodLsWPu5xrDq7iDW-iViMBlRCCOsw6F91Pc0ZXygU9jYFl5_vJ68KDPvKF_4LpUIKCvVD0krTio1E8uxVDXU6v_jUAwJ9iW_hL9ZufrUV6if1AC4cuDJd0GWJfwq9lg36-TUR8ReGFiEVSEX9ZVHQ"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <span className="font-label-sm text-[10px] uppercase tracking-widest text-secondary block">
                          Petite Gesture
                        </span>
                        <h3 className="font-headline-sm text-headline-sm text-primary group-hover:text-tertiary-fixed-variant transition-colors line-clamp-1">
                          The Letter Ink Keepsake Gifting Bag
                        </h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                          Illustrated botanical bag filled with personalized
                          handwritten parchment scroll and sealing wax beads.
                        </p>
                      </div>
                    </div>
                    <div className="pt-5 mt-4 flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="font-label-sm text-[10px] uppercase text-secondary">
                          Price
                        </span>
                        <span className="font-headline-md text-headline-md text-primary font-normal">
                          ₹1,200
                        </span>
                      </div>
                      <button
                        className="bg-tertiary-fixed hover:bg-primary hover:text-on-primary text-primary font-label-md text-label-md uppercase px-4 py-2.5 rounded-full transition-colors shrink-0 shadow-sm"
                        type="button"
                      >
                        Order Online
                      </button>
                    </div>
                  </article>
                  {/*  Item 6  */}
                  <article className="bg-surface-container-lowest p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow group">
                    <div>
                      <div className="relative w-full aspect-square overflow-hidden mb-4 bg-surface-container-low">
                        <img
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          data-alt="Pair of French crystal champagne flutes with hand-engraved cursive monogram lettering resting on linen inside a pale pink leatherette trunk, alongside a wax-sealed glass vial of artisanal confectioneries and hand-lettered message card."
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXKryYghYnKeSQNvMVxyM-C76IADfkpkVq3Y1RaP5roBJThfypsWTMVaR3qFS2AiY_oIDO4Zrzsrf1bxClJZb7LaAy12OpYJk9o9dehaPF4sD2pFfnz53z8jmp64aV0vBToX0iAHqriyFJl9zHRgBgdMZXfZs8qwZMAx__l4RDAd2xt3JOaxByEGHmv7eRjfeEa79T4-NYheUKaXgRbRCofCR_fILtjGSKRwW7o5rD5z40HRZODu4"
                        />
                        <div className="absolute top-2.5 left-2.5 bg-paper-tint text-primary px-2.5 py-1 font-label-sm text-[10px] uppercase tracking-wider shadow-sm">
                          Heirloom Glass
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <span className="font-label-sm text-[10px] uppercase tracking-widest text-secondary block">
                          Engraved Monogram
                        </span>
                        <h3 className="font-headline-sm text-headline-sm text-primary group-hover:text-tertiary-fixed-variant transition-colors line-clamp-1">
                          Engraved Flutes &amp; Lettering Trunk
                        </h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                          Victorian crystal flutes with hand-drilled monograms,
                          bespoke vow scroll, and confectionery jar.
                        </p>
                      </div>
                    </div>
                    <div className="pt-5 mt-4 flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="font-label-sm text-[10px] uppercase text-secondary">
                          Price
                        </span>
                        <span className="font-headline-md text-headline-md text-primary font-normal">
                          ₹3,600
                        </span>
                      </div>
                      <button
                        className="bg-tertiary-fixed hover:bg-primary hover:text-on-primary text-primary font-label-md text-label-md uppercase px-4 py-2.5 rounded-full transition-colors shrink-0 shadow-sm"
                        type="button"
                      >
                        Order Online
                      </button>
                    </div>
                  </article>
                  {/*  Item 7  */}
                  <article className="bg-surface-container-lowest p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow group">
                    <div>
                      <div className="relative w-full aspect-square overflow-hidden mb-4 bg-surface-container-low">
                        <img
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          data-alt="High-end executive gift hamper featuring rich blush leather desk mat, personalized white Makrana marble paperweight with gold-leaf engraved monogram, and custom engraved brass wax seal stamp resting on natural cotton stationery."
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTpHrtdApXmhH90hAAkp46zubBvgiiJDGFOSsmldallwyY3ku4QHxM2_Fb9JCXZC9p319DRv3ncnc5O8i14CZ2WlSIRtxaJe1pbEcIuTDw-az9TCY1cFOwP8z1qd4nrkBxokKh3ihIOyMCmlpE0gTVlL4g0jr3dIFAlV0v6qlR1FcEykFJACuN-0sjJXLQnJePanxMlKKocKV7-NJ866YJbF-cwL_ulOJl8RuCYRaaLsG7Dv4YeFg"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <span className="font-label-sm text-[10px] uppercase tracking-widest text-secondary block">
                          Executive &amp; Corporate
                        </span>
                        <h3 className="font-headline-sm text-headline-sm text-primary group-hover:text-tertiary-fixed-variant transition-colors line-clamp-1">
                          Executive Desk Scribe Hamper (Bespoke)
                        </h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                          Italian leather desk blotter, custom carved marble
                          paperweight, and gold wax seal ceremonial kit.
                        </p>
                      </div>
                    </div>
                    <div className="pt-5 mt-4 flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="font-label-sm text-[10px] uppercase text-secondary">
                          Price
                        </span>
                        <span className="font-headline-md text-headline-md text-primary font-normal">
                          ₹5,200
                        </span>
                      </div>
                      <button
                        className="bg-tertiary-fixed hover:bg-primary hover:text-on-primary text-primary font-label-md text-label-md uppercase px-4 py-2.5 rounded-full transition-colors shrink-0 shadow-sm"
                        type="button"
                      >
                        Order Online
                      </button>
                    </div>
                  </article>
                  {/*  Item 8  */}
                  <article className="bg-surface-container-lowest p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow group">
                    <div>
                      <div className="relative w-full aspect-square overflow-hidden mb-4 bg-surface-container-low">
                        <img
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          data-alt="A festive blush gift hamper box decorated with gold foil calligraphy accents, filled with gourmet chocolate almonds in a gold tin, an inscribed festive greeting envelope with emerald seal, and an antique gold nib ornament on a pristine white background."
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAx9aIMbbj3XguvMppVjjOICVLToy1nhkGp9P1LVDv_cU_XTq2voinTFDvSSQ0xsc7IR8cVRDt9SdoJZubIE_xkt5040Dvcr5bJuB0PwPEBFGDfihM6UmkU0vyS566LQoCBMaEEpS-lLw0yM7W-1YLqBMsj-gAL1xTwq6a8SOosaUsTDujK8PyelZK-Vx4WtRTNNuW9xYh72BKvXPZu1apJNSWDNzX2m28y7-mau57-0xY2IonStP4"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <span className="font-label-sm text-[10px] uppercase tracking-widest text-secondary block">
                          Festive Edition
                        </span>
                        <h3 className="font-headline-sm text-headline-sm text-primary group-hover:text-tertiary-fixed-variant transition-colors line-clamp-1">
                          Almond &amp; Gold Nib Festive Trunk
                        </h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                          Festive presentation trunk with artisanal
                          confectionery tin, gold pen nib charm, and custom
                          letter.
                        </p>
                      </div>
                    </div>
                    <div className="pt-5 mt-4 flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="font-label-sm text-[10px] uppercase text-secondary">
                          Price
                        </span>
                        <span className="font-headline-md text-headline-md text-primary font-normal">
                          ₹2,400
                        </span>
                      </div>
                      <button
                        className="bg-tertiary-fixed hover:bg-primary hover:text-on-primary text-primary font-label-md text-label-md uppercase px-4 py-2.5 rounded-full transition-colors shrink-0 shadow-sm"
                        type="button"
                      >
                        Order Online
                      </button>
                    </div>
                  </article>
                  {/*  Item 9  */}
                  <article className="bg-surface-container-lowest p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow group">
                    <div>
                      <div className="relative w-full aspect-square overflow-hidden mb-4 bg-surface-container-low">
                        <img
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          data-alt="Pressed wild botanical fern and handmade deckle-edge correspondence cards inside a pale powder-pink presentation box, with personalized brass monogram wax stamper and metallic gold sealing wax sticks displayed under warm natural morning studio light."
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwzC280mPHHmRf_Xu9ETNNvtByLYUOFXr2P8_3StAp-XAoiwzFpFf7TrIQHVORZ7wH81DM1xDWT9UnDWLob1UEAPFQEctXfxED9gLh8tU3qkUbqoa9E1z9R70z-lGq4BZOZZZVh9nETM3IOxFKTgpF8VQLpP43WgR6zKL2HNCQhS7_xWgaLx24a3TQ-aP18_SrGIAde0sDsoV5zg-5Dy8vEpNOw0Xd_XEk9YXwLgI5Vt5OBgbBO70"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <span className="font-label-sm text-[10px] uppercase tracking-widest text-secondary block">
                          Botanical Stationery
                        </span>
                        <h3 className="font-headline-sm text-headline-sm text-primary group-hover:text-tertiary-fixed-variant transition-colors line-clamp-1">
                          The Heirloom Botanical Gift Box
                        </h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                          Pressed fern and deckle-edged correspondence
                          note-cards with customized monogram wax seal stamp.
                        </p>
                      </div>
                    </div>
                    <div className="pt-5 mt-4 flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="font-label-sm text-[10px] uppercase text-secondary">
                          Price
                        </span>
                        <span className="font-headline-md text-headline-md text-primary font-normal">
                          ₹1,850
                        </span>
                      </div>
                      <button
                        className="bg-tertiary-fixed hover:bg-primary hover:text-on-primary text-primary font-label-md text-label-md uppercase px-4 py-2.5 rounded-full transition-colors shrink-0 shadow-sm"
                        type="button"
                      >
                        Order Online
                      </button>
                    </div>
                  </article>
                </div>
                {/*  Pagination & Archive Footer  */}
                <div className="mt-space-lg flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-surface-container-lowest shadow-sm">
                  <span className="font-body-sm text-body-sm text-secondary">
                    Page 1 of 2 — Handcrafted with slow intentionality
                  </span>
                  <div className="flex items-center gap-2">
                    <button className="w-9 h-9 flex items-center justify-center bg-primary text-on-primary font-label-sm text-xs font-semibold">
                      1
                    </button>
                    <button className="w-9 h-9 flex items-center justify-center bg-surface-container-low hover:bg-tertiary-fixed text-primary font-label-sm text-xs transition-colors">
                      2
                    </button>
                    <button className="px-3 h-9 flex items-center justify-center bg-surface-container-low hover:bg-tertiary-fixed text-primary font-label-sm text-xs uppercase tracking-wider transition-colors gap-1">
                      Next{" "}
                      <span className="material-symbols-outlined text-[14px]">
                        arrow_forward
                      </span>
                    </button>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </section>
        {/*  Interactive Gift Concierge & Custom Curation Box  */}
        <section className="w-full bg-tertiary-fixed/40 py-space-xl px-margin-mobile lg:px-margin">
          <div className="max-w-[1140px] mx-auto bg-surface-container-lowest p-8 lg:p-12 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-tertiary-fixed text-primary font-label-sm text-[10px] uppercase tracking-widest">
                  <span className="material-symbols-outlined text-[14px]">
                    mark_email_read
                  </span>
                  Bespoke Atelier Service
                </div>
                <h2 className="font-headline-md text-headline-md lg:text-[28px] text-primary tracking-wide">
                  Planning Wedding Favours or Corporate Milestone Gifts?
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl leading-relaxed">
                  From hand-engraved perfume bottles and gilded guest favours to
                  hundreds of bespoke personalized wax seals, our atelier crafts
                  commemorative moments that linger for generations. Download
                  our dossier or connect directly with our studio concierge.
                </p>
                {/*  Atelier Specs Badges  */}
                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-2 text-primary font-label-sm text-xs uppercase tracking-wider">
                    <span className="material-symbols-outlined text-primary text-[16px]">
                      draw
                    </span>
                    <span className="">100% Inscribed by Hand</span>
                  </div>
                  <div className="flex items-center gap-2 text-primary font-label-sm text-xs uppercase tracking-wider">
                    <span className="material-symbols-outlined text-primary text-[16px]">
                      workspace_premium
                    </span>
                    <span className="">24k Gold Illumination</span>
                  </div>
                  <div className="flex items-center gap-2 text-primary font-label-sm text-xs uppercase tracking-wider">
                    <span className="material-symbols-outlined text-primary text-[16px]">
                      flight_takeoff
                    </span>
                    <span className="">Insured Global Courier</span>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-4 flex flex-col gap-3 shrink-0">
                <button
                  className="w-full bg-primary hover:bg-tertiary-fixed-variant text-on-primary py-3.5 px-6 font-label-md text-label-md uppercase tracking-wider text-center transition-colors shadow-sm flex items-center justify-center gap-2"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    download
                  </span>
                  Download Gift Catalogue
                </button>
                <button
                  className="w-full bg-tertiary-fixed hover:bg-surface-container-lowest hover:border hover:border-primary text-primary py-3.5 px-6 font-label-md text-label-md uppercase tracking-wider text-center transition-colors flex items-center justify-center gap-2"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    chat
                  </span>
                  WhatsApp Concierge
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
