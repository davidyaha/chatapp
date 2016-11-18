import {idResolver} from '../common-resolvers';

export const typeDef = `
  type User {
    id: ID!
    name: String
    lastName: String
    email: String
    avatar: String
    threads: [Channel]!
  }
  
  input UserInput {
    username: String!
    name: String
    lastName: String
    email: String
  }
  
  type Token {
    userId: ID!
    token: String!
  }
`;

export const resolver = {
  User: {
    id: idResolver,
  },
};
