import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
      <p className="text-sm tracking-[0.4em] text-accent uppercase">404</p>
      <h1 className="mt-4 text-5xl md:text-7xl font-display text-foreground">الصفحة غير موجودة</h1>
      <p className="mt-4 text-muted-foreground max-w-md">يبدو أن هذه الصفحة قد رحلت كأناقة قديمة. عودي إلى المتجر.</p>
      <Link to="/" className="mt-8 inline-block bg-primary text-primary-foreground px-8 py-3 text-sm tracking-widest uppercase hover:bg-gradient-plum transition-all">
        العودة للرئيسية
      </Link>
    </main>
  );
}
