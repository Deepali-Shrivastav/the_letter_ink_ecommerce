export function WorkshopBanner() {
	return (
		<section className="w-full py-space-lg bg-background" id="workshops-section">
			<div className="max-w-7xl mx-auto px-margin-mobile md:px-margin">
				<div className="relative bg-tertiary-fixed rounded-2xl overflow-hidden shadow-sm p-8 md:p-12">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
						<div className="lg:col-span-7 flex flex-col">
							<span className="font-label-sm text-label-sm uppercase tracking-widest text-on-tertiary-fixed font-bold">
								Upcoming Studio Masterclass
							</span>
							<h3 className="font-headline-lg text-headline-lg text-primary tracking-wide mt-2">
								Modern Calligraphy & Pointed Pen Artistry
							</h3>
							<p className="font-body-md text-body-md text-secondary mt-3 leading-relaxed">
								Step inside our world of slow lettering. Learn pointed pen fundamentals, ink flow management,
								flourishing techniques, and wax seal making. Complete studio starter kit provided.
							</p>
							<div className="flex flex-wrap items-center gap-6 mt-6">
								<div className="flex items-center gap-2">
									<span className="material-symbols-outlined text-primary text-[20px]">calendar_today</span>
									<span className="font-label-md text-label-md text-primary">Seasonal Schedule Open</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="material-symbols-outlined text-primary text-[20px]">location_on</span>
									<span className="font-label-md text-label-md text-primary">Maharashtra Atelier & Live Zoom</span>
								</div>
							</div>
							<div className="flex items-center gap-4 mt-8">
								<button
									className="px-8 py-3 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest hover:bg-surface-container-lowest hover:text-primary transition-colors"
									type="button"
								>
									Enroll Now / Join Waitlist
								</button>
								<a
									href="#contact"
									className="font-label-sm text-label-sm uppercase tracking-widest text-primary underline"
								>
									Download Syllabus
								</a>
							</div>
						</div>
						<div className="lg:col-span-5 relative">
							<div className="aspect-[4/3] rounded-xl overflow-hidden shadow-md">
								<img
									src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQJbRvg9Pv1Xq_xQH-leXyuGomOTbK2zgMjO-IIPGXaf2KNazkzwPC37JUH5-aHrtlxoLHJxYtHafha05iGocQmZTcAYfDuYcTE-VbmHcYVkFlDtwa-3ebpMsz2NJiwhesO2Ok1tf2jHXYYtMIYhbI2P1WfsBzwpnW1jpxZuD0uuipq4A_x_3GE0acQEi3FbS4F0WXjRD4Fpq4VPBuG5KiTpQc6-pyTHN8tcJkY8VOP013TnK3d6o"
									alt="Intimate calligraphy workshop setting"
									className="w-full h-full object-cover"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
