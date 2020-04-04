import React from 'react';
import PropTypes from 'prop-types';
import createClass from 'create-react-class';

var ItemsPagination = createClass({
  propTypes: {
    current_page: PropTypes.number.isRequired,
    total_pages: PropTypes.number.isRequired,
    total_count: PropTypes.number.isRequired,
    onPaginationClick: PropTypes.func.isRequired
  },

  render: function() {
    var _this = this;

    var current_page = this.props.current_page;
    var total_pages  = this.props.total_pages;
    var total_count  = this.props.total_count;

    var windowSize = 4;

    var firstPage = '';
    if (current_page > 1) {
      firstPage = (
        <span className="first">
          <a href="javascript:void(0)" rel='first' onClick={function() { _this.props.onPaginationClick(1); }}>&laquo; First</a>
        </span>
      );
    }

    var previousPage = '';
    if (!(current_page - 1) <= 0) {
      previousPage = (
        <span className="previous">
          <a href="javascript:void(0)" rel='previous' onClick={function() { _this.props.onPaginationClick(current_page - 1); }}>&lsaquo; Prev</a>
        </span>
      );
    }

    var pageWindow = [];
    var i = current_page - windowSize;

    while(i < current_page) {
      if (i >= 1) {
        pageWindow.push(i);
      }
      i++;
    }

    pageWindow.push(current_page);

    i = current_page + 1;
    while((i <= (current_page + windowSize)) && (i <= total_pages)) {
      pageWindow.push(i);
      i++;
    }

    var leftEllipsis = '';
    if (current_page > windowSize + 1) {
      leftEllipsis = <span className="page gap">&hellip;</span>;
    }

    var currentWindow = [];

    pageWindow.map(function(page) {
      var link;
      if (current_page == page) {
        link = page;
      } else {
        link = <a href="javascript:void(0)" onClick={function() { _this.props.onPaginationClick(page); }}>{page}</a>;
      }

      currentWindow.push(
        <span className="page" key={'page-' + page}>
          {link}
          {' '}
        </span>
      );
    }, this);

    var nextPage = '';
    if (current_page + 1 <= total_pages) {
      nextPage = (
        <span className="next">
          <a href="javascript:void(0)" rel='next' onClick={function() { _this.props.onPaginationClick(current_page + 1); }}>Next &rsaquo;</a>
        </span>
      );
    }

    var lastPage = '';
    if (current_page != total_pages) {
      lastPage = (
        <span className="last">
          <a href="javascript:void(0)" rel='last' onClick={function() { _this.props.onPaginationClick(total_pages); }}>Last &raquo;</a>
        </span>
      );
    }

    var rightEllipsis = '';
    if (current_page + windowSize < total_pages) {
      rightEllipsis = <span className="page gap">&hellip;</span>;
    }

    return (
      <nav className="pagination">
        {firstPage}
        {' '}
        {previousPage}
        {' '}
        {leftEllipsis}
        {' '}
        {currentWindow}
        {' '}
        {rightEllipsis}
        {' '}
        {nextPage}
        {' '}
        {lastPage}
      </nav>
    );
  }
});

export default ItemsPagination;
