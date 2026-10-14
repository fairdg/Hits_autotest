### Тестовые пользователи

Роль/ Email/ Пароль 
Пользователь U1 `u1@example.ru` `travel2026`
Пользователь U2 `u2@example.ru` `route2026`
Администратор `admin@example.ru` `admin2026`

Для сброса мок-данных в исходное состояние доступна функция `window.GorizontMock.reset()`.

## Что проверить

1. `test_successful_login` — вход с корректными данными открывает личный кабинет U1.
2. `test_wrong_password_is_rejected` — неверный пароль показывает ошибку и не создаёт сессию.
3. `test_search_filters_by_destination` — поиск Москвы показывает T1 и скрывает T2.
4. `test_search_shows_empty_state` — направление без туров показывает пустой результат с пояснением.
5. `test_selected_tour_has_correct_data` — карточка T1 содержит его название, цену, даты и маршрут.
6. `test_booking_is_created_for_selected_tour` — новая бронь относится к T1 и имеет статус «Не оплачено».
7. `test_booking_cancellation_persists` — статус «Отменено» сохраняется после обновления страницы.
8. `test_successful_payment_confirms_booking` — оплата подтверждает бронь, а оплаченная сумма равна сумме заказа.
9. `test_bookings_belong_to_current_user` — кабинет U1 не показывает предзаполненную бронь пользователя U2.
10. `test_review_is_saved_for_selected_tour` — отзыв сохраняется для T1 с точным текстом, оценкой 5 и статусом «На модерации».
11. `test_empty_review_is_rejected` — пустой отзыв не создаётся и сопровождается ошибкой.
12. `test_profile_name_persists` — имя «Михаил» сохраняется после обновления страницы.
13. `test_logout_closes_private_account` — выход завершает сессию и закрывает прямой доступ к кабинету.
14. `test_bookings_require_authorization` — `#bookings` без сессии требует вход.
15. `test_admin_can_add_tour` — администратор добавляет «Тестовый Алтай» с ценой 20 000 ₽, датами и маршрутом; тур появляется в каталоге.

