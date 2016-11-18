import {Observable} from 'rxjs';
import {Collection} from 'mongodb';

export class MessageModel {
  constructor({connector}) {
    this.messages = connector.map(db => db.collection('messages'));
  }
  
  getMessagesForHandle(channelId) {
    return this.messages.flatMap(
      messages => Observable.fromPromise(
        messages.find({sentOn: channelId}, {limit: 30}).toArray()
      )
    )
  }
  
  addMessage(message, user) {
    return this.messages.flatMap(
      messages => Observable.fromPromise(
        messages.insert(Object.assign({}, message, {user, arrivedAt: Date.now()}))
      )
    ).map(result => result && result.ops && result.ops[0]);
  }
  
  private messages: Observable<Collection>;
}
