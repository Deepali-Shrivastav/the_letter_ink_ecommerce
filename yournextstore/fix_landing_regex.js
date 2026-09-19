const fs = require('fs');

let file = fs.readFileSync('components/sections/gifting-landing-client.tsx', 'utf8');

const occasionsRegex = /({\/\*  Row 1: Wedding  \*\/}[\s\S]*?)(<\/div>\s*<\/section>\s*{\/\*  Interactive Gifting Concierge)/;

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
            {occ.products?.map((product) => (
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
