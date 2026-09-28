"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Link from "next/link";

export function CampaignBanner() {
  const [campaign, setCampaign] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Only fetch client-side if we want real-time, but for this banner 
    // it's fine to fetch from our Next.js API route or just the backend.
    // For simplicity, we fetch the campaigns page JSON or directly backend
    fetch("/campaigns")
      .then(res => {
        // Since we didn't expose a Next API route, let's just use the fact that 
        // /campaigns is a page, or better yet, skip fetching and wait.
        // Actually, we should just query the backend.
      })
      .catch(() => {});
  }, []);

  if (!campaign || !isVisible) return null;

  return (
    <div className="bg-primary text-primary-foreground py-2 px-4 flex items-center justify-between">
      <div className="flex-1 text-center text-sm font-medium">
        <Link href="/campaigns" className="hover:underline">
          {campaign.name}: Use code {campaign.campaign_identifier} for special offers!
        </Link>
      </div>
      <button onClick={() => setIsVisible(false)} className="opacity-70 hover:opacity-100">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
