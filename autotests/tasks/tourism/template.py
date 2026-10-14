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


@pytest.fixture(scope="module")
def driver():
    """Создаёт экземпляр Chrome перед тестами и закрывает после."""
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--window-size=1440,1000")
    browser = webdriver.Remote(SELENIUM, options=options)
    yield browser
    browser.quit()


def test_successful_login(driver):
    """Проверить успешный вход пользователя U1."""


def test_wrong_password_is_rejected(driver):
    """Проверить отказ во входе с неверным паролем."""


def test_search_filters_by_destination(driver):
    """Проверить фильтрацию туров по направлению Москва."""


def test_search_shows_empty_state(driver):
    """Проверить сообщение для направления без туров."""


def test_selected_tour_has_correct_data(driver):
    """Проверить название, даты, маршрут и цену выбранного T1."""


def test_booking_is_created_for_selected_tour(driver):
    """Проверить создание неоплаченной брони T1 для U1."""


def test_booking_cancellation_persists(driver):
    """Проверить сохранение отмены брони после обновления."""


def test_successful_payment_confirms_booking(driver):
    """Проверить подтверждение брони и оплаченную сумму."""


def test_bookings_belong_to_current_user(driver):
    """Проверить отсутствие чужих броней в кабинете U1."""


def test_review_is_saved_for_selected_tour(driver):
    """Проверить сохранение отзыва для T1 после обновления."""


def test_empty_review_is_rejected(driver):
    """Проверить запрет пустого отзыва."""


def test_profile_name_persists(driver):
    """Проверить сохранение имени пользователя после обновления."""


def test_logout_closes_private_account(driver):
    """Проверить завершение сессии после выхода."""


def test_bookings_require_authorization(driver):
    """Проверить защиту прямой ссылки на бронирования."""


def test_admin_can_add_tour(driver):
    """Проверить добавление и отображение тура администратором."""

