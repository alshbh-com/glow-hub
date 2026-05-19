import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
type Gov = { id: string; name: string; shipping_cost: number };

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, clear } = useCart();
  const [govs, setGovs] = useState<Gov[]>([]);
  const [govId, setGovId] = useState<string>("");
  const [form, setForm] = useState({ name: "", phone: "", address: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState<number | null>(null);

  useEffect(() => {
    supabase
      .from("governorates")
      .select("id, name, shipping_cost")
      .eq("is_active", true)
      .order("display_order")
      .then(({ data }) => {
        const list = ((data as any[]) ?? []).map((g) => ({
          id: g.id,
          name: g.name,
          shipping_cost: Number(g.shipping_cost ?? 0),
        }));
        setGovs(list);
        if (list[0]) setGovId(list[0].id);
      });
  }, []);

  const selectedGov = govs.find((g) => g.id === govId);
  const shipping = Number(selectedGov?.shipping_cost ?? 0);
  const total = subtotal + shipping;

  if (items.length === 0 && !orderNumber) {
    return (
      <div className="py-24 text-center">
        <p className="font-display text-3xl mb-4">السلة فاضية</p>
        <Link to="/shop" className="text-accent underline">تسوقي الآن</Link>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGov) return toast.error("اختاري المحافظة");
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) return toast.error("املئي البيانات");
    if (!/^01[0-2,5]\d{8}$/.test(form.phone.trim())) return toast.error("رقم تليفون غير صحيح");

    setSubmitting(true);

    // 1) Create / insert customer
    const { data: customer, error: custErr } = await (supabase as any)
      .from("customers")
      .insert({
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        governorate: selectedGov.name,
      })
      .select("id")
      .single();

    if (custErr || !customer) {
      setSubmitting(false);
      toast.error("حصلت مشكلة في حفظ بياناتك، حاولي تاني");
      return;
    }

    // 2) Create order
    const orderDetails = items
      .map((i) => `${i.name} × ${i.qty}${i.shade ? ` (${i.shade})` : ""}${i.size ? ` [${i.size}]` : ""}`)
      .join("\n");

    const { data: order, error: orderErr } = await (supabase as any)
      .from("orders")
      .insert({
        customer_id: customer.id,
        governorate_id: selectedGov.id,
        total_amount: total,
        shipping_cost: shipping,
        status: "pending",
        order_details: orderDetails,
        notes: form.notes.trim() || null,
      })
      .select("order_number")
      .single();

    if (orderErr || !order) {
      setSubmitting(false);
      toast.error("حصلت مشكلة، حاولي تاني");
      return;
    }

    // 3) Insert order items (best-effort)
    await (supabase as any).from("order_items").insert(
      items.map((i) => ({
        order_id: (order as any).id ?? undefined,
        product_id: i.product_id,
        quantity: i.qty,
        price: i.price,
        color: i.shade ?? null,
        size: i.size ?? null,
        product_details: i.name,
      })),
    );

    setSubmitting(false);
    setOrderNumber(Number(order.order_number));
    clear();
  };

  if (orderNumber) {
    return (
      <div className="py-24 max-w-xl mx-auto px-6 text-center">
        <CheckCircle2 size={72} className="text-accent mx-auto mb-6" strokeWidth={1.5} />
        <h1 className="font-display text-4xl md:text-5xl mb-4">
          شكراً <span className="italic font-serif text-gradient-gold">لك</span>
        </h1>
        <p className="text-muted-foreground mb-6">تم استلام طلبك وهنتواصل معكِ قريباً.</p>
        <div className="bg-card border border-border p-6 mb-6">
          <p className="text-xs tracking-widest uppercase text-muted-foreground mb-2">رقم الطلب</p>
          <p className="font-display text-2xl text-accent">{orderNumber}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to={`/track/${orderNumber}`} className="bg-primary text-primary-foreground px-8 py-3 text-sm tracking-widest uppercase">تتبعي طلبك</Link>
          <Link to="/shop" className="border border-border px-8 py-3 text-sm tracking-widest uppercase">تسوقي المزيد</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <Link to="/cart" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ChevronLeft size={16} /> العودة للسلة
        </Link>
        <h1 className="font-display text-4xl md:text-6xl mb-10">إتمام <span className="italic font-serif text-gradient-gold">الطلب</span></h1>

        <form onSubmit={submit} className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-card border border-border p-6 space-y-4">
              <h2 className="font-display text-2xl mb-4">بيانات التوصيل</h2>
              <Field label="الاسم بالكامل" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
              <Field label="رقم التليفون" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="01xxxxxxxxx" type="tel" />
              <div>
                <label className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2 block">المحافظة</label>
                <select value={govId} onChange={(e) => setGovId(e.target.value)} className="w-full bg-input px-4 py-3 focus:outline-none focus:ring-1 focus:ring-accent">
                  {govs.map((g) => <option key={g.id} value={g.id}>{g.name_ar} — شحن {g.shipping_cost} ج.م</option>)}
                </select>
              </div>
              <Field label="العنوان بالتفصيل" value={form.address} onChange={(v) => setForm({ ...form, address: v })} multiline />
              <Field label="ملاحظات (اختياري)" value={form.notes} onChange={(v) => setForm({ ...form, notes: v })} multiline />
            </section>

            <section className="bg-card border border-border p-6">
              <h2 className="font-display text-2xl mb-4">طريقة الدفع</h2>
              <label className="flex items-center gap-3 p-4 border border-accent bg-accent/5 cursor-pointer">
                <input type="radio" checked readOnly className="accent-accent" />
                <div>
                  <p className="font-medium">الدفع عند الاستلام</p>
                  <p className="text-xs text-muted-foreground">ادفعي نقداً عند وصول الأوردر</p>
                </div>
              </label>
            </section>
          </div>

          <aside className="bg-card border border-border p-6 h-fit lg:sticky lg:top-28">
            <h2 className="font-display text-2xl mb-6">ملخص الطلب</h2>
            <div className="space-y-3 mb-4 max-h-60 overflow-auto">
              {items.map((i) => (
                <div key={i.id} className="flex justify-between text-sm">
                  <span className="truncate">{i.name} × {i.qty}</span>
                  <span>{i.price * i.qty} ج.م</span>
                </div>
              ))}
            </div>
            <div className="space-y-2 py-4 border-y border-border text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">المجموع الفرعي</span><span>{subtotal} ج.م</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">الشحن</span><span>{shipping} ج.م</span></div>
            </div>
            <div className="flex justify-between items-baseline py-4">
              <span className="text-xs tracking-widest uppercase">الإجمالي</span>
              <span className="font-display text-2xl">{total} ج.م</span>
            </div>
            <button type="submit" disabled={submitting} className="w-full bg-primary text-primary-foreground px-8 py-4 text-sm tracking-widest uppercase hover:bg-gradient-plum transition disabled:opacity-50">
              {submitting ? "جاري التأكيد..." : "تأكيد الطلب"}
            </button>
          </aside>
        </form>
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, placeholder, type = "text", multiline,
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; multiline?: boolean }) {
  return (
    <div>
      <label className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2 block">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3} className="w-full bg-input px-4 py-3 focus:outline-none focus:ring-1 focus:ring-accent resize-none" />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-input px-4 py-3 focus:outline-none focus:ring-1 focus:ring-accent" />
      )}
    </div>
  );
}
