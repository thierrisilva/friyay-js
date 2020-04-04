import React from 'react';
import createClass from 'create-react-class';
import DocumentsList from './documents_list';

var ItemContentDocuments = createClass({
  getDefaultProps: function() {
    return {
      item: null,
      documents: [],
      isGrid: false
    };
  },

  render: function() {
    var item   = this.props.item;
    var documents = this.props.documents;

    return (
      <DocumentsList item={item} documents={documents} isGrid={this.props.isGrid} />
    );
  }
});

export default ItemContentDocuments;
