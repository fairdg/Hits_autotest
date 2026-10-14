import os
import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

TEST_URL = os.getenv("TEST_URL")
SELENIUM = os.getenv("SELENIUM_HUB")

@pytest.fixture(scope="module")
def driver():
    """Создаёт экземпляр браузера Chrome перед тестами и закрывает после."""
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--window-size=1280,800")
    driver = webdriver.Remote(SELENIUM, options=options)
    yield driver
    driver.quit()


def test_page_contains_five_games(driver):
    """Проверить, что на первой странице каталога показано ровно 5 игр."""


def test_all_cards_have_images(driver):
    """Проверить, что у каждой карточки есть изображение с непустым src."""


def test_page_indicator(driver):
    """Проверить, что индикатор показывает «Страница 1 из 5»."""


def test_next_button_advances_page(driver):
    """Проверить, что кнопка «Далее» открывает вторую страницу."""


def test_navigation_limits(driver):
    """Проверить, что кнопки неактивны на границах навигации."""
