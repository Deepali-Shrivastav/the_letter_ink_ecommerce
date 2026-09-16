export function ClientReviews() {
	const reviews = [
		{
			id: 1,
			quote:
				"Absolutely stunning craftsmanship. The engraving on our champagne glasses was pristine and made for our most treasured wedding keepsake.",
			initials: "PS",
			name: "Priya S.",
			location: "Verified Patron • Mumbai",
		},
		{
			id: 2,
			quote:
				"The Name Frame Royal Large exceeded all expectations. Seeing our family name penned with such historical grandeur on cotton stock brought tears of joy.",
			initials: "RM",
			name: "Rahul M.",
			location: "Verified Patron • Pune",
		},
		{
			id: 3,
			quote:
				"Such a heartwarming anniversary gift! The brass scroll frame with dried flowers and custom written vows was wrapped so gracefully, ready to impress.",
			initials: "AG",
			name: "Ananya G.",
			location: "Verified Patron • Delhi",
		},
		{
			id: 4,
			quote:
				"The Letter Ink addressed 180 envelopes for our international wedding. The copperplate flourishes and wax seals set an unforgettable tone before guests arrived.",
			initials: "RK",
			name: "Rohan K.",
			location: "Verified Patron • Bengaluru",
		},
	];

	return (
		<section className="w-full py-space-xl bg-surface-container-lowest">
			<div className="max-w-7xl mx-auto px-margin-mobile md:px-margin">
				<div className="text-center mb-space-md">
					<span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">
						The Patron Experience
					</span>
					<h2 className="font-headline-lg text-headline-lg text-primary tracking-wide mt-1">Stories From Our Clients</h2>
					<div className="w-12 h-0.5 bg-primary/20 mx-auto mt-4" />
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{reviews.map((review) => (
						<div key={review.id} className="p-6 bg-paper-tint rounded-xl shadow-sm flex flex-col justify-between">
							<div>
								<div className="flex items-center gap-1 text-amber-500 mb-3">
									{[...Array(5)].map((_, i) => (
										<span
											key={i}
											className="material-symbols-outlined text-[18px]"
											style={{ fontVariationSettings: "'FILL' 1" }}
										>
											star
										</span>
									))}
								</div>
								<p className="font-body-md text-body-md text-secondary italic mb-4">“{review.quote}”</p>
							</div>
							<div className="flex items-center gap-3 pt-3">
								<div className="w-9 h-9 rounded-full bg-tertiary-fixed flex items-center justify-center font-bold text-primary text-sm">
									{review.initials}
								</div>
								<div>
									<h4 className="font-label-sm text-label-sm uppercase text-primary font-bold">{review.name}</h4>
									<span className="font-body-sm text-[12px] text-secondary">{review.location}</span>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
