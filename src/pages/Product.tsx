import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, ChevronLeft, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { mapRowToProduct, type Product } from "@/lib/types";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { add } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [shade, setShade] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        const p = data ? mapRowToProduct(data) : null;
        setProduct(p);
        if (p?.shades?.[0]) setShade(p.shades[0].name);
        if (p?.sizes?.[0]) setSize(p.sizes[0]);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="py-32 text-center text-muted-foreground">جاري التحميل...</div>;
  if (!product) return (
    <div className="py-32 text-center">
      <p className="font-display text-3xl mb-4">المنتج غير موجود</p>
      <Link to="/shop" className="text-accent underline">العودة للمتجر</Link>
    </div>
  );

  const handleAdd = () => {
    add({
      id: `${product.id}__${shade ?? ""}__${size ?? ""}`,
      product_id: product.id,
      name: product.name_ar,
      price: Number(product.price),
      qty,
      image: product.images?.[0] ?? "",
      shade: shade ?? undefined,
      size: size ?? undefined,
    });
    toast.success("تمت الإضافة للسلة", { description: product.name_ar });
  };

  const buyNow = () => {
    handleAdd();
    navigate("/checkout");
  };

  return (
    <div className="py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ChevronLeft size={16} />
          العودة للمتجر
        </Link>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          {/* Gallery */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="aspect-square bg-gradient-to-br from-secondary/40 to-muted relative overflow-hidden">
              {product.images?.[activeImg] ? (
                <img src={product.images[activeImg]} alt={product.name_ar} className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-9xl opacity-20 font-display text-plum">G</div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`aspect-square overflow-hidden border-2 transition ${activeImg === i ? "border-accent" : "border-transparent opacity-60 hover:opacity-100"}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-accent mb-2">{product.name_en}</p>
              <h1 className="font-display text-4xl md:text-5xl mb-4">{product.name_ar}</h1>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-medium">{product.price} ج.م</span>
                {product.compare_at_price && product.compare_at_price > product.price && (
                  <span className="text-lg text-muted-foreground line-through">{product.compare_at_price} ج.م</span>
                )}
              </div>
            </div>

            {product.description_ar && (
              <p className="text-muted-foreground leading-relaxed">{product.description_ar}</p>
            )}

            {product.shades?.length > 0 && (
              <div>
                <p className="text-xs tracking-[0.3em] uppercase mb-3">اللون: <span className="text-accent">{shade}</span></p>
                <div className="flex flex-wrap gap-3">
                  {product.shades.map((s) => (
                    <button
                      key={s.name}
                      onClick={() => setShade(s.name)}
                      className={`w-10 h-10 rounded-full border-2 transition ${shade === s.name ? "border-accent scale-110" : "border-border"}`}
                      style={{ backgroundColor: s.hex }}
                      title={s.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {product.sizes?.length > 0 && (
              <div>
                <p className="text-xs tracking-[0.3em] uppercase mb-3">الحجم</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSize(sz)}
                      className={`px-5 py-2 text-sm border transition ${size === sz ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-accent"}`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-xs tracking-[0.3em] uppercase mb-3">الكمية</p>
              <div className="inline-flex items-center border border-border">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-10 h-10 grid place-items-center hover:bg-muted"><Minus size={14} /></button>
                <span className="w-12 text-center">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="w-10 h-10 grid place-items-center hover:bg-muted"><Plus size={14} /></button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button onClick={handleAdd} className="flex-1 border border-primary text-primary px-8 py-4 text-sm tracking-widest uppercase hover:bg-primary hover:text-primary-foreground transition inline-flex items-center justify-center gap-2">
                <ShoppingBag size={16} /> أضيفي للسلة
              </button>
              <button onClick={buyNow} className="flex-1 bg-primary text-primary-foreground px-8 py-4 text-sm tracking-widest uppercase hover:bg-gradient-plum transition">
                اشتري الآن
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
              {[
                { icon: Truck, label: "شحن سريع" },
                { icon: ShieldCheck, label: "أصلي 100%" },
                { icon: RotateCcw, label: "استبدال سهل" },
              ].map((f) => (
                <div key={f.label} className="text-center">
                  <f.icon size={20} className="text-accent mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">{f.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
