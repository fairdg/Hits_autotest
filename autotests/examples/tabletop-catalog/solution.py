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
    """Проверяет, что на первой странице каталога показано ровно 5 игр."""
    driver.get(TEST_URL)
    cards = driver.find_elements(By.CSS_SELECTOR, ".game-card")
    assert len(cards) == 5, f"Ожидалось 5 карточек на странице, а получилось {len(cards)}"


def test_all_cards_have_images(driver):
    """Проверяет, что у каждой карточки есть изображение с непустым src."""
    driver.get(TEST_URL)
    cards = driver.find_elements(By.CSS_SELECTOR, ".game-card")
    for card in cards:
        name = card.find_element(By.CSS_SELECTOR, ".game-name").text
        img = card.find_element(By.TAG_NAME, "img")
        src = img.get_attribute("src")
        assert src and src.startswith("data:image"), \
            f"У карточки '{name}' нет встроенного изображения"


def test_page_indicator(driver):
    """Проверяет, что индикатор показывает 'Страница 1 из 5'."""
    driver.get(TEST_URL)
    indicator = driver.find_element(By.ID, "page-indicator").text
    assert indicator == "Страница 1 из 5", \
        f"Ожидалось 'Страница 1 из 5', а показано '{indicator}'"


def test_next_button_advances_page(driver):
    """Проверяет, что кнопка 'Далее' открывает вторую страницу."""
    driver.get(TEST_URL)
    driver.find_element(By.ID, "next").click()
    indicator = driver.find_element(By.ID, "page-indicator").text
    assert indicator == "Страница 2 из 5", \
        f"Ожидалось 'Страница 2 из 5', а показано '{indicator}'"



def test_navigation_limits(driver):
    """Проверяет, что кнопки неактивны на границах навигации."""
    driver.get(TEST_URL)
    prev = driver.find_element(By.ID, "prev")
    next_btn = driver.find_element(By.ID, "next")
    assert not prev.is_enabled(), "На первой странице кнопка 'Назад' должна быть неактивна"
    for _ in range(4):
        next_btn.click()
    indicator = driver.find_element(By.ID, "page-indicator").text
    assert indicator == "Страница 5 из 5", \
        f"Ожидалось 'Страница 5 из 5', а показано '{indicator}'"
    assert not next_btn.is_enabled(), "На последней странице кнопка 'Далее' должна быть неактивна"
