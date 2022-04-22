const express = require('express');
const morgan = require('morgan');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');

const graphQLSchema = require('./graphql/schema');
const graphQLResolvers = require('./graphql/resolvers');
const isAuth = require('./middlewares/is-auth');

const app = new express();

app.use(morgan('combined'));
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
});

app.use(isAuth);

app.use(
    '/graphql',
    graphqlHTTP({
        schema: graphQLSchema,
        rootValue: graphQLResolvers,
        graphiql: true,
    }),
);

// app.use("/", (req, res, next) => {
//   res.send("Hello aaa");
//   next();
// });

mongoose
    .connect('mongodb://localhost:27017/event-booking?retryWrites=true')
    .then(() => {
        app.listen('8000');
    })
    .catch((err) => {
        console.log(err);
    });
