import { useState } from 'react';

interface ChecklistFormProps {
  onGenerate: (productName: string, intendedUse: string) => void;
  isLoading: boolean;
}

export default function ChecklistForm({ onGenerate, isLoading }: ChecklistFormProps) {
  const [productName, setProductName] = useState('');
  const [intendedUse, setIntendedUse] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (productName.trim() && intendedUse.trim() && !isLoading) {
      onGenerate(productName.trim(), intendedUse.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 md:p-8 rounded-2xl bg-surface-card border border-border shadow-[0_4px_20px_rgba(0,0,0,0.15)] animate-fade-in-up">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-glow text-[#E9441F] mb-4">
          <span className="material-symbols-outlined text-[28px]">rule_folder</span>
        </div>
        <h2 className="text-[24px] font-bold text-text-primary mb-2">Compliance Checklist Generator</h2>
        <p className="text-[15px] text-text-muted max-w-md mx-auto">
          Generate a product-specific BIS compliance checklist tailored to your intended market and use case.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="productName" className="block text-[14px] font-semibold text-text-primary">
            Product Name <span className="text-status-red">*</span>
          </label>
          <input
            id="productName"
            type="text"
            required
            disabled={isLoading}
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="e.g., Electric Water Heater"
            className="w-full px-4 py-3 rounded-xl bg-surface-elevated border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all disabled:opacity-60"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="intendedUse" className="block text-[14px] font-semibold text-text-primary">
            Intended Market / Use <span className="text-status-red">*</span>
          </label>
          <input
            id="intendedUse"
            type="text"
            required
            disabled={isLoading}
            value={intendedUse}
            onChange={(e) => setIntendedUse(e.target.value)}
            placeholder="e.g., Domestic household use in India"
            className="w-full px-4 py-3 rounded-xl bg-surface-elevated border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all disabled:opacity-60"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={!productName.trim() || !intendedUse.trim() || isLoading}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#E9441F] hover:bg-[#CC3A1A] disabled:opacity-50 disabled:hover:bg-[#E9441F] text-white font-semibold transition-all shadow-sm"
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                <span>Generating Checklist...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">fact_check</span>
                <span>Generate Checklist</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
