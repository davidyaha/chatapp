import {MongoClient} from 'mongodb';
import {Observable} from 'rxjs';

const dbConnection = new Observable(observer => {
  MongoClient.connect('mongodb://localhost:27017/chat', (err, db) => {
    
    if (err) {
      console.log(err);
      observer.error(err);
    }
    
    if (db) {
      observer.next(db);
      
      db.on('close', (err) => {
        console.log(err);
        observer.error(err || new Error('Socket closed unexpectedly'));
      });
      
      db.on('timeout', (err) => {
        console.log(err);
        observer.error(err || new Error('Socket timed out'));
      });
    }
    
    return () => {
      db.close();
    }
  });
}).publishReplay().refCount().retry();

dbConnection.subscribe(
  () => console.log('Connected to mongo'),
  () => console.log('Released connection to mongo')
);

export default dbConnection;
