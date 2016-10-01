import React, {Component, PropTypes} from 'react';
import {StyleSheet, Text, ListView, TouchableOpacity} from 'react-native';
import gql from 'graphql-tag';
import {graphql} from 'react-apollo';

// Presentational Component

class Conversations extends Component {
  static propTypes = {
    threads: PropTypes.arrayOf(PropTypes.object),
    onSelectThread: PropTypes.func,
  }
  
  static defaultProps = {
    onSelectThread: thread => console.log('Got no handler but thread was pressed with id', thread && thread.id),
  }
  
  constructor() {
    super();
    this.renderRow = this.renderRow.bind(this);
    
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  }
  
  renderRow(rowData) {
    return rowData && rowData.title && (
        <TouchableOpacity style={styles.row} onPress={() => this.props.onSelectThread(rowData)}>
          
          <Text style={[styles.largeText]}>
            {rowData.title}
          </Text>
          <Text style={[styles.smallText]}>
            {rowData.lastMessage}
          </Text>
        </TouchableOpacity>
      );
  }
  
  render() {
    return (
      <ListView dataSource={this.ds.cloneWithRows(this.props.threads)}
                renderRow={this.renderRow}
                enableEmptySections
      />
    
    );
  }
}

const styles = StyleSheet.create({
  row: {
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  largeText: {
    fontSize: 20,
  },
  smallText: {
    fontSize: 15,
  },
});

// Apollo Container

const THREADS_QUERY = gql`
  query threads {
    threads {
      _id
      title
      handle
      lastMessageTime
      lastMessage
    }
  }
`;

const ConversationsWithData = graphql(THREADS_QUERY, {
  props: ({data: {threads = []}}) => ({
    threads
  })
})(Conversations);

export default ConversationsWithData;
