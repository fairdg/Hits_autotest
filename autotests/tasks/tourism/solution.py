import os

import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.select import Select
from selenium.webdriver.support.ui import WebDriverWait


TEST_URL = os.getenv("TEST_URL")
SELENIUM = os.getenv("SELENIUM_HUB")
WAIT_SECONDS = 8


@pytest.fixture(scope="module")
def driver():
    """Создаёт один браузер для набора и закрывает его после тестов."""
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--window-size=1440,1000")
    browser = webdriver.Remote(SELENIUM, options=options)
    yield browser
    browser.quit()


def wait(driver):
    return WebDriverWait(driver, WAIT_SECONDS)


def reset_app(driver):
    """Очищает клиентское состояние, чтобы каждый тест был независимым."""
    driver.get(TEST_URL)
    driver.execute_script("window.localStorage.clear(); window.sessionStorage.clear();")
    driver.get(TEST_URL)
    wait(driver).until(EC.presence_of_element_located((By.ID, "search")))


def open_dialog(driver, dialog_id):
    return wait(driver).until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, f"#{dialog_id}[open]"))
    )


def login(driver, email="u1@example.ru", password="travel2026"):
    driver.find_element(By.ID, "account-button").click()
    open_dialog(driver, "auth-dialog")
    driver.find_element(By.ID, "login-email").send_keys(email)
    driver.find_element(By.ID, "login-password").send_keys(password)
    driver.find_element(By.ID, "login-submit").click()
    return open_dialog(driver, "account-dialog")


def close_account(driver):
    driver.find_element(
        By.CSS_SELECTOR, "#account-dialog [data-close='account-dialog']"
    ).click()
    wait(driver).until(
        EC.invisibility_of_element_located((By.CSS_SELECTOR, "#account-dialog[open]"))
    )


def search_destination(driver, destination):
    Select(driver.find_element(By.ID, "destination")).select_by_visible_text(destination)
    driver.find_element(By.ID, "search-button").click()
    wait(driver).until(EC.visibility_of_element_located((By.ID, "search-results")))


def click_card(driver, card):
    """Стабильно нажимает карточку после плавной прокрутки результатов."""
    driver.execute_script(
        "arguments[0].scrollIntoView({block: 'center', behavior: 'instant'});", card
    )
    wait(driver).until(lambda d: card.is_displayed() and card.is_enabled())
    card.click()


def open_tour(driver, tour_id="T1"):
    destination = "Москва" if tour_id == "T1" else "Санкт-Петербург"
    search_destination(driver, destination)
    card = wait(driver).until(
        EC.element_to_be_clickable(
            (By.CSS_SELECTOR, f"#results-list [data-tour-id='{tour_id}']")
        )
    )
    click_card(driver, card)
    return open_dialog(driver, "tour-dialog")


def create_t1_booking(driver):
    """Создаёт через UI одну неоплаченную бронь T1 для U1."""
    open_tour(driver, "T1")
    driver.find_element(By.ID, "book-tour-button").click()
    open_dialog(driver, "auth-dialog")
    driver.find_element(By.ID, "login-email").send_keys("u1@example.ru")
    driver.find_element(By.ID, "login-password").send_keys("travel2026")
    driver.find_element(By.ID, "login-submit").click()
    open_dialog(driver, "booking-dialog")
    phone = driver.find_element(By.ID, "booking-phone")
    phone.send_keys("+7 900 111-22-33")
    travelers = driver.find_element(By.ID, "booking-travelers")
    travelers.clear()
    travelers.send_keys("1")
    driver.find_element(By.CSS_SELECTOR, "#booking-form button[type='submit']").click()
    open_dialog(driver, "account-dialog")
    return wait(driver).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "#bookings-list .booking-item"))
    )


def test_successful_login(driver):
    """Верные данные U1 открывают его личный кабинет."""
    reset_app(driver)
    login(driver)
    assert driver.find_element(By.ID, "account-title").text == "Анна"
    assert driver.find_element(By.ID, "account-label").text == "Анна"


def test_wrong_password_is_rejected(driver):
    """Неверный пароль не создаёт сессию и показывает ошибку."""
    reset_app(driver)
    driver.find_element(By.ID, "account-button").click()
    open_dialog(driver, "auth-dialog")
    driver.find_element(By.ID, "login-email").send_keys("u1@example.ru")
    driver.find_element(By.ID, "login-password").send_keys("wrong-password")
    driver.find_element(By.ID, "login-submit").click()
    error = wait(driver).until(EC.visibility_of_element_located((By.ID, "auth-error")))
    assert "Неверный" in error.text
    assert not driver.find_elements(By.CSS_SELECTOR, "#account-dialog[open]")
    assert driver.find_element(By.ID, "account-label").text == "Войти"


def test_search_filters_by_destination(driver):
    """Поиск Москвы показывает T1 и не показывает T2."""
    reset_app(driver)
    search_destination(driver, "Москва")
    cards = driver.find_elements(By.CSS_SELECTOR, "#results-list .tour-card")
    ids = [card.get_attribute("data-tour-id") for card in cards]
    assert ids == ["T1"]
    assert all("Москва" in card.text for card in cards)


def test_search_shows_empty_state(driver):
    """Направление без туров показывает пустой результат."""
    reset_app(driver)
    search_destination(driver, "Камчатка")
    assert not driver.find_elements(By.CSS_SELECTOR, "#results-list .tour-card")
    empty = driver.find_element(By.ID, "empty-results")
    assert empty.is_displayed()
    assert "туров пока нет" in empty.text


def test_selected_tour_has_correct_data(driver):
    """В карточке T1 показаны известные данные именно T1."""
    reset_app(driver)
    open_tour(driver, "T1")
    assert driver.find_element(By.ID, "tour-detail-title").text == "Москва: город в деталях"
    assert driver.find_element(By.ID, "tour-detail-dates").text == "18–22 октября 2026"
    assert driver.find_element(By.ID, "tour-detail-route").text == "Москва — Коломенское — Замоскворечье — ВДНХ"
    assert "72 000" in driver.find_element(By.ID, "tour-detail-price").text


def test_booking_is_created_for_selected_tour(driver):
    """Новая бронь U1 относится к T1 и имеет статус «Не оплачено»."""
    reset_app(driver)
    booking = create_t1_booking(driver)
    assert "Москва: город в деталях" in booking.text
    assert "не оплачено" in booking.text.lower()
    assert len(driver.find_elements(By.CSS_SELECTOR, "#bookings-list .booking-item")) == 1


def test_booking_cancellation_persists(driver):
    """Отмена брони сохраняется после обновления страницы."""
    reset_app(driver)
    booking = create_t1_booking(driver)
    booking.find_element(By.CSS_SELECTOR, "[data-cancel-booking]").click()
    wait(driver).until(EC.alert_is_present()).accept()
    wait(driver).until(
        lambda d: d.find_element(By.CSS_SELECTOR, "#bookings-list .status").text.lower() == "отменено"
    )
    driver.refresh()
    open_dialog(driver, "account-dialog")
    assert driver.find_element(By.CSS_SELECTOR, "#bookings-list .status").text.lower() == "отменено"


def test_successful_payment_confirms_booking(driver):
    """Тестовая оплата подтверждает бронь и сохраняет точную сумму."""
    reset_app(driver)
    booking = create_t1_booking(driver)
    assert "72 000" in booking.text
    booking.find_element(By.CSS_SELECTOR, "[data-pay-booking]").click()
    open_dialog(driver, "payment-dialog")
    assert "72 000" in driver.find_element(By.ID, "payment-description").text
    driver.find_element(By.CSS_SELECTOR, "#payment-form button[type='submit']").click()
    open_dialog(driver, "account-dialog")
    driver.refresh()
    open_dialog(driver, "account-dialog")
    refreshed = driver.find_element(By.CSS_SELECTOR, "#bookings-list .booking-item")
    assert "подтверждено" in refreshed.text.lower()
    assert "оплачено 72 000" in refreshed.text


def test_bookings_belong_to_current_user(driver):
    """U1 видит только собственные бронирования, но не предзаполненную B-U2."""
    reset_app(driver)
    create_t1_booking(driver)
    bookings = driver.find_elements(By.CSS_SELECTOR, "#bookings-list .booking-item")
    assert len(bookings) == 1
    assert all(item.get_attribute("data-user-id") == "U1" for item in bookings)
    assert "B-U2" not in driver.find_element(By.ID, "bookings-list").text


def test_review_is_saved_for_selected_tour(driver):
    """Отзыв U1 сохраняется для T1 с точным текстом, оценкой и статусом."""
    reset_app(driver)
    login(driver)
    close_account(driver)
    open_tour(driver, "T1")
    Select(driver.find_element(By.ID, "review-rating")).select_by_value("5")
    driver.find_element(By.ID, "review-text").send_keys("Отличный маршрут")
    driver.find_element(By.CSS_SELECTOR, "#review-form button[type='submit']").click()
    review = wait(driver).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "#tour-review-list .tour-review-item"))
    )
    assert "Отличный маршрут" in review.text
    assert "★★★★★" in review.text
    assert "Анна" in review.text
    assert "На модерации" in review.text
    driver.refresh()
    open_dialog(driver, "tour-dialog")
    assert "Отличный маршрут" in driver.find_element(By.ID, "tour-review-list").text


def test_empty_review_is_rejected(driver):
    """Пустой отзыв не создаётся и сопровождается ошибкой."""
    reset_app(driver)
    login(driver)
    close_account(driver)
    open_tour(driver, "T1")
    driver.find_element(By.CSS_SELECTOR, "#review-form button[type='submit']").click()
    error = wait(driver).until(EC.visibility_of_element_located((By.ID, "review-error")))
    assert "Введите текст" in error.text
    assert not driver.find_elements(By.CSS_SELECTOR, "#tour-review-list .tour-review-item")


def test_profile_name_persists(driver):
    """Новое имя U1 сохраняется после обновления страницы."""
    reset_app(driver)
    login(driver)
    driver.find_element(By.CSS_SELECTOR, "[data-account-tab='profile']").click()
    name = driver.find_element(By.ID, "profile-name")
    name.clear()
    name.send_keys("Михаил")
    driver.find_element(By.CSS_SELECTOR, "#profile-form button[type='submit']").click()
    wait(driver).until(lambda d: d.find_element(By.ID, "profile-success").text == "Имя сохранено.")
    driver.refresh()
    open_dialog(driver, "account-dialog")
    assert driver.find_element(By.ID, "profile-name").get_attribute("value") == "Михаил"
    assert driver.find_element(By.ID, "account-title").text == "Михаил"


def test_logout_closes_private_account(driver):
    """После выхода прямая ссылка на бронирования снова требует вход."""
    reset_app(driver)
    login(driver)
    driver.find_element(By.ID, "logout-button").click()
    driver.get(f"{TEST_URL}#bookings")
    open_dialog(driver, "auth-dialog")
    assert not driver.find_elements(By.CSS_SELECTOR, "#account-dialog[open]")
    assert driver.find_element(By.ID, "account-label").text == "Войти"


def test_bookings_require_authorization(driver):
    """Прямая ссылка на бронирования без сессии не раскрывает список."""
    reset_app(driver)
    driver.get(f"{TEST_URL}#bookings")
    open_dialog(driver, "auth-dialog")
    assert not driver.find_elements(By.CSS_SELECTOR, "#account-dialog[open]")
    assert not driver.find_element(By.ID, "bookings-list").is_displayed()


def test_admin_can_add_tour(driver):
    """Администратор добавляет тур, который затем находится в каталоге."""
    reset_app(driver)
    login(driver, "admin@example.ru", "admin2026")
    driver.find_element(By.CSS_SELECTOR, "[data-account-tab='admin']").click()
    driver.find_element(By.ID, "admin-tour-name").send_keys("Тестовый Алтай")
    driver.find_element(By.ID, "admin-tour-destination").send_keys("Алтай")
    driver.find_element(By.ID, "admin-tour-dates").send_keys("10–15 октября 2027")
    driver.find_element(By.ID, "admin-tour-price").send_keys("20000")
    driver.find_element(By.ID, "admin-tour-route").send_keys("Барнаул — Белокуриха")
    driver.find_element(By.CSS_SELECTOR, "#admin-tour-form button[type='submit']").click()
    wait(driver).until(lambda d: "добавлен" in d.find_element(By.ID, "admin-success").text)
    close_account(driver)
    search_destination(driver, "Алтай")
    cards = driver.find_elements(By.CSS_SELECTOR, "#results-list .tour-card")
    created = next(card for card in cards if "Тестовый Алтай" in card.text)
    assert "20 000" in created.text
    click_card(driver, created)
    open_dialog(driver, "tour-dialog")
    assert driver.find_element(By.ID, "tour-detail-dates").text == "10–15 октября 2027"
    assert driver.find_element(By.ID, "tour-detail-route").text == "Барнаул — Белокуриха"

