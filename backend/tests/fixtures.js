export const sampleArticles = [
  {
    title: "Automated Article 1",
    author: "Reporter One",
    url: "https://example.com/article-1",
    site: "https://example.com",
    publishDate: "2024-10-01T00:00:00Z",
    content: [
      "Paragraph 1",
      "Paragraph 2",
    ],
    summary: [
      "Summary point 1",
      "Summary point 2",
    ],
    imageUrl: "https://example.com/image-1.jpg",
  },
  {
    title: "Automated Article 2",
    author: "Reporter Two",
    url: "https://example.com/article-2",
    site: "https://example.com",
    publishDate: "2024-10-02T00:00:00Z",
    content: ["Content paragraph"],
    summary: ["Summary point"],
    imageUrl: "https://example.com/image-2.jpg",
  },
];

export const invalidArticles = [
  {
    title: "Missing Site",
    url: "https://example.com/bad-article",
    content: ["Content paragraph"],
    summary: ["Summary point"],
    imageUrl: "https://example.com/image.jpg",
  },
];

export const sampleSites = [
  {
    name: "American Liberty Media",
    url: "https://www.americanlibertymedia.com/all-news",
    image: "https://example.com/alm.png",
  },
  {
    name: "Sample News",
    url: "https://news.example.com",
    image: "https://example.com/news.png",
  },
];

export const invalidSites = [
  {
    name: "Invalid Site",
    image: "https://example.com/bad.png",
  },
];
