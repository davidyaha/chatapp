import {IResolverContext} from '../../main';
export const typeDef = `
  createUser(user: UserInput!): Token
  login(username: String!): Token
`;

export const resolver = {
  createUser(root, {user}, ctx: IResolverContext) {
    return ctx.userModel.createUser(user).take(1).toPromise();
  },
  login(root, {username}, ctx: IResolverContext) {
    return ctx.userModel.login(username).take(1).toPromise();
  }
};
