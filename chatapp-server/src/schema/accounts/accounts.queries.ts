export const typeDef = `
  me: User
`;

export const resolver = {
  me(root, args, {user}) {
    return user;
  },
};
