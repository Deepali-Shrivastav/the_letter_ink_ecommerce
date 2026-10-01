"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Link from "next/link";

export function CampaignBanner({ campaign: initialCampaign }: { campaign?: any } = {}) {
  const [campaign, setCampaign] = useState<any>(initialCampaign || null);
  const [isVisible, setIsVisible] = useState(true);

  // Check sessionStorage once on mount so if the patron dismissed it, it stays hidden
  useEffect(() => {
    const targetId = initialCampaign?.id || campaign?.id;
    if (typeof window !== "undefined" && targetId) {
      if (sessionStorage.getItem(`dismissed_campaign_${targetId}`)) {
        setIsVisible(false);
      }
    }
  }, [initialCampaign?.id, campaign?.id]);

  // If campaign was not provided server-side, only then optionally fetch once
  useEffect(() => {
    if (initialCampaign) {
      setCampaign(initialCampaign);
      return;
    }

    let isMounted = true;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const fetchCampaigns = async () => {
      try {
        const res = await fetch("/api/campaigns/active", {
          signal: controller.signal,
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.campaigns && data.campaigns.length > 0) {
            setCampaign(data.campaigns[0]);
          }
        }
      } catch {
        // Silent fallback
      } finally {
        clearTimeout(timeoutId);
      }
    };

    fetchCampaigns();

    return () => {
      isMounted = false;
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [initialCampaign]);

  if (!campaign || !isVisible) return null;

  const promoCode = campaign.promotions?.[0]?.code;

  const handleDismiss = () => {
    setIsVisible(false);
    if (typeof window !== "undefined" && campaign?.id) {
      sessionStorage.setItem(`dismissed_campaign_${campaign.id}`, "true");
    }
  };

  return (
    <div className="bg-primary text-primary-foreground py-2 px-4 flex items-center justify-between text-xs sm:text-sm font-medium">
      <div className="flex-1 text-center">
        <Link href="/campaigns" className="hover:underline">
          <span className="font-semibold">{campaign.name}:</span>{" "}
          {promoCode ? (
            <>
              Use code <strong className="bg-primary-foreground/20 px-1.5 py-0.5 rounded font-mono">{promoCode}</strong> for special offers!
            </>
          ) : (
            campaign.description || "Check out our latest special offers!"
          )}
        </Link>
      </div>
      <button
        type="button"
        onClick={handleDismiss}
        className="opacity-70 hover:opacity-100 transition-opacity p-1 ml-2 rounded"
        aria-label="Dismiss banner"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
