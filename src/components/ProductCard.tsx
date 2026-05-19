import { Link } from "react-router-dom";
import type { Product } from "@/lib/types";

export function ProductCard({ p }: { p: Product }) {
  const img = p.images?.[0];
  return (
    <Link to={`/product/${p.id}`} className="group block">
      <div className="aspect-square bg-gradient-to-br from-secondary/40 to-muted relative overflow-hidden mb-4">
        {p.is_new && (
          <span className="absolute top-3 right-3 bg-accent text-accent-foreground text-[10px] px-2 py-1 tracking-widest uppercase z-10">جديد</span>
        )}
        {p.is_bestseller && (
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] px-2 py-1 tracking-widest uppercase z-10">Bestseller</span>
        )}
        {img ? (
          <img src={img} alt={p.name_ar} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-6xl opacity-20 font-display text-plum">G</div>
        )}
      </div>
      <p className="text-[10px] text-muted-foreground tracking-widest uppercase mb-1">{p.name_en}</p>
      <h3 className="font-display text-lg mb-2 group-hover:text-accent transition-colors">{p.name_ar}</h3>
      <div className="flex items-center gap-3">
        <span className="font-medium">{p.price} ج.م</span>
        {p.compare_at_price && p.compare_at_price > p.price && (
          <span className="text-xs text-muted-foreground line-through">{p.compare_at_price} ج.م</span>
        )}
      </div>
    </Link>
  );
}
