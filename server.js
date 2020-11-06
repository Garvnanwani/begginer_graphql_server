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
        hello: String
    }
`)

const rootValue = {
    hello: () => 'Hello, world'
}

app.use('/graphql', graphqlHTTP({ schema, rootValue }))

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`))
