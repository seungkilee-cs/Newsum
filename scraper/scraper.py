import requests
from bs4 import BeautifulSoup
from config import SAMPLE_URL_PATH, SAMPLE_NEWS_SITE_URL
from summarizer import generate_summary
from urllib.parse import urlparse

import json
from datetime import datetime


DEBUG = False
# Basically API call flag. If not TEST, call LLM API. Else, use test data. -> Prob should make a separate flag for this. I'm also using this to test the url uid for MongoDB
TEST = True
# Clean this up later
MONGOTEST = False
MONGO = True

# Use the constants directly:
sample_url_path = SAMPLE_URL_PATH
sample_news_site_url = SAMPLE_NEWS_SITE_URL

# URL Parsing for site
def get_base_url(url):
    parsed_url = urlparse(url)
    return f"{parsed_url.scheme}://{parsed_url.netloc}"

# extract article from the article post
def extract_article_text(soup):
    article_text = []

    for div in soup.find_all('div', attrs={'data-breakout': 'normal'}):
        p_tag = div.find('p')
        if p_tag:
            spans = p_tag.find_all('span')
            if len(spans) >= 2:
                deepest_span = spans[-1]
                article_text.append(deepest_span.get_text(strip=True))

    return ' '.join(article_text)


# construct object to send to backend
def scrape_article(url):
    # Fetch the HTML content
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    # Extract title
    title_span = soup.find('span', class_='blog-post-title-font blog-post-title-color')
    title = title_span.text if title_span else 'Title not found'

    # Extract date
    date_span = soup.find('span', class_='post-metadata__date time-ago')
    date = date_span['title'] if date_span else 'Date not found'

    # Extract author
    author_span = soup.find('span', class_='tQ0Q1A user-name dlINDG')
    author = author_span['title'] if author_span else 'Author not found'
    # site = 'https://www.americanlibertymedia.com'
    site = get_base_url(url)

    # Extract article content
    # Join the text elements
    article_content = extract_article_text(soup)

    article_summary = generate_summary(article_content=article_content, test=TEST)

    # Testing if 
    if MONGOTEST:
        url = url + "_test"

    if MONGO:
        return {
            'title': title,
            'url': url,
            'author': author,
            'publishDate': date,
            'content': article_content.split('\n') if isinstance(article_content, str) else article_content,
            'summary': article_summary if isinstance(article_summary, list) else [article_summary],
            'site': site,
            'imageUrl': 'test.url'  # Add this field, even if empty
        }

    else:
        return {
            'title': title,
            'url': url,
            'author': author,
            'date': date,
            'content': article_content,
            'summary': article_summary,
            'site': site
        }

def send_to_backend(articles):
    if MONGO:
        backend_url = 'http://localhost:5001/mongo-receive-articles'
    else:
        backend_url = 'http://localhost:5001/receive-articles'
    headers = {'Content-Type': 'application/json'}
    
    try:
        response = requests.post(backend_url, json=articles, headers=headers)
        response.raise_for_status()
        print(articles)
        print(f"Data sent successfully. Status code: {response.status_code}")
    except requests.RequestException as e:
        print(f"Failed to send data to backend: {e}")

if __name__ == '__main__':

    # testing with ALM
    response = requests.get(SAMPLE_NEWS_SITE_URL)
    soup = BeautifulSoup(response.content, 'html.parser')

    # Somehow static article class?
    article_class = "O16KGI pu51Xe JnzaaY xs2MeC"

    # Assuming you have already created the soup object
    url_list = [a['href'] for a in soup.find_all('a', class_=article_class) if a.has_attr('href')]

    # articles = scrape_article()
    articles = [scrape_article(url) for url in url_list]
    if DEBUG:
        for a in articles:
            print(a)
    else:
        send_to_backend(articles)
