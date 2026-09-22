"use client";

import React from 'react';
import { Footer } from '@/components/ui/footer';

const FacebookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);
const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);
const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);

const FooterDemo = () => {
  /**
   * A mock function to simulate an API call for newsletter subscription.
   * Returns a promise that resolves to true (success) or false (failure).
   */
  const handleNewsletterSubscribe = async (email: string): Promise<boolean> => {
    console.log(`Subscribing ${email}...`);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    // Simulate a 70% success rate
    if (Math.random() > 0.3) {
      console.log(`Successfully subscribed ${email}!`);
      return true;
    } else {
      console.error(`Failed to subscribe ${email}.`);
      return false;
    }
  };

  const socialLinksData = [
    { label: 'Facebook', href: '#', icon: <FacebookIcon /> },
    { label: 'Instagram', href: '#', icon: <InstagramIcon /> },
    { label: 'Twitter (X)', href: '#', icon: <XIcon /> },
  ];

  return (
    <div className="w-full bg-background">
      <Footer
        logoSrc="/Latest-logo.png"
        onSubscribe={handleNewsletterSubscribe}
        socialLinks={socialLinksData}
      />
    </div>
  );
};

export default FooterDemo;
