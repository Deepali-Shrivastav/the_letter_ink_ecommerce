"use client";

import Link from "next/link";
import { useState } from "react";
import { Play, Video, Film, Volume2, Sparkles, X, Camera, ArrowRight } from "lucide-react";

const DEFAULT_POST_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuBDILBvJvTP7pFN8Q8AB9yn6fJknIwSIg0T5igpUeSzCrbuXGc5UgP6Txh_dtwI4pQ53tdKmnG4clSwrW88oSvqK8d5Nmov3F4EYnkgxEU7-nRdxUsfESM7DITV60d3cHYW8sMZqqUERkB0M6DPhRTe6RMHDrXw4onFBpBuo3_g__Kun13vb_y2wPKgqnM435pz0r-cT1ggqjKVx6529MlChAAAWgt3nRY4ygtlF5Dr8OVceHZ1hxg";

function getSafeImageUrl(img: any): string {
  if (typeof img === "string" && img.trim().length > 0) {
    return img.trim();
  }
  return DEFAULT_POST_IMAGE;
}

function LandscapeVideoCard({ item, onPlay }: { item: any; onPlay: (item: any) => void }) {
  return (
    <div className="media-card group relative bg-surface-container-lowest shadow-sm overflow-hidden" data-category={item.category}>
      <div className="relative w-full aspect-video bg-primary overflow-hidden">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          alt={item.title || "Studio Cinema"}
          src={getSafeImageUrl(item.thumbnail_url)}
        />
        <div className="absolute inset-0 bg-primary/30 group-hover:bg-primary/20 transition-colors"></div>
        <div className="absolute top-4 left-4 bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 font-label-sm text-label-sm uppercase tracking-wider shadow-sm flex items-center gap-1.5">
          <Video className="w-3.5 h-3.5" />
          <span>{item.badge || "Studio Cinema"}</span>
        </div>
        {item.duration && (
          <div className="absolute top-4 right-4 bg-primary/70 text-on-primary px-2.5 py-1 font-label-sm text-[11px] rounded backdrop-blur-sm">
            {item.duration}
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            type="button"
            onClick={() => onPlay(item)}
            className="w-16 h-16 rounded-full bg-paper-tint text-primary flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform cursor-pointer"
            aria-label={`Play ${item.title}`}
          >
            <Play className="w-8 h-8 fill-current text-primary translate-x-0.5" />
          </button>
        </div>
        <div className="absolute bottom-4 left-4 right-4 text-on-primary">
          {item.views && (
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-tertiary-fixed block mb-1">
              {item.views}
            </span>
          )}
          <h4 className="font-headline-sm text-headline-sm font-normal">
            {item.title}
          </h4>
          {item.caption && (
            <p className="font-body-sm text-[12px] text-surface-variant mt-1 line-clamp-1">
              {item.caption}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function PortraitVideoCard({ item, onPlay }: { item: any; onPlay: (item: any) => void }) {
  return (
    <div className="media-card group relative bg-surface-container-lowest shadow-sm overflow-hidden" data-category={item.category}>
      <div className="relative w-full aspect-[9/16] bg-primary-container overflow-hidden">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-90"
          alt={item.title || "Studio Reel"}
          src={getSafeImageUrl(item.thumbnail_url)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent"></div>
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-on-primary">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-tertiary-container/80 backdrop-blur-sm rounded-full font-label-sm text-[10px] tracking-wider uppercase">
            <Film className="w-3 h-3" />
            <span>{item.badge || "Instagram Reel"}</span>
          </span>
          {item.duration && (
            <span className="flex items-center gap-1 font-label-sm text-[11px] bg-primary/40 px-2 py-0.5 rounded backdrop-blur-sm">
              <Volume2 className="w-3 h-3" /> {item.duration}
            </span>
          )}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            type="button"
            onClick={() => onPlay(item)}
            className="w-14 h-14 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform cursor-pointer"
            aria-label={`Play ${item.title}`}
          >
            <Play className="w-6 h-6 fill-current text-on-tertiary-fixed translate-x-0.5" />
          </button>
        </div>
        <div className="absolute bottom-4 left-4 right-4 text-on-primary space-y-1">
          {item.views && (
            <p className="font-label-sm text-label-sm uppercase tracking-widest text-tertiary-fixed">
              {item.views}
            </p>
          )}
          <h4 className="font-headline-sm text-headline-sm font-medium leading-snug">
            {item.title}
          </h4>
          {item.caption && (
            <p className="font-body-sm text-[12px] text-surface-variant line-clamp-1">
              {item.caption}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function StillPhotoCard({ item, aspect = "aspect-[4/3]" }: { item: any; aspect?: string }) {
  return (
    <div className="media-card group relative bg-surface-container-lowest shadow-sm p-4 overflow-hidden" data-category="stills">
      <div className={`relative w-full ${aspect} bg-surface-container overflow-hidden`}>
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          alt={item.title || "Macro Study"}
          src={getSafeImageUrl(item.thumbnail_url)}
        />
        <span className="absolute top-3 right-3 bg-paper-tint/90 backdrop-blur-sm text-primary p-1.5 rounded-full shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
        </span>
      </div>
      <div className="pt-3">
        <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
          {item.badge || "Macro Study"}
        </span>
        <p className="font-body-sm text-body-sm text-primary font-medium mt-1">
          {item.title}
        </p>
      </div>
    </div>
  );
}

function DynamicMediaCard({ item, onPlay }: { item: any; onPlay: (item: any) => void }) {
  if (item.format === "landscape" || item.category === "shorts") {
    return <LandscapeVideoCard item={item} onPlay={onPlay} />;
  }
  if (item.format === "still" || item.category === "stills") {
    return <StillPhotoCard item={item} />;
  }
  return <PortraitVideoCard item={item} onPlay={onPlay} />;
}

export function BlogPageClient({ posts = [], initialVideos = [] }: { posts?: any[]; initialVideos?: any[] }) {
    const videos = initialVideos || [];
    const [mediaFilter, setMediaFilter] = useState<string>("all");
    const [activeVideo, setActiveVideo] = useState<any | null>(null);

    return (
      <main className="w-full pt-36 bg-background">
        <div className="flex flex-col w-full">
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
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-secondary block">Folio Vol. IV • Dispatches</span>
                  <h2 className="font-headline-lg text-headline-lg text-primary tracking-wide uppercase">Written Chronicles</h2>
                </div>
                <div className="flex items-center gap-space-xs text-secondary">
                  <span className="font-label-sm text-label-sm uppercase tracking-widest">Showing {posts.length} Essays</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  <span className="font-label-sm text-label-sm uppercase tracking-widest">Handcrafted in India</span>
                </div>
              </div>

              {/* Hero Featured Essay */}
              {posts.length > 0 && (
                <article className="bg-surface-container-lowest shadow-sm rounded-none overflow-hidden transition-all duration-300 group">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                    <div className="lg:col-span-7 relative h-80 sm:h-96 lg:h-[480px] overflow-hidden bg-surface-container-high">
                      <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" alt={posts[0].title || "Featured Chronicle"} data-alt={posts[0].title} src={getSafeImageUrl(posts[0].images?.[0])}/>
                    </div>
                    <div className="lg:col-span-5 p-space-sm sm:p-space-md flex flex-col justify-between bg-surface-container-lowest">
                      <div className="space-y-space-xs">
                        <div className="flex items-center space-x-2 text-secondary">
                          <span className="font-label-sm text-label-sm uppercase tracking-[0.16em] text-on-tertiary-container font-semibold">{posts[0].category}</span>
                          <span>•</span>
                          <span className="font-label-sm text-label-sm uppercase tracking-[0.12em]">{posts[0].read_time}</span>
                          <span>•</span>
                          <span className="font-label-sm text-label-sm uppercase tracking-[0.12em]">{posts[0].author}</span>
                        </div>
                        <h3 className="font-headline-lg text-headline-md lg:text-headline-lg text-primary font-normal leading-tight group-hover:text-tertiary-container transition-colors">
                          {posts[0].title}
                        </h3>
                        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                          {posts[0].description}
                        </p>
                      </div>
                      <div className="pt-space-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <Link className="inline-flex items-center justify-center h-[49px] px-7 bg-tertiary-fixed text-on-tertiary-fixed font-label-lg text-label-lg uppercase tracking-[0.15em] hover:bg-primary hover:text-on-primary transition-all duration-200 shadow-sm" href={`/blog/${posts[0].handle}`}>
                          Read Article
                        </Link>
                        <span className="font-body-sm text-body-sm text-secondary italic">Dispatched {posts[0].publish_date}</span>
                      </div>
                    </div>
                  </div>
                </article>
              )}

              {/* Article Grid */}
              {posts.length > 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
                  {posts.slice(1).map((post: any, index: number) => (
                    <article key={post.id || index} className="bg-surface-container-lowest shadow-sm flex flex-col justify-between p-6 group transition-all duration-300">
                      <div className="space-y-4">
                        <Link href={`/blog/${post.handle}`} className="block relative h-60 overflow-hidden bg-surface-container">
                          <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={post.title || "Chronicle"} data-alt={post.title} src={getSafeImageUrl(post.images?.[0])}/>
                        </Link>
                        <div className="flex items-center space-x-2 text-secondary font-label-sm text-label-sm uppercase tracking-wider">
                          <span>{post.read_time}</span>
                          <span>•</span>
                          <span>{post.publish_date}</span>
                        </div>
                        <Link href={`/blog/${post.handle}`}>
                          <h4 className="font-headline-lg text-headline-sm text-primary group-hover:text-on-tertiary-container transition-colors leading-snug">
                            {post.title}
                          </h4>
                        </Link>
                        <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3 leading-relaxed">
                          {post.description}
                        </p>
                      </div>
                      <div className="pt-6 mt-6 flex items-center justify-between border-t border-outline-variant/20">
                        <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">{post.category}</span>
                        <Link className="font-label-md text-label-md uppercase tracking-[0.14em] text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform" href={`/blog/${post.handle}`}>
                          Read Essay <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* SECTION 2: STUDIO MOTION & VISUAL REPOSITORIES */}
          <section className="max-w-[1440px] mx-auto w-full px-margin-mobile lg:px-margin py-space-xl space-y-space-md">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-space-xs">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 text-tertiary-container">
                  <Film className="w-4 h-4 text-tertiary-container" />
                  <span className="font-label-sm text-label-sm uppercase tracking-[0.22em] font-semibold">Cinematography &amp; Visual Reel Wall</span>
                </div>
                <h2 className="font-headline-lg text-headline-lg lg:text-headline-lg text-primary tracking-wide uppercase">
                  Studio Motion &amp; Visual Repositories
                </h2>
                <p className="font-body-md text-body-md text-secondary leading-relaxed">
                  Uneven glimpses into daily atelier rhythm, wet ink macro captures, slow penmanship reels, and fleeting studio moments captured in our Bhusawal studio.
                </p>
              </div>

              {/* Media Filter Controls (only rendered if videos exist) */}
              {videos.length > 0 && (
                <div className="flex flex-wrap gap-2" id="media-filter-bar">
                  <button
                    className={`media-btn px-4 py-2 rounded-full font-label-sm text-label-sm uppercase tracking-[0.14em] transition-colors shadow-sm cursor-pointer ${
                      mediaFilter === "all" ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface hover:bg-tertiary-fixed"
                    }`}
                    onClick={() => setMediaFilter("all")}
                    type="button"
                  >
                    All Media ({videos.length})
                  </button>
                  <button
                    className={`media-btn px-4 py-2 rounded-full font-label-sm text-label-sm uppercase tracking-[0.14em] transition-colors shadow-sm cursor-pointer ${
                      mediaFilter === "reels" ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface hover:bg-tertiary-fixed"
                    }`}
                    onClick={() => setMediaFilter("reels")}
                    type="button"
                  >
                    Process Reels (9:16) ({videos.filter((v: any) => v.category === "reels" || v.format === "portrait").length})
                  </button>
                  <button
                    className={`media-btn px-4 py-2 rounded-full font-label-sm text-label-sm uppercase tracking-[0.14em] transition-colors shadow-sm cursor-pointer ${
                      mediaFilter === "shorts" ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface hover:bg-tertiary-fixed"
                    }`}
                    onClick={() => setMediaFilter("shorts")}
                    type="button"
                  >
                    Studio Shorts &amp; Videos ({videos.filter((v: any) => v.category === "shorts" || v.format === "landscape").length})
                  </button>
                  <button
                    className={`media-btn px-4 py-2 rounded-full font-label-sm text-label-sm uppercase tracking-[0.14em] transition-colors shadow-sm cursor-pointer ${
                      mediaFilter === "stills" ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface hover:bg-tertiary-fixed"
                    }`}
                    onClick={() => setMediaFilter("stills")}
                    type="button"
                  >
                    Macro Photos ({videos.filter((v: any) => v.category === "stills" || v.format === "still").length})
                  </button>
                </div>
              )}
            </div>

            {/* Asymmetrical Masonry Wall or Empty Curation State */}
            {videos.length === 0 ? (
              <div className="w-full border border-dashed border-outline-variant/60 bg-surface-container-lowest/50 p-12 lg:p-16 text-center shadow-xs">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="w-14 h-14 rounded-full bg-paper-tint flex items-center justify-center mx-auto text-primary border border-outline-variant/30">
                    <Film className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-secondary">Atelier Visual Vault</span>
                    <h3 className="font-headline-lg text-headline-sm text-primary uppercase font-normal tracking-wide">
                      Motion Archive Currently In Curation
                    </h3>
                    <p className="font-body-sm text-body-sm text-secondary leading-relaxed">
                      Raw lettering footage, macro ink captures, and behind-the-scenes studio cuts will appear here as they are published from the atelier backend dashboard.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              (() => {
                const filteredVideos = mediaFilter === "all"
                  ? videos
                  : videos.filter((v: any) => v.category === mediaFilter || (mediaFilter === "reels" && v.format === "portrait") || (mediaFilter === "shorts" && v.format === "landscape") || (mediaFilter === "stills" && v.format === "still"));

                const col1Items: any[] = [];
                const col2Items: any[] = [];
                const col3Items: any[] = [];

                if (mediaFilter === "shorts") {
                  filteredVideos.forEach((v: any, idx: number) => {
                    if (idx % 2 === 0) col2Items.push(v);
                    else col1Items.push(v);
                  });
                } else if (mediaFilter === "reels") {
                  filteredVideos.forEach((v: any, idx: number) => {
                    if (idx % 3 === 0) col1Items.push(v);
                    else if (idx % 3 === 1) col2Items.push(v);
                    else col3Items.push(v);
                  });
                } else {
                  filteredVideos.forEach((v: any) => {
                    if (v.format === "landscape" || v.category === "shorts") {
                      col2Items.push(v);
                    } else if (col1Items.length <= col3Items.length) {
                      col1Items.push(v);
                    } else {
                      col3Items.push(v);
                    }
                  });
                }

                if (filteredVideos.length === 0) {
                  return (
                    <div className="p-12 text-center text-secondary font-body-sm bg-surface-container-lowest">
                      No media items found in this category.
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-gutter items-start">
                    {/* COLUMN 1: Width 4 / 12 */}
                    <div className="lg:col-span-4 flex flex-col gap-gutter">
                      {col1Items.map((item: any, idx: number) => (
                        <DynamicMediaCard key={item.id || `col1-${idx}`} item={item} onPlay={setActiveVideo} />
                      ))}
                    </div>

                    {/* COLUMN 2: Width 5 / 12 (Central Asymmetric Anchor) */}
                    <div className="lg:col-span-5 flex flex-col gap-gutter">
                      {col2Items.map((item: any, idx: number) => (
                        <DynamicMediaCard key={item.id || `col2-${idx}`} item={item} onPlay={setActiveVideo} />
                      ))}
                    </div>

                    {/* COLUMN 3: Width 3 / 12 */}
                    <div className="lg:col-span-3 flex flex-col gap-gutter">
                      {col3Items.map((item: any, idx: number) => (
                        <DynamicMediaCard key={item.id || `col3-${idx}`} item={item} onPlay={setActiveVideo} />
                      ))}
                    </div>
                  </div>
                );
              })()
            )}

            {/* Instagram Feed Callout CTA Button */}
            <div className="pt-space-md flex flex-col items-center justify-center text-center space-y-4">
              <div className="flex items-center gap-2 text-secondary font-label-sm text-label-sm uppercase tracking-[0.2em]">
                <span className="w-8 h-[1px] bg-secondary"></span>
                Daily Atelier Stories
                <span className="w-8 h-[1px] bg-secondary"></span>
              </div>
              <a className="inline-flex items-center gap-3 px-8 py-3.5 bg-tertiary-fixed text-on-tertiary-fixed font-label-lg text-label-lg uppercase tracking-[0.16em] hover:bg-primary hover:text-on-primary transition-all duration-200 shadow-sm" href="#">
                <Camera className="w-5 h-5" />
                Watch More on Instagram Reels @the_letter_ink
              </a>
              <p className="font-body-sm text-body-sm text-secondary">
                Updated every Tuesday &amp; Friday with raw studio takes and lettering process clips.
              </p>
            </div>
          </section>

          {/* SECTION 3: EDITORIAL GAZETTE CALLOUT */}
          <section className="w-full bg-tertiary-fixed/20 py-space-xl relative overflow-hidden">
            <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-tertiary-fixed/40 blur-2xl pointer-events-none"></div>
            <div className="absolute -left-24 -bottom-24 w-96 h-96 rounded-full bg-tertiary-fixed/40 blur-2xl pointer-events-none"></div>
            <div className="max-w-4xl mx-auto px-margin-mobile lg:px-margin text-center relative z-10 space-y-space-xs">
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
                <input className="flex-1 bg-surface-container-lowest px-4 py-3.5 font-body-sm text-body-sm text-primary placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary shadow-sm" placeholder="ENTER YOUR CORRESPONDENCE EMAIL" required type="email"/>
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

        {/* Video Playback Modal */}
        {activeVideo && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 transition-all duration-300 animate-in fade-in"
            onClick={() => setActiveVideo(null)}
            role="dialog"
            aria-modal="true"
            aria-label={activeVideo.title}
          >
            <div
              className={`relative bg-surface-container-lowest text-primary shadow-2xl overflow-hidden rounded-xl border border-outline/20 w-full flex flex-col ${
                activeVideo.format === "portrait"
                  ? "max-w-sm max-h-[88vh]"
                  : "max-w-4xl max-h-[88vh]"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-surface border-b border-outline-variant/30 z-10">
                <div className="flex items-center gap-2 overflow-hidden pr-2">
                  <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold bg-tertiary-fixed text-on-tertiary-fixed rounded-sm shrink-0">
                    {activeVideo.badge || (activeVideo.format === "portrait" ? "Reel" : "Cinema")}
                  </span>
                  <h3 className="font-headline-sm text-sm sm:text-base font-medium truncate text-primary">
                    {activeVideo.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveVideo(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-secondary hover:text-primary hover:bg-surface-container transition-colors shrink-0"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Video Player Box */}
              <div
                className={`relative w-full bg-black flex items-center justify-center overflow-hidden ${
                  activeVideo.format === "portrait"
                    ? "aspect-[9/16] max-h-[68vh]"
                    : "aspect-video max-h-[68vh]"
                }`}
              >
                {activeVideo.video_url ? (
                  activeVideo.video_url.includes("youtube.com") || activeVideo.video_url.includes("youtu.be") ? (
                    <iframe
                      className="w-full h-full border-0"
                      src={`${activeVideo.video_url}${activeVideo.video_url.includes("?") ? "&" : "?"}autoplay=1`}
                      title={activeVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={activeVideo.video_url}
                      poster={activeVideo.thumbnail_url}
                      controls
                      autoPlay
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  )
                ) : (
                  <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center text-white">
                    <img
                      src={getSafeImageUrl(activeVideo.thumbnail_url)}
                      alt={activeVideo.title || "Atelier Master Tape"}
                      className="absolute inset-0 w-full h-full object-cover opacity-40"
                    />
                    <div className="relative z-10 flex flex-col items-center max-w-xs space-y-2">
                      <Film className="w-10 h-10 text-tertiary-fixed" />
                      <p className="font-headline-sm text-base">Atelier Master Tape Archive</p>
                      <p className="font-body-sm text-xs text-white/80">
                        Visual repository excerpt. Full high-definition reel currently undergoing archival synchronization.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer Caption */}
              <div className="p-3.5 bg-surface text-secondary border-t border-outline-variant/30 flex items-center justify-between text-xs">
                <span className="truncate max-w-[70%]">{activeVideo.caption || "Atelier Visual Archive"}</span>
                {activeVideo.duration && (
                  <span className="font-mono text-[11px] bg-surface-container px-2 py-0.5 rounded">
                    {activeVideo.duration}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    );
}
