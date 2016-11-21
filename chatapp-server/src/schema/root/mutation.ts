import * as AccountsMutations from '../accounts/accounts.mutations';
import * as ChatMutations from '../chat/chat.mutations';

export const typeDef = `
# Root Mutation
type Mutation {
  ${ChatMutations.typeDef}
  
  ${AccountsMutations.typeDef}
}
`;

export const resolver = {
  Mutation: Object.assign({},
    ChatMutations.resolver,
    AccountsMutations.resolver,
  ),
};
