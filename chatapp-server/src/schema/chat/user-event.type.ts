import {idResolver, createdAtResolver} from '../common-resolvers';
import {IResolverContext} from '../../main';
export const typeDef = `
  type UserEvent {
    id: ID!
    createdAt: Float!
    user: User!
    eventKind: EventKinds!
  }
  
  enum EventKinds {
    DELIVERED
    SEEN
    STARTED_TYPING
    STOPPED_TYPING
    LOGGED_ON
    LOGGED_OFF
  }
`;

export const resolver = {
  UserEvent: {
    id: idResolver,
    createdAt: createdAtResolver,
    user(event, args, ctx: IResolverContext) {
      return ctx.userModel.getUserById(event.userId)
                .take(1).toPromise();
    },
  }
};
