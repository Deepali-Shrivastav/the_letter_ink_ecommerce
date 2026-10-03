"use client";

import { CheckCircle2, Compass, Home, Loader2, Mail, MapPin, RotateCcw, Sparkles, User } from "lucide-react";
import { useEffect, useState } from "react";
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

export function ShippingAddressForm({ initialData, onChange }: ShippingAddressFormProps) {
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

	// 2. Split full name into first and last name
	const handleNameChange = (val: string) => {
		setFullName(val);
		const parts = val.trim().split(/\s+/);
		const first = parts[0] || "";
		const last = parts.slice(1).join(" ") || "";
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
		<div className="bg-white border border-stone-200/90 rounded-2xl p-6 sm:p-7 shadow-xs space-y-6 text-left">
			{/* Header Banner */}
			<div className="flex items-center justify-between pb-4 border-b border-stone-100">
				<div className="flex items-center gap-2.5">
					<div className="h-8 w-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-800">
						<MapPin className="h-4 w-4" />
					</div>
					<div>
						<h2 className="text-base sm:text-lg font-serif font-medium text-stone-900">Delivery Address</h2>
						<p className="text-xs text-stone-500">Where should we deliver your handcrafted stationery?</p>
					</div>
				</div>

				{isFormValid ? (
					<span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
						<CheckCircle2 className="h-3.5 w-3.5" />
						Address Ready
					</span>
				) : hasLoadedSaved ? (
					<button
						type="button"
						onClick={clearSavedAddress}
						className="inline-flex items-center gap-1 text-[11px] text-stone-400 hover:text-stone-700 transition-colors"
						title="Reset address"
					>
						<RotateCcw className="h-3 w-3" />
						Reset
					</button>
				) : null}
			</div>

			{/* Form Fields - Minimal & Clean */}
			<div className="space-y-4">
				{/* Row 1: Full Name & Mobile */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="space-y-1.5">
						<Label htmlFor="checkout-fullname" className="text-xs font-medium text-stone-700">
							Full Name *
						</Label>
						<div className="relative">
							<User className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
							<Input
								id="checkout-fullname"
								type="text"
								placeholder="e.g. Aarav Sharma"
								value={fullName}
								onChange={(e) => handleNameChange(e.target.value)}
								onBlur={() => handleBlur("name")}
								className={`pl-9 h-11 text-sm border-stone-200 focus-visible:ring-stone-800 ${
									touched.name && !isNameValid ? "border-rose-400 focus-visible:ring-rose-400" : ""
								}`}
								required
							/>
						</div>
						{touched.name && !isNameValid && (
							<p className="text-[11px] text-rose-500">Please enter your name.</p>
						)}
					</div>

					<div className="space-y-1.5">
						<Label htmlFor="checkout-phone" className="text-xs font-medium text-stone-700">
							Mobile Number (10 Digits) *
						</Label>
						<div className="relative flex">
							<span className="inline-flex items-center px-3 border border-r-0 border-stone-200 rounded-l-md bg-stone-50 text-xs text-stone-600 font-mono">
								+91
							</span>
							<Input
								id="checkout-phone"
								type="tel"
								placeholder="9876543210"
								maxLength={10}
								value={formData.phone}
								onChange={(e) => handleFieldChange("phone", e.target.value.replace(/\D/g, ""))}
								onBlur={() => handleBlur("phone")}
								className={`rounded-l-none h-11 text-sm font-mono border-stone-200 focus-visible:ring-stone-800 ${
									touched.phone && !isPhoneValid ? "border-rose-400 focus-visible:ring-rose-400" : ""
								}`}
								required
							/>
						</div>
						{touched.phone && !isPhoneValid && (
							<p className="text-[11px] text-rose-500">Enter a valid 10-digit mobile number.</p>
						)}
					</div>
				</div>

				{/* Row 2: Email Address */}
				<div className="space-y-1.5">
					<Label htmlFor="checkout-email" className="text-xs font-medium text-stone-700">
						Email Address (for Order Receipt & Tracking) *
					</Label>
					<div className="relative">
						<Mail className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
						<Input
							id="checkout-email"
							type="email"
							placeholder="aarav.sharma@gmail.com"
							value={formData.email}
							onChange={(e) => handleFieldChange("email", e.target.value)}
							onBlur={() => handleBlur("email")}
							className={`pl-9 h-11 text-sm border-stone-200 focus-visible:ring-stone-800 ${
								touched.email && !isEmailValid ? "border-rose-400 focus-visible:ring-rose-400" : ""
							}`}
							required
						/>
					</div>
					{touched.email && !isEmailValid && (
						<p className="text-[11px] text-rose-500">Please provide a valid email.</p>
					)}
				</div>

				{/* Row 3: Street Address / Building / Flat */}
				<div className="space-y-1.5">
					<Label htmlFor="checkout-address1" className="text-xs font-medium text-stone-700">
						Flat, House No., Building & Street *
					</Label>
					<div className="relative">
						<Home className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
						<Input
							id="checkout-address1"
							type="text"
							placeholder="e.g. 402, Lotus Bloom Enclave, 12th Main Road"
							value={formData.address1}
							onChange={(e) => handleFieldChange("address1", e.target.value)}
							onBlur={() => handleBlur("address1")}
							className={`pl-9 h-11 text-sm border-stone-200 focus-visible:ring-stone-800 ${
								touched.address1 && !isAddressValid ? "border-rose-400 focus-visible:ring-rose-400" : ""
							}`}
							required
						/>
					</div>
					{touched.address1 && !isAddressValid && (
						<p className="text-[11px] text-rose-500">Please enter your street address.</p>
					)}
				</div>

				{/* Row 4: PIN Code + Auto-Filled City & State */}
				<div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
					{/* PIN Code with instant auto-fill */}
					<div className="sm:col-span-4 space-y-1.5">
						<div className="flex items-center justify-between">
							<Label htmlFor="checkout-postal" className="text-xs font-medium text-stone-700">
								PIN Code *
							</Label>
							{isDetectingPin && (
								<span className="text-[10px] text-amber-700 flex items-center gap-1">
									<Loader2 className="h-3 w-3 animate-spin" /> Detecting…
								</span>
							)}
						</div>
						<div className="relative">
							<Input
								id="checkout-postal"
								type="text"
								placeholder="400001"
								maxLength={6}
								value={formData.postalCode}
								onChange={(e) => handlePinChange(e.target.value)}
								onBlur={() => handleBlur("postalCode")}
								className={`h-11 text-sm font-mono border-stone-200 focus-visible:ring-stone-800 ${
									touched.postalCode && !isPinValid ? "border-rose-400 focus-visible:ring-rose-400" : ""
								}`}
								required
							/>
						</div>
						{pinCityDetected && (
							<p className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
								<Sparkles className="h-3 w-3" /> Auto-detected: {pinCityDetected}
							</p>
						)}
						{touched.postalCode && !isPinValid && (
							<p className="text-[11px] text-rose-500">6-digit PIN required.</p>
						)}
					</div>

					{/* City */}
					<div className="sm:col-span-4 space-y-1.5">
						<Label htmlFor="checkout-city" className="text-xs font-medium text-stone-700">
							City / District *
						</Label>
						<Input
							id="checkout-city"
							type="text"
							placeholder="e.g. Mumbai"
							value={formData.city}
							onChange={(e) => handleFieldChange("city", e.target.value)}
							onBlur={() => handleBlur("city")}
							className={`h-11 text-sm border-stone-200 focus-visible:ring-stone-800 ${
								touched.city && !isCityValid ? "border-rose-400 focus-visible:ring-rose-400" : ""
							}`}
							required
						/>
					</div>

					{/* State */}
					<div className="sm:col-span-4 space-y-1.5">
						<Label htmlFor="checkout-state" className="text-xs font-medium text-stone-700">
							State *
						</Label>
						<select
							id="checkout-state"
							value={formData.province}
							onChange={(e) => handleFieldChange("province", e.target.value)}
							className="w-full h-11 px-3 rounded-md border border-stone-200 bg-white text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-800"
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
					<Label htmlFor="checkout-landmark" className="text-xs font-medium text-stone-600">
						Landmark or Delivery Instruction (Optional)
					</Label>
					<div className="relative">
						<Compass className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
						<Input
							id="checkout-landmark"
							type="text"
							placeholder="e.g. Near Rose Garden, or Call on arrival"
							value={formData.deliveryNotes || formData.address2}
							onChange={(e) => {
								handleFieldChange("deliveryNotes", e.target.value);
								handleFieldChange("address2", e.target.value);
							}}
							className="pl-9 h-11 text-sm border-stone-200 focus-visible:ring-stone-800"
						/>
					</div>
				</div>
			</div>

			{/* Footer reassurance */}
			<div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
				<span className="flex items-center gap-1.5">
					<CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
					Domestic Express Courier Across India
				</span>
				<span className="text-[11px] text-stone-400">All prices in INR (₹)</span>
			</div>
		</div>
	);
}
