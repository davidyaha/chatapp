import User from './user';
import {Observable} from 'rxjs';

const channel = `
  type Channel {
    _id: ID!
    handle: String!
    title: String!
    description: String
    numberOfMembers: Int!
    members: [User!]
    lastMessageTime: Float
    lastMessage: String
  }
  
  input ChannelInput {
    title: String!
    handle: String
    description: String
  }
`;

export default () => [channel, User];

export class Channels {
  constructor({connector}) {
    this.channels = connector.map(db => db.collection('channels'));
  }
  
  getChannelByHandleAndUser(channelId, userId) {
    return this.channels.flatMap(collection =>
      Observable.fromPromise(
        collection.findOne({_id: channelId, members: userId})
      )
    );
  }
  
  getChannelsByUser(userId) {
    return this.channels.flatMap(collection =>
      Observable.fromPromise(
        collection.findOne({members: userId})
      )
    );
  }
  
  createChannel(channel) {
    return this.channels.flatMap(collection =>
      Observable.fromPromise(
        collection.insertOne({
          ...channel,
          handle: channel.handle || this.createHandleFromTitle(channel.title),
          members: []
        })
      )
      // Mapping insert result to the inserted document to return on query
      .map(result => result && result.ops && result.ops[0])
    )
  }
  
  addUserToChannel(channelId, userId) {
    return this.channels.flatMap(collection =>
      Observable.fromPromise(
        collection.updateOne({_id: channelId}, {members: {$push: userId}})
      )
    ).flatMap(
      Observable.fromPromise(
        collection.findOne({_id: channelId})
      )
    );
  }
  
  createHandleFromTitle(title) {
    return title.toLowerCase().split(' ').join('_');
  }
}
