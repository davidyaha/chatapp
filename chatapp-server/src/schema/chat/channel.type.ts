import {idResolver} from '../common-resolvers';

export const typeDef = `
  type Channel {
    id: ID!
    handle: String!
    title: String!
    description: String
    numberOfMembers: Int!
    members: [User!]
    lastMessageTime: Float
    lastMessage: String
    thumbnail: String
  }
  
  input ChannelInput {
    title: String!
    handle: String
    description: String
  }
`;

export const resolver = {
  Channel: {
    id: idResolver,
  },
};
