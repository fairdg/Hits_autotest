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
