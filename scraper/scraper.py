import requests
from bs4 import BeautifulSoup

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
    print(scrape_news())
