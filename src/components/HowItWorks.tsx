import { Search, Compass, Phone } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function HowItWorks() {
  const { t } = useI18n();
  const steps = [
    { icon: Search, title: t("how.s1.t"), desc: t("how.s1.d") },
    { icon: Compass, title: t("how.s2.t"), desc: t("how.s2.d") },
    { icon: Phone, title: t("how.s3.t"), desc: t("how.s3.d") },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">{t("how.title")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("how.subtitle")}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
        {steps.map((s, i) => (
          <div
            key={s.title}
            className="glass group relative overflow-hidden rounded-2xl p-6 transition hover:scale-[1.02] hover:shadow-glow"
            style={{ animation: `fade-in 0.5s ease-out ${i * 0.1}s both` }}
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-brand shadow-glow">
              <s.icon className="h-6 w-6 text-white" />
            </div>
            <div className="absolute right-4 top-4 text-5xl font-black text-white/5">
              {i + 1}
            </div>
            <h3 className="text-lg font-semibold text-white">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
