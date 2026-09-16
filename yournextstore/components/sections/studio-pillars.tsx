export function StudioPillars() {
	return (
		<section className="w-full bg-surface-container-lowest py-space-md shadow-sm">
			<div className="max-w-7xl mx-auto px-margin-mobile md:px-margin">
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
					{/* Pillar 1 */}
					<div className="flex flex-col items-center p-3 rounded-lg hover:bg-paper-tint transition-colors">
						<div className="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center text-primary mb-3">
							<span className="material-symbols-outlined text-[24px]">history_edu</span>
						</div>
						<h3 className="font-label-md text-label-md uppercase tracking-wider text-primary">Hand Written Scripts</h3>
						<p className="font-body-sm text-body-sm text-secondary mt-1 line-clamp-2">
							Each piece is handwritten with authentic dipped pen and pure archival fluid ink.
						</p>
					</div>
					{/* Pillar 2 */}
					<div className="flex flex-col items-center p-3 rounded-lg hover:bg-paper-tint transition-colors">
						<div className="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center text-primary mb-3">
							<span className="material-symbols-outlined text-[24px]">stylus</span>
						</div>
						<h3 className="font-label-md text-label-md uppercase tracking-wider text-primary">Various Styles</h3>
						<p className="font-body-sm text-body-sm text-secondary mt-1 line-clamp-2">
							Copperplate, modern script, flourishing, and bespoke heirloom lettering.
						</p>
					</div>
					{/* Pillar 3 */}
					<div className="flex flex-col items-center p-3 rounded-lg hover:bg-paper-tint transition-colors">
						<div className="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center text-primary mb-3">
							<span className="material-symbols-outlined text-[24px]">brush</span>
						</div>
						<h3 className="font-label-md text-label-md uppercase tracking-wider text-primary">Bespoke Customisation</h3>
						<p className="font-body-sm text-body-sm text-secondary mt-1 line-clamp-2">
							Open to bespoke commissions, tailored framing sizes, and custom prose.
						</p>
					</div>
					{/* Pillar 4 */}
					<div className="flex flex-col items-center p-3 rounded-lg hover:bg-paper-tint transition-colors">
						<div className="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center text-primary mb-3">
							<span className="material-symbols-outlined text-[24px]">verified</span>
						</div>
						<h3 className="font-label-md text-label-md uppercase tracking-wider text-primary">Artisanal Wax Seals</h3>
						<p className="font-body-sm text-body-sm text-secondary mt-1 line-clamp-2">
							Hand-poured flexible seal wax, real metallic flakes, and botanicals.
						</p>
					</div>
					{/* Pillar 5 */}
					<div className="flex flex-col items-center p-3 rounded-lg hover:bg-paper-tint transition-colors">
						<div className="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center text-primary mb-3">
							<span className="material-symbols-outlined text-[24px]">schedule</span>
						</div>
						<h3 className="font-label-md text-label-md uppercase tracking-wider text-primary">Fast Turnaround</h3>
						<p className="font-body-sm text-body-sm text-secondary mt-1 line-clamp-2">
							Carefully packaged and expedited to your doorstep worldwide.
						</p>
					</div>
					{/* Pillar 6 */}
					<div className="flex flex-col items-center p-3 rounded-lg hover:bg-paper-tint transition-colors">
						<div className="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center text-primary mb-3">
							<span className="material-symbols-outlined text-[24px]">school</span>
						</div>
						<h3 className="font-label-md text-label-md uppercase tracking-wider text-primary">Studio Workshops</h3>
						<p className="font-body-sm text-body-sm text-secondary mt-1 line-clamp-2">
							Intimate masterclasses in Maharashtra & virtual worldwide ateliers.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
