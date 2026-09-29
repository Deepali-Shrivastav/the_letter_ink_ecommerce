"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  MapPin,
  Mail,
  Phone,
  User,
  Building,
  Home,
  FileText,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export interface ShippingAddressData {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  province: string;
  postalCode: string;
  countryCode: string;
  deliveryNotes: string;
}

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi (NCT)",
  "Chandigarh",
  "Jammu & Kashmir",
  "Ladakh",
  "Puducherry",
  "Goa",
];

const LOCAL_STORAGE_KEY = "tli_saved_shipping_address";

interface ShippingAddressFormProps {
  initialData?: Partial<ShippingAddressData>;
  onChange: (data: ShippingAddressData, isValid: boolean) => void;
}

export function ShippingAddressForm({
  initialData,
  onChange,
}: ShippingAddressFormProps) {
  const [formData, setFormData] = useState<ShippingAddressData>({
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    address1: initialData?.address1 || "",
    address2: initialData?.address2 || "",
    city: initialData?.city || "",
    province: initialData?.province || "Maharashtra",
    postalCode: initialData?.postalCode || "",
    countryCode: "IN",
    deliveryNotes: initialData?.deliveryNotes || "",
  });

  const [saveAddress, setSaveAddress] = useState(true);
  const [hasLoadedSaved, setHasLoadedSaved] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({
          ...prev,
          ...parsed,
          countryCode: "IN",
        }));
        setHasLoadedSaved(true);
      }
    } catch (e) {
      // ignore storage access errors
    }
  }, []);

  // Validate fields
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());
  const isPhoneValid = /^[6-9]\d{9}$/.test(formData.phone.replace(/\D/g, "").slice(-10));
  const isFirstNameValid = formData.firstName.trim().length >= 2;
  const isAddress1Valid = formData.address1.trim().length >= 5;
  const isCityValid = formData.city.trim().length >= 2;
  const isPostalCodeValid = /^\d{6}$/.test(formData.postalCode.trim());
  const isProvinceValid = Boolean(formData.province);

  const isValid =
    isEmailValid &&
    isPhoneValid &&
    isFirstNameValid &&
    isAddress1Valid &&
    isCityValid &&
    isPostalCodeValid &&
    isProvinceValid;

  // Propagate changes to parent
  useEffect(() => {
    onChange(formData, isValid);

    if (saveAddress && isValid) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
      } catch (e) {
        // ignore
      }
    }
  }, [formData, isValid, saveAddress, onChange]);

  const handleChange = (field: keyof ShippingAddressData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 text-left">
      {/* Title */}
      <div className="border-b border-border/60 pb-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-serif font-semibold text-foreground tracking-tight">
              Delivery & Recipient Details
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Where should our atelier send your handcrafted treasures?
          </p>
        </div>
        {hasLoadedSaved && (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="h-3 w-3" />
            Saved Address Loaded
          </span>
        )}
      </div>

      {/* 1. Contact Info Section */}
      <div className="space-y-4">
        <h3 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
          Contact Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="checkout-email" className="text-xs font-medium">
              Email Address <span className="text-rose-500">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="checkout-email"
                type="email"
                placeholder="patron@example.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                className={`pl-9 text-sm ${
                  touched.email && !isEmailValid ? "border-rose-500 focus-visible:ring-rose-400" : ""
                }`}
                required
              />
            </div>
            {touched.email && !isEmailValid && (
              <p className="text-[11px] text-rose-500">Please enter a valid email address.</p>
            )}
            <p className="text-[10px] text-muted-foreground">
              Order receipt and dispatch tracking will be sent here.
            </p>
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <Label htmlFor="checkout-phone" className="text-xs font-medium">
              Phone Number (10 digits) <span className="text-rose-500">*</span>
            </Label>
            <div className="relative flex">
              <span className="inline-flex items-center px-3 border border-r-0 border-input rounded-l-md bg-muted text-xs text-muted-foreground font-mono">
                +91
              </span>
              <Input
                id="checkout-phone"
                type="tel"
                placeholder="9876543210"
                maxLength={10}
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value.replace(/\D/g, ""))}
                onBlur={() => handleBlur("phone")}
                className={`rounded-l-none text-sm font-mono ${
                  touched.phone && !isPhoneValid ? "border-rose-500 focus-visible:ring-rose-400" : ""
                }`}
                required
              />
            </div>
            {touched.phone && !isPhoneValid && (
              <p className="text-[11px] text-rose-500">Enter a valid 10-digit Indian mobile number.</p>
            )}
            <p className="text-[10px] text-muted-foreground">Required for courier delivery updates.</p>
          </div>
        </div>
      </div>

      {/* 2. Shipping Address Section */}
      <div className="space-y-4 pt-2">
        <h3 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
          Shipping Address
        </h3>

        {/* Recipient Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="checkout-firstname" className="text-xs font-medium">
              First Name <span className="text-rose-500">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="checkout-firstname"
                type="text"
                placeholder="Aarav"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                onBlur={() => handleBlur("firstName")}
                className={`pl-9 text-sm ${
                  touched.firstName && !isFirstNameValid
                    ? "border-rose-500 focus-visible:ring-rose-400"
                    : ""
                }`}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="checkout-lastname" className="text-xs font-medium">
              Last Name
            </Label>
            <Input
              id="checkout-lastname"
              type="text"
              placeholder="Sharma"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              className="text-sm"
            />
          </div>
        </div>

        {/* Street Address */}
        <div className="space-y-1.5">
          <Label htmlFor="checkout-address1" className="text-xs font-medium">
            Street Address / House No. / Flat <span className="text-rose-500">*</span>
          </Label>
          <div className="relative">
            <Home className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="checkout-address1"
              type="text"
              placeholder="Villa 402, Lotus Bloom Enclave, 12th Main"
              value={formData.address1}
              onChange={(e) => handleChange("address1", e.target.value)}
              onBlur={() => handleBlur("address1")}
              className={`pl-9 text-sm ${
                touched.address1 && !isAddress1Valid
                  ? "border-rose-500 focus-visible:ring-rose-400"
                  : ""
              }`}
              required
            />
          </div>
          {touched.address1 && !isAddress1Valid && (
            <p className="text-[11px] text-rose-500">Please provide a complete street address.</p>
          )}
        </div>

        {/* Address Line 2 */}
        <div className="space-y-1.5">
          <Label htmlFor="checkout-address2" className="text-xs font-medium">
            Apartment, Suite, Landmark (Optional)
          </Label>
          <div className="relative">
            <Building className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="checkout-address2"
              type="text"
              placeholder="Near Rose Garden or Opposite City Bank"
              value={formData.address2}
              onChange={(e) => handleChange("address2", e.target.value)}
              className="pl-9 text-sm"
            />
          </div>
        </div>

        {/* PIN Code, City & State */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* PIN Code */}
          <div className="space-y-1.5">
            <Label htmlFor="checkout-postal" className="text-xs font-medium">
              PIN Code <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="checkout-postal"
              type="text"
              placeholder="400001"
              maxLength={6}
              value={formData.postalCode}
              onChange={(e) => handleChange("postalCode", e.target.value.replace(/\D/g, ""))}
              onBlur={() => handleBlur("postalCode")}
              className={`text-sm font-mono ${
                touched.postalCode && !isPostalCodeValid
                  ? "border-rose-500 focus-visible:ring-rose-400"
                  : ""
              }`}
              required
            />
            {touched.postalCode && !isPostalCodeValid && (
              <p className="text-[11px] text-rose-500">6-digit PIN required.</p>
            )}
          </div>

          {/* City */}
          <div className="space-y-1.5">
            <Label htmlFor="checkout-city" className="text-xs font-medium">
              City <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="checkout-city"
              type="text"
              placeholder="Mumbai"
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
              onBlur={() => handleBlur("city")}
              className={`text-sm ${
                touched.city && !isCityValid ? "border-rose-500 focus-visible:ring-rose-400" : ""
              }`}
              required
            />
          </div>

          {/* State */}
          <div className="space-y-1.5">
            <Label htmlFor="checkout-province" className="text-xs font-medium">
              State <span className="text-rose-500">*</span>
            </Label>
            <select
              id="checkout-province"
              value={formData.province}
              onChange={(e) => handleChange("province", e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              required
            >
              {INDIAN_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Special Delivery Note or Calligraphy Inscription */}
        <div className="space-y-1.5 pt-1">
          <Label htmlFor="checkout-notes" className="text-xs font-medium flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
            Special Delivery Instructions or Gift Note (Optional)
          </Label>
          <textarea
            id="checkout-notes"
            rows={2}
            placeholder="e.g. Please ring the doorbell twice, or 'Happy 30th Birthday Priya!'"
            value={formData.deliveryNotes}
            onChange={(e) => handleChange("deliveryNotes", e.target.value)}
            className="w-full rounded-md border border-input bg-background p-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        </div>

        {/* Save Address Toggle */}
        <div className="flex items-center gap-2 pt-2">
          <Checkbox
            id="save-address"
            checked={saveAddress}
            onCheckedChange={(checked) => setSaveAddress(Boolean(checked))}
          />
          <Label htmlFor="save-address" className="text-xs font-normal text-muted-foreground cursor-pointer">
            Save this address on this device for future orders
          </Label>
        </div>
      </div>
    </div>
  );
}
