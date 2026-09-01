import type { Artist } from "../types";

export const artists: Artist[] = [
  {
    id: "a1",
    slug: "maryam-rad",
    name: { fa: "مریم راد", en: "Maryam Rad" },
    profession: {
      fa: "طراح پارچه و سطوح",
      en: "Textile & surface designer",
    },
    bio: {
      fa: "مریم ده سال است که ریتمِ رنگ و بافت را از بازار تهران تا کارگاه‌های اصفهان کاوش می‌کند؛ نگاره‌هایش پلی میان هندسهٔ معماری و لطافت منسوجات است.",
      en: "For a decade Maryam has explored the rhythm of color and texture from Tehran's bazaar to Isfahan's workshops; her motifs bridge architectural geometry and the softness of textiles.",
    },
    location: { fa: "تهران، ایران", en: "Tehran, Iran" },
    avatar: "/assets/images/artists/maryam-rad.jpg",
    cover: "/assets/images/portfolio/hotel-lobby.jpg",
    specialties: [
      { fa: "هندسهٔ اسلامی", en: "Islamic geometry" },
      { fa: "چاپ پارچه", en: "Fabric print" },
      { fa: "کاغذدیواری", en: "Wallcovering" },
    ],
    socials: [
      { label: "Instagram", url: "https://instagram.com" },
      { label: "Behance", url: "https://behance.net" },
    ],
    stats: { patterns: 34, products: 12, projects: 8, followers: "۴٬۲هزار" },
    featured: true,
    story: {
      fa: "«هر تکرار، یک تنفس است.» مریم کارش را با خط‌کشی دستی آغاز می‌کند و اجازه می‌دهد خمِ دست در نسخهٔ دیجیتال بماند؛ همین ناقصیِ زیباست که نگاره‌هایش را زنده نگه می‌دارد.",
      en: '"Every repeat is a breath." Maryam begins with hand-drawn linework and lets the curve of her hand survive into the digital version — that beautiful imperfection keeps her motifs alive.',
    },
    seo: {
      title: { fa: "مریم راد — طراح پارچه", en: "Maryam Rad — Textile Designer" },
      description: { fa: "نگاره‌ها و محصولات مریم راد در بازار رزی آتلیه", en: "Patterns and products by Maryam Rad on Rezi Atelier" },
    },
  },
  {
    id: "a2",
    slug: "kian-soltani",
    name: { fa: "کیان سلطانی", en: "Kian Soltani" },
    profession: { fa: "طراح الگوی هندسی", en: "Geometric pattern designer" },
    bio: {
      fa: "کیان با ذهنِ یک معمار به نگاره نگاه می‌کند: شبکه، تناسب طلایی و نور. مجموعه‌هایش برای دیوارپوش‌های معماری معاصر ساخته می‌شوند.",
      en: "Kian looks at motifs with an architect's mind: grids, golden ratios and light. His collections are built for contemporary architectural wallcovering.",
    },
    location: { fa: "اصفهان، ایران", en: "Isfahan, Iran" },
    avatar: "/assets/images/artists/kian-soltani.jpg",
    cover: "/assets/images/portfolio/cafe.jpg",
    specialties: [
      { fa: "هندسهٔ معماری", en: "Architectural geometry" },
      { fa: "تایل مینیمال", en: "Minimal tiling" },
    ],
    socials: [{ label: "Instagram", url: "https://instagram.com" }],
    stats: { patterns: 28, products: 9, projects: 11, followers: "۳٬۱هزار" },
    featured: true,
    story: {
      fa: "کیان می‌گوید الگو «معماریِ بی‌صدا» است. او با یک مدال ساده شروع می‌کند و با تکرار، به ریتم می‌رسد — دقیقاً همان‌طور که یک نما با پنجره‌ها نفس می‌کشد.",
      en: "Kian calls pattern “silent architecture”. He starts with a simple unit and reaches rhythm through repetition — exactly the way a façade breathes with windows.",
    },
  },
  {
    id: "a3",
    slug: "niloofar-karimi",
    name: { fa: "نیلوفر کریمی", en: "Niloofar Karimi" },
    profession: { fa: "تصویرگر گیاهی", en: "Botanical illustrator" },
    bio: {
      fa: "نیلوفر باغ‌های گیلان را به خط می‌کشد؛ سرو، انار و گل‌های وحشی در نگاره‌های او به رقص می‌آیند — ظریف، اما هرگز شکسته.",
      en: "Niloofar draws the gardens of Gilan; cypress, pomegranate and wildflowers dance in her motifs — delicate, yet never fragile.",
    },
    location: { fa: "رشت، ایران", en: "Rasht, Iran" },
    avatar: "/assets/images/artists/niloofar-karimi.jpg",
    cover: "/assets/images/portfolio/nursery.jpg",
    specialties: [
      { fa: "تصویرسازی گیاهی", en: "Botanical illustration" },
      { fa: "آبرنگ دیجیتال", en: "Digital watercolor" },
    ],
    socials: [{ label: "Instagram", url: "https://instagram.com" }],
    stats: { patterns: 41, products: 15, projects: 6, followers: "۶٬۸هزار" },
    featured: true,
    story: {
      fa: "نیلوفر هر بهار یک هفته، فقط برای دیدن گل‌های وحشی به جنگل می‌رود. می‌گوید نقاشیِ گل از روی عکس مثل این است که «صدای کسی را از روی نامه حدس بزنی».",
      en: "Every spring Niloofar spends a week in the forest just to see the wildflowers. She says painting a flower from a photo is like “guessing someone's voice from their letter”.",
    },
  },
  {
    id: "a4",
    slug: "arman-vesali",
    name: { fa: "آرمان وصالی", en: "Arman Vesali" },
    profession: { fa: "طراح گرافیک و ترازو", en: "Graphic & terrazzo designer" },
    bio: {
      fa: "آرمان ترازوی وینتیج ونیزی را با تیپوگرافی معاصر ترکیب می‌کند؛ نقطه‌چین‌های پراکنده‌اش به محصولات روحِ بازیگوش می‌دهند.",
      en: "Arman blends vintage Venetian terrazzo with contemporary typography; his scattered speckles give products a playful soul.",
    },
    location: { fa: "شیراز، ایران", en: "Shiraz, Iran" },
    avatar: "/assets/images/artists/arman-vesali.jpg",
    cover: "/assets/images/portfolio/showroom.jpg",
    specialties: [
      { fa: "ترازو", en: "Terrazzo" },
      { fa: "پوستر", en: "Poster design" },
    ],
    socials: [{ label: "Behance", url: "https://behance.net" }],
    stats: { patterns: 19, products: 7, projects: 5, followers: "۲٬۴هزار" },
  },
  {
    id: "a5",
    slug: "sara-cheraghi",
    name: { fa: "سارا چراغی", en: "Sara Cheraghi" },
    profession: { fa: "هنرمند سرامیک", en: "Ceramic artist" },
    bio: {
      fa: "سارا لعاب و نقش را روی چرخ سفال با هم می‌چرخاند؛ الهامش از کاشی‌های تبریز و آسمانِ شب کویر است.",
      en: "Sara spins glaze and motif together on the potter's wheel; her inspiration comes from Tabrizi tiles and the desert night sky.",
    },
    location: { fa: "تبریز، ایران", en: "Tabriz, Iran" },
    avatar: "/assets/images/artists/sara-cheraghi.jpg",
    cover: "/assets/images/products/vase-salt-dome.jpg",
    specialties: [
      { fa: "سرامیک", en: "Ceramics" },
      { fa: "لعاب‌نگاری", en: "Glaze painting" },
    ],
    socials: [{ label: "Instagram", url: "https://instagram.com" }],
    stats: { patterns: 15, products: 11, projects: 4, followers: "۳٬۹هزار" },
    featured: true,
  },
  {
    id: "a6",
    slug: "yeganeh-bahrami",
    name: { fa: "یگانه بهرامی", en: "Yeganeh Bahrami" },
    profession: { fa: "طراح قالی و منسوجات", en: "Rug & textile designer" },
    bio: {
      fa: "یگانه نوهٔ قالیبافان کاشانی است؛ طرح‌هایش حافظهٔ گلیم را با چینه‌های مدرن دوباره می‌بافند.",
      en: "Yeganeh is the granddaughter of Kashani rug weavers; her designs reweave the memory of the kilim into modern arrangements.",
    },
    location: { fa: "کاشان، ایران", en: "Kashan, Iran" },
    avatar: "/assets/images/artists/yeganeh-bahrami.jpg",
    cover: "/assets/images/products/rug-desert-lattice.jpg",
    specialties: [
      { fa: "گلیم", en: "Kilim" },
      { fa: "قالی معاصر", en: "Contemporary rug" },
    ],
    socials: [{ label: "Instagram", url: "https://instagram.com" }],
    stats: { patterns: 22, products: 8, projects: 7, followers: "۵٬۲هزار" },
    featured: true,
    story: {
      fa: "یگانه می‌گوید اولین کلمه‌ای که یاد گرفته «گره» بوده. حالا با همان زبانِ مادربزرگش، برای نسلِ تازه‌ای نقش می‌نویسد.",
      en: "Yeganeh says the first word she learned was “knot”. Now, in her grandmother's exact language, she writes motifs for a new generation.",
    },
  },
];

export function getArtist(slug: string): Artist | undefined {
  return artists.find((a) => a.slug === slug);
}
