import React, { useMemo, useState } from 'react';
import { Calculator, IndianRupee, Percent, RotateCcw } from 'lucide-react';

const formatCurrency = (value) => new Intl.NumberFormat('en-IN', {
	maximumFractionDigits: 0,
}).format(Math.round(value));

const EMICAL = ({ compact = false }) => {
	const [loanAmount, setLoanAmount] = useState(5000000);
	const [interestRate, setInterestRate] = useState(8.5);
	const [tenure, setTenure] = useState(20);

	const result = useMemo(() => {
		const principal = Number(loanAmount) || 0;
		const monthlyRate = (Number(interestRate) || 0) / 1200;
		const months = (Number(tenure) || 0) * 12;
		const monthlyEmi = monthlyRate === 0
			? principal / months
			: principal * monthlyRate * ((1 + monthlyRate) ** months) / (((1 + monthlyRate) ** months) - 1);
		const totalPayable = monthlyEmi * months;

		return {
			monthlyEmi: Number.isFinite(monthlyEmi) ? monthlyEmi : 0,
			totalInterest: Number.isFinite(totalPayable - principal) ? totalPayable - principal : 0,
			totalPayable: Number.isFinite(totalPayable) ? totalPayable : 0,
		};
	}, [loanAmount, interestRate, tenure]);

	const resetCalculator = () => {
		setLoanAmount(5000000);
		setInterestRate(8.5);
		setTenure(20);
	};

	return (
		<section className={compact ? 'py-0' : 'container-custom py-12 sm:py-16'} aria-labelledby="emi-calculator-title">
			<div className={`relative overflow-hidden ${compact ? '' : 'border border-border bg-surface-raised shadow-[0_18px_45px_rgba(30,41,38,0.08)]'}`}>
				<div className="absolute right-0 top-0 h-full w-1/3 blueprint-grid opacity-40 pointer-events-none" />

				<div className={`relative grid ${compact ? 'grid-cols-1' : 'lg:grid-cols-[1.05fr_0.95fr]'}`}>
					<div className={compact ? 'p-0' : 'p-6 sm:p-9 lg:p-12'}>
						<div className={`${compact ? 'mb-6 pb-5' : 'mb-8 pb-6'} flex items-start justify-between gap-4 border-b border-border`}>
							<div>
								<div className="mb-3 flex items-center gap-2 text-[11px] font-mono font-semibold uppercase tracking-[0.16em] text-accent">
									<Calculator className="h-4 w-4" aria-hidden="true" />
									Financial planning desk
								</div>
								<h2 id="emi-calculator-title" className={`${compact ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl'} font-heading font-semibold tracking-tight text-ink`}>
									Estimate your monthly outlay
								</h2>
								<p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-secondary">
									Adjust the numbers to see an indicative home loan repayment plan.
								</p>
							</div>
							<button
								type="button"
								onClick={resetCalculator}
								className="shrink-0 border border-border p-2.5 text-ink-muted transition-colors hover:border-accent hover:text-accent"
								aria-label="Reset EMI calculator"
								title="Reset calculator"
							>
								<RotateCcw className="h-4 w-4" aria-hidden="true" />
							</button>
						</div>

						<div className={compact ? 'space-y-5' : 'space-y-8'}>
							<div>
								<div className="mb-3 flex items-center justify-between gap-4">
									<label htmlFor="loan-amount" className="form-label mb-0">Loan amount</label>
									<div className="relative w-40">
										<IndianRupee className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
										<input
											id="loan-amount"
											type="number"
											min="100000"
											max="100000000"
											step="100000"
											value={loanAmount}
											onChange={(event) => setLoanAmount(event.target.value)}
											className="form-input pl-8 text-right font-mono"
										/>
									</div>
								</div>
								<input
									type="range"
									min="100000"
									max="100000000"
									step="100000"
									value={loanAmount}
									onChange={(event) => setLoanAmount(event.target.value)}
									className="h-1.5 w-full cursor-pointer accent-[var(--accent)]"
									aria-label="Loan amount slider"
								/>
								<div className="mt-2 flex justify-between text-[11px] font-mono text-ink-muted"><span>₹1 Lac</span><span>₹10 Cr</span></div>
							</div>

							<div>
								<div className="mb-3 flex items-center justify-between gap-4">
									<label htmlFor="interest-rate" className="form-label mb-0">Interest rate</label>
									<div className="relative w-32">
										<Percent className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
										<input
											id="interest-rate"
											type="number"
											min="0"
											max="20"
											step="0.05"
											value={interestRate}
											onChange={(event) => setInterestRate(event.target.value)}
											className="form-input pl-8 text-right font-mono"
										/>
									</div>
								</div>
								<input type="range" min="0" max="20" step="0.05" value={interestRate} onChange={(event) => setInterestRate(event.target.value)} className="h-1.5 w-full cursor-pointer accent-[var(--accent)]" aria-label="Interest rate slider" />
								<div className="mt-2 flex justify-between text-[11px] font-mono text-ink-muted"><span>0%</span><span>20%</span></div>
							</div>

							<div>
								<div className="mb-3 flex items-center justify-between gap-4">
									<label htmlFor="loan-tenure" className="form-label mb-0">Loan tenure</label>
									<div className="flex w-32 items-center border border-border bg-surface-raised">
										<input id="loan-tenure" type="number" min="1" max="30" value={tenure} onChange={(event) => setTenure(event.target.value)} className="w-full border-0 bg-transparent p-3 text-right font-mono text-sm text-ink outline-none" />
										<span className="pr-3 text-xs text-ink-muted">yrs</span>
									</div>
								</div>
								<input type="range" min="1" max="30" step="1" value={tenure} onChange={(event) => setTenure(event.target.value)} className="h-1.5 w-full cursor-pointer accent-[var(--accent)]" aria-label="Loan tenure slider" />
								<div className="mt-2 flex justify-between text-[11px] font-mono text-ink-muted"><span>1 year</span><span>30 years</span></div>
							</div>
						</div>
					</div>

					<div className={`relative flex flex-col justify-between bg-dark text-[var(--text-inverse)] ${compact ? 'mt-6 p-5' : 'p-6 sm:p-9 lg:p-12'}`}>
						<div>
							<div className="text-[11px] font-mono uppercase tracking-[0.16em] text-[var(--brass)]">Indicative repayment</div>
							<div className="mt-4 border-b border-white/15 pb-8">
								<div className="text-sm text-white/60">Your monthly EMI</div>
								<div className="mt-2 font-heading text-4xl font-semibold tracking-tight text-white sm:text-5xl">
									₹{formatCurrency(result.monthlyEmi)}
								</div>
							</div>

							<dl className="divide-y divide-white/15">
								<div className="flex items-center justify-between gap-4 py-5"><dt className="text-sm text-white/60">Principal amount</dt><dd className="font-mono text-sm">₹{formatCurrency(Number(loanAmount) || 0)}</dd></div>
								<div className="flex items-center justify-between gap-4 py-5"><dt className="text-sm text-white/60">Total interest</dt><dd className="font-mono text-sm text-[var(--brass)]">₹{formatCurrency(result.totalInterest)}</dd></div>
								<div className="flex items-center justify-between gap-4 py-5"><dt className="text-sm text-white/60">Total repayment</dt><dd className="font-mono text-sm">₹{formatCurrency(result.totalPayable)}</dd></div>
							</dl>
						</div>
						<p className="mt-10 border-l border-[var(--brass)] pl-4 text-xs leading-relaxed text-white/50">
							This is an indicative calculation. Final terms depend on the lender, credit profile, and applicable charges.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
};

export default EMICAL;
