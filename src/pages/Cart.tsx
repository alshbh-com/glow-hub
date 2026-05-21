import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ChevronLeft } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function Cart() {
  const { items, updateQty, remove, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="py-24 max-w-2xl mx-auto px-6 text-center">
        <ShoppingBag size={64} className="mx-auto text-muted-foreground mb-6" strokeWidth={1} />
        <h1 className="font-display text-4xl mb-3">سلتك فاضية</h1>
        <p className="text-muted-foreground mb-8">اكتشفي مجموعتنا الفاخرة من المستحضرات.</p>
        <Link to="/shop" className="inline-block bg-primary text-primary-foreground px-10 py-4 text-sm tracking-widest uppercase hover:bg-gradient-plum transition">
          تسوقي الآن
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ChevronLeft size={16} /> الاستمرار في التسوق
        </Link>
        <h1 className="font-display text-4xl md:text-6xl mb-10">
          سلتك<span className="italic font-serif text-gradient-gold">.</span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 bg-card border border-border">
                <div className="w-24 h-24 bg-muted flex-shrink-0 overflow-hidden">
                  {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : null}
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-lg">{item.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.shade && <span>اللون: {item.shade}</span>}
                      {item.shade && item.size && <span> · </span>}
                      {item.size && <span>الحجم: {item.size}</span>}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center border border-border">
                      <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-8 h-8 grid place-items-center hover:bg-muted"><Minus size={12} /></button>
                      <span className="w-10 text-center text-sm">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-8 h-8 grid place-items-center hover:bg-muted"><Plus size={12} /></button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{item.price * item.qty} ج.م</span>
                      <button onClick={() => remove(item.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="bg-card border border-border p-6 h-fit sticky top-28">
            <h2 className="font-display text-2xl mb-6">ملخص الطلب</h2>
            <div className="space-y-3 pb-6 border-b border-border text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">المجموع الفرعي</span><span>{subtotal} ج.م</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">الشحن</span><span className="text-accent">مجاني</span></div>
            </div>
            <div className="flex justify-between items-baseline py-6">
              <span className="text-xs tracking-widest uppercase">الإجمالي</span>
              <span className="font-display text-2xl">{subtotal} ج.م</span>
            </div>
            <Link to="/checkout" className="block bg-primary text-primary-foreground text-center px-8 py-4 text-sm tracking-widest uppercase hover:bg-gradient-plum transition">
              إتمام الطلب
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
