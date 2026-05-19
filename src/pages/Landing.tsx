import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Sparkles, Star, Truck, ShieldCheck, Heart, Moon, Sun, Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    supabase
      .from("categories")
      .select("id, name_ar, name_en, slug, image_url")
      .eq("is_active", true)
      .order("display_order")
      .then(({ data }) => data && setCategories(data));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ============ NAV ============ */}
      <header className="fixed top-0 inset-x-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-3xl tracking-tight">
              <span className="text-gradient-gold">Glow</span>
              <span className="text-foreground"> X</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-10 text-sm tracking-widest uppercase">
            <a href="#bestsellers" className="hover:text-accent transition-colors">الأكثر مبيعاً</a>
            <a href="#categories" className="hover:text-accent transition-colors">الأقسام</a>
            <a href="#new" className="hover:text-accent transition-colors">جديدنا</a>
            <a href="#story" className="hover:text-accent transition-colors">قصتنا</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDark((d) => !d)}
              className="w-10 h-10 grid place-items-center rounded-full hover:bg-muted transition"
              aria-label="Toggle dark mode"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="w-10 h-10 grid place-items-center rounded-full hover:bg-muted transition relative" aria-label="Cart">
              <ShoppingBag size={18} />
              <span className="absolute -top-0.5 -right-0.5 bg-accent text-accent-foreground text-[10px] w-4 h-4 grid place-items-center rounded-full font-bold">0</span>
            </button>
            <button className="md:hidden w-10 h-10 grid place-items-center" onClick={() => setMenuOpen(true)} aria-label="Menu">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] bg-background flex flex-col p-8 md:hidden">
          <div className="flex justify-end">
            <button onClick={() => setMenuOpen(false)} className="w-10 h-10 grid place-items-center"><X /></button>
          </div>
          <nav className="flex-1 flex flex-col items-center justify-center gap-8 text-2xl font-display">
            <a onClick={() => setMenuOpen(false)} href="#bestsellers">الأكثر مبيعاً</a>
            <a onClick={() => setMenuOpen(false)} href="#categories">الأقسام</a>
            <a onClick={() => setMenuOpen(false)} href="#new">جديدنا</a>
            <a onClick={() => setMenuOpen(false)} href="#story">قصتنا</a>
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
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
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
              <a
                href="#categories"
                className="group bg-primary text-primary-foreground px-10 py-4 text-sm tracking-[0.3em] uppercase hover:bg-gradient-plum transition-all shadow-luxe inline-flex items-center gap-3"
              >
                تسوقي الآن
                <Sparkles size={16} className="group-hover:rotate-12 transition" />
              </a>
              <a
                href="#story"
                className="border border-foreground/20 px-10 py-4 text-sm tracking-[0.3em] uppercase hover:bg-foreground hover:text-background transition-all"
              >
                اكتشفي قصتنا
              </a>
            </div>

            <div className="flex items-center gap-8 pt-6">
              {[
                { icon: Truck, label: "شحن لكل المحافظات" },
                { icon: ShieldCheck, label: "منتجات أصلية 100%" },
                { icon: Heart, label: "+10K عميلة سعيدة" },
              ].map((f) => (
                <div key={f.label} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <f.icon size={16} className="text-accent" />
                  <span>{f.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Floating tag */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="hidden lg:flex absolute bottom-12 left-12 z-10 glass rounded-sm px-6 py-4 items-center gap-4 max-w-xs"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-rose-gold grid place-items-center text-white font-bold">★</div>
          <div>
            <p className="text-xs text-muted-foreground">تقييم العميلات</p>
            <p className="font-display text-lg">4.9 من 5</p>
          </div>
        </motion.div>
      </section>

      {/* ============ FEATURES STRIP ============ */}
      <section className="border-y border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-xs tracking-[0.25em] uppercase">
          {["شحن سريع", "دفع عند الاستلام", "هدية مع كل طلب", "تركيبات نباتية"].map((s) => (
            <div key={s} className="text-muted-foreground">{s}</div>
          ))}
        </div>
      </section>

      {/* ============ CATEGORIES ============ */}
      <section id="categories" className="py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <motion.div {...fadeUp} className="flex items-end justify-between mb-16">
            <div>
              <p className="text-xs tracking-[0.4em] text-accent uppercase mb-4">تسوقي حسب القسم</p>
              <h2 className="font-display text-5xl md:text-7xl">
                مجموعتنا<br />
                <span className="italic font-serif text-gradient-gold">الكاملة</span>
              </h2>
            </div>
            <p className="hidden md:block max-w-xs text-muted-foreground">
              من الروج للعطور، كل قطعة مُختارة لإضفاء لمسة فخامة على روتينك اليومي.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                {...fadeUp}
                transition={{ duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="group relative aspect-[3/4] overflow-hidden bg-muted cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-plum opacity-90 group-hover:opacity-70 transition-opacity duration-700" />
                {cat.image_url && (
                  <img src={cat.image_url} alt={cat.name_ar} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                )}
                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between">
                  <span className="text-cream/70 text-xs tracking-[0.3em] uppercase">{cat.name_en}</span>
                  <div>
                    <h3 className="font-display text-3xl md:text-4xl text-cream mb-2">{cat.name_ar}</h3>
                    <span className="inline-flex items-center gap-2 text-gold text-xs tracking-widest uppercase group-hover:gap-4 transition-all">
                      اكتشفي
                      <span className="w-8 h-px bg-gold" />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ BESTSELLERS PLACEHOLDER ============ */}
      <section id="bestsellers" className="py-32 bg-card">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs tracking-[0.4em] text-accent uppercase mb-4">المفضلات</p>
            <h2 className="font-display text-5xl md:text-7xl mb-6">
              <span className="italic font-serif">الأكثر</span> مبيعاً
            </h2>
            <p className="text-muted-foreground">
              المنتجات التي اختارتها آلاف العميلات لتصبح جزءاً لا يتجزأ من جمالهن اليومي.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="group"
              >
                <div className="aspect-square bg-gradient-to-br from-secondary to-muted relative overflow-hidden mb-4">
                  <div className="absolute top-3 right-3 bg-accent text-accent-foreground text-[10px] px-2 py-1 tracking-widest uppercase">جديد</div>
                  <div className="absolute inset-0 grid place-items-center text-6xl opacity-20 font-display text-plum">G</div>
                  <button className="absolute bottom-3 left-3 right-3 bg-primary text-primary-foreground py-3 text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                    أضيفي للسلة
                  </button>
                </div>
                <p className="text-xs text-muted-foreground tracking-widest uppercase mb-1">روج فاخر</p>
                <h3 className="font-display text-xl mb-2">Velvet Bloom</h3>
                <div className="flex items-center justify-between">
                  <span className="font-medium">٤٥٠ ج.م</span>
                  <div className="flex gap-1 text-accent">
                    {[...Array(5)].map((_, j) => <Star key={j} size={12} fill="currentColor" />)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-sm text-muted-foreground italic">قريباً — أضيفي منتجاتك من لوحة الأدمن</p>
          </div>
        </div>
      </section>

      {/* ============ BRAND STORY ============ */}
      <section id="story" className="py-32">
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
              جمال
              <span className="italic font-serif text-gradient-gold"> بلا حدود</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              في Glow X، نؤمن أن الجمال طقس يومي وليس مجرد منتج. نختار أفخم
              المكونات من حول العالم ونصمم تركيبات تحتفي بأنوثتك الفريدة.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              كل لمسة، كل لون، كل عطر — مصاغ ليكون امتداداً لك.
            </p>
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border">
              <div>
                <p className="font-display text-4xl text-accent">10K+</p>
                <p className="text-xs text-muted-foreground tracking-widest uppercase mt-1">عميلة</p>
              </div>
              <div>
                <p className="font-display text-4xl text-accent">150+</p>
                <p className="text-xs text-muted-foreground tracking-widest uppercase mt-1">منتج</p>
              </div>
              <div>
                <p className="font-display text-4xl text-accent">4.9</p>
                <p className="text-xs text-muted-foreground tracking-widest uppercase mt-1">تقييم</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="py-32 bg-gradient-plum text-cream">
        <div className="max-w-5xl mx-auto px-6 md:px-10 text-center">
          <motion.div {...fadeUp}>
            <p className="text-xs tracking-[0.4em] text-gold uppercase mb-6">آراء عميلاتنا</p>
            <blockquote className="font-display text-3xl md:text-5xl leading-tight italic font-serif">
              "أول ماركة محلية حسيت إن منتجاتها فعلاً بمستوى الماركات العالمية.
              الإحساس فاخر من أول ما الباكدج بتوصل."
            </blockquote>
            <div className="mt-10 flex flex-col items-center gap-2">
              <div className="flex gap-1 text-gold">
                {[...Array(5)].map((_, j) => <Star key={j} size={16} fill="currentColor" />)}
              </div>
              <p className="text-sm tracking-widest uppercase text-cream/70">— ندى م.، القاهرة</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div>
              <h3 className="font-display text-3xl mb-4">
                <span className="text-gradient-gold">Glow</span> X
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                مستحضرات تجميل فاخرة، صُممت لتحتفي بك في كل لحظة.
              </p>
            </div>
            <div>
              <p className="text-xs tracking-[0.3em] uppercase mb-4 text-accent">المتجر</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#categories" className="hover:text-foreground">كل الأقسام</a></li>
                <li><a href="#bestsellers" className="hover:text-foreground">الأكثر مبيعاً</a></li>
                <li><a href="#new" className="hover:text-foreground">جديدنا</a></li>
              </ul>
            </div>
            <div>
              <p className="text-xs tracking-[0.3em] uppercase mb-4 text-accent">المساعدة</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>تتبع أوردرك</li>
                <li>الشحن والإرجاع</li>
                <li>تواصلي معنا</li>
              </ul>
            </div>
            <div>
              <p className="text-xs tracking-[0.3em] uppercase mb-4 text-accent">اشتركي</p>
              <p className="text-sm text-muted-foreground mb-4">احصلي على عروض حصرية وآخر التحديثات</p>
              <form className="flex">
                <input type="email" placeholder="بريدك الإلكتروني" className="flex-1 bg-muted px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent" />
                <button className="bg-primary text-primary-foreground px-5 text-xs tracking-widest uppercase">اشتركي</button>
              </form>
            </div>
          </div>
          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground tracking-wider">
            <p>© 2026 Glow X Cosmetics. جميع الحقوق محفوظة.</p>
            <p>صُنع بـ <Heart size={12} className="inline text-accent" /> في مصر</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
