import {GraphQLSchema} from 'graphql';
import {makeExecutableSchema, addMockFunctionsToSchema} from 'graphql-tools';
import * as Query from './root/query';
import * as Mutation from './root/mutation';
import * as Subscription from './root/subscription';
import * as User from './accounts/user.type';
import * as Message from './chat/message.type';
import * as Channel from './chat/channel.type';
import * as UserEvent from './chat/user-event.type';

const modules = [Query, Mutation, Subscription, User, Message, Channel, UserEvent];

// Creating an array of strings from the modules typeDef field
const typeDefs = modules.map(m => m.typeDef).filter(res => !!res);

// Creating a map of resolvers from the modules resolver field
const resolverCollection = modules.map(m => m.resolver).filter(res => !!res);
const resolvers = Object.assign({}, ...resolverCollection);

const logger = console;

const Schema: GraphQLSchema = makeExecutableSchema({
  logger,
  resolvers,
  typeDefs,
  resolverValidationOptions: {
    requireResolversForNonScalar: false,
  },
});

addMockFunctionsToSchema({
  mocks: {},
  preserveResolvers: true,
  schema: Schema,
});

export {Schema};
