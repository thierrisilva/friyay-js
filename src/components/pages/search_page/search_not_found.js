import React from 'react';
import createClass from 'create-react-class';

// this is acting as a pure HTML template, no event handling should be here
var SearchNotFound = createClass({
  render: function() {
    var search = this.props.search;

    return (
      <div className="tt-suggestion">
        <a href="javascript:void(0)">
          Found no result for <span className="search-query"><em>{search.query}</em></span>
        </a>
      </div>
    );
  }
});

export default SearchNotFound;
