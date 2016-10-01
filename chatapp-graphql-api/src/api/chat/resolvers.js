export default {
  Query: {
    me(root, args, {user}) {
      console.log("here");
  
      const any = user.take(1).toPromise();
      any.then(u => console.log(u));
      return any;
    },
    messages(root, { handle }, { Messages, user }) {
      return Messages.getMessagesForHandle(handle, user).take(1).toPromise();
    },
    threads(root, args, {Channels, user}) {
      return Channels.getChannelsByUser(user).take(1).toPromise();
    },
  },
  Mutation: {
    sendMessage(root, { message }, { Messages, user }) {
      return Messages.addMessage(message, user).take(1).toPromise();
    },
    joinChannel(root, { handle }, { Channels, user }) {
      return Channels.addUserToChannel(handle, user).take(1).toPromise();
    },
    createChannel(root, { channel }, { Channels, user }) {
      return Channels.createChannel(channel).take(1).toPromise();
    },
    createUser(root, { user }, { Users }) {
      return Users.createUser(user).take(1).toPromise();
    },
    login(root, { username }, { Users }) {
      return Users.login(username).take(1).toPromise();
    }
  },
  Subscribe: {
    messagesAtChannel(root) {
      return root;
    }
  }
};
