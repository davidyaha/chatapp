import {Observable} from 'rxjs';
import {Collection} from 'mongodb';
import {extractInsertResult} from '../connectors/mongo-utils';

export class ChannelModel {
  constructor({connector}) {
    this.channels = connector.map(db => db.collection('channels'));
  }
  
  getChannelByHandleAndUser(channelId: string, userId: string): Observable<any> {
    return this.channels.flatMap(
      collection =>
        Observable.fromPromise(
          collection.findOne({_id: channelId, members: userId})
        )
    );
  }
  
  getChannelById(channelId: string): Observable<any> {
    return this.channels.flatMap(
      collection =>
        Observable.fromPromise(
          collection.findOne({_id: channelId})
        )
    );
  }
  
  getChannelsByUser(userId: string) {
    return this.channels.flatMap(
      collection =>
        Observable.fromPromise(
          collection.findOne({members: userId})
        )
    );
  }
  
  createChannel(channel) {
    function modifyCollection(collection: Collection): Observable<any> {
      const doc = Object.assign({}, channel, {
        handle: channel.handle || this.createHandleFromTitle(channel.title),
        members: []
      });
      
      return Observable.fromPromise(collection.insertOne(doc));
    }
    
    return this.channels
               .flatMap(modifyCollection)
               .flatMap(extractInsertResult);
  }
  
  addUserToChannel(channelId, userId) {
    function modifyCollection(collection: Collection): Observable<any> {
      const selector = {_id: channelId};
      const modifier = {members: {$push: userId}};
      
      return Observable.fromPromise(collection.updateOne(selector, modifier));
    }
    
    return this.channels
               .flatMap(modifyCollection)
               .flatMap(() => this.getChannelById(channelId));
  }
  
  createHandleFromTitle(title) {
    return title.toLowerCase().split(' ').join('_');
  }
  
  private channels: Observable<Collection>;
}
