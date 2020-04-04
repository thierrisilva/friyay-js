import React from 'react';
import createClass from 'create-react-class';

// this is acting as a pure HTML template, no event handling should be here
var SearchPending = createClass({
  render: function() {
    var search = this.props.search;

    return (
      <div className="tt-suggestion">
        <a href="javascript:void(0)">
          Searching for <span className="search-query"><em>{search.query}</em></span> <img src="/images/ajax-loader.gif" />
        </a>
      </div>
    );
  }
});

export default SearchPending;
