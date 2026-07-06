import React, { useState } from "react";
import { X, ArrowLeft, ArrowRight, MessageCircle, ShieldCheck } from "lucide-react";

const wa = (num, msg) =>
  `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;

export const ProductCard = ({ product, onOpen }) => {
  const cover = product.images?.[0];
  return (
    <button
      onClick={() => onOpen(product)}
      className="group relative overflow-hidden border border-ink/10 rounded-sm bg-canvas-alt/40 text-left"
      data-testid={`product-card-${product.id}`}
    >
      <div className="aspect-[4/5] w-full overflow-hidden bg-canvas-deep">
        {cover ? (
          <img
            src={cover}
            alt={product.title}
            loading="lazy"
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.04] transition-all duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink-soft/40 text-sm">No image</div>
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-canvas-deep/85 via-canvas-deep/20 to-transparent pointer-events-none" />
      <div className="absolute left-0 right-0 bottom-0 p-4 md:p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-serif text-xl md:text-2xl text-ink truncate">{product.title}</h3>
          {product.price && (
            <span className="text-[11px] uppercase tracking-widest-2 text-metallic-gold whitespace-nowrap">
              {product.price}
            </span>
          )}
        </div>
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[10px] uppercase tracking-widest-2 text-teal/90">
          {product.category && <span>{product.category}</span>}
          {product.size && <span>· {product.size}</span>}
          {!product.in_stock && <span className="text-metallic-gold">· Made to order</span>}
        </div>
      </div>
    </button>
  );
};

const embedUrl = (url) => {
  if (!url) return "";
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  return url;
};

export const ProductDialog = ({ product, onClose, whatsapp }) => {
  const [idx, setIdx] = useState(0);
  if (!product) return null;
  const images = product.images || [];
  const cur = images[idx];
  const total = images.length;
  const next = () => setIdx((i) => (i + 1) % Math.max(total, 1));
  const prev = () => setIdx((i) => (i - 1 + Math.max(total, 1)) % Math.max(total, 1));

  return (
    <div
      className="fixed inset-0 z-[70] bg-canvas-deep/85 backdrop-blur-md flex items-center justify-center p-4 md:p-8 overflow-y-auto"
      onClick={onClose}
      data-testid="product-dialog"
    >
      <div
        className="w-full max-w-6xl bg-canvas border border-ink/15 rounded-sm relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-canvas-deep/70 border border-ink/20 flex items-center justify-center text-ink hover:text-teal"
          data-testid="dialog-close"
          aria-label="Close"
        >
          <X className="w-4 h-4" strokeWidth={1.5} />
        </button>

        <div className="grid md:grid-cols-2">
          <div className="relative bg-canvas-deep aspect-square md:aspect-auto md:min-h-[520px]">
            {cur ? (
              <img src={cur} alt={product.title} className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-ink-soft/50">No image</div>
            )}
            {total > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-canvas-deep/80 border border-ink/20 text-ink hover:text-teal flex items-center justify-center"
                  data-testid="dialog-prev"
                  aria-label="Previous image"
                >
                  <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-canvas-deep/80 border border-ink/20 text-ink hover:text-teal flex items-center justify-center"
                  data-testid="dialog-next"
                  aria-label="Next image"
                >
                  <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 rounded-full transition-all ${
                        i === idx ? "w-6 bg-teal" : "w-1.5 bg-ink/40"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="p-6 md:p-10 flex flex-col">
            <div className="text-[11px] uppercase tracking-widest-2 text-teal mb-3">
              {product.category || "Original Work"}
            </div>
            <h2 className="font-serif text-3xl md:text-4xl leading-tight mb-4">{product.title}</h2>
            {product.price && (
              <div className="text-2xl font-serif text-metallic-gold mb-6">{product.price}</div>
            )}
            {product.description && (
              <p className="text-ink-soft font-light leading-relaxed mb-6 whitespace-pre-line">
                {product.description}
              </p>
            )}

            <dl className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm border-t border-ink/15 pt-5 mb-6">
              {product.size && (
                <>
                  <dt className="text-[10px] uppercase tracking-widest-2 text-ink-soft/70">Size</dt>
                  <dd className="text-ink">{product.size}</dd>
                </>
              )}
              {product.colour && (
                <>
                  <dt className="text-[10px] uppercase tracking-widest-2 text-ink-soft/70">Colour</dt>
                  <dd className="text-ink">{product.colour}</dd>
                </>
              )}
              {product.thread && (
                <>
                  <dt className="text-[10px] uppercase tracking-widest-2 text-ink-soft/70">Thread</dt>
                  <dd className="text-ink">{product.thread}</dd>
                </>
              )}
              <>
                <dt className="text-[10px] uppercase tracking-widest-2 text-ink-soft/70">Availability</dt>
                <dd className={product.in_stock ? "text-teal" : "text-metallic-gold"}>
                  {product.in_stock ? "In stock" : "Made to order"}
                </dd>
              </>
            </dl>

            {product.video_url && (
              <div className="mb-6 aspect-video w-full overflow-hidden border border-ink/15 rounded-sm">
                <iframe
                  src={embedUrl(product.video_url)}
                  title={product.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            )}

            <a
              href={wa(whatsapp || "919999999999", `Hi! I'd like to order the "${product.title}"${product.price ? " (" + product.price + ")" : ""}. Please share the next steps.`)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-teal text-canvas-deep px-6 py-3.5 rounded-full text-[11px] uppercase tracking-widest-2 font-medium hover:bg-teal/90 transition-colors mt-auto"
              data-testid="dialog-whatsapp-cta"
            >
              <MessageCircle className="w-4 h-4" strokeWidth={1.75} />
              Order via WhatsApp
            </a>

            <div className="mt-3 text-[11px] uppercase tracking-widest-2 text-ink-soft/70 flex items-center gap-2 justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-teal" strokeWidth={1.5} />
              Signed · Numbered · Ships worldwide
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
