// Сгенерировано из src/js командой: node build-js.mjs
(() => {
  "use strict";

  // Дефект тест-кейса 8: отмена брони не сохраняется.

  // --- data.js ---
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

  // --- core.js ---
  // DOM-ссылки и общие вспомогательные функции.

  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const elements = {
    accountButton: $("#account-button"),
    accountLabel: $("#account-label"),
    mobileAccountButton: $("#mobile-account-button"),
    mobileMenuButton: $("#mobile-menu-button"),
    mobileMenu: $("#mobile-menu"),
    searchForm: $("#search"),
    destination: $("#destination"),
    travelers: $("#travelers"),
    results: $("#search-results"),
    resultsTitle: $("#results-title"),
    resultsList: $("#results-list"),
    emptyResults: $("#empty-results"),
    clearSearch: $("#clear-search"),
    featuredTours: $("#featured-tours"),
    authDialog: $("#auth-dialog"),
    authForm: $("#auth-form"),
    loginEmail: $("#login-email"),
    loginPassword: $("#login-password"),
    authError: $("#auth-error"),
    tourDialog: $("#tour-dialog"),
    tourImage: $("#tour-detail-image"),
    tourMeta: $("#tour-detail-meta"),
    tourTitle: $("#tour-detail-title"),
    tourDescription: $("#tour-detail-description"),
    tourDates: $("#tour-detail-dates"),
    tourRoute: $("#tour-detail-route"),
    tourPrice: $("#tour-detail-price"),
    bookTourButton: $("#book-tour-button"),
    reviewList: $("#tour-review-list"),
    reviewForm: $("#review-form"),
    reviewText: $("#review-text"),
    reviewRating: $("#review-rating"),
    reviewError: $("#review-error"),
    bookingDialog: $("#booking-dialog"),
    bookingForm: $("#booking-form"),
    bookingTitle: $("#booking-title"),
    bookingName: $("#booking-name"),
    bookingPhone: $("#booking-phone"),
    bookingTravelers: $("#booking-travelers"),
    bookingError: $("#booking-error"),
    accountDialog: $("#account-dialog"),
    accountTitle: $("#account-title"),
    bookingsList: $("#bookings-list"),
    bookingsPanel: $("#bookings-panel"),
    profilePanel: $("#profile-panel"),
    adminPanel: $("#admin-panel"),
    adminTab: $("#admin-tab"),
    logoutButton: $("#logout-button"),
    profileForm: $("#profile-form"),
    profileName: $("#profile-name"),
    profileEmail: $("#profile-email"),
    profileSuccess: $("#profile-success"),
    adminForm: $("#admin-tour-form"),
    adminName: $("#admin-tour-name"),
    adminDestination: $("#admin-tour-destination"),
    adminDates: $("#admin-tour-dates"),
    adminPrice: $("#admin-tour-price"),
    adminRoute: $("#admin-tour-route"),
    adminSuccess: $("#admin-success"),
    paymentDialog: $("#payment-dialog"),
    paymentForm: $("#payment-form"),
    paymentDescription: $("#payment-description"),
    toast: $("#toast")
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function load(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return Array.isArray(value) ? value : clone(fallback);
    } catch (error) {
      return clone(fallback);
    }
  }

  function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function allTours() {
    return [...defaultTours, ...state.customTours];
  }

  function currentUser() {
    return state.users.find(user => user.id === state.currentUserId) || null;
  }

  function getTour(id) {
    return allTours().find(tour => tour.id === id) || null;
  }

  function formatPrice(value) {
    return `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;
  }

  function pluralize(value, forms) {
    const mod100 = value % 100;
    const mod10 = value % 10;
    const form = mod100 >= 11 && mod100 <= 14 ? forms[2] : mod10 === 1 ? forms[0] : mod10 >= 2 && mod10 <= 4 ? forms[1] : forms[2];
    return `${value} ${form}`;
  }

  function showDialog(dialog) {
    if (!dialog.open) dialog.showModal();
  }

  function closeDialog(dialog) {
    if (dialog.open) dialog.close();
  }

  function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.classList.add("visible");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => elements.toast.classList.remove("visible"), 2800);
  }

  function updateAccountButton() {
    const user = currentUser();
    elements.accountLabel.textContent = user ? user.name : "Войти";
    elements.accountButton.setAttribute("aria-label", user ? `Личный кабинет: ${user.name}` : "Войти в личный кабинет");
  }
  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
  }

  function resetMock() {
    Object.values(STORAGE).forEach(key => localStorage.removeItem(key));
    location.replace(location.pathname);
  }

  // --- catalog.js ---
  // Каталог, поиск и карточка выбранного тура.

  function tourCard(tour) {
    return `
      <button class="tour-card" type="button" data-tour-id="${tour.id}" aria-label="Открыть тур ${escapeHtml(tour.title)}">
        <img class="tour-card-image" src="${tour.image}" alt="${escapeHtml(tour.destination)}">
        <span class="tour-card-meta"><span>${escapeHtml(tour.destination)} · ${pluralize(tour.days, ["день", "дня", "дней"])}</span><span>★ ${tour.rating || "Новый"}</span></span>
        <h3>${escapeHtml(tour.title)}</h3>
        <span>от ${formatPrice(tour.price)}</span>
      </button>
    `;
  }

  function renderFeaturedTours() {
    elements.featuredTours.innerHTML = allTours().filter(tour => ["T3", "T4", "T5"].includes(tour.id)).map(tourCard).join("");
  }

  function renderSearchResults(tours, destination) {
    elements.results.hidden = false;
    elements.resultsTitle.textContent = destination ? `Туры: ${destination}` : "Все путешествия";
    elements.resultsList.innerHTML = tours.map(tourCard).join("");
    elements.resultsList.hidden = tours.length === 0;
    elements.emptyResults.hidden = tours.length !== 0;
    elements.results.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function searchTours(event) {
    event.preventDefault();
    const destination = elements.destination.value;
    const result = destination ? allTours().filter(tour => tour.destination === destination) : allTours();
    renderSearchResults(result, destination);
  }

  function clearSearch() {
    elements.searchForm.reset();
    elements.travelers.value = "2";
    renderSearchResults(allTours(), "");
  }

  function openTour(id) {
    const tour = getTour(id);
    if (!tour) return;
    state.selectedTourId = tour.id;
    elements.tourImage.src = tour.image;
    elements.tourImage.alt = tour.destination;
    elements.tourMeta.textContent = `${tour.region} · ${pluralize(tour.days, ["день", "дня", "дней"])}`;
    elements.tourTitle.textContent = tour.title;
    elements.tourDescription.textContent = tour.description;
    elements.tourDates.textContent = tour.dates;
    elements.tourRoute.textContent = tour.route;
    elements.tourPrice.textContent = `от ${formatPrice(tour.price)} за человека`;
    elements.reviewError.textContent = "";
    elements.reviewText.value = "";
    renderTourReviews();
    showDialog(elements.tourDialog);
    history.replaceState(null, "", `#tour-${tour.id}`);
  }

  // --- reviews.js ---
  // Отображение и создание отзывов.

  function renderTourReviews() {
    const reviews = state.reviews.filter(review => review.tourId === state.selectedTourId);
    elements.reviewList.innerHTML = reviews.length ? reviews.map(review => `
      <article class="tour-review-item" data-review-id="${review.id}">
        <span>${"★".repeat(review.rating)} · ${escapeHtml(review.author)} · ${review.status}</span>
        <p>${escapeHtml(review.text)}</p>
      </article>
    `).join("") : "<p>Для этого путешествия отзывов пока нет.</p>";
  }
  function submitReview(event) {
    event.preventDefault();
    requireAuth("review", () => {
      const text = elements.reviewText.value.trim();
      if (!text) {
        elements.reviewError.textContent = "Введите текст отзыва.";
        return;
      }
      const user = currentUser();
      const review = {
        id: `R-${Date.now()}`,
        tourId: state.selectedTourId,
        userId: user.id,
        author: user.name,
        text,
        rating: Number(elements.reviewRating.value),
        status: "На модерации"
      };
      state.reviews.push(review);
      save(STORAGE.reviews, state.reviews);
      elements.reviewText.value = "";
      elements.reviewError.textContent = "";
      renderTourReviews();
      showToast("Отзыв отправлен на модерацию");
    });
  }

  // --- auth.js ---
  // Авторизация, выход и защита приватных действий.

  function requireAuth(route, action) {
    if (currentUser()) {
      action();
      return true;
    }
    state.pendingRoute = route;
    elements.authError.textContent = "Чтобы продолжить, войдите в аккаунт.";
    showDialog(elements.authDialog);
    return false;
  }
  function login(event) {
    event.preventDefault();
    const email = elements.loginEmail.value.trim().toLowerCase();
    const password = elements.loginPassword.value;
    const user = state.users.find(item => item.email.toLowerCase() === email && item.password === password);
    if (!user) {
      elements.authError.textContent = "Неверный email или пароль.";
      state.currentUserId = null;
      localStorage.removeItem(STORAGE.session);
      updateAccountButton();
      return;
    }
    state.currentUserId = user.id;
    localStorage.setItem(STORAGE.session, user.id);
    elements.authError.textContent = "";
    closeDialog(elements.authDialog);
    updateAccountButton();
    const route = state.pendingRoute;
    state.pendingRoute = null;
    showToast(`Здравствуйте, ${user.name}`);
    if (route === "booking") openBooking();
    else if (route === "review") elements.reviewText.focus();
    else openAccount(route || "bookings");
  }
  function logout() {
    state.currentUserId = null;
    state.pendingRoute = null;
    localStorage.removeItem(STORAGE.session);
    closeDialog(elements.accountDialog);
    updateAccountButton();
    history.replaceState(null, "", "#top");
    showToast("Вы вышли из аккаунта");
  }

  function openAccountOrLogin() {
    if (currentUser()) openAccount("bookings");
    else {
      state.pendingRoute = "bookings";
      elements.authError.textContent = "";
      showDialog(elements.authDialog);
    }
  }

  // --- bookings.js ---
  // Создание, отображение, отмена и оплата бронирований.

  function openBooking() {
    requireAuth("booking", () => {
      const tour = getTour(state.selectedTourId);
      elements.bookingTitle.textContent = `Забронировать «${tour.title}»`;
      elements.bookingName.value = currentUser().name;
      elements.bookingTravelers.value = elements.travelers.value || "2";
      elements.bookingPhone.value = "";
      elements.bookingError.textContent = "";
      closeDialog(elements.tourDialog);
      showDialog(elements.bookingDialog);
    });
  }

  function createBooking(event) {
    event.preventDefault();
    const user = currentUser();
    const tour = getTour(state.selectedTourId);
    const name = elements.bookingName.value.trim();
    const phone = elements.bookingPhone.value.trim();
    const travelers = Number(elements.bookingTravelers.value);
    if (!user || !tour) {
      elements.bookingError.textContent = "Сессия завершена. Войдите снова.";
      return;
    }
    if (name.length < 2 || phone.length < 7 || travelers < 1 || travelers > 12) {
      elements.bookingError.textContent = "Заполните имя, телефон и количество путешественников.";
      return;
    }
    const booking = {
      id: `B-${Date.now()}`,
      userId: user.id,
      tourId: tour.id,
      travelers,
      customerName: name,
      phone,
      total: tour.price * travelers,
      status: "Не оплачено",
      paid: false,
      paidAmount: 0,
      createdAt: new Date().toISOString()
    };
    state.bookings.push(booking);
    save(STORAGE.bookings, state.bookings);
    closeDialog(elements.bookingDialog);
    showToast(`Бронь ${booking.id} создана`);
    openAccount("bookings");
  }
  function renderBookings() {
    const user = currentUser();
    const bookings = state.bookings.filter(booking => booking.userId === user.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    if (!bookings.length) {
      elements.bookingsList.innerHTML = '<div class="empty-account">У вас пока нет бронирований.</div>';
      return;
    }
    elements.bookingsList.innerHTML = bookings.map(booking => {
      const tour = getTour(booking.tourId);
      const title = tour ? tour.title : "Тур недоступен";
      const dates = tour ? tour.dates : "—";
      const statusClass = booking.status === "Отменено" ? "cancelled" : booking.paid ? "paid" : "";
      return `
        <article class="booking-item" data-booking-id="${booking.id}" data-user-id="${booking.userId}">
          <div><h3>${escapeHtml(title)}</h3><p>${dates} · ${pluralize(booking.travelers, ["путешественник", "путешественника", "путешественников"])}</p><p>Сумма заказа: <strong>${formatPrice(booking.total)}</strong>${booking.paid ? ` · оплачено ${formatPrice(booking.paidAmount)}` : ""}</p><p>Номер брони: ${booking.id}</p></div>
          <div class="booking-item-actions"><span class="status ${statusClass}">${booking.status}</span>${booking.status === "Не оплачено" ? `<button class="text-button" type="button" data-pay-booking="${booking.id}">Оплатить</button><button class="text-button danger" type="button" data-cancel-booking="${booking.id}">Отменить</button>` : ""}</div>
        </article>
      `;
    }).join("");
  }

  function cancelBooking(id) {
    const booking = state.bookings.find(item => item.id === id && item.userId === currentUser().id);
    if (!booking || booking.status !== "Не оплачено") return;
    if (!window.confirm(`Отменить бронь ${booking.id}?`)) return;
    booking.status = "Отменено";
    renderBookings();
    showToast("Бронирование отменено");
  }

  function openPayment(id) {
    const booking = state.bookings.find(item => item.id === id && item.userId === currentUser().id);
    if (!booking || booking.status !== "Не оплачено") return;
    state.paymentBookingId = id;
    const tour = getTour(booking.tourId);
    elements.paymentDescription.textContent = `${tour.title}. К оплате ${formatPrice(booking.total)}.`;
    closeDialog(elements.accountDialog);
    showDialog(elements.paymentDialog);
  }

  function payBooking(event) {
    event.preventDefault();
    const booking = state.bookings.find(item => item.id === state.paymentBookingId && item.userId === currentUser().id);
    if (!booking) return;
    booking.paid = true;
    booking.paidAmount = booking.total;
    booking.status = "Подтверждено";
    booking.paidAt = new Date().toISOString();
    save(STORAGE.bookings, state.bookings);
    closeDialog(elements.paymentDialog);
    showToast("Оплата прошла успешно");
    openAccount("bookings");
  }

  // --- account.js ---
  // Личный кабинет, профиль и административное добавление туров.

  function openAccount(tab = "bookings") {
    requireAuth(tab, () => {
      const user = currentUser();
      elements.accountTitle.textContent = user.name;
      elements.profileName.value = user.name;
      elements.profileEmail.value = user.email;
      elements.profileSuccess.textContent = "";
      elements.adminTab.hidden = user.role !== "admin";
      if (tab === "admin" && user.role !== "admin") tab = "bookings";
      switchAccountTab(tab);
      showDialog(elements.accountDialog);
      history.replaceState(null, "", `#${tab}`);
    });
  }

  function switchAccountTab(tab) {
    const panels = { bookings: elements.bookingsPanel, profile: elements.profilePanel, admin: elements.adminPanel };
    Object.entries(panels).forEach(([name, panel]) => { panel.hidden = name !== tab; });
    $$("[data-account-tab]").forEach(button => button.classList.toggle("active", button.dataset.accountTab === tab));
    if (tab === "bookings") renderBookings();
  }
  function saveProfile(event) {
    event.preventDefault();
    const user = currentUser();
    const name = elements.profileName.value.trim();
    if (!user || name.length < 2) return;
    user.name = name;
    save(STORAGE.users, state.users);
    state.reviews.filter(review => review.userId === user.id).forEach(review => { review.author = name; });
    save(STORAGE.reviews, state.reviews);
    updateAccountButton();
    elements.accountTitle.textContent = name;
    elements.profileSuccess.textContent = "Имя сохранено.";
  }

  function addTour(event) {
    event.preventDefault();
    const user = currentUser();
    if (!user || user.role !== "admin") return;
    const name = elements.adminName.value.trim();
    const destination = elements.adminDestination.value.trim();
    const dates = elements.adminDates.value.trim();
    const route = elements.adminRoute.value.trim();
    const price = Number(elements.adminPrice.value);
    if (!name || !destination || !dates || !route || price <= 0) {
      elements.adminSuccess.textContent = "Заполните все поля корректно.";
      return;
    }
    const tour = {
      id: `T-${Date.now()}`,
      title: name,
      destination,
      region: "Россия",
      days: 6,
      dates,
      route,
      price,
      rating: 5,
      image: "assets/image-647b8da147b0.jpg",
      description: `Авторский маршрут по направлению ${destination}.`
    };
    state.customTours.push(tour);
    save(STORAGE.tours, state.customTours);
    addDestinationOption(destination);
    elements.adminForm.reset();
    elements.adminSuccess.textContent = `Тур «${name}» добавлен в каталог.`;
    showToast("Тур сохранён");
  }

  function addDestinationOption(destination) {
    if (!destination || [...elements.destination.options].some(option => option.value === destination)) return;
    const option = document.createElement("option");
    option.value = destination;
    option.textContent = destination;
    elements.destination.append(option);
  }

  // --- app.js ---
  // Маршрутизация, обработчики событий и запуск приложения.

  function handleHash() {
    const hash = location.hash.replace("#", "");
    if (hash.startsWith("tour-")) openTour(hash.replace("tour-", ""));
    else if (["bookings", "profile", "admin"].includes(hash)) openAccount(hash);
  }

  elements.searchForm.addEventListener("submit", searchTours);
  elements.clearSearch.addEventListener("click", clearSearch);
  elements.accountButton.addEventListener("click", openAccountOrLogin);
  elements.mobileAccountButton.addEventListener("click", openAccountOrLogin);
  elements.mobileMenuButton.addEventListener("click", () => { elements.mobileMenu.hidden = !elements.mobileMenu.hidden; });
  elements.authForm.addEventListener("submit", login);
  elements.bookTourButton.addEventListener("click", openBooking);
  elements.bookingForm.addEventListener("submit", createBooking);
  elements.reviewForm.addEventListener("submit", submitReview);
  elements.logoutButton.addEventListener("click", logout);
  elements.profileForm.addEventListener("submit", saveProfile);
  elements.adminForm.addEventListener("submit", addTour);
  elements.paymentForm.addEventListener("submit", payBooking);

  document.addEventListener("click", event => {
    const tourButton = event.target.closest("[data-tour-id]");
    if (tourButton) openTour(tourButton.dataset.tourId);
    const destinationButton = event.target.closest("[data-destination]");
    if (destinationButton) {
      elements.destination.value = destinationButton.dataset.destination;
      renderSearchResults(allTours().filter(tour => tour.destination === elements.destination.value), elements.destination.value);
    }
    const closeButton = event.target.closest("[data-close]");
    if (closeButton) closeDialog(document.getElementById(closeButton.dataset.close));
    const accountTab = event.target.closest("[data-account-tab]");
    if (accountTab) switchAccountTab(accountTab.dataset.accountTab);
    const cancelButton = event.target.closest("[data-cancel-booking]");
    if (cancelButton) cancelBooking(cancelButton.dataset.cancelBooking);
    const payButton = event.target.closest("[data-pay-booking]");
    if (payButton) openPayment(payButton.dataset.payBooking);
    const searchLink = event.target.closest("[data-scroll-search]");
    if (searchLink) elements.searchForm.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  $$("dialog").forEach(dialog => dialog.addEventListener("click", event => {
    if (event.target === dialog) dialog.close();
  }));

  state.customTours.forEach(tour => addDestinationOption(tour.destination));
  updateAccountButton();
  renderFeaturedTours();
  window.addEventListener("hashchange", handleHash);
  window.GorizontMock = { reset: resetMock, getState: () => clone({ users: state.users, bookings: state.bookings, reviews: state.reviews, tours: allTours(), currentUserId: state.currentUserId }) };
  window.setTimeout(handleHash, 0);
})();
