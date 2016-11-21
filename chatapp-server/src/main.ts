import * as express from 'express';
import * as bodyParser from 'body-parser';
import {graphqlExpress, graphiqlExpress, ExpressHandler} from 'graphql-server-express';
import * as cors from 'cors';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import {Schema} from './schema';
import {mongoConnector} from './connectors/mongo.connector';
import {MessageModel} from './chat/message.model';
import {ChannelModel} from './chat/channel.model';
import {UserModel} from './accounts/user.model';

// Default port or given one.
export const GRAPHQL_ROUTE = '/graphql';
export const GRAPHIQL_ROUTE = '/graphiql';

export interface IMainOptions {
  enableCors: boolean;
  enableGraphiql: boolean;
  env: string;
  port: number;
  verbose?: boolean;
}

export interface IResolverContext {
  user?: any;
  userModel: UserModel;
  messageModel: MessageModel;
  channelModel: ChannelModel;
}

/* istanbul ignore next: no need to test verbose print */
function verbosePrint(port, enableGraphiql) {
  console.log(`GraphQL Server is now running on http://localhost:${port}${GRAPHQL_ROUTE}`);
  if (true === enableGraphiql) {
    console.log(`GraphiQL Server is now running on http://localhost:${port}${GRAPHIQL_ROUTE}`);
  }
}

const connector = mongoConnector;
const users = new UserModel({connector});
const context: IResolverContext = {
  userModel: users,
  messageModel: new MessageModel({connector}),
  channelModel: new ChannelModel({connector}),
};

function createGraphQLMiddleware(): ExpressHandler {
  return graphqlExpress(req => {
    
    const authToken = req.headers['authorization'];
    
    if (authToken) {
      console.log('Getting user for auth token', authToken);
      
      const observable = users.getUserByAuthToken(authToken).map(user => ({
        schema: Schema,
        context: Object.assign(context, {user}),
      }));
      
      return observable.take(1).toPromise();
    }
    
    return {
      schema: Schema,
      context
    };
  });
}

export function main(options: IMainOptions) {
  let app = express();
  
  app.use(helmet());
  
  app.use(morgan(options.env));
  
  if (true === options.enableCors) {
    app.use(GRAPHQL_ROUTE, cors());
  }
  
  app.use(GRAPHQL_ROUTE, bodyParser.json(), createGraphQLMiddleware());
  
  if (true === options.enableGraphiql) {
    const grpahiqlOptions = {endpointURL: GRAPHQL_ROUTE};
    app.use(GRAPHIQL_ROUTE, graphiqlExpress(grpahiqlOptions));
  }
  
  return new Promise((resolve, reject) => {
    let server = app.listen(options.port, () => {
      /* istanbul ignore if: no need to test verbose print */
      if (options.verbose) {
        verbosePrint(options.port, options.enableGraphiql);
      }
      
      resolve(server);
    }).on('error', (err: Error) => {
      reject(err);
    });
  });
}

/* istanbul ignore if: main scope */
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  // Either to export GraphiQL (Debug Interface) or not.
  const NODE_ENV = process.env.NODE_ENV !== 'production' ? 'dev' : 'production';
  const EXPORT_GRAPHIQL = NODE_ENV !== 'production';
  // Enable cors (cross-origin HTTP request) or not.
  const ENABLE_CORS = NODE_ENV !== 'production';
  
  main({
    enableCors: ENABLE_CORS,
    enableGraphiql: EXPORT_GRAPHIQL,
    env: NODE_ENV,
    port: PORT,
    verbose: true,
  });
}
