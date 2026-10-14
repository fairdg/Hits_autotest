// Начальные данные, ключи localStorage и изменяемое состояние приложения.

const STORAGE = {
  session: "gorizont.session.v1",
  users: "gorizont.users.v1",
  bookings: "gorizont.bookings.v1",
  reviews: "gorizont.reviews.v1",
  tours: "gorizont.custom-tours.v1"
};

const defaultUsers = [
  { id: "U1", email: "u1@example.ru", password: "travel2026", name: "Анна", role: "user" },
  { id: "U2", email: "u2@example.ru", password: "route2026", name: "Илья", role: "user" },
  { id: "ADMIN", email: "admin@example.ru", password: "admin2026", name: "Администратор", role: "admin" }
];

const defaultTours = [
  {
    id: "T1",
    title: "Москва: город в деталях",
    destination: "Москва",
    region: "Россия",
    days: 5,
    dates: "18–22 октября 2026",
    route: "Москва — Коломенское — Замоскворечье — ВДНХ",
    price: 72000,
    rating: 4.8,
    image: "assets/image-08f82b3b48cc.jpg",
    description: "Пять дней в Москве с архитектурными прогулками, камерными музеями и гастрономическими открытиями."
  },
  {
    id: "T2",
    title: "Петербург: вода и камень",
    destination: "Санкт-Петербург",
    region: "Россия",
    days: 6,
    dates: "24–29 октября 2026",
    route: "Санкт-Петербург — Кронштадт — Петергоф — Репино",
    price: 84000,
    rating: 4.9,
    image: "assets/image-20477fb8015e.jpg",
    description: "Петербург без спешки: дворы, острова, пригороды и прогулка по Финскому заливу."
  },
  {
    id: "T3",
    title: "По Чуйскому тракту к Марсу",
    destination: "Алтай",
    region: "Россия",
    days: 8,
    dates: "5–12 ноября 2026",
    route: "Барнаул — Чуйский тракт — Курайская степь — Марс — Телецкое озеро",
    price: 119000,
    rating: 4.9,
    image: "assets/image-f5e43f166ae0.jpg",
    description: "Большой Алтай: перевалы, степи и горные озёра в небольшой группе с местным проводником."
  },
  {
    id: "T4",
    title: "Северное сияние и океан",
    destination: "Исландия",
    region: "Европа",
    days: 9,
    dates: "12–20 ноября 2026",
    route: "Рейкьявик — Вик — Йёкюльсаурлоун — Снайфедльснес",
    price: 238000,
    rating: 4.9,
    image: "assets/image-a557695036c3.jpg",
    description: "Водопады, вулканические пляжи, ледниковые лагуны и охота за северным сиянием."
  },
  {
    id: "T5",
    title: "Япония вне маршрутов",
    destination: "Япония",
    region: "Азия",
    days: 11,
    dates: "3–13 апреля 2027",
    route: "Токио — Канадзава — Кага — Киото — Коясан",
    price: 295000,
    rating: 4.9,
    image: "assets/image-ee1f2297d7e0.jpg",
    description: "Тихие районы Токио, ремесленные города, горные храмы и весенняя Япония без толпы."
  },
  {
    id: "T6",
    title: "Дагестан: горы и древние аулы",
    destination: "Дагестан",
    region: "Россия",
    days: 7,
    dates: "16–22 мая 2027",
    route: "Махачкала — Сулакский каньон — Гуниб — Гамсутль — Дербент",
    price: 98000,
    rating: 4.9,
    image: "assets/image-20477fb8015e.jpg",
    description: "Горные дороги, заброшенные аулы, древний Дербент и кухня Дагестана в путешествии небольшой группой."
  }
];

const defaultReviews = [
  { id: "R1", tourId: "T3", userId: "U2", author: "Илья", text: "Маршрут очень продуманный, а Алтай оказался ещё красивее фотографий.", rating: 5, status: "Опубликован" }
];

const state = {
  users: load(STORAGE.users, defaultUsers),
  bookings: load(STORAGE.bookings, [
    { id: "B-U2", userId: "U2", tourId: "T2", travelers: 1, customerName: "Илья", phone: "+7 900 000-00-02", total: 84000, status: "Не оплачено", paid: false, paidAmount: 0, createdAt: "2026-10-01T10:00:00.000Z" }
  ]),
  reviews: load(STORAGE.reviews, defaultReviews),
  customTours: load(STORAGE.tours, []),
  currentUserId: localStorage.getItem(STORAGE.session),
  selectedTourId: null,
  paymentBookingId: null,
  pendingRoute: null
};
