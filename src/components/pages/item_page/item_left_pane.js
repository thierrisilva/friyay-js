import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';
import classNames from 'classnames';
import IconBtn from '../../shared/icon_btn';
import { getCards } from 'Src/newRedux/database/cards/thunks';
import { getSortedFilteredCardsByTopic } from 'Src/newRedux/database/cards/selectors';

const getSanitized = body => DOMPurify.sanitize(body, { ADD_ATTR: ['target'] });

class ItemLeftPane extends Component {
  static propTypes = {
    handleRelatedItemClick: PropTypes.func,
    card: PropTypes.object,
    relatedCards: PropTypes.array.isRequired,
    getCards: PropTypes.func.isRequired
    // toggle: PropTypes.func.isRequired,
  };

  static defaultProps = {
    card: null,
    relatedCards: []
  };

  state = {
    isLoading: false
  };

  async componentDidMount() {
    const {
      props: { card, getCards }
    } = this;

    if (card !== null) {
      // TODO: exception in case of no topic
      const [topicId] = card.relationships.topics.data;
      if (topicId) {
        await getCards({ topicId: topicId });
      }
    }
    this.setState({ isLoading: false });
  }

  render() {
    const {
      props: {
        toggle,
        card,
        relatedCards,
        handleRelatedItemClick,
        onToggleRelatedItems
      },
      state: { isLoading }
    } = this;

    const type = card ? card.type : 'items';
    let itemsContent = null;

    if (isLoading) {
      itemsContent = (
        <a href="javascript:void(0)" className="list-group-item">
          <span className="list-group-item-text">
            Checking related cards...
          </span>
        </a>
      );
    } else if (relatedCards.length === 0) {
      itemsContent = (
        <a href="javascript:void(0)" className="list-group-item">
          <span className="list-group-item-text">No related cards found.</span>
        </a>
      );
    } else {
      itemsContent = relatedCards.map(item => {
        const {
          id,
          attributes: { title, body, slug }
        } = item;

        // TODO: Aren't ids always string?
        const itemClass = classNames({
          'list-group-item': true,
          active: parseInt(card.id) === parseInt(id)
        });

        return (
          <a
            href="javascript:void(0)"
            className={itemClass}
            key={`related-item-${id}`}
            onClick={() => handleRelatedItemClick(id, title, slug)}
          >
            <h4 className="list-group-item-heading">{title}</h4>
            <span
              className="list-group-item-text"
              dangerouslySetInnerHTML={{ __html: getSanitized(body) }}
            />
          </a>
        );
      });
    }

    return (
      <div className="list-group" id="related-items">
        <div className="list-group-item flex-r-center-spacebetween">
          <h4 className="list-group-item-heading">Related cards</h4>
          <IconBtn
            handleClick={onToggleRelatedItems}
            materialIcon="chevron_left"
          />
        </div>
        {itemsContent}
      </div>
    );
  }
}

const mapState = (state, props) => ({
  relatedCards:
    getSortedFilteredCardsByTopic(state)[
      props.card.relationships.topics.data[0]
    ] || []
});

const mapDispatch = {
  getCards
};

export default connect(
  mapState,
  mapDispatch
)(ItemLeftPane);
