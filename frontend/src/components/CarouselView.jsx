import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import { EffectCoverflow, Navigation } from "swiper/modules";
import "../styles/CarouselView.css";

function CarouselView({ articles }) {
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
                    {point.replace(/^[-•]\s*/, "")}{" "}
                    {/* This will remove any remaining leading "- " or "• " */}
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
