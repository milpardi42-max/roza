import type { Category, Collection, Portfolio, EducationItem, StyleDef } from "../types";

/* ── Store categories ─────────────────────────────────────── */
export const categories: Category[] = [
  {
    slug: "cushions",
    name: { fa: "کوسن و رومیزی", en: "Cushions" },
    description: {
      fa: "لمس نگاره‌ها؛ نرم‌ترین راه برای ورود نگاره به خانه.",
      en: "Touch the motifs; the softest way to bring pattern home.",
    },
    image: "/assets/images/products/cushion-bamyan.jpg",
    scheme: { motif: "tilestar", bg: "#12263f", fg: "#e8dcc6", fg2: "#b0713c", density: 56 },
  },
  {
    slug: "rugs",
    name: { fa: "قالی و قالیچه", en: "Rugs" },
    description: {
      fa: "حافظهٔ گلیم، بازبافته شده با دستِ امروز.",
      en: "The kilim's memory, rewoven by a modern hand.",
    },
    image: "/assets/images/products/rug-desert-lattice.jpg",
    scheme: { motif: "diamond", bg: "#efe6d8", fg: "#b66a4a", fg2: "#2e4a5c", density: 40 },
  },
  {
    slug: "wallpaper",
    name: { fa: "کاغذدیواری", en: "Wallpaper" },
    description: {
      fa: "دیوارِ صامت شما، بلندگوی طراحی است.",
      en: "Your silent wall is design's loudspeaker.",
    },
    image: "/assets/images/products/wallpaper-pistachio.jpg",
    scheme: { motif: "botanica", bg: "#f4f7f2", fg: "#7d9186", density: 52 },
  },
  {
    slug: "curtains",
    name: { fa: "پرده", en: "Curtains" },
    description: {
      fa: "نور را با نقش فیلتر کنید.",
      en: "Filter light with pattern.",
    },
    image: "/assets/images/products/curtain-saffron.jpg",
    scheme: { motif: "stripes", bg: "#f2e6d2", fg: "#b98a2f", density: 36 },
  },
  {
    slug: "ceramics",
    name: { fa: "سرامیک", en: "Ceramics" },
    description: {
      fa: "لعابی‌ترین بسترِ نقش؛ دست‌ساز و آرشیوی.",
      en: "Pattern's most glazed substrate; handmade, archival.",
    },
    image: "/assets/images/products/vase-salt-dome.jpg",
    scheme: { motif: "rings", bg: "#f6f4ef", fg: "#a89a89", density: 42 },
  },
  {
    slug: "stationery",
    name: { fa: "چاپی و روزمره", en: "Print & Everyday" },
    description: {
      fa: "دفتر، کیف و چاپ هنری؛ نگاره در دستِ شما.",
      en: "Notebooks, totes and art prints; pattern in your hands.",
    },
    image: "/assets/images/products/notebook-terrazzo.jpg",
    scheme: { motif: "terazzo", bg: "#faf7f1", fg: "#d9b48f", fg2: "#a05d24", density: 64, seed: 7 },
  },
  {
    slug: "lighting",
    name: { fa: "روشنایی", en: "Lighting" },
    description: {
      fa: "نقش، وقتی با نور سایه می‌سازد.",
      en: "Pattern, when it casts shadow with light.",
    },
    image: "/assets/images/products/lamp-cypress.jpg",
    scheme: { motif: "botanica", bg: "#f2ece1", fg: "#5d7a68", fg2: "#b0713c", density: 58, seed: 11 },
  },
  {
    slug: "bedding",
    name: { fa: "تخت‌خواب", en: "Bedding" },
    description: {
      fa: "هشت ساعت زندگی در دل یک نگاره.",
      en: "Eight hours of life inside a motif.",
    },
    image: "/assets/images/products/duvet-midnight.jpg",
    scheme: { motif: "rings", bg: "#0e1e33", fg: "#d9b48f", density: 46 },
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

/* ── Collections ──────────────────────────────────────────── */
export const collections: Collection[] = [
  {
    slug: "desert-light",
    title: { fa: "نورِ بیابان", en: "Desert Light" },
    description: {
      fa: "دوازده محصول محدود با رنگ‌های آفتاب غروب کویر؛ فقط تا پایان فصل.",
      en: "Twelve limited products in desert-sunset colors; only until the end of season.",
    },
    cover: "/assets/images/products/cushion-bamyan.jpg",
    scheme: { motif: "tilestar", bg: "#12263f", fg: "#e8dcc6", fg2: "#b0713c", density: 56 },
    productSlugs: ["cushion-bamyan-stars", "rug-desert-lattice", "mural-midnight-rosary", "lampshade-cypress", "duvet-midnight-rosary"],
    exclusive: true,
  },
  {
    slug: "caspian-bloom",
    title: { fa: "شکوفهٔ خزر", en: "Caspian Bloom" },
    description: {
      fa: "گیاهان نرمِ شمال؛ سبز و آبیِ کنار دریا.",
      en: "The north's soft flora; green and blue by the sea.",
    },
    cover: "/assets/images/products/wallpaper-pistachio.jpg",
    scheme: { motif: "botanica", bg: "#f4f7f2", fg: "#7d9186", density: 52 },
    productSlugs: ["wallpaper-pistachio-grove", "plates-caspian-set", "tote-caspian-tide", "tea-cypress-set"],
  },
];

export function getCollection(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}

/* ── Portfolio projects ───────────────────────────────────── */
export const portfolios: Portfolio[] = [
  {
    id: "pf1",
    slug: "caspian-hotel",
    title: { fa: "هتل بوتیک خزر", en: "Caspian Boutique Hotel" },
    category: { fa: "هتل", en: "Hotel" },
    year: "2025",
    location: { fa: "رشت", en: "Rasht" },
    cover: "/assets/images/portfolio/hotel-lobby.jpg",
    gallery: [
      "/assets/images/portfolio/hotel-lobby.jpg",
      "/assets/images/products/curtain-tehran.jpg",
      "/assets/images/products/rug-desert-lattice.jpg",
    ],
    story: {
      fa: "لابی هتلی که صاحبانش می‌خواستند «مهمان اول بوی دریا را نبیند» اما همه‌جا بفهمد کنار دریاست. نگارهٔ «جزرومد خزر» روی کاغذدیواری و پرده‌ها نشست و هر اتاق یک عمقِ رنگی گرفت.",
      en: "A lobby whose owners wanted guests to feel the sea without seeing it first. “Caspian Tide” settled onto the wallcovering and curtains, and every room got its own color depth.",
    },
    creatorSlug: "maryam-rad",
    patternSlugs: ["caspian-tide", "salt-dome"],
    productSlugs: ["curtain-tehran-bridges", "rug-desert-lattice", "vase-salt-dome-set"],
    featured: true,
  },
  {
    id: "pf2",
    slug: "tirajeh-cafe",
    title: { fa: "کافهٔ تیراژه", en: "Tirajeh Café" },
    category: { fa: "کافه/رستوران", en: "Café" },
    year: "2025",
    location: { fa: "تهران", en: "Tehran" },
    cover: "/assets/images/portfolio/cafe.jpg",
    gallery: ["/assets/images/portfolio/cafe.jpg", "/assets/images/products/plates-caspian.jpg"],
    story: {
      fa: "کافه‌ای در یک خانهٔ قدیمی فرمانیه که قرار بود «گرمِ قدیمی» و «دقيقِ امروزی» باشد. «مش مس» به‌جای دیوار، روی سقفِ نیمه شبانه نشست و نور مخفی، آن را به غربال نور تبدیل کرد.",
      en: "A café in an old Farmanieh house meant to feel both warmly-old and precisely-modern. “Copper Mesh” climbed onto the evening half-ceiling and concealed light turned it into a sieve.",
    },
    creatorSlug: "arman-vesali",
    patternSlugs: ["copper-mesh", "garden-of-planes"],
    productSlugs: ["plates-caspian-set", "notebook-planes-set"],
    featured: true,
  },
  {
    id: "pf3",
    slug: "nursery-nika",
    title: { fa: "اتاق کودک نیکا", en: "Nika's Nursery" },
    category: { fa: "مسکونی", en: "Residential" },
    year: "2024",
    location: { fa: "اصفهان", en: "Isfahan" },
    cover: "/assets/images/portfolio/nursery.jpg",
    gallery: [
      "/assets/images/portfolio/nursery.jpg",
      "/assets/images/products/wallpaper-pistachio.jpg",
      "/assets/images/products/cushion-bamyan.jpg",
    ],
    story: {
      fa: "والدین نیکا اتاقی می‌خواستند که «بزرگ شود با او». «باغ پسته» روی یک دیوار رها شد و بقیه رنگ‌های خنثی؛ نگاره‌ای که تا ده سالگی هم بزرگ‌شآن ندارد.",
      en: "Nika's parents wanted a room that would grow with her. “Pistachio Grove” was released on one wall with everything else neutral — a motif that won't grow old by age ten.",
    },
    creatorSlug: "niloofar-karimi",
    patternSlugs: ["pistachio-grove"],
    productSlugs: ["wallpaper-pistachio-grove", "cushion-bamyan-stars"],
    featured: true,
  },
  {
    id: "pf4",
    slug: "showroom-tabriz",
    title: { fa: "شوروم سرامیک تبریز", en: "Tabriz Ceramic Showroom" },
    category: { fa: "فروشگاهی", en: "Retail" },
    year: "2025",
    location: { fa: "تبریز", en: "Tabriz" },
    cover: "/assets/images/portfolio/showroom.jpg",
    gallery: ["/assets/images/portfolio/showroom.jpg", "/assets/images/products/vase-salt-dome.jpg", "/assets/images/products/tea-cypress.jpg"],
    story: {
      fa: "وقتی محصول، نگاره است، فروشگاه باید گالری باشد. سارا شوروم را با کفِ «گنبد نمکی» بزرگ‌مقیاس طراحی کرد تا مشتری روی نگاره راه برود — و نگاهش به رگِ دیوار نکند.",
      en: "When the product is the pattern, the store must be a gallery. Sara designed the showroom with a large-scale “Salt Dome” floor so customers walk on the motif — and catch their reflection.",
    },
    creatorSlug: "sara-cheraghi",
    patternSlugs: ["salt-dome", "cypress-waltz"],
    productSlugs: ["vase-salt-dome-set", "tea-cypress-set"],
    featured: true,
  },
  {
    id: "pf5",
    slug: "ariya-offices",
    title: { fa: "دفتر مرکزی آریا", en: "Ariya HQ" },
    category: { fa: "اداری", en: "Office" },
    year: "2024",
    location: { fa: "تهران", en: "Tehran" },
    cover: "/assets/images/portfolio/hotel-lobby.jpg",
    gallery: ["/assets/images/portfolio/hotel-lobby.jpg"],
    story: {
      fa: "شرکت فناوری‌ای که نمی‌خواست دیوارش آگهی داشته باشد. کیان «پل‌های تهران» را به نسبت ۱:۳ بزرگ کرد تا تکرار، به سکوتِ گرافیکی برسد.",
      en: "A tech company that didn't want its wall to read as advertising. Kian scaled “Tehran Bridges” 3:1 so the repetition reached graphic silence.",
    },
    creatorSlug: "kian-soltani",
    patternSlugs: ["tehran-bridges"],
    productSlugs: ["curtain-tehran-bridges"],
  },
  {
    id: "pf6",
    slug: "kashan-guesthouse",
    title: { fa: "مهمانخانهٔ سنتی کاشان", en: "Kashan Guesthouse" },
    category: { fa: "اقامتی", en: "Guesthouse" },
    year: "2023",
    location: { fa: "کاشان", en: "Kashan" },
    cover: "/assets/images/portfolio/cafe.jpg",
    gallery: ["/assets/images/portfolio/cafe.jpg", "/assets/images/products/cushion-kilim.jpg"],
    story: {
      fa: "مرمت خانه‌ای ۱۵۰ ساله بدون شکستن هجایش؛ یگانه «توری کویر» را با خاکِ حیاط هم‌رنگ کرد تا میهمان بین بافتِ کهن و نو، تفاوت را تنها با لمس بفهمد.",
      en: "Restoring a 150-year-old house without breaking its syllables; Yeganeh matched “Desert Lattice” to the courtyard clay so guests notice old vs. new only by touch.",
    },
    creatorSlug: "yeganeh-bahrami",
    patternSlugs: ["desert-lattice", "kilim-memory"],
    productSlugs: ["rug-desert-lattice", "cushion-kilim-memory"],
    featured: true,
  },
];

export function getPortfolio(slug: string): Portfolio | undefined {
  return portfolios.find((p) => p.slug === slug);
}

export function portfoliosByArtist(artistSlug: string): Portfolio[] {
  return portfolios.filter((p) => p.creatorSlug === artistSlug);
}

/* ── Education ────────────────────────────────────────────── */
export const education: EducationItem[] = [
  {
    id: "e1",
    slug: "repeat-fundamentals",
    kind: "course",
    title: { fa: "اصول تکرار در طراحی الگو", en: "Fundamentals of Repeat in Pattern Design" },
    excerpt: {
      fa: "از بلوک ساده تا تکرار بدون درز؛ شالودهٔ هر نگارهٔ حرفه‌ای.",
      en: "From simple block to seamless repeat; the foundation of every professional motif.",
    },
    category: { fa: "مبانی", en: "Fundamentals" },
    difficulty: "beginner",
    duration: { fa: "۴ ساعت و ۳۰ دقیقه", en: "4h 30m" },
    lessons: 18,
    cover: "",
    coverScheme: { motif: "dots", bg: "#f1efe9", fg: "#2e4a5c", fg2: "#a05d24", density: 26 },
    authorSlug: "kian-soltani",
    popular: true,
    content: [
      {
        fa: "تکرار، قلبِ تپندهٔ الگوست. در این دورهٔ ورودی، با چهار سیستم اصلی تکرار — بلوک، آجر، مایل و چرخش — آشنا می‌شوید و می‌فهمید چرا بعضی نگاره‌ها «نفس می‌کشند» و بعضی «خفه می‌شوند».",
        en: "Repeat is a pattern's heartbeat. In this entry course you'll meet the four core repeat systems — block, brick, drop and rotation — and learn why some motifs 'breathe' while others suffocate.",
      },
      {
        fa: "هر درس با یک تمرین چاپی همراه است: از کاغذ و مداد شروع می‌کنیم و به فایل وکتوری نهایی می‌رسیم؛ درست همان مسیرِ آماده‌سازی برای پورتفوی بازار رزی آتلیه.",
        en: "Each lesson ships with a print exercise: we start with paper and pencil and end with a final vector file — the exact workflow for preparing your portfolio for the Rezi Atelier marketplace.",
      },
    ],
  },
  {
    id: "e2",
    slug: "color-for-pattern-makers",
    kind: "course",
    title: { fa: "رنگ برای الگوسازان", en: "Color for Pattern Makers" },
    excerpt: {
      fa: "چرا کرمِ رزی آتلیه با مسیِ آن آرام است؟ علم و حسِ رنگ در مقیاس الگو.",
      en: "Why is Rezi Atelier cream calm with copper? The science and gut of color at pattern scale.",
    },
    category: { fa: "رنگ", en: "Color" },
    difficulty: "intermediate",
    duration: { fa: "۳ ساعت", en: "3h" },
    lessons: 12,
    cover: "",
    coverScheme: { motif: "stripes", bg: "#f8ecdd", fg: "#a05d24", fg2: "#2e4a5c", density: 32 },
    authorSlug: "maryam-rad",
    popular: true,
    content: [
      {
        fa: "در الگو، رنگ‌ها هرگز تنها نیستند — هر هگز، همسایه‌های خود را در تکرار پیدا می‌کند. اینجا یاد می‌گیرید پالت بسازید که در فاصله‌های یک سانتی‌متری هم خوب کار کند.",
        en: "In patterns, colors are never alone — every hex finds its neighbors in repeat. Here you learn to build palettes that work even at 1cm distances.",
      },
    ],
  },
  {
    id: "e3",
    slug: "first-seamless-repeat",
    kind: "tutorial",
    title: { fa: "اولین تکرار بدون درز در ۳۰ دقیقه", en: "Your First Seamless Repeat in 30 Minutes" },
    excerpt: {
      fa: "تمرین فوری: یک دایره، چهار قاعده، و یک تایل آمادهٔ بازار.",
      en: "Instant practice: one circle, four rules, and a marketplace-ready tile.",
    },
    category: { fa: "تمرینی", en: "Practice" },
    difficulty: "beginner",
    duration: { fa: "۳۰ دقیقه", en: "30 min" },
    cover: "/assets/images/education/sketch-desk.jpg",
    authorSlug: "arman-vesali",
    popular: true,
    content: [
      {
        fa: "یک دایره کشیدید؟ کافی است! این آموزش سریع نشان می‌دهد چطور ساده‌ترین شکل را به تایلی تبدیل کنید که بدون درز، روی هر بستری بنشیند.",
        en: "Drew one circle? That's enough! This quick tutorial shows how to turn the simplest shape into a tile that sits seamlessly on any substrate.",
      },
    ],
  },
  {
    id: "e4",
    slug: "from-sketch-to-vector",
    kind: "tutorial",
    title: { fa: "از اسکیس دستی تا وکتور تمیز", en: "From Hand Sketch to Clean Vector" },
    excerpt: {
      fa: "روش نقاب‌کشی دست‌سازان و حفظ «کیفیت دست» در فایل دیجیتال.",
      en: "Hand-makers' tracing method, keeping the 'hand's quality' in digital files.",
    },
    category: { fa: "دیجیتال", en: "Digital" },
    difficulty: "intermediate",
    duration: { fa: "۴۵ دقیقه", en: "45 min" },
    cover: "/assets/images/education/loom-detail.jpg",
    authorSlug: "maryam-rad",
    content: [
      {
        fa: "وکتوری که «کامپیوتری» به نظر برسد، نگاره را می‌کشد. تکنیک‌های حفظ ارتعاش دست، فاصله‌های نامتقارن و لبه‌های زنده — با مثال‌های واقعی از نگاره‌های مریم.",
        en: "A vector that looks 'computer-made' kills the motif. Techniques for preserving hand tremble, asymmetric spacing and living edges — with real examples from Maryam's patterns.",
      },
    ],
  },
  {
    id: "e5",
    slug: "kilim-history",
    kind: "article",
    title: { fa: "تاریخهٔ گلیم: گرهی که ایرانی شد", en: "A History of the Kilim: The Knot That Became Iranian" },
    excerpt: {
      fa: "از دشت‌های آذربایجان تا خانه‌های اسکاندیناوی؛ سفر یک زبانِ صوری.",
      en: "From Azerbaijan's plains to Scandinavian homes; the journey of a motif language.",
    },
    category: { fa: "تاریخ و فرهنگ", en: "History & culture" },
    difficulty: "beginner",
    duration: { fa: "۱۸ دقیقه مطالعه", en: "18 min read" },
    cover: "",
    coverScheme: { motif: "chevron", bg: "#efe3d3", fg: "#b66a4a", fg2: "#2e4a5c", density: 34 },
    authorSlug: "yeganeh-bahrami",
    popular: true,
    content: [
      {
        fa: "گلیم فقط بافتنی نیست — یک خطِ نوشتاری است که با گره به جای قلم ثبت می‌شود. این مقاله به پرسش «چرا نگاره‌های گلیم هنوز کار می‌کنند؟» پاسخ پژوهشی می‌دهد.",
        en: "The kilim is not just a weave — it is a written language registered with knots instead of pens. This essay gives a research answer to “why do kilim motifs still work?”",
      },
    ],
  },
  {
    id: "e6",
    slug: "pattern-trends-2026",
    kind: "article",
    title: { fa: "ترندهای الگو ۲۰۲۶", en: "Pattern Trends 2026" },
    excerpt: {
      fa: "گزارش سالانهٔ رزی آتلیه: چه چیزی برمی‌گردد و چه چیزی نو می‌شود.",
      en: "The Rezi Atelier annual report: what returns and what arrives.",
    },
    category: { fa: "ترند", en: "Trends" },
    difficulty: "beginner",
    duration: { fa: "۱۲ دقیقه مطالعه", en: "12 min read" },
    cover: "",
    coverScheme: { motif: "tilestar", bg: "#12263f", fg: "#e8dcc6", fg2: "#b0713c", density: 56 },
    authorSlug: "kian-soltani",
    content: [
      {
        fa: "سال ۲۰۲۶ سالِ «الگوی کند» است: تکرارهایی که شتاب نمی‌گیرند، رنگ‌هایی که لبه ندارند. گزارش کامل با نمونه‌هایی از بازار جهانی.",
        en: "2026 is the year of the 'slow pattern': repeats that don't rush, colors without edges. The full report with examples from global markets.",
      },
    ],
  },
  {
    id: "e7",
    slug: "print-production-guide",
    kind: "tutorial",
    title: { fa: "آماده‌سازی فایل برای چاپ صنعتی", en: "Preparing Files for Industrial Print" },
    excerpt: {
      fa: "از DPI تا پروفایل ICC؛ بگذار اولین رول پارچه‌ات اشتباه نشود.",
      en: "From DPI to ICC profiles; don't let your first fabric roll go wrong.",
    },
    category: { fa: "تولید", en: "Production" },
    difficulty: "advanced",
    duration: { fa: "۱ ساعت", en: "1h" },
    cover: "",
    coverScheme: { motif: "archi", bg: "#f2e9df", fg: "#2e4a5c", fg2: "#b0713c", density: 48 },
    authorSlug: "arman-vesali",
    content: [
      {
        fa: "بیشترین هزینهٔ یک طراح مستقل، رولِ چاپِ خراب است. این راهنما چک‌لیست کامل تولید رزی آتلیه را جمع کرده: تکرار، صافی رنگ، حاشیهٔ امن و گفت‌وگو با چاپخانه.",
        en: "A ruined print roll is a freelance designer's biggest cost. This guide assembles Rezi Atelier's full production checklist: repeat, color dithering, safe margins and talking to the print house.",
      },
    ],
  },
  {
    id: "e8",
    slug: "licensing-101",
    kind: "course",
    title: { fa: "لایسنس و کسب‌وکار الگو ۱۰۱", en: "Licensing & the Pattern Business 101" },
    excerpt: {
      fa: "قراردادهایی که از عدالت می‌گویند؛ از قیمت‌گذاری تا رعایت حقوق.",
      en: "Contracts that speak fairness; from pricing to protecting rights.",
    },
    category: { fa: "کسب‌وکار", en: "Business" },
    difficulty: "beginner",
    duration: { fa: "۲ ساعت و ۱۵ دقیقه", en: "2h 15m" },
    lessons: 9,
    cover: "",
    coverScheme: { motif: "diamond", bg: "#efe6d8", fg: "#b66a4a", fg2: "#2e4a5c", density: 40 },
    authorSlug: "sara-cheraghi",
    content: [
      {
        fa: "رزی آتلیه هنرمندانش را ۴۰ تا ۷۰ درصد هر لایسنس می‌پردازد — ولی این چه یعنی؟ در این دوره مدل‌های لایسنس، انحصار کاربری و شرایط نمایش را با مثال‌های قرارداد واقعی (ناشناس‌شده) مرور می‌کنیم.",
        en: "Rezi Atelier pays artists 40–70% of every license — but what does that mean? In this course we review license models, category exclusivity and showcase terms with real (anonymized) contracts.",
      },
    ],
  },
];

export function getEducation(slug: string): EducationItem | undefined {
  return education.find((e) => e.slug === slug);
}

/* ── Styles (style finder section) ────────────────────────── */
export const styles: StyleDef[] = [
  {
    slug: "geometric",
    name: { fa: "هندسی", en: "Geometric" },
    description: {
      fa: "نظمِ بصری، ریتمِ ستاره‌ها؛ برای فضای جسور.",
      en: "Visual order, star rhythm; for bold spaces.",
    },
    scheme: { motif: "tilestar", bg: "#12263f", fg: "#e8dcc6", fg2: "#b0713c", density: 56 },
  },
  {
    slug: "botanical",
    name: { fa: "گیاهی", en: "Botanical" },
    description: {
      fa: "شاخه و برگ با لطافت آبرنگ؛ تازگیِ همیشگی.",
      en: "Branches and leaves in watercolor softness; lasting freshness.",
    },
    scheme: { motif: "botanica", bg: "#f4f7f2", fg: "#7d9186", density: 52 },
  },
  {
    slug: "minimal",
    name: { fa: "مینیمال", en: "Minimal" },
    description: {
      fa: "کمتر، اما دقیق‌تر؛ برای چشم‌های خسته.",
      en: "Less, but sharper; for tired eyes.",
    },
    scheme: { motif: "rings", bg: "#f6f4ef", fg: "#a89a89", density: 42 },
  },
  {
    slug: "kilim",
    name: { fa: "قومی و گلیم", en: "Kilim & ethnic" },
    description: {
      fa: "حافظهٔ قوم، با تناسب امروز.",
      en: "The tribe's memory, with today's proportions.",
    },
    scheme: { motif: "chevron", bg: "#efe3d3", fg: "#b66a4a", density: 34 },
  },
  {
    slug: "terrazzo",
    name: { fa: "ترازو", en: "Terrazzo" },
    description: {
      fa: "رگه‌های ونیزی با روحِ ایرانی.",
      en: "Venetian veins with an Iranian soul.",
    },
    scheme: { motif: "terazzo", bg: "#faf7f1", fg: "#d9b48f", fg2: "#a05d24", density: 64, seed: 7 },
  },
  {
    slug: "waves",
    name: { fa: "امواج", en: "Waves" },
    description: {
      fa: "آرامشِ قوس‌ها؛ از خیزاب تا کنف.",
      en: "The calm of arcs; from tide to linen.",
    },
    scheme: { motif: "seigaiha", bg: "#e9f1f2", fg: "#14304d", density: 44 },
  },
];
