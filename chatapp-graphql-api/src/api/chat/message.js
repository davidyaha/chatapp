import User, {Users} from './user';
import Channel, {Channels} from './channel';

import {Observable} from 'rxjs/Observable';

// Schema

const userEvent = `
  type UserEvent {
    # The user binded to the event
    user: User!
    
    # Epoch time of event happening
    datetime: Float!
  }
`;

const messageFields = `
  # Unique identifier for the message 
  _id: ID!
  
  # Content of the message
  text: String!
  
  # epoch time when the message was created on the source machine
  createdAt: Float!
  
  # The user that sent the message
  user: User!
  
  # channel or thread where the message was sent on
  sentOn: Channel!
  
  # epoch time when the message was established at the server
  arrivedAt: Float
  
  # a list of user and time of delivery to their machine
  deliveredTo: [UserEvent]
  
  # a list of user and time of reading by the actual user 
  readBy: [UserEvent]
`;

const message = `
  # common message fields
  interface Message {
    ${messageFields}
  }
  
  # Basic message sent by some user on some channel
  type PlainMessage implements Message {
    ${messageFields}
  }
`;

const imageMessage = `
  # Same as message but with an image attached
  type ImageMessage implements Message {
    ${messageFields}
    image: String! 
  }
`;

const messageInputFields = `
  # Content of message
  text: String!
  
  # Epoch time of creation on device 
  createdAt: Float!
  
  # Channel id where the message was sent on
  sentOn: ID!
`;

const messageInput = `
  # Reduced message to be used as input
  input MessageInput {
    ${messageInputFields}
  }
  
  # Reduced image message to be used as input
  input ImageMessageInput {
    ${messageInputFields}
    image: String!
  }
`;

export default () => [message, imageMessage, messageInput, userEvent, User, Channel];

// Model

export class Messages {
  constructor({connector}) {
    this.messages = connector.map(db => db.collection('messages')).share();
    this.users = new Users({connector});
    this.channels = new Channels({connector});
  }
  
  getMessagesForHandle(channelId, viewer) {
    return this.channels.getChannelByHandleAndUser(channelId, viewer).flatMap(
      this.messages.flatMap(messages =>
        Observable.fromPromise(
          messages.find({sentOn: channelId}, {limit: 30}).toArray()
        )
      )
    )
  }
  
  addMessage(message, user) {
    return this.messages.flatMap(messages =>
      Observable.fromPromise(
        messages.insert({...message, user, arrivedAt: Date.now()})
      )
    ).map(result => result && result.ops && result.ops[0]);
  }
}
