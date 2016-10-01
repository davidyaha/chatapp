import express from 'express';
import bodyParser from 'body-parser';
import {apolloExpress, graphiqlExpress} from 'apollo-server';
import {makeExecutableSchema, addMockFunctionsToSchema} from 'graphql-tools';

import typeDefs from './api/chat/schema';
import resolvers  from './api/chat/resolvers';

import {Users} from './api/chat/user';
import {Messages} from './api/chat/message';
import {Channels} from './api/chat/channel';
import connector from './api/chat/connector';

const PORT = 3000;
const app = express();

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  resolverValidationOptions: {
    requireResolversForNonScalar: false
  },
});

app.use('/graphql', bodyParser.json(),
  apolloExpress(req => {
    const users = new Users({connector});
    
    let user;
    const authToken = req.headers['authorization'];
    console.log('getting user for auth token', authToken);
    if (authToken) {
      user = users.getUserByAuthToken(authToken);
    }
    
    return {
      schema,
      context: {
        user,
        Users: users,
        Messages: new Messages({connector}),
        Channels: new Channels({connector}),
      }
    };
  }
));

app.use('/graphiql', graphiqlExpress({endpointURL: '/graphql'}));

app.listen(PORT);
