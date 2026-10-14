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
