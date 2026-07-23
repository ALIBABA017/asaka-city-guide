import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "uz" | "ru" | "en";

const translations: Record<Lang, Record<string, string>> = {
  uz: {
    "hero.title.a": "Asakadagi hamma narsa.",
    "hero.title.b": "Bitta platformada.",
    "hero.badge": "Asakada 1,200+ biznesga xizmat ko'rsatmoqda",
    "hero.subtitle":
      "Yaqin atrofdagi restoranlar, klinikalar, maktablar va xizmatlarni kashf eting — haqiqiy sharhlar, jonli ish soatlari va bir bosishda bron.",
    "hero.search.placeholder": "Restoran, shifokor, maktab qidiring...",
    "hero.search.button": "Qidiruv",
    "hero.voice.tooltip": "Ovozli qidiruv tez orada",
    "hero.clear": "Tozalash",
    "categories.title": "Kategoriyalarni ko'ring",
    "categories.subtitle": "Sizga kerak bo'lgan hamma narsa, tartiblangan.",
    "featured.title": "Tanlangan bizneslar",
    "featured.results": "\"{q}\" bo'yicha natijalar",
    "featured.count.one": "{n} joy Asakada",
    "featured.count.many": "{n} joylar Asakada",
    "featured.empty": "Qidiruvingizga mos biznes topilmadi. Boshqa kalit so'z sinab ko'ring.",
    "trending.title": "Asakada mashhur",
    "events.title": "Kelgusi tadbirlar",
    "events.subtitle": "Bu oyda nima bo'layotganini o'tkazib yubormang.",
    "events.viewAll": "Barchasini ko'rish →",
    "nav.explore": "Ko'rish",
    "nav.forBusiness": "Biznes uchun",
    "nav.events": "Tadbirlar",
    "nav.jobs": "Ish o'rinlari",
    "nav.signIn": "Kirish",
    "nav.listBusiness": "+ Biznesni qo'shish",
    "card.openNow": "Hozir ochiq",
    "card.call": "Qo'ng'iroq",
    "card.directions": "Yo'nalish",
    "card.book": "Bron qilish",
    "card.book.title": "{name}da bron qilish",
    "card.book.desc": "Tezkor bron tez orada. Hozircha bron qilish uchun Qo'ng'iroq tugmasini bosing.",
    "card.close": "Yopish",
    "biz.about": "Haqida",
    "biz.owner": "Egasi",
    "biz.hours": "Ish soatlari",
    "biz.today": "• Bugun",
    "biz.menu": "Menyu",
    "biz.reviews": "Sharhlar",
    "biz.book": "Stol bron qilish",
    "biz.faq": "Ko'p so'raladigan savollar",
    "biz.contact": "Aloqa",
    "biz.location": "Joylashuv",
    "biz.offers": "Maxsus takliflar",
    "biz.related": "O'xshash",
    "biz.back": "← Orqaga",
  },
  ru: {
    "hero.title.a": "Всё в Асаке.",
    "hero.title.b": "Одна платформа.",
    "hero.badge": "Сейчас обслуживаем 1,200+ компаний в Асаке",
    "hero.subtitle":
      "Откройте для себя рестораны, клиники, школы и услуги рядом — реальные отзывы, актуальные часы работы, бронь в один клик.",
    "hero.search.placeholder": "Ищите рестораны, врачей, школы...",
    "hero.search.button": "Поиск",
    "hero.voice.tooltip": "Голосовой поиск скоро",
    "hero.clear": "Очистить",
    "categories.title": "Просмотреть категории",
    "categories.subtitle": "Всё нужное, отсортировано для вас.",
    "featured.title": "Избранные компании",
    "featured.results": "Результаты по «{q}»",
    "featured.count.one": "{n} место в Асаке",
    "featured.count.many": "{n} мест в Асаке",
    "featured.empty": "Ничего не найдено. Попробуйте другое ключевое слово.",
    "trending.title": "Популярно в Асаке",
    "events.title": "Предстоящие события",
    "events.subtitle": "Не пропустите главное в этом месяце.",
    "events.viewAll": "Смотреть все →",
    "nav.explore": "Обзор",
    "nav.forBusiness": "Для бизнеса",
    "nav.events": "События",
    "nav.jobs": "Работа",
    "nav.signIn": "Войти",
    "nav.listBusiness": "+ Добавить бизнес",
    "card.openNow": "Сейчас открыто",
    "card.call": "Звонок",
    "card.directions": "Маршрут",
    "card.book": "Бронь",
    "card.book.title": "Бронь в {name}",
    "card.book.desc": "Быстрая бронь скоро. Пока нажмите «Звонок», чтобы забронировать.",
    "card.close": "Закрыть",
    "biz.about": "О заведении",
    "biz.owner": "Владелец",
    "biz.hours": "Часы работы",
    "biz.today": "• Сегодня",
    "biz.menu": "Меню",
    "biz.reviews": "Отзывы",
    "biz.book": "Забронировать стол",
    "biz.faq": "Частые вопросы",
    "biz.contact": "Контакты",
    "biz.location": "Расположение",
    "biz.offers": "Спецпредложения",
    "biz.related": "Похожие",
    "biz.back": "← Назад",
  },
  en: {
    "hero.title.a": "Everything in Asaka.",
    "hero.title.b": "One platform.",
    "hero.badge": "Now serving 1,200+ businesses in Asaka",
    "hero.subtitle":
      "Discover restaurants, clinics, schools, and services near you — with real reviews, live hours, and one-tap booking.",
    "hero.search.placeholder": "Search restaurants, doctors, schools...",
    "hero.search.button": "Search",
    "hero.voice.tooltip": "Voice search coming soon",
    "hero.clear": "Clear",
    "categories.title": "Browse categories",
    "categories.subtitle": "Everything you need, sorted for you.",
    "featured.title": "Featured businesses",
    "featured.results": "Results for “{q}”",
    "featured.count.one": "{n} place in Asaka",
    "featured.count.many": "{n} places in Asaka",
    "featured.empty": "No businesses match your search. Try a different keyword.",
    "trending.title": "Trending in Asaka",
    "events.title": "Upcoming events",
    "events.subtitle": "Don't miss what's happening this month.",
    "events.viewAll": "View all →",
    "nav.explore": "Explore",
    "nav.forBusiness": "For Business",
    "nav.events": "Events",
    "nav.jobs": "Jobs",
    "nav.signIn": "Sign In",
    "nav.listBusiness": "+ List Business",
    "card.openNow": "Open now",
    "card.call": "Call",
    "card.directions": "Directions",
    "card.book": "Book",
    "card.book.title": "Book at {name}",
    "card.book.desc": "Quick booking coming soon. For now, tap Call to reserve.",
    "card.close": "Close",
    "biz.about": "About",
    "biz.owner": "Owner",
    "biz.hours": "Working Hours",
    "biz.today": "• Today",
    "biz.menu": "Menu",
    "biz.reviews": "Reviews",
    "biz.book": "Book Table",
    "biz.faq": "FAQ",
    "biz.contact": "Contact",
    "biz.location": "Location",
    "biz.offers": "Special Offers",
    "biz.related": "Related",
    "biz.back": "← Back",
  },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: string, vars?: Record<string, string | number>) => string };
const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("uz");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("lang") as Lang | null;
      if (saved === "uz" || saved === "ru" || saved === "en") setLangState(saved);
    } catch {}
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("lang", l);
    } catch {}
  };

  const t = (key: string, vars?: Record<string, string | number>) => {
    let s = translations[lang][key] ?? translations.en[key] ?? key;
    if (vars) for (const k in vars) s = s.replace(`{${k}}`, String(vars[k]));
    return s;
  };

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) return { lang: "uz" as Lang, setLang: () => {}, t: (k: string) => translations.uz[k] ?? k };
  return ctx;
}
