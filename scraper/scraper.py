import requests
from bs4 import BeautifulSoup
import json

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

def send_to_backend(articles):
    backend_url = 'http://localhost:5001/receive-articles'  # Adjust the port if needed
    headers = {'Content-Type': 'application/json'}
    
    try:
        response = requests.post(backend_url, json=articles, headers=headers)
        response.raise_for_status()
        print(f"Data sent successfully. Status code: {response.status_code}")
    except requests.RequestException as e:
        print(f"Failed to send data to backend: {e}")

if __name__ == '__main__':
    articles = scrape_news()
    if articles:
        for article in articles:
            print(f"Title: {article['title']}")
            print(f"URL: {article['url']}")
            print(f"Content: {article['content'][:50]}...")
            print("---")
        
        # Send the scraped articles to the backend
        send_to_backend(articles)
    else:
        print("No articles scraped.")

if __name__ == '__main__':
    print(scrape_news())
