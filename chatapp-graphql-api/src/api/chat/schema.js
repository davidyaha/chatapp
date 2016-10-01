import Channel from './channel';
import Message from './message';

const schema = `
  type Query {
    me: User
    threads: [Channel!]
    messages(handle: ID!): [Message!]
  }
  
  type Mutation {
    sendMessage(message: MessageInput): Message
    joinChannel(handle: ID!): Channel
    createChannel(channel: ChannelInput!): Channel
    createUser(user: UserInput!): Token
    login(username: String!): Token
  }
  
  type Subscribe {
    messagesAtChannel(handle: ID!): [Message!]
  }
`;

export default [schema, Channel, Message];
