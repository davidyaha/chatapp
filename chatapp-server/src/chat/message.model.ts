import {Observable} from 'rxjs';
import {Collection, InsertOneWriteOpResult} from 'mongodb';
import {extractInsertResult} from '../connectors/mongo-utils';

export class MessageModel {
  constructor({connector}) {
    this.messages = connector.map(db => db.collection('messages'));
  }
  
  getMessagesForHandle(channelId, skip = 0, limit = 30) {
    return this.messages.flatMap(
      messages => Observable.fromPromise(
        messages.find({sentOn: channelId}, {skip, limit,}).toArray()
      )
    )
  }
  
  addMessage(message, user) {
    return this.messages
               .flatMap(modifyCollection)
               .map(extractInsertResult);
    
    function modifyCollection(collection: Collection): Observable<InsertOneWriteOpResult> {
      const doc = Object.assign({},
        message,
        {
          creatorId: user._id,
          arrivedAt: Date.now(),
        }
      );
      return Observable.fromPromise(collection.insertOne(doc));
    }
    
  }
  
  private messages: Observable<Collection>;
}
