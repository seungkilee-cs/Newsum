import requests
import json
from bs4 import BeautifulSoup
from datetime import datetime

def read_sample_articles():
    articles = []
    current_article = {}
    
    with open('_test/sample_articles.txt', 'r') as file:
        for line in file:
            line = line.strip()
            if line.startswith('Title:'):
                if current_article:
                    articles.append(current_article)
                current_article = {'createdAt': datetime.now().isoformat()}
            if line.startswith('Title:'): current_article['title'] = line[6:].strip()
            elif line.startswith('URL:'): current_article['url'] = line[4:].strip()
            elif line.startswith('Content:'): current_article['content'] = line[8:].strip()
            elif line.startswith('Summary:'):
                current_article['summary'] = line[8:].strip().split('|')
    
    if current_article:
        articles.append(current_article)
    
    return articles

def send_to_backend(articles):
    backend_url = 'http://localhost:5001/receive-articles'
    headers = {'Content-Type': 'application/json'}
    
    try:
        response = requests.post(backend_url, json=articles, headers=headers)
        response.raise_for_status()
        print(f"Data sent successfully. Status code: {response.status_code}")
    except requests.RequestException as e:
        print(f"Failed to send data to backend: {e}")

def scrape_news():
    url = 'https://example-news-site.com'
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    articles = []
    for article in soup.find_all('article', class_='news-item'):
        title = article.find('h2').text.strip()
        url = article.find('a')['href']
        content = article.find('p', class_='summary').text.strip()
        articles.append({
            'title': title,
            'url': url,
            'content': content
        })
    
    return articles[:10]  # Return top 10 articles

if __name__ == '__main__':
    articles = read_sample_articles()
    send_to_backend(articles)
