"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Link from "next/link";

export function CampaignBanner() {
  const [campaign, setCampaign] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/store/campaigns/active`);
        if (res.ok) {
          const data = await res.json();
          if (data.campaigns && data.campaigns.length > 0) {
            setCampaign(data.campaigns[0]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch campaigns", err);
      }
    };
    fetchCampaigns();
  }, []);

  if (!campaign || !isVisible) return null;

  const promoCode = campaign.promotions?.[0]?.code;

  return (
    <div className="bg-primary text-primary-foreground py-2 px-4 flex items-center justify-between">
      <div className="flex-1 text-center text-sm font-medium">
        <Link href="/campaigns" className="hover:underline">
          {campaign.name}: {promoCode ? `Use code ${promoCode} for special offers!` : 'Check out our latest special offers!'}
        </Link>
      </div>
      <button onClick={() => setIsVisible(false)} className="opacity-70 hover:opacity-100">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
