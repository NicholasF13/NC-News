const app = require('./app')
const request = require('supertest')
const db = require('./db/connection')
const seed = require('./db/seeds/seed')
const data = require('./db/data/test-data')
const endpointsData = require('./endpoints.json')

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


describe("GET/api/articles/:article_id", () => {
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

describe("GET /api/articles", () => {
  test("returns an array of article objects with the correct properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({body}) => {
        const articles = body.articles
        expect(articles).toHaveLength(13)
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


describe("GET /api/articles/:article_id/comments", () => {
  test("returns an array of comment objects with the correct properties", () => {
      return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({body}) => {
        const comments = body.comments
        expect(comments).toHaveLength(11)
        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id", expect.any(Number))
          expect(comment).toHaveProperty("votes", expect.any(Number))
          expect(comment).toHaveProperty("created_at", expect.any(String))
          expect(comment).toHaveProperty("author", expect.any(String))
          expect(comment).toHaveProperty("body", expect.any(String))
          expect(comment).toHaveProperty("article_id", expect.any(Number))
        })
      })
  })
  test("checks all comment id's match the endpoint article id", () => {
    const articleId = 1

    return request(app)
    .get(`/api/articles/${articleId}/comments`)
    .expect(200)
    .then(({body}) => {
      const comments = body.comments
      expect(comments).toHaveLength(11)
      comments.forEach((comment) => {
        expect(comment.article_id).toBe(articleId)
      })

    })
  })
  test("returns an array of comment objects with the objects sorted by date, in descending order", () => {
    return request(app)
    .get('/api/articles/1/comments')
    .expect(200)
    .then(({body}) => {
      const comments = body.comments
      expect(comments).toBeSortedBy("created_at", {descending: true});
    });
  })
  test('GET:404 sends an appropriate status and error message when given a valid but non-existent article id', () => {
    return request(app)
      .get('/api/articles/999/comments')
      .expect(404)
      .then(({body}) => {
        expect(body.message).toBe('Article does not exist')
      })
  })
  test('GET:400 sends an appropriate status and error message when given an invalid article id', () => {
    return request(app)
      .get('/api/articles/invalidarticle/comments')
      .expect(400)
      .then(({body}) => {
        expect(body.message).toBe('Bad request')
      })
  })
})

describe("POST /api/articles/:article_id/comments", () => {
  test("adds a comment for an article", () => {

    const newComment = {
      username: 'butter_bridge',
      body: 'Hello World'
    }

    return request(app)
    .post("/api/articles/1/comments")
    .send(newComment)
    .expect(201)
    .then(({body}) => {
      const comment = body.comment[0]
      expect(comment).toHaveProperty("comment_id", 19)
      expect(comment).toHaveProperty("votes", 0)
      expect(comment).toHaveProperty("author", newComment.username)
      expect(comment).toHaveProperty("body", newComment.body)
      expect(comment).toHaveProperty("created_at", expect.any(String))
      expect(comment).toHaveProperty("article_id", 1)
    }) 
  })
  test('sends an appropriate 404 status and error message when given a valid but non-existent article id', () => {
    return request(app)
      .post('/api/articles/999/comments')
      .expect(404)
      .then(({body}) => {
        expect(body.message).toBe('Article does not exist')
      })
  })
  test('sends an appropriate 400 status and error message when given an invalid article id', () => {
    return request(app)
      .post('/api/articles/invalidarticle/comments')
      .expect(400)
      .then(({body}) => {
        expect(body.message).toBe('Bad request')
      })
  })
  test('sends an appropriate 400 status and error message when body is missing', () => {
    const invalidComment = {
      username: 'butter_bridge'
    }

    return request(app)
      .post('/api/articles/1/comments')
      .send(invalidComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe('Missing body or username')
      })
  })
  test('sends an appropriate 400 status and error message when username is missing', () => {
    const invalidComment = {
      body: 'Hello World'
    }

    return request(app)
      .post('/api/articles/1/comments')
      .send(invalidComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe('Missing body or username')
      })
  })
  test('sends an appropriate 400 status and error message when there are extra keys in the request body', () => {
    const invalidComment = {
      username: 'butter_bridge',
      body: 'Hello World',
      extraKey: 'This should not be here'
    };
  
    return request(app)
      .post('/api/articles/1/comments')
      .send(invalidComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe('Invalid keys in the request body');
      });
  });
})

describe("PATCH /api/articles/:article_id", () => {
  test("updates an articles votes with a positive value", () =>{
    const newVotes = { inc_votes: 10 }

    return request(app)
    .patch("/api/articles/1")
    .send(newVotes)
    .expect(200)
    .then(({body}) => {
      const updatedArticle = body.article
      expect(updatedArticle).toHaveProperty("votes", 110)
      expect(updatedArticle).toHaveProperty("author", expect.any(String))
      expect(updatedArticle).toHaveProperty("title", expect.any(String))
      expect(updatedArticle).toHaveProperty("article_id", expect.any(Number))
      expect(updatedArticle).toHaveProperty("body", expect.any(String))
      expect(updatedArticle).toHaveProperty("topic", expect.any(String))
      expect(updatedArticle).toHaveProperty("created_at", expect.any(String))
      expect(updatedArticle).toHaveProperty("article_img_url", expect.any(String))
    })
  })
  test("updates an article's votes with negative value", () => {
    const updatedVotes = { inc_votes: -5 };

    return request(app)
      .patch("/api/articles/2")
      .send(updatedVotes)
      .expect(200)
      .then(({ body }) => {
        const updatedArticle = body.article;
        expect(updatedArticle).toHaveProperty("votes", -5)
        expect(updatedArticle).toHaveProperty("author", expect.any(String))
        expect(updatedArticle).toHaveProperty("title", expect.any(String))
        expect(updatedArticle).toHaveProperty("article_id", expect.any(Number))
        expect(updatedArticle).toHaveProperty("body", expect.any(String))
        expect(updatedArticle).toHaveProperty("topic", expect.any(String))
        expect(updatedArticle).toHaveProperty("created_at", expect.any(String))
        expect(updatedArticle).toHaveProperty("article_img_url", expect.any(String))
      })
  })
  test("sends an appropriate 404 status and error message when given a valid but non-existent article id", () => {
    const updatedVotes = { inc_votes: 5 }

    return request(app)
      .patch("/api/articles/999")
      .send(updatedVotes)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Article does not exist")
      })
  })
  test("sends an appropriate 400 status and error message when given an invalid article id", () => {
    const updatedVotes = { inc_votes: 5 };

    return request(app)
      .patch("/api/articles/invalidarticle")
      .send(updatedVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request")
      })
  })
  test("sends an appropriate 400 status and error message when request body is missing", () => {
      return request(app)
        .patch("/api/articles/1")
        
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request");
        })
    })
  test("sends an appropriate 400 status and error message when provided object has an incorrect key", () => {
      const invalidRequestBody = { incorrect_key: 10 };
  
      return request(app)
        .patch("/api/articles/1")
        .send(invalidRequestBody)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request");
        });
    });
})