                            <ul className="space-y-3 text-sm font-medium text-slate-600">
                                {['Features', 'Integrations', 'Enterprise', 'Security', 'Changelog'].map(l => (
                                    <li key={l}><a href="#" className="hover:text-slate-300 transition-colors">{l}</a></li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h5 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500 mb-5">Company</h5>
                            <ul className="space-y-3 text-sm font-medium text-slate-600">
                                {['About Us', 'Careers', 'Blog', 'Contact', 'Partners'].map(l => (
                                    <li key={l}><a href="#" className="hover:text-slate-300 transition-colors">{l}</a></li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h5 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500 mb-5">Stay Updated</h5>
                            <p className="text-sm text-slate-600 mb-4">Get the latest product updates and sales tips weekly.</p>
                            <div className="flex gap-2">
                                <input type="email" placeholder="your@email.com" className="flex-1 bg-white/5 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-600 outline-none focus:border-indigo-500/50 transition-colors" />
                                <button className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors">
                                    <ArrowRight size={15} className="text-white" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/[0.06] gap-4">
                        <p className="text-xs text-slate-700">┬⌐ 2025 Lead Converter CRM. All rights reserved.</p>
                        <div className="flex gap-6 text-xs text-slate-700">
                            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(l => (
                                <a key={l} href="#" className="hover:text-slate-400 transition-colors">{l}</a>
                            ))}
                        </div>
                    </div>
                </div>
                </div>
            </footer>

            {/* Pricing Modal */}
            {isPricingModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
                    <div className="bg-[#0D1220] border border-white/10 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
                        <button
                            onClick={() => setIsPricingModalOpen(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                        >
                            Γ£ò
                        </button>
                        <h3 className="text-xl font-bold text-white mb-2">Request Custom Quote</h3>
                        <p className="text-sm text-slate-400 mb-6">Let us know exactly how to reach you so we can send your customized pricing and features plan.</p>
                        
                        <form onSubmit={handlePricingSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name *</label>
                                <input required type="text"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                                    value={pricingForm.name} onChange={e => setPricingForm({ ...pricingForm, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1.5">Work Email *</label>
                                <input required type="email"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                                    value={pricingForm.email} onChange={e => setPricingForm({ ...pricingForm, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1.5">Mobile Number *</label>
                                <input required type="tel"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                                    value={pricingForm.mobile} onChange={e => setPricingForm({ ...pricingForm, mobile: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1.5">Business Name</label>
                                <input type="text"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                                    value={pricingForm.business_name} onChange={e => setPricingForm({ ...pricingForm, business_name: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition-all mt-4"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
