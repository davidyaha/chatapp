import {Observable} from 'rxjs';
import {Collection, ObjectID} from 'mongodb';
import {extractInsertResult} from '../connectors/mongo-utils';

export class ChannelModel {
  constructor({connector}) {
    this.channels = connector.map(db => db.collection('channels'));
  }
  
  public getChannelByHandleAndUser(channelId: string, userId: string): Observable<any> {
    return this.getOneChannel({_id: new ObjectID(channelId), members: userId});
  }
  
  public getChannelById(channelId: string): Observable<any> {
    return this.getOneChannel({_id: new ObjectID(channelId)});
  }
  
  public getChannelsByUser(userId: string, skip = 0, limit = 30) {
    return this.channels.flatMap(
      collection =>
        Observable.fromPromise(
          collection.find({members: userId}).skip(0).limit(limit).toArray()
        )
    );
  }
  
  public createChannel(channel: any, userId: string): Observable<any> {
    return this.channels
               .flatMap(modifyCollection.bind(this))
               .map(extractInsertResult);
    
    function modifyCollection(collection: Collection): Observable<any> {
      const doc = Object.assign({},
        channel,
        {
          handle: channel.handle || this.createHandleFromTitle(channel.title),
          members: [userId],
        }
      );
  
      return Observable.fromPromise(collection.insertOne(doc));
    }
  }
  
  public addUserToChannel(channelId, userId) {
    return this.channels
               .flatMap(modifyCollection)
               .flatMap(() => this.getChannelById(channelId));
    
    function modifyCollection(collection: Collection): Observable<any> {
      const selector = {_id: new ObjectID(channelId)};
      const modifier = {$addToSet: {members: userId}};
  
      return Observable.fromPromise(collection.updateOne(selector, modifier));
    }
  }
  
  private getOneChannel(selector): Observable<any> {
    return this.channels.flatMap(getFromCollection);
  
    function getFromCollection(collection: Collection): Observable<any> {
      return Observable.fromPromise(collection.find(selector).limit(1).next())
    }
  }
  
  private createHandleFromTitle(title) {
    return title.toLowerCase().split(' ').join('_');
  }
  
  private channels: Observable<Collection>;
}
