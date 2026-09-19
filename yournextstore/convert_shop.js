const fs = require('fs');

let html = fs.readFileSync('temp_shop.html', 'utf8');

const startTag = '<main class="w-full pt-[116px] bg-background min-h-screen">';
const endTag = '</main><footer';

const startIndex = html.indexOf(startTag);
const endIndex = html.indexOf(endTag);

if (startIndex === -1 || endIndex === -1) {
    console.error("Tags not found");
    process.exit(1);
}

let mainHtml = html.substring(startIndex + startTag.length, endIndex);

// Remove the client side script if it exists
mainHtml = mainHtml.replace(/<script>[\s\S]*?<\/script>/g, '');

// Now apply regex replacements
mainHtml = mainHtml.replace(/class=/g, 'className=');
mainHtml = mainHtml.replace(/for=/g, 'htmlFor=');
mainHtml = mainHtml.replace(/checked=""/g, 'defaultChecked');
mainHtml = mainHtml.replace(/<input([^>]*?)>/g, (m, p1) => { if (p1.endsWith('/')) return m; return `<input${p1} />`; });
mainHtml = mainHtml.replace(/<img([^>]*?)>/g, (m, p1) => { if (p1.endsWith('/')) return m; return `<img${p1} />`; });
mainHtml = mainHtml.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');
mainHtml = mainHtml.replace(/open=""/g, 'open');

// Fix inline styles
mainHtml = mainHtml.replace(/style="font-variation-settings:\s*'FILL'\s*1;"/g, `style={{ fontVariationSettings: "'FILL' 1" }}`);

// Fix group-open for standard icons
mainHtml = mainHtml.replace(/group-open:hidden/g, 'group-open:!hidden');
mainHtml = mainHtml.replace(/hidden group-open:inline-block/g, '!hidden group-open:!inline-block');

// Fix Slider mockup
mainHtml = mainHtml.replace(
    /<div className="flex items-center justify-between text-secondary font-label-sm text-\[11px\] mb-2">[\s\S]*?<span className="">₹ 4500\+<\/span>\s*<\/div>\s*<div className="relative py-2 mb-4">\s*<div className="h-1.5 w-full bg-surface-container rounded-full relative">[\s\S]*?<\/div>\s*<\/div>\s*<div className="grid grid-cols-2 gap-3 pt-2">[\s\S]*?<span className="font-label-sm text-\[10px\] text-secondary uppercase tracking-wider mb-1 text-center">\s*Maximum\s*<\/span>\s*<div className="border border-border-vellum bg-surface-container-lowest px-3 py-2 text-center text-primary font-medium shadow-inner">\s*₹ 5,500\s*<\/div>\s*<\/div>\s*<\/div>/,
    `
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
                    </div>`
);


const result = `"use client";\n\nimport Link from "next/link";\nimport { useState } from "react";\nimport { Slider } from "@/components/ui/slider";\n\nexport function ShopPageClient() {\n  const [priceRange, setPriceRange] = useState([100, 5500]);\n\n  return (\n    <>\n${mainHtml}\n    </>\n  );\n}\n`;

fs.writeFileSync('components/sections/shop-page-client.tsx', result);
console.log('Converted file!');
