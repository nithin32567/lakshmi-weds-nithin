import { Nilavilakku } from "./Nilavilakku";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-teak-deep py-16 text-center">
      <Nilavilakku className="mx-auto h-24 w-14" />
      <p className="mt-6 font-malayalam text-sm font-bold tracking-[0.26em] text-gold">
        നന്ദി · സ്നേഹത്തോടെ
      </p>
      <h2 className="mt-3 font-display text-4xl font-semibold text-gold-shine">Nithin &amp; Lakshmi</h2>
      <p className="mt-3 text-xs uppercase tracking-[0.3em] text-ivory/45">
        12 September 2026 · Kochi, Kerala
      </p>
      <div className="mx-auto my-8 h-px w-40 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <p className="font-malayalam text-[0.8rem] text-ivory/60 leading-relaxed max-w-sm mx-auto mt-2">
        ഞങ്ങളുടെ ഈ പുതിയ തുടക്കത്തിലേക്ക് പ്രിയപ്പെട്ട കൂട്ടുകാർക്കും കുടുംബാംഗങ്ങൾക്കും ഹൃദയം നിറഞ്ഞ സ്വാഗതം. നിങ്ങളുടെ സ്നേഹവും പ്രാർത്ഥനയും എപ്പോഴും കൂടെയുണ്ടാകണം.
      </p>
    </footer>
  );
}
