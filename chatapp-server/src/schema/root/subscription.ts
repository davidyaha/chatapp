export const typeDef = `
# Root Subscription
type Subscription {
  messagesAtChannel(handle: ID!): [Message!]
}
`;

export const resolver = {
  Subscription: {
    messagesAtChannel(root) {
      return root;
    }
  },
};
