# Newsum
AI Powered News Article summarizer

## Design

### Scraper Module
- Scrape the news site to get top 5-10 articles and their links.
- Python with BeautifulSoup or Scrapy

### Backend Module
- Create article object to handle the text, image and other metadata to tie the summary to.
- Node.js with Express.js

### Summarizer Module
- Make calls to some LLM to summarize the news article and return the text to be processed and added to the article object.
- Python with OpenAI API

### Frontend Module
- Articles summarized and available for quick skimming with the bullet point summaries.
- React.js
