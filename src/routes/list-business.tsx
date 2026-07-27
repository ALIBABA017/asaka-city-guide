import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { mySupabase, TABLES, STORAGE_BUCKET } from "@/lib/my-supabase";

export const Route = createFileRoute("/list-business")({
  head: () => ({
    meta: [
      { title: "Biznesingizni qo'shing — Smart Asaka" },
      {
        name: "description",
        content:
          "Smart Asaka platformasida o'z biznesingizni bepul ro'yxatdan o'tkazing va mijozlarga ko'rinadigan bo'ling.",
      },
      { property: "og:title", content: "Biznesingizni qo'shing — Smart Asaka" },
      {
        property: "og:description",
        content: "Asaka shahridagi mijozlarga o'z biznesingizni taqdim eting.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ListBusinessPage,
});

const CATEGORIES = [
  "Restaurants",
  "Clinics",
  "Shops",
  "Schools",
  "Hotels",
  "Beauty",
  "Auto",
  "Fitness",
  "Education",
  "Events",
  "Services",
  "Other",
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
const DAY_LABELS: Record<string, string> = {
  Mon: "Du",
  Tue: "Se",
  Wed: "Ch",
  Thu: "Pa",
  Fri: "Ju",
  Sat: "Sh",
  Sun: "Ya",
};

const MAX_SIZE = 2 * 1024 * 1024;

type Errors = Record<string, string>;

function fieldClass(hasError: boolean) {
  return (
    "w-full rounded-xl border bg-white/5 px-4 py-3 text-sm text-white placeholder:text-muted-foreground/70 outline-none transition focus:border-primary/60 focus:bg-white/10 " +
    (hasError ? "border-red-500/70" : "border-white/10")
  );
}

function Label({ children, optional }: { children: React.ReactNode; optional?: boolean }) {
  return (
    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
      {optional && <span className="ml-1 normal-case text-[10px] text-muted-foreground/70">(ixtiyoriy)</span>}
    </label>
  );
}

function ErrorText({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-red-400">{msg}</p>;
}

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-brand text-xs font-bold text-white shadow-glow">
          {n}
        </span>
        <h2 className="text-base font-semibold text-white">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function ListBusinessPage() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");

  const [days, setDays] = useState<string[]>(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
  const [openTime, setOpenTime] = useState("09:00");
  const [closeTime, setCloseTime] = useState("22:00");

  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");

  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validate = (): Errors => {
    const e: Errors = {};
    if (!name.trim()) e.name = "Biznes nomi kiritilishi shart";
    if (!category) e.category = "Kategoriyani tanlang";
    if (!phone.trim()) e.phone = "Telefon raqami kiritilishi shart";
    else if (!phone.replace(/\s/g, "").startsWith("+998")) e.phone = "Raqam +998 bilan boshlanishi kerak";
    if (!address.trim()) e.address = "Manzil kiritilishi shart";
    if (!description.trim()) e.description = "Tavsif kiritilishi shart";
    else if (description.length > 500) e.description = "Maksimal 500 belgi";
    if (days.length === 0) e.days = "Kamida bitta kun tanlang";
    if (!openTime) e.openTime = "Ochilish vaqtini kiriting";
    if (!closeTime) e.closeTime = "Yopilish vaqtini kiriting";
    if (!logo) e.logo = "Logotip yuklang";
    if (!ownerName.trim()) e.ownerName = "Ism kiritilishi shart";
    if (!ownerEmail.trim()) e.ownerEmail = "Email kiritilishi shart";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ownerEmail)) e.ownerEmail = "Email formati noto'g'ri";
    if (!ownerPhone.trim()) e.ownerPhone = "Telefon raqami kiritilishi shart";
    else if (!ownerPhone.replace(/\s/g, "").startsWith("+998")) e.ownerPhone = "Raqam +998 bilan boshlanishi kerak";
    return e;
  };

  const isValid = useMemo(() => Object.keys(validate()).length === 0, [
    name,
    category,
    phone,
    address,
    description,
    days,
    openTime,
    closeTime,
    logo,
    ownerName,
    ownerEmail,
    ownerPhone,
  ]);

  const toggleDay = (d: string) =>
    setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));

  const onLogoChange = (file: File | null) => {
    if (!file) return;
    if (file.size > MAX_SIZE) {
      setErrors((p) => ({ ...p, logo: "Fayl hajmi 2MB dan oshmasligi kerak" }));
      return;
    }
    setErrors((p) => ({ ...p, logo: "" }));
    setLogo(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const onPhotosChange = (files: FileList | null) => {
    if (!files) return;
    const list = Array.from(files);
    const tooBig = list.find((f) => f.size > MAX_SIZE);
    if (tooBig) {
      setErrors((p) => ({ ...p, photos: "Har bir rasm 2MB dan kichik bo'lishi kerak" }));
      return;
    }
    const next = [...photos, ...list].slice(0, 5);
    setErrors((p) => ({ ...p, photos: list.length + photos.length > 5 ? "Maksimal 5 ta rasm" : "" }));
    setPhotos(next);
    setPhotoPreviews(next.map((f) => URL.createObjectURL(f)));
  };

  const removePhoto = (i: number) => {
    const next = photos.filter((_, idx) => idx !== i);
    setPhotos(next);
    setPhotoPreviews(next.map((f) => URL.createObjectURL(f)));
  };

  const uploadFile = async (file: File, folder: "logos" | "photos") => {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await mySupabase.storage.from(STORAGE_BUCKET).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });
    if (error) throw error;
    return mySupabase.storage.from(STORAGE_BUCKET).getPublicUrl(path).data.publicUrl;
  };

  const workingHours = useMemo(() => {
    const ordered = DAYS.filter((d) => days.includes(d));
    if (ordered.length === 0) return "";
    const label =
      ordered.length === 7
        ? "Mon-Sun"
        : ordered.length === 1
          ? ordered[0]
          : ordered.join(",");
    return `${label} ${openTime}-${closeTime}`;
  }, [days, openTime, closeTime]);

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const logoUrl = logo ? await uploadFile(logo, "logos") : null;
      const photoUrls: string[] = [];
      for (const p of photos) photoUrls.push(await uploadFile(p, "photos"));

      const { error } = await mySupabase.from(TABLES.business).insert({
        name: name.trim(),
        category,
        phone: phone.trim(),
        address: address.trim(),
        description: description.trim(),
        logo_url: logoUrl,
        photos: photoUrls,
        working_hours: workingHours,
        owner_name: ownerName.trim(),
        owner_email: ownerEmail.trim(),
        status: "pending",
        rating: 0,
        review_count: 0,
      });
      if (error) throw error;
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("[list-business] submit failed", err);
      setSubmitError("❌ Xatolik yuz berdi. Qayta urinib ko'ring.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 pb-24 pt-12 sm:px-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-widest text-muted-foreground">
            Smart Asaka · Business
          </div>
          <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">Biznesingizni qo'shing</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            Smart Asaka platformasida o'z biznesingizni ro'yxatdan o'tkazing
          </p>
        </div>

        {success ? (
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center backdrop-blur-xl">
            <div className="text-5xl">✅</div>
            <p className="mt-4 text-lg font-semibold text-white">
              Biznesingiz muvaffaqiyatli yuborildi!
            </p>
            <p className="mt-2 text-sm text-muted-foreground">24 soat ichida ko'rib chiqiladi.</p>
            <Link
              to="/"
              className="mt-8 inline-flex items-center rounded-xl bg-gradient-brand px-5 py-2.5 text-sm font-medium text-white shadow-glow transition hover:scale-[1.02]"
            >
              Bosh sahifaga qaytish
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-10 space-y-6" noValidate>
            <Section n={1} title="Biznes ma'lumotlari">
              <div>
                <Label>Biznes nomi</Label>
                <input
                  className={fieldClass(!!errors.name)}
                  placeholder="Osh Markazi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <ErrorText msg={errors.name} />
              </div>
              <div>
                <Label>Kategoriya</Label>
                <select
                  className={fieldClass(!!errors.category)}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="" className="bg-background">
                    Tanlang...
                  </option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} className="bg-background">
                      {c}
                    </option>
                  ))}
                </select>
                <ErrorText msg={errors.category} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Telefon</Label>
                  <input
                    className={fieldClass(!!errors.phone)}
                    placeholder="+998 90 123 45 67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <ErrorText msg={errors.phone} />
                </div>
                <div>
                  <Label>Manzil</Label>
                  <input
                    className={fieldClass(!!errors.address)}
                    placeholder="Babur ko'chasi, Asaka"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <ErrorText msg={errors.address} />
                </div>
              </div>
              <div>
                <Label>Tavsif</Label>
                <textarea
                  rows={4}
                  maxLength={500}
                  className={fieldClass(!!errors.description) + " resize-none"}
                  placeholder="Biznesingiz haqida qisqacha..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <div className="mt-1 flex items-center justify-between">
                  <ErrorText msg={errors.description} />
                  <span className="ml-auto text-[11px] text-muted-foreground">{description.length}/500</span>
                </div>
              </div>
            </Section>

            <Section n={2} title="Ish soatlari">
              <div>
                <Label>Kunlar</Label>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((d) => {
                    const active = days.includes(d);
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => toggleDay(d)}
                        className={
                          "rounded-lg border px-3 py-2 text-xs font-semibold transition " +
                          (active
                            ? "border-transparent bg-gradient-brand text-white shadow-glow"
                            : "border-white/10 bg-white/5 text-muted-foreground hover:text-white")
                        }
                      >
                        {DAY_LABELS[d]}
                      </button>
                    );
                  })}
                </div>
                <ErrorText msg={errors.days} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Ochilish vaqti</Label>
                  <input
                    type="time"
                    className={fieldClass(!!errors.openTime)}
                    value={openTime}
                    onChange={(e) => setOpenTime(e.target.value)}
                  />
                  <ErrorText msg={errors.openTime} />
                </div>
                <div>
                  <Label>Yopilish vaqti</Label>
                  <input
                    type="time"
                    className={fieldClass(!!errors.closeTime)}
                    value={closeTime}
                    onChange={(e) => setCloseTime(e.target.value)}
                  />
                  <ErrorText msg={errors.closeTime} />
                </div>
              </div>
              {workingHours && (
                <p className="text-xs text-muted-foreground">
                  Saqlanadi: <span className="text-white">{workingHours}</span>
                </p>
              )}
            </Section>

            <Section n={3} title="Rasmlar">
              <div>
                <Label>Logotip (maks. 2MB)</Label>
                <div className="flex items-center gap-4">
                  {logoPreview && (
                    <img
                      src={logoPreview}
                      alt="Logotip preview"
                      className="h-16 w-16 rounded-xl border border-white/10 object-cover"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onLogoChange(e.target.files?.[0] ?? null)}
                    className="block w-full text-xs text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-xs file:text-white"
                  />
                </div>
                <ErrorText msg={errors.logo} />
              </div>
              <div>
                <Label optional>Qo'shimcha rasmlar (maks. 5 ta, har biri 2MB)</Label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => onPhotosChange(e.target.files)}
                  className="block w-full text-xs text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-xs file:text-white"
                />
                <ErrorText msg={errors.photos} />
                {photoPreviews.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                    {photoPreviews.map((src, i) => (
                      <div key={src} className="relative">
                        <img
                          src={src}
                          alt={`Rasm ${i + 1}`}
                          className="h-20 w-full rounded-lg border border-white/10 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(i)}
                          className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white"
                          aria-label="O'chirish"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Section>

            <Section n={4} title="Egasi haqida">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Ism familiya</Label>
                  <input
                    className={fieldClass(!!errors.ownerName)}
                    placeholder="Abdulla Karimov"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                  />
                  <ErrorText msg={errors.ownerName} />
                </div>
                <div>
                  <Label>Email</Label>
                  <input
                    type="email"
                    className={fieldClass(!!errors.ownerEmail)}
                    placeholder="owner@example.com"
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                  />
                  <ErrorText msg={errors.ownerEmail} />
                </div>
              </div>
              <div>
                <Label>Telefon</Label>
                <input
                  className={fieldClass(!!errors.ownerPhone)}
                  placeholder="+998 90 123 45 67"
                  value={ownerPhone}
                  onChange={(e) => setOwnerPhone(e.target.value)}
                />
                <ErrorText msg={errors.ownerPhone} />
              </div>
            </Section>

            {submitError && (
              <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {submitError}
              </div>
            )}

            <button
              type="submit"
              disabled={!isValid || submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-brand px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
            >
              {submitting && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              )}
              {submitting ? "Yuborilmoqda..." : "Yuborish"}
            </button>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
