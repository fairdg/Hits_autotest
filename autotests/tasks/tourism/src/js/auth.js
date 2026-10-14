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
