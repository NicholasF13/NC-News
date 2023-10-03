const app = require('./app')
const request = require('supertest')
const db = require('./db/connection')
const seed = require('./db/seeds/seed')
const data = require('./db/data/test-data')
const endpointsData = require('./endpoints.json')
const jestSorted = require('jest-sorted')

beforeEach(() => {
    return seed(data)
   })
   
   afterAll(() => {
       return db.end()
   })


describe("GET /api/topics", () => {
    test("returns status of code 200 when a request is made to this endpoint", () => {
        return request(app).get("/api/topics").expect(200);
    })
    test("Returns topics with the correct format", () => {
        return request(app)
        .get('/api/topics')
        .then(({body}) => {
          const topics = body
          expect(topics).toHaveLength(3)
          topics.forEach((topic) => {
            expect(typeof topic.slug).toBe("string")
            expect(typeof topic.description).toBe("string")
          })
        }) 
    }) 
})

describe("GET /api", () => {
  test("Should respond with an accurate JSON object representing all available endpoints", () => {
    return request(app)
    .get('/api')
    .expect(200)
    .then(({body}) => {
      const endpoints = body
      expect(endpoints).toEqual(endpointsData)       
    })
  })
})


describe("/api/articles/:article_id", () => {
  test("return an article object with the correct properties", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toHaveProperty("author")
        expect(body.article).toHaveProperty("title")
        expect(body.article).toHaveProperty("article_id")
        expect(body.article).toHaveProperty("body")
        expect(body.article).toHaveProperty("topic")
        expect(body.article).toHaveProperty("created_at")
        expect(body.article).toHaveProperty("votes")
        expect(body.article).toHaveProperty("article_img_url")
      })
  })
  test("returns an article with the correct id", () => {
    return request(app)
    .get("/api/articles/3")
    .expect(200)
    .then(({body}) => {
      const {article_id} = body.article
      expect(article_id).toBe(3)
    })
  })
  test('GET:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
    return request(app)
      .get('/api/articles/999')
      .expect(404)
      .then(({body}) => {
        expect(body.message).toBe('Article does not exist')
      })
  })
  test('GET:400 sends an appropriate status and error message when given an invalid id', () => {
    return request(app)
      .get('/api/articles/invalidarticle')
      .expect(400)
      .then(({body}) => {
        expect(body.message).toBe('Bad request')
      })
  })
})

describe("/api/articles", () => {
  test("returns an array of article objects with the correct properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({body}) => {
        const articles = body.articles
        articles.forEach((article) => {
          expect(article).toHaveProperty("author")
          expect(article).toHaveProperty("title")
          expect(article).toHaveProperty("article_id")
          expect(article).toHaveProperty("topic")
          expect(article).toHaveProperty("created_at")
          expect(article).toHaveProperty("votes")
          expect(article).toHaveProperty("article_img_url")
          expect(article).toHaveProperty("comment_count")
        })
      })
  })
  test("returns an array of article objects with the objects sorted by date, in descending order", () => {
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then(({body}) => {
      const articles = body.articles
      expect(articles).toBeSortedBy("created_at", {descending: true});
    });
  })
})
