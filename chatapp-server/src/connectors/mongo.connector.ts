import {MongoClient, Db} from 'mongodb';
import {Observable} from 'rxjs';

export const mongoConnector = new Observable(observer => {
  console.log('Trying to connect.');
  let dbRef: Db;
  
  MongoClient.connect('mongodb://localhost:27017/chat', (err, db) => {
    if (err) {
      observer.error(err);
    }
    
    if (db) {
      dbRef = db;
      observer.next(db);
      
      db.on('close', (err) => {
        observer.error(err || new Error('Socket closed unexpectedly'));
      });
      
      db.on('timeout', (err) => {
        observer.error(err || new Error('Socket timed out'));
      });
    }
    
  });
  
  return () => {
    dbRef && dbRef.close();
  }
}).retryWhen(error => error.delay(1000)).publishReplay().refCount();

mongoConnector.subscribe(
  () => console.log('Connected to mongo'),
  console.error.bind(console),
  () => console.log('Released connection to mongo')
);
