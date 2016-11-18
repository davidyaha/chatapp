import {Observable} from 'rxjs';
import {randomBytes} from 'crypto';
import {Collection} from 'mongodb';

export class UserModel {
  
  constructor({connector}) {
    this.users = connector.map(db => db.collection('users'));
  }
  
  getUserById(userId) {
    return this.users.flatMap(
      collection => Observable.fromPromise(
        collection.findOne({_id: userId})
      )
    );
  }
  
  getUserByAuthToken(authToken: string): Observable<any> {
    return this.users.flatMap(
      collection => Observable.fromPromise(
        collection.findOne({authToken})
      )
    )
  }
  
  createUser(user: Object): Observable<any> {
    return this.users.flatMap(
      collection => {
        const token = randomBytes(30).toString();
        
        return Observable.fromPromise(
          collection.insertOne(Object.assign({}, user, {threads: [], authToken: token}))
        ).mapTo(token);
      }
    );
  }
  
  login(username: string): Observable<string> {
    return this.users.flatMap(
      collection => {
        const token = randomBytes(30).toString();
        
        return Observable.fromPromise(
          collection.updateOne({username}, {authToken: {$set: token}})
        ).mapTo(token);
      }
    )
  }
  
  private users: Observable<Collection>;
}
