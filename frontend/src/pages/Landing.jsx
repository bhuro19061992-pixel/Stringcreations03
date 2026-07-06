import React, { useState, useEffect } from "react";
import { Instagram, MessageCircle, ArrowUpRight, ArrowRight, MapPin, Menu, X, Quote, Sparkles } from "lucide-react";

// Update this to the real WhatsApp number for String Creations 03
const WHATSAPP_NUMBER = "919999999999"; // international format, no +
const wa = (msg) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

const LOGO_URL =
  "https://customer-assets.emergentagent.com/job_fiber-art-market/artifacts/9fpghvge_inbound4584828131840693190.png";

const IMG = {
  hero: "https://images.unsplash.com/photo-1565213785958-d5db75b246a9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTN8MHwxfHNlYXJjaHwzfHxzdHJpbmclMjBhcnQlMjBnZW9tZXRyaWN8ZW58MHx8fHwxNzgzMzAyOTAwfDA&ixlib=rb-4.1.0&q=85",
  g1: "https://images.unsplash.com/photo-1742942965475-25d3b7bf2bfa?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTN8MHwxfHNlYXJjaHwyfHxzdHJpbmclMjBhcnQlMjBnZW9tZXRyaWN8ZW58MHx8fHwxNzgzMzAyOTAwfDA&ixlib=rb-4.1.0&q=85",
  g2: "https://images.unsplash.com/photo-1771189255393-f87a6323fdce?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTN8MHwxfHNlYXJjaHw0fHxzdHJpbmclMjBhcnQlMjBnZW9tZXRyaWN8ZW58MHx8fHwxNzgzMzAyOTAwfDA&ixlib=rb-4.1.0&q=85",
  thread: "https://images.unsplash.com/photo-1542044801-30d3e45ae49a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzN8MHwxfHNlYXJjaHwxfHxzcG9vbCUyMG9mJTIwdGhyZWFkJTIwY3JhZnR8ZW58MHx8fHwxNzgzMzAyOTAwfDA&ixlib=rb-4.1.0&q=85",
  artist: "https://images.unsplash.com/photo-1584661156681-540e80a161d3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MjJ8MHwxfHNlYXJjaHwzfHxhcnRpc3QlMjB3b3JraW5nJTIwY2FudmFzfGVufDB8fHx8MTc4MzMwMjkwMHww&ixlib=rb-4.1.0&q=85",
};

const WORKS = [
  { id: 1, title: "Geometric Mandala", meta: "24 × 24 in · Silver Thread", img: IMG.g1, span: "md:col-span-7 md:row-span-2 aspect-[4/5]" },
  { id: 2, title: "Crimson Weave", meta: "18 × 18 in · Ruby Cotton", img: IMG.g2, span: "md:col-span-5 aspect-[4/3]" },
  { id: 3, title: "Studio Threads", meta: "Curated Colour Set", img: IMG.thread, span: "md:col-span-5 aspect-[4/3]" },
  { id: 4, title: "Portrait Study", meta: "30 × 30 in · Monochrome", img: IMG.artist, span: "md:col-span-6 aspect-[4/3]" },
  { id: 5, title: "Radial Study 01", meta: "20 × 20 in · Teal / Royal", img: IMG.hero, span: "md:col-span-6 aspect-[4/3]" },
];

const PROCESS = [
  { n: "01", title: "The Canvas", body: "Solid pine or birch board, hand-sanded, sealed in a deep midnight stain. Never rushed." },
  { n: "02", title: "The Grid", body: "Every piece begins with a mathematical plot — hundreds of nail positions marked to the millimetre." },
  { n: "03", title: "The Nails", body: "Brass finish nails driven at a consistent 12mm depth. This alignment is what makes the thread sing." },
  { n: "04", title: "The Thread", body: "A single unbroken length of cotton, pulled taut, wrapped by hand — sometimes 3km per piece." },
];

const COMMISSIONS = [
  { title: "Portraits", meta: "From ₹4,800" },
  { title: "Name Plates", meta: "From ₹2,400" },
  { title: "Logos & Monograms", meta: "From ₹3,600" },
  { title: "Mandalas", meta: "From ₹3,200" },
  { title: "Silhouettes", meta: "From ₹2,800" },
  { title: "Wedding Gifts", meta: "From ₹5,500" },
];

const TESTIMONIALS = [
  { quote: "The portrait of my grandmother arrived and I cried. Every thread felt like a memory pulled tight. A treasure.", name: "Ananya R.", place: "Bengaluru" },
  { quote: "Ordered our wedding monogram — the craftsmanship is otherworldly. Guests still ask about it two years later.", name: "Rahul & Sana", place: "Pune" },
  { quote: "Fast responses on WhatsApp, honest timelines, and a finished piece that outperformed every expectation.", name: "Marcus H.", place: "Berlin" },
  { quote: "This isn't decor — this is heirloom. I've commissioned three pieces and I'm not stopping.", name: "Priya S.", place: "Mumbai" },
];

/* ------- Building blocks ------- */

const Overline = ({ children, className = "" }) => (
  <span className={`overline ${className}`}>{children}</span>
);

const WhatsAppBtn = ({ children, message, testid, variant = "solid", className = "" }) => {
  const base =
    "group inline-flex items-center gap-3 px-6 py-3.5 text-[11px] tracking-widest-2 uppercase font-medium transition-all duration-300 rounded-full";
  const styles =
    variant === "solid"
      ? "bg-teal text-canvas-deep hover:bg-teal/90 border border-teal shadow-[0_0_28px_-8px_rgba(79,195,217,0.6)]"
      : variant === "gold"
      ? "bg-gold text-canvas-deep hover:bg-gold/90 border border-gold shadow-[0_0_28px_-10px_rgba(212,169,96,0.7)]"
      : variant === "outline"
      ? "bg-transparent text-ink border border-ink/25 hover:border-teal hover:text-teal"
      : "bg-ink text-canvas-deep hover:bg-teal";
  return (
    <a
      data-testid={testid}
      href={wa(message)}
      target="_blank"
      rel="noreferrer"
      className={`${base} ${styles} ${className}`}
    >
      {children}
      <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.5} />
    </a>
  );
};

/* ------- Sections ------- */

const NavBar = ({ scrolled }) => {
  const [open, setOpen] = useState(false);
  const links = [
    { label: "Works", href: "#works" },
    { label: "Process", href: "#process" },
    { label: "Commissions", href: "#commissions" },
    { label: "About", href: "#about" },
  ];
  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${
        scrolled ? "bg-canvas/80 backdrop-blur-xl border-b border-ink/10" : "bg-transparent"
      }`}
      data-testid="site-header"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between py-4">
        <a href="#top" data-testid="brand-mark" className="flex items-center gap-3">
          <img src={LOGO_URL} alt="String Creations 03" className="h-11 w-11 object-contain" />
          <span className="hidden sm:flex flex-col leading-tight">
            <span className="font-script text-xl text-metallic">String Creations</span>
            <span className="font-sans text-[10px] tracking-widest-2 text-teal/80 -mt-1">EST · 03</span>
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-9">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              data-testid={`nav-${l.label.toLowerCase()}`}
              className="text-[11px] uppercase tracking-widest-2 text-ink-soft hover:text-teal transition-colors relative py-1"
            >
              {l.label}
            </a>
          ))}
          <WhatsAppBtn testid="nav-cta-whatsapp" message="Hi! I'd like to commission a string art piece.">
            Commission
          </WhatsAppBtn>
        </nav>
        <button
          className="md:hidden text-ink"
          onClick={() => setOpen(!open)}
          data-testid="mobile-menu-toggle"
          aria-label="Menu"
        >
          {open ? <X strokeWidth={1.5} /> : <Menu strokeWidth={1.5} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-canvas/95 backdrop-blur-xl border-t border-ink/10 px-6 py-6 space-y-4" data-testid="mobile-menu">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block text-sm uppercase tracking-widest-2 text-ink-soft"
              data-testid={`mobile-nav-${l.label.toLowerCase()}`}
            >
              {l.label}
            </a>
          ))}
          <WhatsAppBtn testid="mobile-nav-cta" message="Hi! I'd like to commission a piece.">
            Commission
          </WhatsAppBtn>
        </div>
      )}
    </header>
  );
};

const Hero = () => (
  <section id="top" className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden" data-testid="hero-section">
    <div className="absolute inset-0 -z-10 radial-glow" />
    <div className="absolute inset-0 -z-10 opacity-25">
      <img src={IMG.hero} alt="" className="w-full h-full object-cover mix-blend-luminosity" />
      <div className="absolute inset-0 bg-gradient-to-b from-canvas via-canvas/60 to-canvas" />
    </div>

    <div className="max-w-[1400px] mx-auto px-6 md:px-12">
      {/* Logo hero card */}
      <div className="flex justify-center animate-fade-in-up">
        <div className="relative">
          <div className="absolute -inset-8 blur-3xl bg-teal/20 rounded-full -z-10" />
          <img
            src={LOGO_URL}
            alt="String Creations 03"
            className="w-64 sm:w-80 md:w-[22rem] h-auto object-contain drop-shadow-[0_10px_40px_rgba(79,195,217,0.35)]"
            data-testid="hero-logo"
          />
        </div>
      </div>

      <div className="text-center mt-8 md:mt-10 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
        <Overline>Handcrafted · One-of-One · Studio 03</Overline>
        <h1 className="font-serif font-light text-4xl sm:text-6xl lg:text-7xl tracking-tighter leading-[1.02] max-w-4xl mx-auto mt-6">
          Thread, pulled taut into
          <span className="block italic text-metallic">memory & metal.</span>
        </h1>
        <p className="mt-6 max-w-xl mx-auto text-ink-soft font-light text-base md:text-lg leading-relaxed">
          Bespoke string art — hand-nailed onto solid wood, threaded across thousands of tiny anchors.
          No prints. No reproductions. Only originals.
        </p>
        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
          <WhatsAppBtn
            testid="hero-cta-commission"
            variant="solid"
            message="Hi String Creations 03! I'd like to commission a piece. Here's what I have in mind:"
          >
            Commission a Piece
          </WhatsAppBtn>
          <a
            href="#works"
            data-testid="hero-cta-works"
            className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-widest-2 text-ink-soft hover:text-teal transition-colors px-4 py-3"
          >
            See the archive
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
          </a>
        </div>
      </div>

      <div className="mt-24 md:mt-32 grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          ["217", "Pieces threaded"],
          ["11", "Countries shipped"],
          ["3km", "Avg. thread / piece"],
          ["100%", "Handmade original"],
        ].map(([n, l]) => (
          <div key={l} className="hairline-top pt-4">
            <div className="font-serif text-4xl md:text-5xl text-metallic">{n}</div>
            <div className="text-[10px] uppercase tracking-widest-2 text-ink-soft/70 mt-2">{l}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Marquee = () => (
  <section aria-hidden className="hairline-top hairline-bot py-6 overflow-hidden bg-canvas-alt/40" data-testid="marquee">
    <div className="flex whitespace-nowrap animate-marquee">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="flex items-center">
          {["PORTRAITS", "MANDALAS", "MONOGRAMS", "SILHOUETTES", "NAMES", "WEDDING GIFTS", "LOGOS", "CUSTOM"].map((t, j) => (
            <span key={t + j} className="flex items-center">
              <span className="font-script text-3xl md:text-4xl mx-8 text-metallic">{t}</span>
              <span className="w-1.5 h-1.5 bg-teal rounded-full" />
            </span>
          ))}
        </div>
      ))}
    </div>
  </section>
);

const Works = () => (
  <section id="works" className="py-24 md:py-32" data-testid="works-section">
    <div className="max-w-[1400px] mx-auto px-6 md:px-12">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
        <div className="max-w-2xl">
          <Overline>Selected Works</Overline>
          <h2 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight font-light">
            A small archive of pieces already <span className="italic text-metallic">living in someone's home.</span>
          </h2>
        </div>
        <WhatsAppBtn testid="works-cta-commission" variant="outline" message="I'd love to see more works from your archive.">
          Request Archive
        </WhatsAppBtn>
      </div>

      <div className="grid md:grid-cols-12 gap-6 md:gap-8">
        {WORKS.map((w, i) => (
          <figure
            key={w.id}
            className={`group relative overflow-hidden border border-ink/10 rounded-sm bg-canvas-alt/40 ${w.span}`}
            data-testid={`work-card-${w.id}`}
          >
            <img
              src={w.img}
              alt={w.title}
              className="absolute inset-0 w-full h-full object-cover opacity-90 transition-all duration-700 ease-out group-hover:scale-[1.04] group-hover:opacity-100"
              loading={i === 0 ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-canvas-deep/85 via-canvas-deep/20 to-transparent" />
            <figcaption className="absolute left-0 right-0 bottom-0 p-5 md:p-6">
              <div className="text-ink font-serif text-xl md:text-2xl">{w.title}</div>
              <div className="text-teal/90 text-[10px] uppercase tracking-widest-2 mt-1">{w.meta}</div>
            </figcaption>
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-9 h-9 rounded-full bg-teal/90 flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4 text-canvas-deep" strokeWidth={2} />
              </div>
            </div>
          </figure>
        ))}
      </div>
    </div>
  </section>
);

const Process = () => (
  <section id="process" className="py-24 md:py-32 bg-canvas-alt/60 hairline-top hairline-bot" data-testid="process-section">
    <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid md:grid-cols-12 gap-12">
      <div className="md:col-span-5">
        <Overline>The Making</Overline>
        <h2 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight font-light">
          From <span className="italic">plank</span> to <span className="italic text-metallic">portrait.</span>
        </h2>
        <p className="mt-6 text-ink-soft font-light leading-relaxed max-w-md">
          Nothing about this process is digital. Each piece is drawn, plotted, hammered and threaded by one pair of hands — the artist's.
        </p>
        <div className="mt-8 aspect-[4/5] overflow-hidden border border-ink/10 rounded-sm">
          <img src={IMG.thread} alt="thread spools" className="w-full h-full object-cover opacity-90" loading="lazy" />
        </div>
      </div>

      <div className="md:col-span-7">
        {PROCESS.map((p, i) => (
          <div
            key={p.n}
            className={`grid grid-cols-[70px_1fr] md:grid-cols-[110px_1fr] gap-6 py-8 ${i !== 0 ? "hairline-top" : ""}`}
            data-testid={`process-step-${p.n}`}
          >
            <div className="font-serif text-4xl md:text-5xl text-metallic italic">{p.n}</div>
            <div>
              <h3 className="font-serif text-2xl md:text-3xl text-ink mb-2">{p.title}</h3>
              <p className="text-ink-soft font-light leading-relaxed">{p.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Commissions = () => (
  <section id="commissions" className="py-24 md:py-32 bg-canvas-deep grain-texture relative overflow-hidden" data-testid="commissions-section">
    <div className="absolute -top-32 -right-32 w-96 h-96 bg-teal/10 rounded-full blur-3xl" />
    <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-royal/15 rounded-full blur-3xl" />
    <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
      <div className="grid md:grid-cols-12 gap-10 items-end mb-16">
        <div className="md:col-span-8">
          <Overline>Custom Orders</Overline>
          <h2 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-7xl tracking-tight font-light">
            Tell me the story.<br />
            <span className="italic text-metallic">I'll pull it into thread.</span>
          </h2>
        </div>
        <div className="md:col-span-4">
          <p className="font-light text-ink-soft leading-relaxed">
            Every commission starts with a message on WhatsApp — a photo, a name, a memory. We plan together. You approve the sketch. Then the work begins.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 hairline-top hairline-bot">
        {COMMISSIONS.map((c, i) => (
          <a
            key={c.title}
            href={wa(`Hi! I'd like to commission a ${c.title.toLowerCase()}.`)}
            target="_blank"
            rel="noreferrer"
            className={`p-8 md:p-10 border-ink/10 group hover:bg-teal/[0.06] transition-colors block ${
              i % 3 !== 0 ? "md:border-l" : ""
            } ${i % 2 !== 0 ? "sm:border-l md:border-l" : ""} ${i >= 3 ? "md:border-t" : ""} ${
              i >= 2 && i < 3 ? "sm:border-t md:border-t-0" : ""
            } ${i >= 2 ? "sm:border-t md:border-t-0" : ""}`}
            data-testid={`commission-${c.title.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <div className="flex items-baseline justify-between mb-3">
              <h3 className="font-serif text-3xl text-ink">{c.title}</h3>
              <ArrowUpRight className="w-4 h-4 text-teal group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={1.5} />
            </div>
            <div className="text-[11px] uppercase tracking-widest-2 text-metallic-gold">{c.meta}</div>
          </a>
        ))}
      </div>

      <div className="mt-14 flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <WhatsAppBtn
          testid="commissions-cta-start"
          variant="gold"
          message="Hi! I'd like to start a custom order. Here's my brief:"
        >
          Start a Custom Order
        </WhatsAppBtn>
        <p className="text-sm text-ink-soft font-light flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-teal" strokeWidth={1.5} />
          Typical turnaround: 2–4 weeks · Ships worldwide.
        </p>
      </div>
    </div>
  </section>
);

const About = () => (
  <section id="about" className="py-24 md:py-32" data-testid="about-section">
    <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid md:grid-cols-12 gap-12 items-center">
      <div className="md:col-span-6 md:pr-12">
        <Overline>About the Studio</Overline>
        <h2 className="mt-4 font-serif font-light text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-8">
          One artist. One workbench.<br />
          <span className="italic text-metallic">A very quiet room.</span>
        </h2>
        <blockquote className="font-serif italic text-2xl md:text-3xl text-ink/95 border-l-2 border-teal pl-6 mb-8 leading-snug">
          "There's something honest about a piece you can trace back to a single day, a single hand, a single spool of thread."
        </blockquote>
        <p className="text-ink-soft font-light leading-relaxed mb-4">
          String Creations 03 is a solo studio devoted to the vanishing craft of nail-and-thread portraiture. Every piece is signed, dated and numbered on the back — because it will outlive us both.
        </p>
        <p className="text-ink-soft font-light leading-relaxed">
          The "03" is not a batch number. It's the third studio I ever worked in — the one where the practice finally clicked.
        </p>
      </div>
      <div className="md:col-span-6">
        <div className="relative">
          <div className="absolute -inset-6 border border-teal/20 -z-10 rounded-sm" />
          <div className="aspect-[4/5] overflow-hidden rounded-sm">
            <img src={IMG.artist} alt="Artist in studio" className="w-full h-full object-cover opacity-90" loading="lazy" />
          </div>
          <div className="absolute -bottom-4 -right-4 bg-canvas-deep px-5 py-3 border border-teal/40 rounded-sm shadow-xl">
            <div className="text-[10px] uppercase tracking-widest-2 text-teal">Signed & Numbered</div>
            <div className="font-serif text-lg text-ink">Every Piece. No Exceptions.</div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Testimonials = () => (
  <section className="py-24 md:py-32 bg-canvas-alt/60 hairline-top hairline-bot" data-testid="testimonials-section">
    <div className="max-w-[1400px] mx-auto px-6 md:px-12">
      <div className="flex items-end justify-between mb-14 flex-wrap gap-6">
        <div className="max-w-xl">
          <Overline>Kind Words</Overline>
          <h2 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight font-light">
            From the people who <span className="italic text-metallic">hung them on their walls.</span>
          </h2>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {TESTIMONIALS.map((t, i) => (
          <figure
            key={i}
            className="bg-canvas/60 backdrop-blur p-8 md:p-10 border border-ink/10 rounded-sm relative hover:border-teal/30 transition-colors"
            data-testid={`testimonial-${i}`}
          >
            <Quote className="w-8 h-8 text-teal mb-4" strokeWidth={1.25} />
            <blockquote className="font-serif italic text-xl md:text-2xl text-ink leading-snug mb-6">
              "{t.quote}"
            </blockquote>
            <figcaption className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm text-ink">{t.name}</div>
                <div className="text-[10px] uppercase tracking-widest-2 text-ink-soft mt-1">{t.place}</div>
              </div>
              <div className="text-metallic-gold text-[10px] uppercase tracking-widest-2">Verified Buyer</div>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-canvas-deep pt-20 md:pt-24 pb-10 relative overflow-hidden" data-testid="site-footer">
    <div className="absolute inset-0 radial-glow" />
    <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative">
      <div className="grid md:grid-cols-12 gap-10 items-end">
        <div className="md:col-span-8">
          <img src={LOGO_URL} alt="String Creations 03" className="h-20 w-20 mb-6 object-contain" data-testid="footer-logo" />
          <Overline>Let's Make Something</Overline>
          <h2 className="mt-4 font-serif font-light text-5xl sm:text-6xl lg:text-8xl tracking-tighter leading-[0.95]">
            Let's talk<br />
            <span className="italic text-metallic">on WhatsApp.</span>
          </h2>
        </div>
        <div className="md:col-span-4 space-y-3">
          <WhatsAppBtn
            testid="footer-cta-whatsapp"
            variant="solid"
            message="Hi String Creations 03 — I found you via your site."
            className="w-full justify-between !px-6"
          >
            Message on WhatsApp
          </WhatsAppBtn>
          <a
            data-testid="footer-instagram"
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-6 py-3.5 border border-ink/20 text-ink hover:border-teal hover:text-teal transition-colors text-[11px] uppercase tracking-widest-2 rounded-full"
          >
            <span className="flex items-center gap-3"><Instagram className="w-4 h-4" strokeWidth={1.5} /> Instagram</span>
            <ArrowUpRight className="w-4 h-4" strokeWidth={1.5} />
          </a>
        </div>
      </div>

      <div className="mt-20 pt-8 hairline-top grid md:grid-cols-3 gap-6 text-[10px] uppercase tracking-widest-2 text-ink-soft">
        <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-teal" strokeWidth={1.5} /> Studio 03 · Ships worldwide</div>
        <div className="md:text-center">© {new Date().getFullYear()} String Creations 03</div>
        <div className="md:text-right font-script normal-case tracking-normal text-lg text-metallic">Made slowly. On purpose.</div>
      </div>
    </div>
  </footer>
);

const FloatingWA = () => (
  <a
    data-testid="floating-whatsapp"
    href={wa("Hi String Creations 03! I'd like to enquire about a piece.")}
    target="_blank"
    rel="noreferrer"
    aria-label="Chat on WhatsApp"
    className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 bg-teal text-canvas-deep hover:bg-teal/90 transition-all duration-300 shadow-[0_10px_40px_-10px_rgba(79,195,217,0.7)] hover:shadow-[0_10px_50px_-8px_rgba(79,195,217,0.9)] px-5 py-4 flex items-center gap-3 rounded-full group"
  >
    <MessageCircle className="w-5 h-5" strokeWidth={1.75} />
    <span className="text-[11px] uppercase tracking-widest-2 font-semibold hidden sm:inline">
      Chat on WhatsApp
    </span>
  </a>
);

/* ------- Page ------- */

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="bg-canvas text-ink min-h-screen" data-testid="landing-root">
      <NavBar scrolled={scrolled} />
      <Hero />
      <Marquee />
      <Works />
      <Process />
      <Commissions />
      <About />
      <Testimonials />
      <Footer />
      <FloatingWA />
    </main>
  );
}
