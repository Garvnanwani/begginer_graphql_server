const express = require("express")
const { graphqlHTTP } = require('express-graphql')
const ggl = require("graphql-tag")
const { buildASTSchema } = require("graphql")
const cors = require("cors")

const app = express()

const PORT = process.env.PORT || 5000

app.use(cors())

const schema = buildASTSchema(ggl`
    type Query {
    posts: [Post]
    post(id: ID): Post
    authors: [Person]
    author(id: ID): Person
  }

  type Post {
    id: ID
    author: Person
    body: String
  }

  type Person {
    id: ID
    posts: [Post]
    firstName: String
    lastName: String
  }
`)

const PEOPLE = new Map()
const POSTS = new Map()

class Post {
    constructor(data) { Object.assign(this, data) }
    get author() {
        return PEOPLE.get(this.authorId)
    }
}

class Person {
    constructor(data) { Object.assign(this, data) }
    get posts() {
        return [...POSTS.values()].filter(post => post.authorId === this.id)
    }
}

const initializeData = () => {
    const fakePeople = [
        { id: '1', firstName: 'John', lastName: 'Doe' },
        { id: '2', firstName: 'Jane', lastName: 'Doe' }
    ]

    fakePeople.forEach(person => PEOPLE.set(person.id, new Person(person)))

    const fakePosts = [
        { id: '1', authorId: '1', body: 'Hello world' },
        { id: '2', authorId: '2', body: 'Hi, planet!' }
    ]

    fakePosts.forEach(post => POSTS.set(post.id, new Post(post)))
}

initializeData()

const rootValue = {
    posts: () => POSTS.values(),
    post: ({ id }) => POSTS.get(id),
    authors: () => PEOPLE.values(),
    author: ({ id }) => PEOPLE.get(id)
}

app.use('/graphql', graphqlHTTP({ schema, rootValue }))

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`))
