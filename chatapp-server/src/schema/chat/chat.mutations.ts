import {IResolverContext} from '../../main';
export const typeDef = `
  # Create a channel
  createChannel(channel: ChannelInput!): Channel
  
  # Join a channel with the given id
  joinChannel(handle: ID!): Channel
  
  # Send a text message on a specific channel
  sendMessage(message: MessageInput): Message
`;

export const resolver = {
  createChannel(root, {channel}, ctx: IResolverContext) {
    return ctx.channelModel.createChannel(channel, ctx.user._id).take(1).toPromise();
  },
  joinChannel(root, {handle}, ctx: IResolverContext) {
    return ctx.channelModel.addUserToChannel(handle, ctx.user._id).take(1).toPromise();
  },
  sendMessage(root, {message}, ctx: IResolverContext) {
    return ctx.messageModel.addMessage(message, ctx.user).take(1).toPromise();
  },
};
