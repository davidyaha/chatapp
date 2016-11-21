import * as AccountsQuery from '../accounts/accounts.queries';
import * as ChatQuery from '../chat/chat.queries';

export const typeDef = `
# Root Query
type Query {
    ${AccountsQuery.typeDef}
    
    ${ChatQuery.typeDef}
}
`;

export const resolver = {
  Query: Object.assign({},
    AccountsQuery.resolver,
    ChatQuery.resolver,
  ),
};
