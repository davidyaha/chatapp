import {idResolver} from '../common-resolvers';
import {IResolverContext} from '../../main';

export const typeDef = `
  type User {
    id: ID!
    name: String
    lastName: String
    username: String
    email: String
    avatar: String
    channels: [Channel]
  }
  
  input UserInput {
    username: String!
    name: String
    lastName: String
    email: String
  }
  
  type Token {
    token: String!
  }
`;

export const resolver = {
  User: {
    id: idResolver,
    channels(user, args, ctx: IResolverContext) {
      return ctx.channelModel.getChannelsByUser(user._id).take(1).toPromise();
    },
  },
};
