import {Observable} from 'rxjs';
import {v4 as genUUID} from 'node-uuid';
import {Collection} from 'mongodb';

export class UserModel {
  
  constructor({connector}) {
    this.users = connector.map(db => db.collection('users'));
    this.createIndexes();
  }
  
  public getUserById(userId: string): Observable<any> {
    return this.getUserWithSelector({_id: userId});
  }
  
  public getUserByAuthToken(authToken: string): Observable<any> {
    return this.getUserWithSelector({authToken});
  }
  
  public createUser(user: Object): Observable<any> {
    return this.users.flatMap(modifyCollection);
    
    function modifyCollection(collection: Collection): Observable<any> {
      const token = genUUID();
      const doc = Object.assign({}, user, {threads: [], authToken: token});
      
      return Observable.fromPromise(collection.insertOne(doc))
                       .mapTo({token});
    }
  }
  
  public login(username: string): Observable<string> {
    return this.users.flatMap(modifyCollection);
    
    function modifyCollection(collection: Collection): Observable<any> {
      const token = genUUID();
      
      const selector = {username};
      const modifier = {$set: {authToken: token}};
      
      return Observable.fromPromise(collection.updateOne(selector, modifier))
                       .mapTo({token})
    }
  }
  
  private getUserWithSelector(selector: Object): Observable<any> {
    return this.users.flatMap(
      collection => Observable.fromPromise(
        collection.findOne(selector)
      )
    )
  }
  
  private createIndexes() {
    this.users.take(1).subscribe(runCommandOnCollection);
    
    function runCommandOnCollection(collection: Collection) {
      console.log('Creating indexes for users collection');
      
      const indexPromises = [
        collection.createIndex({username: 1}, {unique: true, sparse: true}),
        collection.createIndex({email: 1}, {unique: true, sparse: true}),
      ];
      
      Promise.all(indexPromises)
             .then(() => console.log('Successfully created indexes for users collection'))
             .catch(err => console.log('Could not create indexes because:', err));
    }
  }
  
  private users: Observable<Collection>;
}
