import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/ProductCard";
import { mapRowToProduct, mapRowToCategory, type Product, type Category } from "@/lib/types";

export default function Shop() {
  const { slug } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const activeCat = categories.find((c) => c.slug === slug);

  useEffect(() => {
    supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("display_order")
      .then(({ data }) => data && setCategories((data as any[]).map(mapRowToCategory)));
  }, []);

  useEffect(() => {
    setLoading(true);
    let q = supabase
      .from("products")
      .select("*, product_images(image_url, display_order)")
      .order("created_at", { ascending: false });
    if (slug && activeCat) q = q.eq("category_id", activeCat.id);
    q.then(({ data }) => {
      setProducts(((data as any[]) ?? []).map(mapRowToProduct));
      setLoading(false);
    });
  }, [slug, activeCat]);

  return (
    <div className="min-h-screen">
      <section className="py-16 md:py-24 border-b border-border bg-gradient-to-b from-secondary/20 to-transparent">
        <div className="max-w-7xl mx-auto px-6 md:px-10 text-center">
          <p className="text-xs tracking-[0.4em] text-accent uppercase mb-4">المتجر</p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-display text-5xl md:text-7xl mb-6"
          >
            {activeCat ? (
              <>
                <span className="italic font-serif text-gradient-gold">{activeCat.name_ar}</span>
              </>
            ) : (
              <>
                كل <span className="italic font-serif text-gradient-gold">المنتجات</span>
              </>
            )}
          </motion.h1>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex flex-wrap gap-2 md:gap-3 justify-center mb-12">
            <Link
              to="/shop"
              className={`px-5 py-2 text-xs tracking-widest uppercase border transition ${
                !slug ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-accent"
              }`}
            >
              الكل
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                to={`/shop/${c.slug}`}
                className={`px-5 py-2 text-xs tracking-widest uppercase border transition ${
                  slug === c.slug ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-accent"
                }`}
              >
                {c.name_ar}
              </Link>
            ))}
          </div>

          {loading ? (
            <p className="text-center text-muted-foreground py-20">جاري التحميل...</p>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-display text-3xl mb-4">لا توجد منتجات بعد</p>
              <p className="text-muted-foreground">المنتجات هتظهر هنا بمجرد ما الأدمن يضيفها</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
