import classNames from 'classnames';
import createClass from 'create-react-class';
import React from 'react';

var ItemContentSlacklinks = createClass({
  getDefaultProps: function() {
    return {
      item: null,
      slacklinks: []
    };
  },

  render: function() {
    var item       = this.props.item;
    var slacklinks = this.props.slacklinks;

    var slacklinkItems = [];
    for (var i = 0; i < slacklinks.length; i++) {
      var slacklink = slacklinks[i];

      if (slacklink.messages == '') { continue; }

      var slacklinkClass = classNames('item', {active: i == 0});

      var slacklinkContent =
        <div className={slacklinkClass} key={item.type + '-slacklink-' + slacklink.id}
          dangerouslySetInnerHTML={{__html: slacklink.messages}}></div>;

      slacklinkItems.push(slacklinkContent);
    }

    return (
      <div className="slack-messages">
        {slacklinkItems}
      </div>
    );
  }
});

export default ItemContentSlacklinks;
