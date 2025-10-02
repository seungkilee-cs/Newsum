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
- [x] Cache check logic, to see if the url already exists in the mongoDB so it doesn't call API unnecessarily.

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
- [x] Have site selection call data update API

### House Keeping
- [x] Standard Autodeploy script
- [x] start / end switch for mongoDB and backend
- [x] start / end switch for frontend

- [x] Need to check on the staging vs test article fetching
- [ ] Reorganize backend API calls and the target URL
- [ ] Consolidate scripts and clean up package.json scripts

#### Feedback
- [x] Bullet Points list (-)
- [x] Headlines -> alt size / text wrap (currently cuts off with ...)

- [ ] Perhaps include a "detail" view? -> Expanded view with "Expand"
- [ ] Visual -> Color Scheme (customize to specific news sites) -> ALM (R/W/B)

# AI-Powered News Summarizer: Features and Requirements

### 1. Site Selection
- [x] Display a list of predefined news sites (e.g., CNN, Fox News)
- [x] Allow users to select a specific news site
- [x] Trigger article fetching based on site selection

### 2. Article Fetching
- [x] Implement API calls to backend for fetching articles
- [x] Create mock data for staging/testing environments
- [x] Handle errors and edge cases in fetching process

### 3. Dynamic Filtering
- [x] Implement URL normalization for consistent site matching
- [x] Filter fetched articles based on selected site
- [x] Ensure filtered results are accurately displayed

### 4. Carousel View
- [x] Design and implement a carousel component for article display
- [x] Ensure smooth navigation between articles in the carousel
- [x] Optimize carousel for different screen sizes and devices

### 5. Environment-Specific Behavior
- [x] Set up environment variables for staging and production
- [x] Implement logic to use mock data in staging
- [x] Ensure seamless switching between mock and live data

### 6. Advanced Summarization Techniques
- [ ] Integrate an NLP model for abstractive summarization (e.g., GPT, BERT)
- [ ] Implement bullet point summary generation
- [ ] Create a toggle for users to switch between full and bullet point summaries

### 7. Real-Time News Updates
- [ ] Integrate with real-time news APIs (e.g., Google News API, NewsAPI)
- [ ] Implement a periodic refresh mechanism for news feed
- [ ] Add visual indicators for newly updated articles

### 8. User Personalization
- [x] Develop a user profile system to store preferences
- [ ] Implement a recommendation algorithm based on reading history
- [ ] Create UI for users to select and save preferred topics/sites

### 9. Multi-Language Support
- [ ] Integrate a translation API or model
- [ ] Implement language selection in the user interface
- [ ] Ensure summaries and UI elements adapt to selected language

### 10. Search Functionality
- [ ] Design and implement a search bar component
- [ ] Create backend endpoint for keyword-based article search
- [ ] Implement real-time search suggestions

### 11. Headline Generation
- [ ] Integrate or develop an AI model for headline generation
- [ ] Implement A/B testing for AI-generated vs. original headlines
- [ ] Allow users to toggle between original and AI-generated headlines

### 12. Article Categorization
- [ ] Implement Named Entity Recognition for topic extraction
- [ ] Develop a categorization system (e.g., politics, sports, tech)
- [ ] Create filters and tags for category-based navigation

### 13. Analytics Dashboard
- [ ] Design and implement an analytics dashboard UI
- [ ] Track and calculate time saved metrics
- [ ] Visualize news consumption patterns and preferences

### 14. User Feedback Loop
- [ ] Implement a rating system for summary accuracy and relevance
- [ ] Create a backend system to collect and store user feedback
- [ ] Develop a mechanism to use feedback for model fine-tuning

### 15. External Platform Integration
- [ ] Implement social media sharing functionality
- [ ] Develop export options for summaries (PDF, text)
- [ ] Ensure exported content is well-formatted and branded

### 16. Video and Document Summarization
- [ ] Integrate or develop AI models for video/document summarization
- [ ] Implement file upload functionality for documents
- [ ] Create a video link input for YouTube or other video platforms

### 17. Conversational Interface
- [ ] Develop a chatbot interface for the summarizer
- [ ] Implement natural language processing for user queries
- [ ] Create a set of predefined commands for common summarization tasks
