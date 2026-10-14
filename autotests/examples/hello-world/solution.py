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


def test_page_has_title(driver):
    """Проверяет, что на странице есть title и он не пустой."""
    driver.get(TEST_URL)
    title = driver.title
    assert title != "", "У страницы отсутствует title"


def test_h1_text_is_correct(driver):
    """Проверяет, что заголовок h1 содержит нужный текст."""
    driver.get(TEST_URL)
    h1 = driver.find_element(By.TAG_NAME, "h1")
    expected_text = "Пример сайта для тестов"
    assert h1.text == expected_text, f"Ожидался текст '{expected_text}', но найден '{h1.text}'"
