export type Category = {
  slug: string;
  name: string;
  emoji: string;
  gradient: string;
};

export const categories: Category[] = [
  { slug: "restaurants", name: "Restaurants", emoji: "🍽️", gradient: "from-orange-500/30 to-red-500/20" },
  { slug: "hospitals", name: "Hospitals", emoji: "🏥", gradient: "from-red-500/30 to-pink-500/20" },
  { slug: "schools", name: "Schools", emoji: "🎓", gradient: "from-blue-500/30 to-indigo-500/20" },
  { slug: "hotels", name: "Hotels", emoji: "🏨", gradient: "from-purple-500/30 to-fuchsia-500/20" },
  { slug: "car-service", name: "Car Service", emoji: "🚗", gradient: "from-slate-500/30 to-zinc-500/20" },
  { slug: "pharmacy", name: "Pharmacy", emoji: "💊", gradient: "from-emerald-500/30 to-teal-500/20" },
  { slug: "beauty", name: "Beauty", emoji: "💇", gradient: "from-pink-500/30 to-rose-500/20" },
  { slug: "banks", name: "Banks", emoji: "🏦", gradient: "from-sky-500/30 to-cyan-500/20" },
  { slug: "shops", name: "Shops", emoji: "🛒", gradient: "from-amber-500/30 to-yellow-500/20" },
  { slug: "events", name: "Events", emoji: "🎉", gradient: "from-violet-500/30 to-purple-500/20" },
  { slug: "jobs", name: "Jobs", emoji: "💼", gradient: "from-teal-500/30 to-cyan-500/20" },
  { slug: "more", name: "More", emoji: "✨", gradient: "from-indigo-500/30 to-blue-500/20" },
];

export type Business = {
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  address: string;
  rating: number;
  distanceKm: number;
  emoji: string;
  isOpen: boolean;
  phone: string;
  tags: string[];
};

export const featuredBusinesses: Business[] = [
  {
    slug: "osh-markazi",
    name: "Osh Markazi",
    category: "Traditional Uzbek Cuisine",
    categorySlug: "restaurants",
    address: "Babur Street",
    rating: 4.9,
    distanceKm: 1.2,
    emoji: "🍛",
    isOpen: true,
    phone: "+998901234567",
    tags: ["Family Restaurant"],
  },
  {
    slug: "choyxona-asaka",
    name: "Choyxona Asaka",
    category: "Grill & Shashlik",
    categorySlug: "restaurants",
    address: "Amir Temur St.",
    rating: 4.6,
    distanceKm: 1.5,
    emoji: "🍖",
    isOpen: true,
    phone: "+998903334455",
    tags: ["Family Restaurant"],
  },
  {
    slug: "asaka-medical-center",
    name: "Asaka Medical Center",
    category: "Multi-Specialty Clinic",
    categorySlug: "hospitals",
    address: "Navoi Avenue",
    rating: 4.7,
    distanceKm: 0.8,
    emoji: "🩺",
    isOpen: true,
    phone: "+998901112233",
    tags: ["24h Pharmacy"],
  },
];

export const trending: Business[] = [
  {
    slug: "fitlife-gym",
    name: "FitLife Gym",
    category: "Fitness & Wellness",
    categorySlug: "beauty",
    address: "Yangi Hayot St.",
    rating: 4.5,
    distanceKm: 0.9,
    emoji: "🏋️",
    isOpen: true,
    phone: "+998905556677",
    tags: [],
  },
  {
    slug: "ziyo-education",
    name: "Ziyo Education",
    category: "English & IT Courses",
    categorySlug: "schools",
    address: "Ibn Sino St.",
    rating: 4.9,
    distanceKm: 1.8,
    emoji: "📚",
    isOpen: true,
    phone: "+998908889900",
    tags: ["English Courses"],
  },
  {
    slug: "silk-road-cafe",
    name: "Silk Road Café",
    category: "Coffee & Coworking",
    categorySlug: "restaurants",
    address: "Mustaqillik Square",
    rating: 4.8,
    distanceKm: 2.1,
    emoji: "☕",
    isOpen: true,
    phone: "+998907778899",
    tags: ["Family Restaurant"],
  },
];


export const popularTags = [
  "24h Pharmacy",
  "Family Restaurant",
  "Car Service",
  "English Courses",
];

export type EventItem = {
  id: string;
  title: string;
  dateLabel: string; // "25 JUL"
  day: string;
  month: string;
  description: string;
  emoji: string;
};

export const events: EventItem[] = [
  {
    id: "asaka-business-forum",
    title: "Asaka Business Forum",
    dateLabel: "25 JUL",
    day: "25",
    month: "JUL",
    description: "Regional entrepreneurs meetup at Hotel Asaka",
    emoji: "💼",
  },
  {
    id: "summer-music-festival",
    title: "Summer Music Festival",
    dateLabel: "28 JUL",
    day: "28",
    month: "JUL",
    description: "Live performances at Mustaqillik Square",
    emoji: "🎵",
  },
  {
    id: "youth-tech-hackathon",
    title: "Youth Tech Hackathon",
    dateLabel: "02 AUG",
    day: "02",
    month: "AUG",
    description: "48-hour hackathon for students at Ziyo Center",
    emoji: "💻",
  },
];

export const specialOffers = [
  { id: "osh-20", business: "Osh Markazi", businessSlug: "osh-markazi", label: "20% OFF", note: "Lunch special until 3 PM" },
  { id: "medical-free", business: "Asaka Medical", businessSlug: "asaka-medical-center", label: "FREE CONSULTATION", note: "First visit this month" },
];

export const allBusinesses: Business[] = [...featuredBusinesses, ...trending];
