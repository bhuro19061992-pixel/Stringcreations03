import React, { useState, useMemo } from "react";
import { ArrowUpRight, Sparkles, X, MessageCircle } from "lucide-react";
import { STRING_ART_TYPES, TYPE_GROUPS } from "@/data/stringArtTypes";

const wa = (num, msg) => `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;

const TypeCard = ({ t, onOpen }) => (
  <button
    onClick={() => onOpen(t)}
    className="group relative overflow-hidden border border-ink/10 rounded-sm bg-canvas-alt/40 text-left h-full flex flex-col"
    data-testid={`type-card-${t.id}`}
  >
    <div className="relative aspect-[4/3] overflow-hidden bg-canvas-deep">
      <img
        src={t.image}
        alt={t.title}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-[1.04] transition-all duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-canvas-deep/85 via-canvas-deep/25 to-transparent" />
      <div className="absolute top-3 left-3 flex items-center gap-2">
        <span className="font-serif italic text-2xl text-metallic">{t.num}</span>
        {t.popular && (
          <span className="text-[9px] uppercase tracking-widest-2 bg-gold/90 text-canvas-deep px-2 py-0.5 rounded-full font-semibold">
            Popular
          </span>
        )}
      </div>
      <div className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-teal/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowUpRight className="w-4 h-4 text-canvas-deep" strokeWidth={2} />
      </div>
    </div>
    <div className="p-5 flex-1 flex flex-col">
      <div className="text-[10px] uppercase tracking-widest-2 text-teal mb-2">{t.group}</div>
      <h3 className="font-serif text-2xl text-ink mb-1.5">{t.title}</h3>
      <p className="text-sm text-ink-soft font-light leading-relaxed mb-4 line-clamp-2">{t.tagline}</p>
      <div className="flex flex-wrap gap-1.5 mt-auto">
        {t.variants.slice(0, 3).map((v) => (
          <span key={v} className="text-[10px] uppercase tracking-widest-2 text-ink-soft border border-ink/15 rounded-full px-2.5 py-1">
            {v}
          </span>
        ))}
        {t.variants.length > 3 && (
          <span className="text-[10px] uppercase tracking-widest-2 text-teal border border-teal/30 rounded-full px-2.5 py-1">
            +{t.variants.length - 3} more
          </span>
        )}
      </div>
    </div>
  </button>
);

const TypeDialog = ({ type, onClose, whatsapp, brand }) => {
  if (!type) return null;
  const orderMsg = (variant) =>
    `Hi ${brand}! I'd like to commission a ${type.title.toLowerCase()} string art${
      variant ? ` (${variant})` : ""
    }. Please share the next steps.`;

  return (
    <div
      className="fixed inset-0 z-[70] bg-canvas-deep/85 backdrop-blur-md flex items-center justify-center p-4 md:p-8 overflow-y-auto"
      onClick={onClose}
      data-testid="type-dialog"
    >
      <div
        className="w-full max-w-5xl bg-canvas border border-ink/15 rounded-sm relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-canvas-deep/70 border border-ink/20 flex items-center justify-center text-ink hover:text-teal"
          data-testid="type-dialog-close"
          aria-label="Close"
        >
          <X className="w-4 h-4" strokeWidth={1.5} />
        </button>

        <div className="grid md:grid-cols-2">
          <div className="relative bg-canvas-deep aspect-square md:aspect-auto md:min-h-[520px]">
            <img src={type.image} alt={type.title} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute top-4 left-4">
              <span className="font-serif italic text-4xl text-metallic">{type.num}</span>
            </div>
          </div>
          <div className="p-6 md:p-10 flex flex-col">
            <div className="text-[10px] uppercase tracking-widest-2 text-teal mb-3">{type.group} · Type {type.num}</div>
            <h2 className="font-serif text-3xl md:text-4xl leading-tight mb-3">{type.title}</h2>
            <p className="text-ink-soft font-light leading-relaxed mb-6">{type.tagline}</p>

            <div className="text-[10px] uppercase tracking-widest-2 text-ink-soft/70 mb-3">Variants available</div>
            <div className="flex flex-wrap gap-2 mb-8">
              {type.variants.map((v) => (
                <a
                  key={v}
                  href={wa(whatsapp || "919999999999", orderMsg(v))}
                  target="_blank"
                  rel="noreferrer"
                  data-testid={`type-variant-${v.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "")}`}
                  className="group inline-flex items-center gap-1.5 text-xs bg-canvas-alt/70 hover:bg-teal hover:text-canvas-deep border border-ink/15 hover:border-teal rounded-full px-3.5 py-2 transition-colors"
                >
                  {v}
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
                </a>
              ))}
            </div>

            <a
              href={wa(whatsapp || "919999999999", orderMsg())}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-teal text-canvas-deep px-6 py-3.5 rounded-full text-[11px] uppercase tracking-widest-2 font-medium hover:bg-teal/90 transition-colors mt-auto"
              data-testid="type-order-cta"
            >
              <MessageCircle className="w-4 h-4" strokeWidth={1.75} />
              Order this type on WhatsApp
            </a>
            <div className="mt-3 text-[10px] uppercase tracking-widest-2 text-ink-soft/70 text-center">
              Sample photo shown · your piece will be one-of-one
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TypesCatalog = ({ settings }) => {
  const [group, setGroup] = useState("All");
  const [open, setOpen] = useState(null);
  const shown = useMemo(
    () => (group === "All" ? STRING_ART_TYPES : STRING_ART_TYPES.filter((t) => t.group === group)),
    [group]
  );

  return (
    <section id="types" className="py-24 md:py-32" data-testid="types-catalog-section">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-12">
          <div className="max-w-2xl">
            <span className="overline">30 String Art Types</span>
            <h2 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight font-light">
              Every style, <span className="italic text-metallic">every variant.</span>
            </h2>
            <p className="mt-4 text-ink-soft font-light leading-relaxed max-w-xl">
              Explore the full catalogue — from classical mandalas to scannable QR codes.
              Tap any type to see its variants and order on WhatsApp.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-ink-soft">
            <Sparkles className="w-4 h-4 text-teal" strokeWidth={1.5} />
            <span>{STRING_ART_TYPES.length} types · 90+ variants</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-10" data-testid="type-group-filter">
          {TYPE_GROUPS.map((g) => (
            <button
              key={g}
              onClick={() => setGroup(g)}
              data-testid={`type-filter-${g.toLowerCase()}`}
              className={`px-4 py-2 text-[10px] uppercase tracking-widest-2 rounded-full border transition-all ${
                group === g
                  ? "bg-teal border-teal text-canvas-deep"
                  : "bg-transparent border-ink/20 text-ink-soft hover:border-teal hover:text-teal"
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6" data-testid="types-grid">
          {shown.map((t) => (
            <TypeCard key={t.id} t={t} onOpen={setOpen} />
          ))}
        </div>
      </div>

      <TypeDialog
        type={open}
        onClose={() => setOpen(null)}
        whatsapp={settings.whatsapp}
        brand={settings.brand_name}
      />
    </section>
  );
};

export default TypesCatalog;
