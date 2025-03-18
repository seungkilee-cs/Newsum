import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import { EffectCoverflow, Navigation } from "swiper/modules";
import "../styles/CarouselView.css";
import { fetchArticles } from "../services/articleService";
import { debugLog, debugError } from "../utils/debugUtils";

function CarouselView({ site }) {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { siteName } = useParams(); // Get siteName from URL params

  useEffect(() => {
    const loadArticles = async () => {
      if (!site) {
        setError("No site selected.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const fetchedArticles = await fetchArticles(site);
        debugLog("Fetched articles:", fetchedArticles);
        setArticles(fetchedArticles);
        if (fetchedArticles.length === 0) {
          setError("No articles found for this site.");
        }
      } catch (err) {
        debugError("Error loading articles:", err);
        setError("Failed to load articles. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadArticles();
  }, [site]);

  if (isLoading) return <div>Loading articles...</div>;
  if (error) return <div>{error}</div>;
  if (articles.length === 0)
    return <div>No articles available for {siteName}.</div>;

  return (
    <Swiper
      effect={"coverflow"}
      grabCursor={true}
      centeredSlides={true}
      slidesPerView={"auto"}
      coverflowEffect={{
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
      }}
      navigation={true}
      modules={[EffectCoverflow, Navigation]}
      className="mySwiper"
    >
      {articles.slice(0, 10).map((article, index) => (
        <SwiperSlide key={article._id}>
          <article className={`carousel-card rank-${index + 1}`}>
            <div className="article-header">
              <span className={`article-number rank-${index + 1}`}>
                {index + 1}
              </span>
              {index < 3 && <span className="trending-tag">Trending</span>}
            </div>
            <h2 className="article-title" title={article.title}>
              {article.title}
            </h2>
            <div className="article-meta">
              <span className="article-author">{article.author}</span>
              <span className="article-date">{article.date}</span>
            </div>
            <ul className="article-summary">
              {Array.isArray(article.summary) ? (
                article.summary.map((point, pointIndex) => (
                  <li key={pointIndex} className="summary-point">
                    {point.replace(/^[-•]\s*/, "")}
                  </li>
                ))
              ) : (
                <li className="summary-point">
                  {article.summary || "No summary available"}
                </li>
              )}
            </ul>
            <a
              href={article.url}
              className="read-more"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read More
            </a>
          </article>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default CarouselView;
