import sampleArticle from '../_test/sampleArticle.json';

export const loadSampleArticle = () => {
  return sampleArticle;
};

export const loadSampleArticles = (count = 5) => {
  return Array(count).fill(sampleArticle).map((article, index) => ({
    ...article,
    id: index + 1,
    title: `${article.title} ${index + 1}`,
  }));
};
