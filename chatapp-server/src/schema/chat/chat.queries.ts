import {IResolverContext} from '../../main';
export const typeDef = `
  # Get messages list of a channel
  messages(handle: ID!): [Message!]
`;

export const resolver = {
  messages(root, {handle}, ctx: IResolverContext) {
    return ctx.messageModel.getMessagesForHandle(handle).take(1).toPromise();
  },
};
