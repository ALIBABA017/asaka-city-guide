import { Users, Store, Heart } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function WhyAsaka() {
  const { t } = useI18n();
  const items = [
    { icon: Users, title: t("why.customers.t"), desc: t("why.customers.d"), color: "from-[#0066FF] to-[#4D94FF]" },
    { icon: Store, title: t("why.business.t"), desc: t("why.business.d"), color: "from-[#00D4AA] to-[#0066FF]" },
    { icon: Heart, title: t("why.city.t"), desc: t("why.city.d"), color: "from-[#FF6B6B] to-[#FFA855]" },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">{t("why.title")}</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
        {items.map((s, i) => (
          <div
            key={s.title}
            className="glass rounded-2xl p-6 transition hover:scale-[1.02]"
            style={{ animation: `fade-in 0.5s ease-out ${i * 0.1}s both` }}
          >
            <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${s.color}`}>
              <s.icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
