import {Observable} from 'rxjs';
import Channel from './channel';
import bcrypt from 'bcryptjs';
import {randomBytes} from 'crypto';

const user = `
  type User {
    _id: ID!
    name: String
    lastName: String
    email: String
    avatar: String
    threads: [Channel]!
  }
  
  input UserInput {
    username: String!
    name: String
    lastName: String
    email: String
  }
  
  type Token {
  
  
    userId: ID!
    token: String!
  }
`;

export default () => [user, Channel];

export class Users {
  constructor({ connector }) {
    this.users = connector.map(db => db.collection('users'));
  }
  
  getUserById(userId) {
    return this.users.flatMap(
      collection => Observable.fromPromise(
        collection.findOne({_id: userId})
      )
    );
  }
  
  getUserByAuthToken(authToken) {
    // bcrypt(authToken
    return this.users.flatMap(
      collection => Observable.fromPromise(
        collection.findOne({hashedToken: {$where: token => bcrypt.compare(authToken, token)}})
      )
    )
  }
  
  createUser(user) {
    return this.users.flatMap(
      collection => {
        const token = randomBytes(30);
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(token, salt);
        
        return Observable.fromPromise(
          collection.insertOne({...user, threads: [], hashedToken: hash})
        ).mapTo(token);
      }
    )
  }
  
  login(username) {
    return this.users.flatMap(
      collection => {
        const token = randomBytes(30);
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(token, salt);
        
        return Observable.fromPromise(
          collection.updateOne({username}, {hashedToken: {$set: hash}})
        ).mapTo(token);
      }
    )
  }
}
