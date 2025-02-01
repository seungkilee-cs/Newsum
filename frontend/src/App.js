import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GridView from './GridView';
import CarouselView from './CarouselView';
import './App.css';

function App() {
  const [articles, setArticles] = useState([]);
  const [isCarouselView, setIsCarouselView] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://localhost:5001/articles');
        setArticles(response.data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, []);

  const toggleView = () => {
    setIsCarouselView(!isCarouselView);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>News Summarizer</h1>
        {/* <button onClick={toggleView} className="view-toggle-btn">
          {isCarouselView ? 'Grid View' : 'Carousel View'}
        </button> */}
      </header>
      {articles.length > 0 ? (
        isCarouselView ? (
          <CarouselView articles={articles} />
        ) : (
          <GridView articles={articles} />
        )
      ) : (
        <p>Loading articles...</p>
      )}
    </div>
  );
}

export default App;
