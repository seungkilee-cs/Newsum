import requests
import openai
import os

from bs4 import BeautifulSoup
import os
import logging
from config import SAMPLE_URL_PATH

openai.api_key = os.getenv('OPENAI_API_KEY')


logging.basicConfig(level=logging.INFO)

def get_news_url():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    url_file_path = os.path.join(script_dir, SAMPLE_URL_PATH)
    try:
        with open(url_file_path, 'r') as file:
            return file.read().strip()
    except FileNotFoundError:
        logging.error(f"URL file not found: {url_file_path}")
        return None

def scrape_news():
    url = get_news_url()
    if not url:
        return []

    try:
        response = requests.get(url)
        response.raise_for_status()
    except requests.RequestException as e:
        logging.error(f"Failed to fetch URL: {e}")
        return []

    soup = BeautifulSoup(response.text, 'html.parser')
    
    articles = []
    for article in soup.find_all('article', class_='news-item'):
        title = article.find('h2').text.strip()
        article_url = article.find('a')['href']
        content = article.find('p', class_='summary').text.strip()
        articles.append({
            'title': title,
            'url': article_url,
            'content': content
        })
    
    return articles[:10]  # Return top 10 articles

if __name__ == '__main__':
    articles = scrape_news()
    if articles:
        for article in articles:
            print(f"Title: {article['title']}")
            print(f"URL: {article['url']}")
            print(f"Content: {article['content'][:50]}...")
            print("---")
    else:
        print("No articles scraped.")
