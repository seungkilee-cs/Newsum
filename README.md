# Newsum
AI Powered News Article summarizer

## Design

### Scraper Module
- Scrape the news site to get top 5-10 articles and their links.
- Python with BeautifulSoup or Scrapy

- [x] Get Top N news articles links to scrape the data from (from the landing page)
- [x] For the links I get for the articles, make calls to scrape author, title, text, date, img url from the article (may benefit from writing the data temporarily so it's not all in the working memory)
- [x] Construct Article object from scraped data and send it to nodejs backend
- [x] Send article text to summarizer for bullet point summary
- [x] Receive the summary bullet points from the summarizer to put into the article object -> May benefit from separate Main to call and construct object, while leaving the logics for handling scraping and summarizing modular.
- [ ] Cache the article objects based on url, so we don't make calls to API more than once (per day?)

### Backend Module
- Create article object to handle the text, image and other metadata to tie the summary to.
- Node.js with Express.js

- [x] Receive article data from Python Scraper
- [x] Send article data to React Frontend for display

### Summarizer Module
- Make calls to some LLM to summarize the news article and return the text to be processed and added to the article object.
- Python with OpenAI API

- [ ] Receive article content from scraper to make API call to LLM text summarizer to produce three bullet point summaries
- [x] Send bullet point summaries to scraper to construct object to send to backend

### Frontend Module
- Articles summarized and available for quick skimming with the bullet point summaries.
- React.js

- [x] Receive data from node js backend to display the article list view showing summaries and meta data
- [x] Link back to original Article
- [ ] Display img of the article
- [x] Display the trending articles
- [x] Carousel vs Grid vs Card View for mobile adaptation
- [ ] Click into each article to see details and links to the original article