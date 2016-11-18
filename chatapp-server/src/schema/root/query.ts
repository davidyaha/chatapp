export const typeDef = `
# Root Query
type Query {
    me: User
    channels: [Channel!]
    messages(handle: ID!): [Message!]
}
`;

export const resolver = {
  Query: {
    me(root, args, {user}) {
      console.log("here");
      
      const any = user.take(1).toPromise();
      any.then(u => console.log(u));
      return any;
    },
    messages(root, {handle}, {Messages, user}) {
      return Messages.getMessagesForHandle(handle, user).take(1).toPromise();
    },
    channels(root, args, {Channels, user}) {
      return Channels.getChannelsByUser(user).take(1).toPromise();
    },
  },
};
