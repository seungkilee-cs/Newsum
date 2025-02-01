from bs4 import BeautifulSoup
from config import SAMPLE_URL_PATH, SAMPLE_NEWS_SITE_URL
import requests

# Use the constants directly:
sample_url_path = SAMPLE_URL_PATH
sample_news_site_url = SAMPLE_NEWS_SITE_URL

response = requests.get(SAMPLE_NEWS_SITE_URL)
soup = BeautifulSoup(response.content, 'html.parser')

# Somehow static article class?
article_class = "O16KGI pu51Xe JnzaaY xs2MeC"

# Assuming you have already created the soup object
# hrefs = [a['href'] for a in soup.find_all('a', class_=article_class) if a.has_attr('href')]

# for url in hrefs:
#     print(url)

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

    # Extract article content
    # Join the text elements
    article_content = extract_article_text(soup)

    return {
        'title': title,
        'date': date,
        'author': author,
        'content': article_content
    }

# Example usage
# url = hrefs[0]
# url = "https://www.americanlibertymedia.com/post/kurt-schwab-the-air-force-veteran-aspiring-to-transform-texas-s-33rd-district"
url = "https://www.americanlibertymedia.com/post/top-25-most-conservative-college-campuses-2024"
article_data = scrape_article(url)

print(f"Title: {article_data['title']}")
print(f"Date: {article_data['date']}")
print(f"Author: {article_data['author']}")
print(f"Content: {article_data['content'][:2000]}...") # Print first 200 characters of content

# For a given URL, I want to extract the title


# Article Title
# <span class="blog-post-title-font blog-post-title-color">Top 25 Most Conservative College Campuses - 2024</span>

# Date
# <span title="Aug 1, 2024" class="post-metadata__date time-ago" data-hook="time-ago">Aug 1, 2024</span>

# Author
# <span title="ALM Staff" class="tQ0Q1A user-name dlINDG" data-hook="user-name">ALM Staff</span>

# Img URL
# <img src="https://static.wixstatic.com/media/11062b_8e1fee533a604273819a9c9b4abb66ee~mv2_d_5573_3981_s_4_2.jpg/v1/fill/w_1480,h_1058,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/11062b_8e1fee533a604273819a9c9b4abb66ee~mv2_d_5573_3981_s_4_2.jpg"

# Text from the article
# <span class="v0IdQ">

# if __name__ == '__main__':
#     print(hrefs)