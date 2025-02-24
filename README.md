# Newsum
AI Powered News Article summarizer

## Design

## Business question
1. To what extent are we going support the summary service
2. Tech Decision -> We are going to be making 1 API per day -> store the result in server -> "Breaking News" "What time of the day" (Update Interval)

### Websites for News
- FOX
- The Guardian
- Daily Signal
- National Review
- WSJ (Cost)

### Scraper Module
- Scrape the news site to get top 5-10 articles and their links.
- Python with BeautifulSoup or Scrapy

- [x] Get Top N news articles links to scrape the data from (from the landing page)
- [x] For the links I get for the articles, make calls to scrape author, title, text, date, img url from the article (may benefit from writing the data temporarily so it's not all in the working memory)
- [x] Construct Article object from scraped data and send it to nodejs backend
- [x] Send article text to summarizer for bullet point summary
- [x] Receive the summary bullet points from the summarizer to put into the article object -> May benefit from separate Main to call and construct object, while leaving the logics for handling scraping and summarizing modular.

- [ ] Server Architecture to host the scraped data
    - For now, once a day
    - site schema
    - articles object stored in the server
    - data overhaul duration?
- [ ] App makes calls to Server instead of the API
    - restructure the backend module to receive the data and store it, then hold it in different DB

### Backend Module
- Create article object to handle the text, image and other metadata to tie the summary to.
- Node.js with Express.js

- [x] Receive article data from Python Scraper
    - [x] Write the data to MongoDB schema
- [x] Send article data to React Frontend for display
    - [x] Update the data posting to pull from DB
    - [ ] Separate the scrapper logic from update backend logic
    - [x] Update the url db to modular pointing
- [x] Save the article data to MongoDB

- [ ] Server makes a once a day "scrape" and API call, save the data, and hosts it as the client connects to the app.

### Summarizer Module
- Make calls to some LLM to summarize the news article and return the text to be processed and added to the article object.
- Python with OpenAI API

- [x] Receive article content from scraper to make API call to LLM text summarizer to produce three bullet point summaries
- [x] Send bullet point summaries to scraper to construct object to send to backend
- [ ] Cache check logic, to see if the url already exists in the mongoDB so it doesn't call API unnecessarily.

### Frontend Module
- Articles summarized and available for quick skimming with the bullet point summaries.
- React.js

- [x] Receive data from node js backend to display the article list view showing summaries and meta data
- [x] Link back to original Article
- [x] Display the trending articles
- [x] Carousel vs Grid vs Card View for mobile adaptation
- [x] Click into each article to links to the original article

- [ ] Display img of the article
- [x] Make site layout
- [ ] Have site selection call data update API

### House Keeping
- [x] Standard Autodeploy script
- [x] start / end switch for mongoDB and backend
- [x] start / end switch for frontend
- [ ] Consolidate scripts and clean up package.json scripts

#### Feedback
- [x] Bullet Points list (-)
- [x] Headlines -> alt size / text wrap (currently cuts off with ...)

- [ ] Perhaps include a "detail" view? -> Expanded view with "Expand"
- [ ] Visual -> Color Scheme (customize to specific news sites) -> ALM (R/W/B)
