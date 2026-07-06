import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  LogOut,
Plus,
Trash2,
Save,
Image as ImageIcon,
X,
Star,
Package,
Settings as SettingsIcon,
Lock,
Loader2,
MessageSquare,
} from "lucide-react";
import { api, getAdminToken, setAdminToken, clearAdminToken, fileToBase64 } from "@/lib/api";

const CATS = ["Portrait", "Mandala", "Name Plate", "Logo", "Silhouette", "Wedding", "Custom"];

const EMPTY_PRODUCT = {
  title: "", description: "", price: "", size: "", colour: "", thread: "",
  category: "Portrait", images: [], video_url: "", in_stock: true, featured: false, order: 0,
};

const Field = ({ label, children, hint }) => (
  <label className="block">
    <div className="text-[10px] uppercase tracking-widest-2 text-ink-soft/70 mb-1.5">{label}</div>
    {children}
    {hint && <div className="text-[10px] text-ink-soft/60 mt-1">{hint}</div>}
  </label>
);

const inputCls =
  "w-full bg-canvas border border-ink/15 rounded-sm px-3 py-2.5 text-sm text-ink placeholder:text-ink-soft/40 focus:outline-none focus:border-teal transition-colors";

/* ---------- Login ---------- */

const Login = ({ onLogin }) => {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!token.trim()) return;
    setLoading(true);
    try {
      await api.verifyAdmin(token.trim());
      setAdminToken(token.trim());
      toast.success("Welcome back.");
      onLogin();
    } catch {
      toast.error("Invalid admin token.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-canvas">
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-canvas-alt/40 border border-ink/10 rounded-sm p-8"
        data-testid="admin-login-form"
      >
        <div className="w-12 h-12 rounded-full bg-teal/10 border border-teal/30 flex items-center justify-center mb-5">
          <Lock className="w-5 h-5 text-teal" strokeWidth={1.5} />
        </div>
        <h1 className="font-serif text-3xl mb-1">Admin access</h1>
        <p className="text-sm text-ink-soft mb-6">Enter your admin token to manage products and site settings.</p>
        <Field label="Admin token">
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className={inputCls}
            placeholder="•••••••••"
            data-testid="admin-token-input"
            autoFocus
          />
        </Field>
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-teal text-canvas-deep rounded-full py-3 text-[11px] uppercase tracking-widest-2 font-semibold hover:bg-teal/90 disabled:opacity-60 flex items-center justify-center gap-2"
          data-testid="admin-login-submit"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Enter Studio
        </button>
        <a href="/" className="mt-4 block text-center text-xs uppercase tracking-widest-2 text-ink-soft hover:text-teal">
          ← Back to site
        </a>
      </form>
    </div>
  );
};

/* ---------- Product form ---------- */

const ProductForm = ({ initial, onSave, onCancel, onDelete }) => {
  const [f, setF] = useState(initial || EMPTY_PRODUCT);
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) =>
    setF((s) => ({ ...s, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const handleImages = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const encoded = await Promise.all(files.map(fileToBase64));
    setF((s) => ({ ...s, images: [...s.images, ...encoded] }));
  };

  const removeImage = (i) =>
    setF((s) => ({ ...s, images: s.images.filter((_, k) => k !== i) }));

  const submit = async (e) => {
    e.preventDefault();
    if (!f.title.trim()) return toast.error("Title is required.");
    setSaving(true);
    try {
      await onSave(f);
      toast.success(initial?.id ? "Product updated." : "Product added.");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5" data-testid="product-form">
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Title *">
          <input value={f.title} onChange={set("title")} className={inputCls} required data-testid="pf-title" />
        </Field>
        <Field label="Category">
          <select value={f.category} onChange={set("category")} className={inputCls} data-testid="pf-category">
            {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Price" hint="Free text — e.g. ₹4,800 or From ₹3,600">
          <input value={f.price} onChange={set("price")} className={inputCls} data-testid="pf-price" />
        </Field>
        <Field label="Size" hint={`e.g. 24" × 24"`}>
          <input value={f.size} onChange={set("size")} className={inputCls} data-testid="pf-size" />
        </Field>
        <Field label="Colour">
          <input value={f.colour} onChange={set("colour")} className={inputCls} data-testid="pf-colour" />
        </Field>
        <Field label="Thread type" hint="Cotton / Silk / Metallic / etc.">
          <input value={f.thread} onChange={set("thread")} className={inputCls} data-testid="pf-thread" />
        </Field>
      </div>

      <Field label="Description">
        <textarea
          value={f.description}
          onChange={set("description")}
          className={inputCls + " min-h-[110px] resize-y"}
          data-testid="pf-description"
        />
      </Field>

      <Field label="Video URL (YouTube / Instagram / MP4)">
        <input
          value={f.video_url}
          onChange={set("video_url")}
          className={inputCls}
          placeholder="https://youtube.com/watch?v=..."
          data-testid="pf-video"
        />
      </Field>

      <div>
        <div className="text-[10px] uppercase tracking-widest-2 text-ink-soft/70 mb-2">Images</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {f.images.map((src, i) => (
            <div key={i} className="relative aspect-square border border-ink/15 rounded-sm overflow-hidden group">
              <img src={src} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-canvas-deep/80 text-ink flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                data-testid={`pf-image-remove-${i}`}
              >
                <X className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
            </div>
          ))}
          <label
            className="aspect-square border border-dashed border-ink/25 rounded-sm flex flex-col items-center justify-center gap-2 text-ink-soft hover:text-teal hover:border-teal cursor-pointer transition-colors"
            data-testid="pf-image-upload"
          >
            <ImageIcon className="w-6 h-6" strokeWidth={1.5} />
            <span className="text-[10px] uppercase tracking-widest-2">Add photos</span>
            <input type="file" multiple accept="image/*" onChange={handleImages} className="hidden" />
          </label>
        </div>
      </div>

      <div className="flex flex-wrap gap-6 pt-2">
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" checked={f.in_stock} onChange={set("in_stock")} data-testid="pf-in-stock" />
          In stock
        </label>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" checked={f.featured} onChange={set("featured")} data-testid="pf-featured" />
          Featured
        </label>
        <Field label="Sort order">
          <input
            type="number"
            value={f.order}
            onChange={set("order")}
            className={inputCls + " !w-28"}
            data-testid="pf-order"
          />
        </Field>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-ink/10">
        <button
          type="submit"
          disabled={saving}
          className="bg-teal text-canvas-deep px-5 py-2.5 rounded-full text-[11px] uppercase tracking-widest-2 font-semibold hover:bg-teal/90 flex items-center gap-2 disabled:opacity-60"
          data-testid="pf-save"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" strokeWidth={1.5} />}
          {initial?.id ? "Save changes" : "Add product"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-full border border-ink/20 text-ink hover:border-teal hover:text-teal text-[11px] uppercase tracking-widest-2"
          data-testid="pf-cancel"
        >
          Cancel
        </button>
        {initial?.id && (
          <button
            type="button"
            onClick={onDelete}
            className="ml-auto px-5 py-2.5 rounded-full border border-ink/20 text-ink-soft hover:border-red-400 hover:text-red-400 text-[11px] uppercase tracking-widest-2 flex items-center gap-2"
            data-testid="pf-delete"
          >
            <Trash2 className="w-4 h-4" strokeWidth={1.5} /> Delete
          </button>
        )}
      </div>
    </form>
  );
};

/* ---------- Products tab ---------- */

const ProductsTab = () => {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null); // null | product | 'new'
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setProducts(await api.getProducts());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async (data) => {
    if (editing?.id) {
      await api.updateProduct(editing.id, data);
    } else {
      await api.createProduct(data);
    }
    await load();
    setEditing(null);
  };

  const del = async () => {
    if (!editing?.id) return;
    if (!window.confirm("Delete this product?")) return;
    await api.deleteProduct(editing.id);
    toast.success("Product deleted.");
    await load();
    setEditing(null);
  };

  if (editing) {
    return (
      <div className="bg-canvas-alt/40 border border-ink/10 rounded-sm p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl">{editing?.id ? "Edit product" : "New product"}</h2>
          <button
            onClick={() => setEditing(null)}
            className="text-ink-soft hover:text-teal text-[11px] uppercase tracking-widest-2"
            data-testid="close-editor"
          >
            ← Back to list
          </button>
        </div>
        <ProductForm
          initial={editing === "new" ? null : editing}
          onSave={save}
          onCancel={() => setEditing(null)}
          onDelete={del}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-3xl">Products</h2>
          <p className="text-sm text-ink-soft">{products.length} pieces in the collection.</p>
        </div>
        <button
          onClick={() => setEditing("new")}
          className="bg-teal text-canvas-deep px-5 py-2.5 rounded-full text-[11px] uppercase tracking-widest-2 font-semibold hover:bg-teal/90 flex items-center gap-2"
          data-testid="new-product-btn"
        >
          <Plus className="w-4 h-4" strokeWidth={2} /> New product
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-ink-soft"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>
      ) : products.length === 0 ? (
        <div className="py-20 border border-dashed border-ink/15 rounded-sm text-center">
          <Package className="w-10 h-10 text-teal mx-auto mb-4" strokeWidth={1.5} />
          <div className="font-serif text-2xl mb-2">No products yet.</div>
          <p className="text-ink-soft text-sm mb-6">Add your first piece to bring the gallery to life.</p>
          <button
            onClick={() => setEditing("new")}
            className="bg-teal text-canvas-deep px-5 py-2.5 rounded-full text-[11px] uppercase tracking-widest-2 font-semibold hover:bg-teal/90"
            data-testid="empty-add-btn"
          >
            Add first product
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <button
              key={p.id}
              onClick={() => setEditing(p)}
              className="text-left bg-canvas-alt/40 border border-ink/10 rounded-sm overflow-hidden hover:border-teal/40 transition-colors group"
              data-testid={`admin-product-${p.id}`}
            >
              <div className="aspect-[4/3] bg-canvas-deep overflow-hidden">
                {p.images?.[0] ? (
                  <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-ink-soft/40 text-xs">No image</div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="font-serif text-lg truncate">{p.title}</div>
                  {p.featured && <Star className="w-3.5 h-3.5 text-metallic-gold" strokeWidth={1.5} fill="currentColor" />}
                </div>
                <div className="text-[10px] uppercase tracking-widest-2 text-teal mt-1">
                  {p.category}{p.size ? ` · ${p.size}` : ""}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-metallic-gold">{p.price || "—"}</span>
                  <span className={"text-[10px] uppercase tracking-widest-2 " + (p.in_stock ? "text-teal" : "text-ink-soft/60")}>
                    {p.in_stock ? "In stock" : "Made to order"}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ---------- Settings tab ---------- */

const SettingsTab = () => {
  const [s, setS] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.getSettings().then(setS);
  }, []);

  const set = (k) => (e) => setS((st) => ({ ...st, [k]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await api.updateSettings(s);
      setS(updated);
      toast.success("Settings saved.");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  if (!s) return <div className="py-20 text-center text-ink-soft"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>;

  return (
    <form onSubmit={save} className="space-y-8" data-testid="settings-form">
      <div>
        <h2 className="font-serif text-3xl mb-1">Site settings</h2>
        <p className="text-sm text-ink-soft">Edit the copy and contact details that appear on the public site.</p>
      </div>

      <div className="bg-canvas-alt/40 border border-ink/10 rounded-sm p-6 md:p-8 space-y-5">
        <div className="text-[10px] uppercase tracking-widest-2 text-teal">Brand</div>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Brand name"><input value={s.brand_name || ""} onChange={set("brand_name")} className={inputCls} data-testid="s-brand" /></Field>
          <Field label="Tagline"><input value={s.tagline || ""} onChange={set("tagline")} className={inputCls} data-testid="s-tagline" /></Field>
        </div>
        <Field label="Short intro (below hero)">
          <textarea value={s.about_short || ""} onChange={set("about_short")} className={inputCls + " min-h-[80px]"} data-testid="s-about-short" />
        </Field>
        <Field label="About string art (long)">
          <textarea value={s.about_long || ""} onChange={set("about_long")} className={inputCls + " min-h-[160px]"} data-testid="s-about-long" />
        </Field>
      </div>

      <div className="bg-canvas-alt/40 border border-ink/10 rounded-sm p-6 md:p-8 space-y-5">
        <div className="text-[10px] uppercase tracking-widest-2 text-teal">Contact</div>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="WhatsApp number" hint="International format, no + or spaces. Example: 919812345678">
            <input value={s.whatsapp || ""} onChange={set("whatsapp")} className={inputCls} data-testid="s-whatsapp" />
          </Field>
          <Field label="Email"><input type="email" value={s.email || ""} onChange={set("email")} className={inputCls} data-testid="s-email" /></Field>
          <Field label="Phone"><input value={s.phone || ""} onChange={set("phone")} className={inputCls} data-testid="s-phone" /></Field>
          <Field label="Location / Studio"><input value={s.location || ""} onChange={set("location")} className={inputCls} data-testid="s-location" /></Field>
          <Field label="Working hours"><input value={s.hours || ""} onChange={set("hours")} className={inputCls} data-testid="s-hours" /></Field>
          <Field label="Turnaround"><input value={s.turnaround || ""} onChange={set("turnaround")} className={inputCls} data-testid="s-turnaround" /></Field>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <Field label="Instagram URL"><input value={s.instagram || ""} onChange={set("instagram")} className={inputCls} data-testid="s-instagram" /></Field>
          <Field label="Facebook URL"><input value={s.facebook || ""} onChange={set("facebook")} className={inputCls} data-testid="s-facebook" /></Field>
          <Field label="YouTube URL"><input value={s.youtube || ""} onChange={set("youtube")} className={inputCls} data-testid="s-youtube" /></Field>
        </div>
      </div>

      <div className="sticky bottom-4">
        <button
          type="submit"
          disabled={saving}
          className="bg-teal text-canvas-deep px-6 py-3 rounded-full text-[11px] uppercase tracking-widest-2 font-semibold hover:bg-teal/90 disabled:opacity-60 flex items-center gap-2"
          data-testid="s-save"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" strokeWidth={1.5} />}
          Save settings
        </button>
      </div>
    </form>
  );
};

/* ---------- Admin shell ---------- */

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState("products");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const t = getAdminToken();
    if (!t) { setChecking(false); return; }
    api.verifyAdmin(t)
      .then(() => { setAuthed(true); })
      .catch(() => { clearAdminToken(); })
      .finally(() => setChecking(false));
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-ink-soft">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!authed) return <Login onLogin={() => setAuthed(true)} />;

  const logout = () => {
    clearAdminToken();
    setAuthed(false);
    toast.success("Signed out.");
  };

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-ink/10 bg-canvas-alt/40 backdrop-blur sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
          <a href="/" className="font-script text-2xl text-metallic" data-testid="admin-brand">String Creations 03</a>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTab("products")}
              className={`px-4 py-2 rounded-full text-[11px] uppercase tracking-widest-2 flex items-center gap-2 ${
                tab === "products" ? "bg-teal text-canvas-deep" : "text-ink-soft hover:text-teal"
              }`}
              data-testid="tab-products"
            >
              <Package className="w-4 h-4" strokeWidth={1.5} /> Products
            </button>
            <button
  onClick={() => setTab("reviews")}
  className={`px-4 py-2 rounded-full text-[11px] uppercase tracking-widest-2 flex items-center gap-2 ${
    tab === "reviews"
      ? "bg-teal text-canvas-deep"
      : "text-ink-soft hover:text-teal"
  }`}
  data-testid="tab-reviews"
>
  <MessageSquare className="w-4 h-4" strokeWidth={1.5} />
  Reviews
</button>
          <button
              onClick={() => setTab("settings")}
              className={`px-4 py-2 rounded-full text-[11px] uppercase tracking-widest-2 flex items-center gap-2 ${
                tab === "settings" ? "bg-teal text-canvas-deep" : "text-ink-soft hover:text-teal"
              }`}
              data-testid="tab-settings"
            >
              <SettingsIcon className="w-4 h-4" strokeWidth={1.5} /> Settings
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 rounded-full text-[11px] uppercase tracking-widest-2 border border-ink/20 text-ink-soft hover:border-red-400 hover:text-red-400 flex items-center gap-2"
              data-testid="admin-logout"
            >
              <LogOut className="w-4 h-4" strokeWidth={1.5} /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 md:px-12 py-10">
  {tab === "products" && <ProductsTab />}

  {tab === "reviews" && <ReviewsTab />}

  {tab === "settings" && <SettingsTab />}
</main>
    </div>
  );
}
