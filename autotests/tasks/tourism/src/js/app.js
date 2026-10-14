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
