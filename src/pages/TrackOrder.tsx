import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Package, Truck, CheckCircle2, Clock, XCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  governorate_name: string;
  items: Array<{ name: string; price: number; qty: number; shade?: string | null; size?: string | null }>;
  subtotal: number;
  shipping_cost: number;
  total: number;
  status: "new" | "processing" | "shipped" | "delivered" | "cancelled";
  created_at: string;
};

const STATUS_MAP: Record<Order["status"], { label: string; icon: typeof Clock; color: string }> = {
  new: { label: "جديد", icon: Clock, color: "text-blue-500" },
  processing: { label: "قيد التجهيز", icon: Package, color: "text-amber-500" },
  shipped: { label: "تم الشحن", icon: Truck, color: "text-indigo-500" },
  delivered: { label: "تم التسليم", icon: CheckCircle2, color: "text-green-500" },
  cancelled: { label: "ملغي", icon: XCircle, color: "text-red-500" },
};
const STEPS: Order["status"][] = ["new", "processing", "shipped", "delivered"];

export default function TrackOrder() {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(orderNumber ?? "");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (orderNumber) search(orderNumber);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderNumber]);

  const search = async (num: string) => {
    if (!num.trim()) return toast.error("اكتبي رقم الأوردر");
    setLoading(true);
    setSearched(true);
    const { data } = await supabase
      .from("orders")
      .select("id, order_number, customer_name, governorate_name, items, subtotal, shipping_cost, total, status, created_at")
      .eq("order_number", num.trim())
      .maybeSingle();
    setOrder(data as unknown as Order);
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/track/${query.trim()}`);
    search(query);
  };

  const currentStep = order ? STEPS.indexOf(order.status) : -1;

  return (
    <div className="py-12 md:py-20">
      <div className="max-w-3xl mx-auto px-6 md:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <p className="text-xs tracking-[0.4em] text-accent uppercase mb-4">تتبع أوردرك</p>
          <h1 className="font-display text-4xl md:text-6xl mb-4">
            <span className="italic font-serif text-gradient-gold">فين</span> أوردري؟
          </h1>
          <p className="text-muted-foreground">اكتبي رقم الأوردر (GLW-xxxx) لمتابعة حالته.</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="flex gap-2 mb-10">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="GLW-1000"
            className="flex-1 bg-input px-5 py-4 focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <button type="submit" className="bg-primary text-primary-foreground px-6 py-4 hover:bg-gradient-plum transition flex items-center gap-2">
            <Search size={18} />
            <span className="hidden sm:inline text-xs tracking-widest uppercase">بحث</span>
          </button>
        </form>

        {loading && <p className="text-center text-muted-foreground py-10">جاري البحث...</p>}

        {!loading && searched && !order && (
          <div className="text-center py-16 bg-card border border-border">
            <XCircle size={48} className="text-muted-foreground mx-auto mb-4" strokeWidth={1.5} />
            <p className="font-display text-2xl mb-2">لم يتم العثور على الأوردر</p>
            <p className="text-muted-foreground text-sm">تأكدي من رقم الأوردر وحاولي تاني.</p>
          </div>
        )}

        {!loading && order && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-card border border-border p-6">
              <div className="flex flex-wrap justify-between gap-3 mb-6">
                <div>
                  <p className="text-xs tracking-widest uppercase text-muted-foreground">رقم الأوردر</p>
                  <p className="font-display text-2xl text-accent">{order.order_number}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs tracking-widest uppercase text-muted-foreground">العميل</p>
                  <p className="font-medium">{order.customer_name}</p>
                </div>
              </div>

              {order.status !== "cancelled" ? (
                <div className="relative pt-4">
                  <div className="absolute top-9 right-5 left-5 h-px bg-border" />
                  <div className="absolute top-9 right-5 h-px bg-accent transition-all" style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%`, right: "auto", left: "auto", marginRight: "1.25rem" }} />
                  <div className="grid grid-cols-4 gap-2 relative">
                    {STEPS.map((s, i) => {
                      const { label, icon: Icon } = STATUS_MAP[s];
                      const done = i <= currentStep;
                      return (
                        <div key={s} className="flex flex-col items-center text-center">
                          <div className={`w-10 h-10 rounded-full grid place-items-center border-2 transition ${done ? "bg-accent border-accent text-accent-foreground" : "bg-background border-border text-muted-foreground"}`}>
                            <Icon size={16} />
                          </div>
                          <p className={`text-[10px] mt-2 tracking-widest uppercase ${done ? "text-foreground" : "text-muted-foreground"}`}>{label}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="bg-destructive/10 border border-destructive/30 p-4 text-center text-destructive">
                  <XCircle className="mx-auto mb-2" />
                  <p className="font-medium">تم إلغاء هذا الأوردر</p>
                </div>
              )}
            </div>

            <div className="bg-card border border-border p-6">
              <h2 className="font-display text-xl mb-4">المنتجات</h2>
              <div className="space-y-3 divide-y divide-border">
                {order.items.map((i, idx) => (
                  <div key={idx} className="pt-3 first:pt-0 flex justify-between text-sm">
                    <div>
                      <p>{i.name} × {i.qty}</p>
                      {(i.shade || i.size) && <p className="text-xs text-muted-foreground mt-1">{[i.shade, i.size].filter(Boolean).join(" · ")}</p>}
                    </div>
                    <span>{i.price * i.qty} ج.م</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border mt-4 pt-4 space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">المجموع الفرعي</span><span>{order.subtotal} ج.م</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">الشحن ({order.governorate_name})</span><span>{order.shipping_cost} ج.م</span></div>
                <div className="flex justify-between font-display text-xl pt-2"><span>الإجمالي</span><span className="text-accent">{order.total} ج.م</span></div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
