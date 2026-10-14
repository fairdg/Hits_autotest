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
