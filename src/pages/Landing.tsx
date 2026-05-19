import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Sparkles, Moon, Sun, Menu, X, ChevronDown, Truck, RefreshCw, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { ProductCard } from "@/components/ProductCard";
import WhatsAppButton from "@/components/WhatsAppButton";
import type { Product } from "@/lib/types";
import heroImage from "@/assets/hero.jpg";

type Category = {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  image_url: string | null;
};

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
};

export default function Landing() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [catsOpen, setCatsOpen] = useState(false);
  const { count } = useCart();

  useEffect(() => {
    supabase.from("categories").select("id, name_ar, name_en, slug, image_url").eq("is_active", true).order("display_order").then(({ data }) => data && setCategories(data));
    supabase.from("products").select("*").eq("is_active", true).order("created_at", { ascending: false }).limit(8).then(({ data }) => data && setProducts(data as unknown as Product[]));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ============ NAV ============ */}
      <header className="fixed top-0 inset-x-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
          <Link to="/" className="font-display text-3xl tracking-tight">
            <span className="text-gradient-gold">Glow</span>
            <span className="text-foreground"> X</span>
          </Link>

          <nav className="hidden md:flex items-center gap-10 text-sm tracking-widest uppercase">
            <Link to="/shop" className="hover:text-accent transition-colors">المتجر</Link>
            <a href="#categories" className="hover:text-accent transition-colors">الأقسام</a>
            <a href="#story" className="hover:text-accent transition-colors">قصتنا</a>
            <Link to="/track" className="hover:text-accent transition-colors">تتبع الأوردر</Link>
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={() => setDark((d) => !d)} className="w-10 h-10 grid place-items-center rounded-full hover:bg-muted transition" aria-label="Toggle dark mode">
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link to="/cart" className="w-10 h-10 grid place-items-center rounded-full hover:bg-muted transition relative" aria-label="Cart">
              <ShoppingBag size={18} />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent text-accent-foreground text-[10px] min-w-4 h-4 px-1 grid place-items-center rounded-full font-bold">{count}</span>
              )}
            </Link>
            <button className="md:hidden w-10 h-10 grid place-items-center" onClick={() => setMenuOpen(true)} aria-label="Menu">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[60] bg-background flex flex-col p-8 md:hidden">
          <div className="flex justify-end">
            <button onClick={() => setMenuOpen(false)} className="w-10 h-10 grid place-items-center"><X /></button>
          </div>
          <nav className="flex-1 flex flex-col items-center justify-center gap-8 text-2xl font-display">
            <Link onClick={() => setMenuOpen(false)} to="/shop">المتجر</Link>
            <a onClick={() => setMenuOpen(false)} href="#categories">الأقسام</a>
            <a onClick={() => setMenuOpen(false)} href="#story">قصتنا</a>
            <Link onClick={() => setMenuOpen(false)} to="/track">تتبع الأوردر</Link>
          </nav>
        </div>
      )}

      {/* ============ HERO ============ */}
      <section className="relative min-h-screen pt-20 flex items-center">
        <div className="absolute inset-0 z-0">
          <img src={heroImage} alt="" className="w-full h-full object-cover" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-l from-background/95 via-background/60 to-background/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-20 grid md:grid-cols-2 gap-10">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} className="space-y-8">
            <div className="flex items-center gap-3 text-xs tracking-[0.4em] uppercase text-accent">
              <span className="w-12 h-px bg-accent" />
              <span>مجموعة 2026</span>
            </div>

            <h1 className="font-display text-6xl md:text-8xl leading-[0.95] text-foreground">
              فخامة
              <br />
              <span className="italic font-serif text-gradient-gold">تلمس الجمال</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              مستحضرات تجميل مختارة بعناية لإطلاق سحرك الفريد. تركيبات راقية،
              صياغة فاخرة، وكل تفصيلة مصممة لتحتفي بك.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/shop" className="group bg-primary text-primary-foreground px-10 py-4 text-sm tracking-[0.3em] uppercase hover:bg-gradient-plum transition-all shadow-luxe inline-flex items-center gap-3">
                تسوقي الآن
                <Sparkles size={16} className="group-hover:rotate-12 transition" />
              </Link>
              <a href="#story" className="border border-foreground/20 px-10 py-4 text-sm tracking-[0.3em] uppercase hover:bg-foreground hover:text-background transition-all">
                اكتشفي قصتنا
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ CATEGORIES (TOGGLE) ============ */}
      <section id="categories" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <motion.div {...fadeUp} className="text-center mb-10">
            <p className="text-xs tracking-[0.4em] text-accent uppercase mb-4">تسوقي حسب القسم</p>
            <h2 className="font-display text-5xl md:text-7xl mb-8">
              مجموعتنا <span className="italic font-serif text-gradient-gold">الكاملة</span>
            </h2>

            <button
              onClick={() => setCatsOpen((o) => !o)}
              className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 text-xs tracking-[0.3em] uppercase hover:bg-gradient-plum transition-all shadow-luxe"
              aria-expanded={catsOpen}
            >
              {catsOpen ? "إخفاء الأقسام" : "اعرضي الأقسام"}
              <ChevronDown size={16} className={`transition-transform ${catsOpen ? "rotate-180" : ""}`} />
            </button>
          </motion.div>

          <AnimatePresence initial={false}>
            {catsOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 pt-8">
                  {categories.map((cat, i) => (
                    <motion.div
                      key={cat.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: i * 0.08 }}
                    >
                      <Link to={`/shop/${cat.slug}`} className="group relative aspect-[3/4] block overflow-hidden bg-muted">
                        <div className="absolute inset-0 bg-gradient-plum opacity-70 group-hover:opacity-50 transition-opacity duration-700 z-10" />
                        {cat.image_url && (
                          <img src={cat.image_url} alt={cat.name_ar} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                        )}
                        <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between z-20">
                          <span className="text-cream/80 text-xs tracking-[0.3em] uppercase">{cat.name_en}</span>
                          <div>
                            <h3 className="font-display text-3xl md:text-4xl text-cream mb-2">{cat.name_ar}</h3>
                            <span className="inline-flex items-center gap-2 text-gold text-xs tracking-widest uppercase group-hover:gap-4 transition-all">
                              اكتشفي
                              <span className="w-8 h-px bg-gold" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ============ FEATURED PRODUCTS ============ */}
      <section className="py-24 md:py-32 bg-card">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs tracking-[0.4em] text-accent uppercase mb-4">مختاراتنا</p>
            <h2 className="font-display text-5xl md:text-7xl mb-4">
              <span className="italic font-serif text-gradient-gold">جديدنا</span>
            </h2>
            <p className="text-muted-foreground">قطع منتقاة لإطلالة استثنائية.</p>
          </motion.div>

          {products.length === 0 ? (
            <p className="text-center text-muted-foreground">المنتجات قادمة قريباً.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {products.map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/shop" className="inline-block border border-foreground/20 px-10 py-4 text-xs tracking-[0.3em] uppercase hover:bg-foreground hover:text-background transition-all">
              اعرضي كل المنتجات
            </Link>
          </div>
        </div>
      </section>

      {/* ============ BRAND STORY ============ */}
      <section id="story" className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeUp} className="relative">
            <div className="aspect-[4/5] bg-gradient-luxe relative overflow-hidden">
              <img src={heroImage} alt="" className="w-full h-full object-cover mix-blend-overlay opacity-80" />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-primary text-primary-foreground p-8 max-w-xs hidden md:block">
              <p className="font-display text-5xl text-gradient-gold">2026</p>
              <p className="text-xs tracking-widest uppercase mt-2 text-primary-foreground/70">عام الانطلاقة</p>
            </div>
          </motion.div>

          <motion.div {...fadeUp} className="space-y-6">
            <p className="text-xs tracking-[0.4em] text-accent uppercase">قصتنا</p>
            <h2 className="font-display text-5xl md:text-6xl leading-tight">
              جمال <span className="italic font-serif text-gradient-gold">بلا حدود</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              في Glow X، نؤمن أن الجمال طقس يومي وليس مجرد منتج. نختار أفخم
              المكونات ونصمم تركيبات تحتفي بأنوثتك الفريدة.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              كل لمسة، كل لون، كل عطر — مصاغ ليكون امتداداً لك.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============ POLICIES ============ */}
      <section className="py-24 md:py-32 bg-gradient-plum text-cream">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <motion.div {...fadeUp} className="text-center mb-14">
            <p className="text-xs tracking-[0.4em] text-gold uppercase mb-4">سياساتنا</p>
            <h2 className="font-display text-4xl md:text-6xl">
              <span className="italic font-serif">معلومات</span> تهمك
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Truck, title: "التوصيل", body: "خلال 2–5 أيام عمل لكل المحافظات. الدفع عند الاستلام متاح." },
              { icon: RefreshCw, title: "الاستبدال", body: "متاح خلال يومين من استلام الطلب فقط، شرط أن يكون المنتج بحالته الأصلية." },
              { icon: ShieldCheck, title: "لا يوجد استرجاع", body: "لا نقبل استرجاع المنتجات نهائياً، فقط استبدال خلال المدة المحددة." },
            ].map((p) => (
              <motion.div key={p.title} {...fadeUp} className="border border-gold/20 bg-cream/5 backdrop-blur-sm p-8 text-center">
                <p.icon size={32} className="text-gold mx-auto mb-4" strokeWidth={1.5} />
                <h3 className="font-display text-2xl mb-3">{p.title}</h3>
                <p className="text-sm text-cream/80 leading-relaxed">{p.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
          <div className="grid md:grid-cols-3 gap-10 mb-12">
            <div>
              <h3 className="font-display text-3xl mb-4">
                <span className="text-gradient-gold">Glow</span> X
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                مستحضرات تجميل فاخرة، صُممت لتحتفي بك في كل لحظة.
              </p>
            </div>
            <div>
              <p className="text-xs tracking-[0.3em] uppercase mb-4 text-accent">روابط</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/shop" className="hover:text-foreground">المتجر</Link></li>
                <li><a href="#categories" className="hover:text-foreground">الأقسام</a></li>
                <li><Link to="/track" className="hover:text-foreground">تتبع الأوردر</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs tracking-[0.3em] uppercase mb-4 text-accent">تواصلي معنا</p>
              <p className="text-sm text-muted-foreground mb-2">واتساب: +20 103 080 6772</p>
              <a href="https://wa.me/201030806772" target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline">دردشة على واتساب →</a>
            </div>
          </div>
          <div className="pt-8 border-t border-border text-center text-xs text-muted-foreground tracking-wider">
            © 2026 Glow X Cosmetics. جميع الحقوق محفوظة.
          </div>
        </div>
      </footer>

      <WhatsAppButton />
    </div>
  );
}
