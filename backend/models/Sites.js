{
    "_id": ObjectId,
    "name": String,
    "url": String,
    "categories": [String],
    "articles": [
      {
        "_id": ObjectId,
        "title": String,
        "summary": String,
        "publishDate": Date,
        "author": String,
        "content": String,
        "imageUrl": String,
        "tags": [String]
      }
    ]
  }
  