import React, {Component, PropTypes} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import gql from 'graphql-tag';
import {graphql} from 'react-apollo';

// Presentational Component

class Conversation extends Component {
  static propTypes = {
    conversationHandle: PropTypes.string.isRequired,
    errorHandler: PropTypes.func,
  }
  
  render() {
    return (
      <GiftedChat {...this.props}/>
    );
  }
}

// Apollo Container

const SEND_MESSAGE_MUTATION = gql`
  mutation sendMessage($message: MessageInput!) {
    sendMessage(message: $message) {
      _id
      text
      createdAt
      arrivedAt
      user {
        _id
        name
        avatar
      }
      sentOn {
        handle
      }
    }
  }
`;

const ConversationWithMutation = graphql(SEND_MESSAGE_MUTATION, {
  props: ({ownProps, mutate}) => ({
    onSend: messages => {
      const message = messages[0];
      const dateTime = message.createdAt.getTime();
      const variables = {
        message: {
          text: message.text,
          createdAt: dateTime,
          channelHandle: ownProps.conversationHandle,
        },
      };
  
      const optimisticResponse = {
        __typename: 'Mutation',
        sendMessage: {
          __typename: 'Message',
          _id: message._id || 'tempId' + dateTime,
          text: message.text,
          createdAt: dateTime,
          arrivedAt: dateTime + 1,
          user: {
            __typename: 'User',
            _id: ownProps.user._id,
            name: ownProps.user.name,
            avatar: ownProps.user.avatar,
          },
          sentOn: {
            __typename: 'Channel',
            handle: ownProps.conversationHandle,
          }
        },
      };
      
      const updateQueries = {
        messages: (prev, {mutationResult}) => {
          const newMessage = mutationResult.data.sendMessage;
          return {
            ...prev,
            messages: [newMessage, ...prev.messages],
          };
        }
      };
      
      return mutate({ variables, optimisticResponse, updateQueries, });
    }
  }),
})(Conversation);

const MESSAGES_QUERY = gql`
  query messages($conversationHandle: ID!) {
    messages(handle: $conversationHandle) {
      _id
      text
      createdAt
      user {
        _id
        name
        avatar
      }
      sentOn {
        handle
      }
    }
    me {
      _id
      name
      avatar
    }
  }
`;

const ConversationWithMutationAndData = graphql(MESSAGES_QUERY, {
  options: ({conversationHandle}) => ({variables: {conversationHandle}}),
  
  props: (ownProps, {data: {loading, messages, me, error}}) => {
    if (error && ownProps.errorHandler) ownProps.errorHandler(error);
    
    const transformedMessages = messages &&
      messages.map(message => ({
          ...message,
          createdAt: new Date(message.createdAt),
        })
      );
    
    return {
      isLoadingEarlier: loading,
      messages: transformedMessages || [],
      user: {
        _id: me && me._id || '1',
        name: me && me.name,
        avatar: me && me.avatar,
      }
    };
  },
})(ConversationWithMutation);

export default ConversationWithMutationAndData;
