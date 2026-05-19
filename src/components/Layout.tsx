import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Moon, Sun, Menu, X, Heart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import WhatsAppButton from "./WhatsAppButton";

export default function Layout({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const { count } = useCart();
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden flex flex-col">
      <header className="fixed top-0 inset-x-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
          <Link to="/" className="font-display text-3xl tracking-tight">
            <span className="text-gradient-gold">Glow</span>
            <span className="text-foreground"> X</span>
          </Link>

          <nav className="hidden md:flex items-center gap-10 text-sm tracking-widest uppercase">
            <Link to="/" className="hover:text-accent transition-colors">الرئيسية</Link>
            <Link to="/shop" className="hover:text-accent transition-colors">المتجر</Link>
            <Link to="/track" className="hover:text-accent transition-colors">تتبع الأوردر</Link>
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={() => setDark((d) => !d)} className="w-10 h-10 grid place-items-center rounded-full hover:bg-muted transition" aria-label="Toggle dark mode">
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link to="/cart" className="w-10 h-10 grid place-items-center rounded-full hover:bg-muted transition relative" aria-label="Cart">
              <ShoppingBag size={18} />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent text-accent-foreground text-[10px] min-w-4 h-4 px-1 grid place-items-center rounded-full font-bold">
                  {count}
                </span>
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
            <Link to="/">الرئيسية</Link>
            <Link to="/shop">المتجر</Link>
            <Link to="/track">تتبع الأوردر</Link>
            <Link to="/cart">السلة ({count})</Link>
          </nav>
        </div>
      )}

      <main className="flex-1 pt-20">{children}</main>

      <footer className="bg-background border-t border-border mt-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
          <div className="grid md:grid-cols-3 gap-10 mb-8">
            <div>
              <h3 className="font-display text-3xl mb-3">
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
                <li><Link to="/cart" className="hover:text-foreground">السلة</Link></li>
                <li><Link to="/track" className="hover:text-foreground">تتبع الأوردر</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs tracking-[0.3em] uppercase mb-4 text-accent">تواصلي معنا</p>
              <p className="text-sm text-muted-foreground">للاستفسارات: support@glowx.eg</p>
            </div>
          </div>
          <div className="pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
            <p>© 2026 Glow X Cosmetics. جميع الحقوق محفوظة.</p>
            <p>صُنع بـ <Heart size={12} className="inline text-accent" /> في مصر</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
