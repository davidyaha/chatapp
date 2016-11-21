import {idResolver} from '../common-resolvers';
import {IResolverContext} from '../../main';

const messageFields = `
  # Unique identifier for the message 
  id: ID!
  
  # Content of the message
  text: String!
  
  # epoch time when the message was created on the source machine
  createdAt: Float!
  
  # The user that sent the message
  creator: User!
  
  # channel or thread where the message was sent on
  sentOn: Channel!
  
  # epoch time when the message was established at the server
  arrivedAt: Float
  
  # a list of user and time of delivery to their machine
  deliveredTo: [UserEvent]
  
  # a list of user and time of reading by the actual user 
  readBy: [UserEvent]
`;

const message = `
  # common message fields
  interface Message {
    ${messageFields}
  }
  
  # Basic message sent by some user on some channel
  type PlainMessage implements Message {
    ${messageFields}
  }
`;

const imageMessage = `
  # Same as message but with an image attached
  type ImageMessage implements Message {
    ${messageFields}
    image: String! 
  }
`;

const messageInputFields = `
  # Content of message
  text: String!
  
  # Epoch time of creation on device 
  createdAt: Float!
  
  # Channel id where the message was sent on
  sentOn: ID!
`;

const messageInput = `
  # Reduced message to be used as input
  input MessageInput {
    ${messageInputFields}
  }
  
  # Reduced image message to be used as input
  input ImageMessageInput {
    ${messageInputFields}
    image: String!
  }
`;

export const typeDef = `
  ${message}
  
  ${imageMessage}

  ${messageInput}
`;

const sharedMessageResolvers = {
  id: idResolver,
  creator(message, args, ctx: IResolverContext) {
    return ctx.userModel.getUserById(message.creatorId).take(1).toPromise();
  }
};

export const resolver = {
  Message: {
    __resolveType(message, ctx, info) {
      return message.imageUrl ? 'ImageMessage' : 'PlainMessage';
    },
  },
  PlainMessage: Object.assign({}, sharedMessageResolvers),
  ImageMessage: Object.assign({}, sharedMessageResolvers),
};
