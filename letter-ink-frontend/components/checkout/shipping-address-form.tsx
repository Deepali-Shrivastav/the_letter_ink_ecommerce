"use client";

import { CheckCircle2, Compass, Home, Loader2, Mail, MapPin, RotateCcw, Sparkles, User } from "lucide-react";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

export interface ShippingAddressFormHandle {
	validateAndFocus: () => boolean;
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
];

const LOCAL_STORAGE_KEY = "tli_saved_shipping_address";

interface ShippingAddressFormProps {
	initialData?: Partial<ShippingAddressData>;
	onChange: (data: ShippingAddressData, isValid: boolean) => void;
}

export const ShippingAddressForm = forwardRef<ShippingAddressFormHandle, ShippingAddressFormProps>(
	function ShippingAddressForm({ initialData, onChange }, ref) {
		// Combined Full Name state for easier entry
		const [fullName, setFullName] = useState(
			[initialData?.firstName, initialData?.lastName].filter(Boolean).join(" ") || "",
		);

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

		const [isDetectingPin, setIsDetectingPin] = useState(false);
		const [pinCityDetected, setPinCityDetected] = useState<string | null>(null);
		const [hasLoadedSaved, setHasLoadedSaved] = useState(false);
		const [touched, setTouched] = useState<Record<string, boolean>>({});

		// 1. Load saved address on mount
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
					const name = [parsed.firstName, parsed.lastName].filter(Boolean).join(" ");
					if (name) setFullName(name);
					setHasLoadedSaved(true);
				}
			} catch {
				// ignore
			}
		}, []);

		// 2. Split full name into first and last name (safely handling single name)
		const handleNameChange = (val: string) => {
			setFullName(val);
			const parts = val.trim().split(/\s+/);
			const first = parts[0] || "";
			// Backend APIs often reject empty lastName; fallback to firstName or period for single names
			const last = parts.slice(1).join(" ") || (first ? first : "");
			setFormData((prev) => ({ ...prev, firstName: first, lastName: last }));
		};

		// 3. Smart PIN Code Auto-Fill (City & State)
		const handlePinChange = async (val: string) => {
			const cleanPin = val.replace(/\D/g, "").slice(0, 6);
			setFormData((prev) => ({ ...prev, postalCode: cleanPin }));

			if (cleanPin.length === 6) {
				setIsDetectingPin(true);
				try {
					const res = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`);
					if (res.ok) {
						const data = await res.json();
						if (data?.[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
							const district = data[0].PostOffice[0].District;
							const state = data[0].PostOffice[0].State;

							if (district || state) {
								setFormData((prev) => ({
									...prev,
									city: district || prev.city,
									province: state || prev.province,
								}));
								setPinCityDetected(`${district}, ${state}`);
							}
						}
					}
				} catch {
					// fallback gracefully if external API is slow
				} finally {
					setIsDetectingPin(false);
				}
			} else {
				setPinCityDetected(null);
			}
		};

		const handleFieldChange = (field: keyof ShippingAddressData, value: string) => {
			setFormData((prev) => ({ ...prev, [field]: value }));
		};

		const handleBlur = (field: string) => {
			setTouched((prev) => ({ ...prev, [field]: true }));
		};

		const clearSavedAddress = () => {
			try {
				localStorage.removeItem(LOCAL_STORAGE_KEY);
			} catch {}
			setFullName("");
			setFormData({
				email: "",
				phone: "",
				firstName: "",
				lastName: "",
				address1: "",
				address2: "",
				city: "",
				province: "Maharashtra",
				postalCode: "",
				countryCode: "IN",
				deliveryNotes: "",
			});
			setHasLoadedSaved(false);
			setTouched({});
			setPinCityDetected(null);
		};

		// Validation
		const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());
		const isPhoneValid = /^[6-9]\d{9}$/.test(formData.phone.replace(/\D/g, "").slice(-10));
		const isNameValid = fullName.trim().length >= 2;
		const isAddressValid = formData.address1.trim().length >= 4;
		const isPinValid = /^\d{6}$/.test(formData.postalCode.trim());
		const isCityValid = formData.city.trim().length >= 2;
		const isStateValid = Boolean(formData.province);

		const isFormValid =
			isEmailValid &&
			isPhoneValid &&
			isNameValid &&
			isAddressValid &&
			isPinValid &&
			isCityValid &&
			isStateValid;

		// Expose validateAndFocus method to parent
		useImperativeHandle(ref, () => ({
			validateAndFocus: () => {
				setTouched({
					name: true,
					phone: true,
					email: true,
					address1: true,
					postalCode: true,
					city: true,
				});

				if (!isNameValid) {
					const el = document.getElementById("checkout-fullname");
					el?.focus();
					el?.scrollIntoView({ behavior: "smooth", block: "center" });
					return false;
				}
				if (!isPhoneValid) {
					const el = document.getElementById("checkout-phone");
					el?.focus();
					el?.scrollIntoView({ behavior: "smooth", block: "center" });
					return false;
				}
				if (!isEmailValid) {
					const el = document.getElementById("checkout-email");
					el?.focus();
					el?.scrollIntoView({ behavior: "smooth", block: "center" });
					return false;
				}
				if (!isAddressValid) {
					const el = document.getElementById("checkout-address1");
					el?.focus();
					el?.scrollIntoView({ behavior: "smooth", block: "center" });
					return false;
				}
				if (!isPinValid) {
					const el = document.getElementById("checkout-postal");
					el?.focus();
					el?.scrollIntoView({ behavior: "smooth", block: "center" });
					return false;
				}
				if (!isCityValid) {
					const el = document.getElementById("checkout-city");
					el?.focus();
					el?.scrollIntoView({ behavior: "smooth", block: "center" });
					return false;
				}
				return true;
			},
		}));

		// Propagate to parent
		useEffect(() => {
			onChange(formData, isFormValid);
			if (isFormValid) {
				try {
					localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
				} catch {}
			}
		}, [formData, isFormValid, onChange]);

		return (
			<div className="bg-card border border-border-vellum/90 rounded-xl p-6 sm:p-7 shadow-xs space-y-6 text-left">
				{/* Header Banner */}
				<div className="flex items-center justify-between pb-4 border-b border-border-vellum/60">
					<div className="flex items-center gap-2.5">
						<div className="h-9 w-9 rounded-full bg-paper-tint border border-border-vellum flex items-center justify-center text-primary">
							<MapPin className="h-4 w-4" />
						</div>
						<div>
							<h2 className="text-base sm:text-lg font-serif font-medium text-foreground">Delivery Address</h2>
							<p className="text-xs text-secondary">Where should we deliver your handcrafted stationery?</p>
						</div>
					</div>

					{isFormValid ? (
						<span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-300 dark:border-emerald-800">
							<CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
							Address Ready
						</span>
					) : null}
				</div>

				{/* Saved Address Notice & Reset Action */}
				{hasLoadedSaved && (
					<div className="flex items-center justify-between text-xs bg-paper-tint/70 border border-border-vellum px-3.5 py-2.5 rounded-sm">
						<span className="text-secondary">Saved on this device for faster checkout</span>
						<button
							type="button"
							onClick={clearSavedAddress}
							className="inline-flex items-center gap-1 font-medium text-primary hover:underline hover:text-brand-script transition-colors"
						>
							<RotateCcw className="h-3 w-3" />
							Use different address
						</button>
					</div>
				)}

				{/* Form Fields */}
				<div className="space-y-4">
					{/* Row 1: Full Name & Mobile */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="space-y-1.5">
							<Label htmlFor="checkout-fullname" className="text-xs font-medium text-foreground">
								Full Name *
							</Label>
							<div className="relative">
								<User className="absolute left-3 top-3 h-4 w-4 text-secondary/70" />
								<Input
									id="checkout-fullname"
									type="text"
									autoComplete="name"
									aria-required="true"
									aria-invalid={touched.name && !isNameValid}
									aria-describedby={touched.name && !isNameValid ? "checkout-fullname-error" : undefined}
									placeholder="e.g. Aarav Sharma"
									value={fullName}
									onChange={(e) => handleNameChange(e.target.value)}
									onBlur={() => handleBlur("name")}
									className={`pl-9 h-11 text-sm border-border-vellum focus-visible:ring-primary ${
										touched.name && !isNameValid ? "border-red-500 focus-visible:ring-red-500" : ""
									}`}
									required
								/>
							</div>
							{touched.name && !isNameValid && (
								<p id="checkout-fullname-error" role="alert" className="text-xs text-red-600 dark:text-red-400 font-medium">
									Please enter your full name.
								</p>
							)}
						</div>

						<div className="space-y-1.5">
							<Label htmlFor="checkout-phone" className="text-xs font-medium text-foreground">
								Mobile Number (10 Digits) *
							</Label>
							<div className="relative flex">
								<span className="inline-flex items-center px-3 border border-r-0 border-border-vellum rounded-l-md bg-paper-tint text-xs text-secondary font-medium tabular-nums">
									+91
								</span>
								<Input
									id="checkout-phone"
									type="tel"
									inputMode="numeric"
									autoComplete="tel"
									aria-required="true"
									aria-invalid={touched.phone && !isPhoneValid}
									aria-describedby={touched.phone && !isPhoneValid ? "checkout-phone-error" : undefined}
									placeholder="9876543210"
									maxLength={10}
									value={formData.phone}
									onChange={(e) => handleFieldChange("phone", e.target.value.replace(/\D/g, ""))}
									onBlur={() => handleBlur("phone")}
									className={`rounded-l-none h-11 text-sm tabular-nums border-border-vellum focus-visible:ring-primary ${
										touched.phone && !isPhoneValid ? "border-red-500 focus-visible:ring-red-500" : ""
									}`}
									required
								/>
							</div>
							{touched.phone && !isPhoneValid && (
								<p id="checkout-phone-error" role="alert" className="text-xs text-red-600 dark:text-red-400 font-medium">
									Enter a valid 10-digit mobile number.
								</p>
							)}
						</div>
					</div>

					{/* Row 2: Email Address */}
					<div className="space-y-1.5">
						<Label htmlFor="checkout-email" className="text-xs font-medium text-foreground">
							Email Address (for Order Receipt & Tracking) *
						</Label>
						<div className="relative">
							<Mail className="absolute left-3 top-3 h-4 w-4 text-secondary/70" />
							<Input
								id="checkout-email"
								type="email"
								autoComplete="email"
								aria-required="true"
								aria-invalid={touched.email && !isEmailValid}
								aria-describedby={touched.email && !isEmailValid ? "checkout-email-error" : undefined}
								placeholder="aarav.sharma@gmail.com"
								value={formData.email}
								onChange={(e) => handleFieldChange("email", e.target.value)}
								onBlur={() => handleBlur("email")}
								className={`pl-9 h-11 text-sm border-border-vellum focus-visible:ring-primary ${
									touched.email && !isEmailValid ? "border-red-500 focus-visible:ring-red-500" : ""
								}`}
								required
							/>
						</div>
						{touched.email && !isEmailValid && (
							<p id="checkout-email-error" role="alert" className="text-xs text-red-600 dark:text-red-400 font-medium">
								Please provide a valid email address.
							</p>
						)}
					</div>

					{/* Row 3: Street Address / Building / Flat */}
					<div className="space-y-1.5">
						<Label htmlFor="checkout-address1" className="text-xs font-medium text-foreground">
							Flat, House No., Building & Street *
						</Label>
						<div className="relative">
							<Home className="absolute left-3 top-3 h-4 w-4 text-secondary/70" />
							<Input
								id="checkout-address1"
								type="text"
								autoComplete="address-line1"
								aria-required="true"
								aria-invalid={touched.address1 && !isAddressValid}
								aria-describedby={touched.address1 && !isAddressValid ? "checkout-address1-error" : undefined}
								placeholder="e.g. 402, Lotus Bloom Enclave, 12th Main Road"
								value={formData.address1}
								onChange={(e) => handleFieldChange("address1", e.target.value)}
								onBlur={() => handleBlur("address1")}
								className={`pl-9 h-11 text-sm border-border-vellum focus-visible:ring-primary ${
									touched.address1 && !isAddressValid ? "border-red-500 focus-visible:ring-red-500" : ""
								}`}
								required
							/>
						</div>
						{touched.address1 && !isAddressValid && (
							<p id="checkout-address1-error" role="alert" className="text-xs text-red-600 dark:text-red-400 font-medium">
								Please enter your complete street address.
							</p>
						)}
					</div>

					{/* Row 4: PIN Code + Auto-Filled City & State */}
					<div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
						{/* PIN Code with instant auto-fill */}
						<div className="sm:col-span-4 space-y-1.5">
							<div className="flex items-center justify-between">
								<Label htmlFor="checkout-postal" className="text-xs font-medium text-foreground">
									PIN Code *
								</Label>
								{isDetectingPin && (
									<span className="text-xs text-secondary flex items-center gap-1">
										<Loader2 className="h-3 w-3 animate-spin text-primary" /> Detecting…
									</span>
								)}
							</div>
							<div className="relative">
								<Input
									id="checkout-postal"
									type="text"
									inputMode="numeric"
									pattern="[0-9]*"
									autoComplete="postal-code"
									aria-required="true"
									aria-invalid={touched.postalCode && !isPinValid}
									aria-describedby={touched.postalCode && !isPinValid ? "checkout-postal-error" : undefined}
									placeholder="400001"
									maxLength={6}
									value={formData.postalCode}
									onChange={(e) => handlePinChange(e.target.value)}
									onBlur={() => handleBlur("postalCode")}
									className={`h-11 text-sm tabular-nums border-border-vellum focus-visible:ring-primary ${
										touched.postalCode && !isPinValid ? "border-red-500 focus-visible:ring-red-500" : ""
									}`}
									required
								/>
							</div>
							{pinCityDetected && (
								<p className="text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-medium">
									<Sparkles className="h-3 w-3" /> Auto-detected: {pinCityDetected}
								</p>
							)}
							{touched.postalCode && !isPinValid && (
								<p id="checkout-postal-error" role="alert" className="text-xs text-red-600 dark:text-red-400 font-medium">
									6-digit PIN code required.
								</p>
							)}
						</div>

						{/* City */}
						<div className="sm:col-span-4 space-y-1.5">
							<Label htmlFor="checkout-city" className="text-xs font-medium text-foreground">
								City / District *
							</Label>
							<Input
								id="checkout-city"
								type="text"
								autoComplete="address-level2"
								aria-required="true"
								aria-invalid={touched.city && !isCityValid}
								aria-describedby={touched.city && !isCityValid ? "checkout-city-error" : undefined}
								placeholder="e.g. Mumbai"
								value={formData.city}
								onChange={(e) => handleFieldChange("city", e.target.value)}
								onBlur={() => handleBlur("city")}
								className={`h-11 text-sm border-border-vellum focus-visible:ring-primary ${
									touched.city && !isCityValid ? "border-red-500 focus-visible:ring-red-500" : ""
								}`}
								required
							/>
							{touched.city && !isCityValid && (
								<p id="checkout-city-error" role="alert" className="text-xs text-red-600 dark:text-red-400 font-medium">
									Please enter your city / district.
								</p>
							)}
						</div>

						{/* State */}
						<div className="sm:col-span-4 space-y-1.5">
							<Label htmlFor="checkout-state" className="text-xs font-medium text-foreground">
								State *
							</Label>
							<select
								id="checkout-state"
								autoComplete="address-level1"
								value={formData.province}
								onChange={(e) => handleFieldChange("province", e.target.value)}
								className="w-full h-11 px-3 rounded-md border border-border-vellum bg-background text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
								required
							>
								{INDIAN_STATES.map((s) => (
									<option key={s} value={s}>
										{s}
									</option>
								))}
							</select>
						</div>
					</div>

					{/* Row 5: Landmark & Delivery Note (Optional) */}
					<div className="space-y-1.5 pt-1">
						<Label htmlFor="checkout-landmark" className="text-xs font-medium text-secondary">
							Landmark or Delivery Instruction (Optional)
						</Label>
						<div className="relative">
							<Compass className="absolute left-3 top-3 h-4 w-4 text-secondary/70" />
							<Input
								id="checkout-landmark"
								type="text"
								autoComplete="off"
								placeholder="e.g. Near Rose Garden, or Call on arrival"
								value={formData.deliveryNotes || formData.address2}
								onChange={(e) => {
									handleFieldChange("deliveryNotes", e.target.value);
									handleFieldChange("address2", e.target.value);
								}}
								className="pl-9 h-11 text-sm border-border-vellum focus-visible:ring-primary"
							/>
						</div>
					</div>
				</div>

				{/* Footer reassurance */}
				<div className="pt-2 border-t border-border-vellum/60 flex items-center justify-between text-xs text-secondary">
					<span className="flex items-center gap-1.5">
						<CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
						Complimentary Express Courier Across India
					</span>
					<span className="text-xs text-secondary/70">All prices in INR (₹)</span>
				</div>
			</div>
		);
	},
);
