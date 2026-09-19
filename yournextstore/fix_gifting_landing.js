const fs = require('fs');

let file = fs.readFileSync('components/sections/gifting-landing-client.tsx', 'utf8');

// Update function signature
file = file.replace(
  'export function GiftingLandingClient() {',
  'export function GiftingLandingClient({ hampers = [], occasions = [] }: { hampers?: any[], occasions?: any[] }) {'
);

// We need to replace the hamper track contents.
const hamperTrackRegex = /(<div className="flex gap-gutter overflow-x-auto pb-4 scroll-smooth \[scrollbar-width:none\] \[-ms-overflow-style:none\]" id="hamper-track">)([\s\S]*?)(<\/div>\s*<\/div>\s*<\/section>)/;
const newHamperTrack = `$1
          {hampers.map((hamper, idx) => (
            <div key={hamper.id} className="min-w-[300px] sm:min-w-[340px] lg:min-w-[360px] max-w-[360px] bg-surface-container-lowest flex flex-col justify-between shadow-sm group shrink-0 border border-border-vellum">
              <div className="relative aspect-[4/5] overflow-hidden bg-surface-container">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={hamper.title} src={hamper.thumbnail || 'https://via.placeholder.com/400x500?text=Hamper'} />
                {hamper.metadata?.badge && (
                  <span className="absolute top-4 left-4 bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 font-label-sm text-[11px] uppercase tracking-wider font-semibold">
                    {hamper.metadata.badge}
                  </span>
                )}
              </div>
              <div className="p-space-sm flex flex-col flex-grow justify-between">
                <div>
                  <div className="flex items-baseline justify-between gap-2 mb-2">
                    <h3 className="font-headline-sm text-headline-sm text-primary">{hamper.title}</h3>
                    <div className="text-right shrink-0">
                      <span className="font-headline-sm text-headline-sm text-primary font-medium block">
                        ₹{hamper.variants?.[0]?.prices?.[0]?.amount || '0'}
                      </span>
                    </div>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm line-clamp-3">
                    {hamper.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-space-sm">
                    {hamper.tags?.slice(0,3).map((tag: any) => (
                      <span key={tag.id} className="bg-surface-container-low px-2.5 py-1 font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">{tag.value}</span>
                    ))}
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
          ))}
          {hampers.length === 0 && (
            <div className="p-8 text-center text-ui-fg-subtle w-full">No hampers available yet.</div>
          )}
$3`;
file = file.replace(hamperTrackRegex, newHamperTrack);


// Replace the occasions section.
// The occasions section starts with `{/*  Row 1: Wedding  */}`
const occasionsRegex = /({\/\*  Row 1: Wedding  \*\/}[\s\S]*?)(\s*<\/div>\s*<\/section>\s*<section className="bg-surface-container py-space-xl">)/;
const newOccasions = `
      {occasions.map((occ, idx) => (
        <div key={occ.category.id} className="flex flex-col mt-space-xl first:mt-0">
          <div className="flex items-baseline justify-between mb-space-sm border-b border-border-vellum pb-2">
            <div className="flex items-center gap-3">
              <h3 className="font-headline-lg text-headline-lg text-primary tracking-wide">{occ.category.name}</h3>
            </div>
            <a className="font-label-sm text-label-sm uppercase text-primary hover:text-secondary inline-flex items-center gap-1 tracking-wider transition-colors" href="#">
              View All {occ.category.name} Curations
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {occ.products?.map((product: any) => (
              <div key={product.id} className="bg-surface-container-lowest border border-border-vellum shadow-sm flex flex-col justify-between group hover:border-primary transition-colors">
                <div>
                  <div className="relative aspect-square overflow-hidden bg-surface-container">
                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={product.title} src={product.thumbnail || 'https://via.placeholder.com/300?text=Gift'} />
                    {product.metadata?.badge && (
                      <span className="absolute top-3 left-3 bg-surface-container-lowest text-primary font-label-sm text-[11px] uppercase tracking-wider px-2 py-0.5 border border-border-vellum">
                        {product.metadata.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="font-headline-sm text-[18px] text-primary mb-1">{product.title}</h4>
                    <p className="font-body-sm text-[13px] text-on-surface-variant line-clamp-2 mb-3">{product.description}</p>
                    <span className="font-headline-sm text-[18px] text-primary font-medium block">
                      ₹{product.variants?.[0]?.prices?.[0]?.amount || '0'}
                    </span>
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <button className="w-full bg-tertiary-fixed hover:bg-primary hover:text-on-primary text-primary py-2 font-label-md text-[12px] uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-1.5" type="button">
                    Order Online
                    <span className="material-symbols-outlined text-[14px]">north_east</span>
                  </button>
                </div>
              </div>
            ))}
            {(!occ.products || occ.products.length === 0) && (
              <div className="col-span-full p-8 text-center text-ui-fg-subtle">No gifts added to {occ.category.name} yet.</div>
            )}
          </div>
        </div>
      ))}
$2`;
file = file.replace(occasionsRegex, newOccasions);


fs.writeFileSync('components/sections/gifting-landing-client.tsx', file);
console.log('Modified gifting-landing-client.tsx');
