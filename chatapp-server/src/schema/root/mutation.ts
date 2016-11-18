export const typeDef = `
# Root Mutation
type Mutation {
  sendMessage(message: MessageInput): Message
  joinChannel(handle: ID!): Channel
  createChannel(channel: ChannelInput!): Channel
  createUser(user: UserInput!): Token
  login(username: String!): Token
}
`;

export const resolver = {
  Mutation: {
    sendMessage(root, {message}, {Messages, user}) {
      return Messages.addMessage(message, user).take(1).toPromise();
    },
    joinChannel(root, {handle}, {Channels, user}) {
      return Channels.addUserToChannel(handle, user).take(1).toPromise();
    },
    createChannel(root, {channel}, {Channels, user}) {
      return Channels.createChannel(channel).take(1).toPromise();
    },
    createUser(root, {user}, {Users}) {
      return Users.createUser(user).take(1).toPromise();
    },
    login(root, {username}, {Users}) {
      return Users.login(username).take(1).toPromise();
    }
  },
};
