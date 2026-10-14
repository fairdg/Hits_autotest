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
  save(STORAGE.bookings, state.bookings);
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
