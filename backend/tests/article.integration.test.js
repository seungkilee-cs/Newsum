import request from "supertest";
import app from "../app.js";
import { sampleArticles, invalidArticles } from "./fixtures.js";

describe("Article API", () => {
  it("should accept article ingestion", async () => {
    const ingest = await request(app)
      .post("/api/articles/mongo-receive")
      .send(sampleArticles)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(ingest.body.count).toBe(sampleArticles.length);

    const res = await request(app)
      .get("/api/articles/mongo")
      .query({ limit: 5, page: 1 })
      .expect("Content-Type", /json/)
      .expect(200);

    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.pagination).toMatchObject({ page: 1, limit: 5 });
  });

  it("should return paginated articles", async () => {
    await request(app)
      .post("/api/articles/mongo-receive")
      .send(sampleArticles)
      .expect("Content-Type", /json/)
      .expect(200);

    const res = await request(app)
      .get("/api/articles/mongo")
      .query({ limit: 5, page: 1 })
      .expect("Content-Type", /json/)
      .expect(200);

    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.pagination).toMatchObject({ page: 1, limit: 5 });
  });

  describe("validation", () => {
    it("should reject invalid payloads", async () => {
      const res = await request(app)
        .post("/api/articles/mongo-receive")
        .send(invalidArticles)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(res.body.message).toBe("Validation failed");
      expect(res.body.issues[0].path).toContain("site");
    });
  });
});
