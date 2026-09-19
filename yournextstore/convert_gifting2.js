const fs = require('fs');

let html = fs.readFileSync('temp_gifting2.html', 'utf8');

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

// Remove event handlers completely since they are strings like "this.closest(...)"
mainHtml = mainHtml.replace(/onclick="[^"]*"/g, '');
mainHtml = mainHtml.replace(/onsubmit="[^"]*"/g, '');

// Fix required="" or required="true" -> required
mainHtml = mainHtml.replace(/required="[^"]*"/g, 'required');

// Fix inline styles
mainHtml = mainHtml.replace(/style="([^"]*)"/g, (match, p1) => {
    // Basic conversion for font-variation-settings and object-position
    let styleObj = p1;
    if (p1.includes('font-variation-settings')) {
        return `style={{ fontVariationSettings: "'FILL' 1" }}`;
    }
    if (p1.includes('object-position: center 20%')) {
        return `style={{ objectPosition: 'center 20%' }}`;
    }
    if (p1.includes('background-image: url')) {
        const urlMatch = p1.match(/url\((.*?)\)/);
        if (urlMatch) {
            return `style={{ backgroundImage: "url(" + ${urlMatch[1]} + ")" }}`;
        }
    }
    // We can just strip out problematic inline styles if they are too complex or just ignore them.
    return `style={{}}`; 
});

// We need to fix the background image style specifically because of the string quotes.
mainHtml = mainHtml.replace(/style=\{\{ backgroundImage: "url\(" \+ '(.*?)' \+ "\)" \}\}/g, "style={{ backgroundImage: `url('$1')` }}");

// Fix group-open for standard icons
mainHtml = mainHtml.replace(/group-open:hidden/g, 'group-open:!hidden');
mainHtml = mainHtml.replace(/hidden group-open:inline-block/g, '!hidden group-open:!inline-block');


const result = `"use client";\n\nimport Link from "next/link";\n\nexport function GiftingLandingClient() {\n  return (\n    <>\n${mainHtml}\n    </>\n  );\n}\n`;

fs.writeFileSync('components/sections/gifting-landing-client.tsx', result);
console.log('Converted file!');
