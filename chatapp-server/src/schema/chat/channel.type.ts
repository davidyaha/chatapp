import {idResolver} from '../common-resolvers';
import {IResolverContext} from '../../main';

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
    members(channel, args, ctx: IResolverContext) {
      return channel.members
                    .map(memberId => ctx.userModel.getUserById(memberId).take(1).toPromise());
    },
    numberOfMembers(channel) {
      return channel.members.length;
    },
  },
};
