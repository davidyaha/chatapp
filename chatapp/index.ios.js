/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {View, StyleSheet, AppRegistry,} from 'react-native';
import ApolloClient, {createNetworkInterface} from 'apollo-client';
import {ApolloProvider} from  'react-apollo';

import {Conversations, Conversation} from 'chatapp-chat';


var networkInterface = createNetworkInterface({
  uri: 'http://localhost:3000/graphql'
});
const client = new ApolloClient({networkInterface});

class chatapp extends Component {
  constructor() {
    super();
    this.state = {};
  }
  
  render() {
    return (
      <ApolloProvider client={client}>
        <View style={[styles.fullScreen, styles.statusBarMargin, ]}>
          {
            !this.state.showingThread ?
              <Conversations onSelectThread={thread => this.setState({showingThread: thread.handle}) }/>
            : <Conversation conversationHandle={this.state.showingThread}/>
          }
        </View>
      </ApolloProvider>
    );
  }
}
const styles = StyleSheet.create({
  statusBarMargin: {
    marginTop: 20,
  },
  fullScreen: {
    flex: 1,
  }
});

AppRegistry.registerComponent('chatapp', () => chatapp);
