from config import SAMPLE_NEWS_SITE_URL
from scraper import scrape_article, get_article_urls
from data_sender import send_to_backend

DEBUG = False
TEST = True
MONGOTEST = False
MONGO = True

def main():
    article_class = "O16KGI pu51Xe JnzaaY xs2MeC"
    url_list = get_article_urls(SAMPLE_NEWS_SITE_URL, article_class)
    
    articles = [scrape_article(url, TEST, MONGO, MONGOTEST) for url in url_list]
    
    if DEBUG:
        for a in articles:
            print(a)
    else:
        send_to_backend(articles, MONGO)

if __name__ == '__main__':
    main()
