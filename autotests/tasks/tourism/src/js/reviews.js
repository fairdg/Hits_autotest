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
