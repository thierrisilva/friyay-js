import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Icon from 'Src/components/shared/Icon';
import LoadingIndicator from 'Src/components/shared/LoadingIndicator';
import { getCard, viewCard } from 'Src/newRedux/database/cards/thunks';
import { viewPerson } from 'Src/newRedux/database/people/thunks';
import { hideSearchModal } from 'Src/newRedux/database/search/thunks';
import { viewTopic } from 'Src/newRedux/database/topics/thunks';

class SearchResultItem extends React.Component {
  static propTypes = {
    viewCard: PropTypes.func.isRequired,
    viewTopic: PropTypes.func.isRequired,
    viewPerson: PropTypes.func.isRequired,
    resultItem: PropTypes.object.isRequired,
    itemDetail: PropTypes.object,
    hideSearchModal: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      isExpanded: false
    };

    this.viewCard = props.viewCard;
    this.viewTopic = props.viewTopic;
    this.viewPerson = props.viewPerson;
    this.hideSearchModal = props.hideSearchModal;
    this.getCard = props.getCard;
  }

  /**
   * On click expand icon event handler.
   *
   * @param {Event} e
   * @return  {Void}
   */
  handleClickExpand = e => {
    e.preventDefault();
    const { isExpanded } = this.state;
    const { itemDetail, resultItem } = this.props;

    if (!itemDetail) {
      (async () => {
        try {
          await this.getCard(resultItem.id);
        } catch (ex) {
          console.error(ex);
        }
      })();
    }

    this.setState({
      isExpanded: !isExpanded
    });
  };

  /**
   * On click result name event handler
   *
   * @param {Event} e
   * @return  {Void}
   */
  handleClickName = e => {
    e.preventDefault();

    const { resultItem } = this.props;

    this.hideSearchModal();

    if (resultItem.attributes.label === 'Card') {
      this.viewCard({
        cardId: resultItem.id,
        cardSlug: resultItem.attributes.slug
      });
    } else if (
      resultItem.attributes.label === 'SubTopic' ||
      resultItem.attributes.label === 'Topic'
    ) {
      this.viewTopic({
        topicId: resultItem.id,
        topicSlug: resultItem.attributes.slug
      });
    } else if (resultItem.attributes.label === 'Member') {
      this.viewPerson(resultItem.id);
    }
  };

  /**
   * Build path string.
   *
   * @param {[String]} paths
   * @return  {String}
   */
  buildPath = paths => {
    // It is 2 dimensional arrays.
    return paths[0] ? paths[0].join('/') : '/';
  };

  /**
   * Render the search result expandable panel, the card body, show loading animation until get the detail.
   *
   * @return  {DOM}
   */
  renderCardBodyPanel = () => {
    const { itemDetail } = this.props;
    const { isExpanded } = this.state;

    return !itemDetail ? (
      isExpanded && <LoadingIndicator />
    ) : (
      <div
        className={`card-body ${!isExpanded && 'hidden'}`}
        dangerouslySetInnerHTML={{ __html: itemDetail.attributes.body }}
      />
    );
  };

  render() {
    const { resultItem } = this.props;
    const { isExpanded } = this.state;
    const { attributes } = resultItem;

    let searchResultLabel = attributes.label;
    if (searchResultLabel !== 'Card') searchResultLabel = 'yay';

    return (
      <div
        className="search-result-item"
        key={`${attributes.label}-${attributes.slug}`}
      >
        <span className="search-result-label">{searchResultLabel}</span>
        <span className="search-result-name">
          {attributes.label === 'Card' && (
            <a onClick={this.handleClickExpand}>
              <Icon
                icon={isExpanded ? 'angle-double-down' : 'angle-double-right'}
                fontAwesome
              />
            </a>
          )}
          {<a onClick={this.handleClickName}>{attributes.name}</a>}
        </span>
        {(attributes.label === 'Card' ||
          attributes.label === 'Topic' ||
          attributes.label === 'SubTopic') && (
          <span className="search-result-path">
            {this.buildPath(attributes.topic_paths)}
          </span>
        )}
        {attributes.label === 'Card' && this.renderCardBodyPanel()}
      </div>
    );
  }
}

const mapDispatchToProps = {
  viewCard,
  viewTopic,
  viewPerson,
  hideSearchModal,
  getCard
};

export default connect(
  undefined,
  mapDispatchToProps
)(SearchResultItem);
