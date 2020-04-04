import PropTypes from 'prop-types';
import React from 'react';
import ReactModal from 'react-modal';
import { connect } from 'react-redux';

import IconButton from 'Src/components/shared/buttons/MaterialIconButton';
import Icon from 'Src/components/shared/Icon';
import LoadingIndicator from 'Src/components/shared/LoadingIndicator';
import { hideSearchModal, search } from 'Src/newRedux/database/search/thunks';
import { stateMappings } from 'Src/newRedux/stateMappings';
import SearchResultItem from './SearchResultItem';

class SearchModal extends React.Component {
  static propTypes = {
    cards: PropTypes.object,
    topics: PropTypes.object,
    search: PropTypes.func,
    searchResult: PropTypes.array,
    recentSearches: PropTypes.array,
    isModalShown: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool
  };

  constructor(props) {
    super(props);

    this.state = {
      query: ''
    };

    this.search = props.search;
    this.hideSearchModal = props.hideSearchModal;
  }

  componentDidMount = () => {
    ReactModal.setAppElement('#search_modal');
    this.setState({ query: '' });
  };

  /**
   * On closing the modal event handler.
   *
   * @param {Event} e
   * @return  {Void}
   */
  handleClickClose = e => {
    e.preventDefault();

    this.handleRequestClose();
  };

  /**
   * Handle request close event handler.
   *
   * @return  {Void}
   */
  handleRequestClose = () => {
    this.setState({
      query: ''
    });
    this.hideSearchModal();
  };

  /**
   * Handle change input query.
   *
   * @param {Event} e
   * @return  {Void}
   */
  handleChangeQ = e => {
    e.preventDefault();
    const { target } = e;
    const query = target.value;

    this.setState({
      query
    });

    // Prevent next action when user is typing
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      (async () => {
        try {
          await this.search(query);
        } catch (err) {
          console.error(err);
        }
      })();
    }, 500);
  };

  handleAfterOpen = () => {
    this.setState({ query: '' });
  };

  handleRecentClick = query => {
    this.setState({
      query
    });
    this.search(query);
  };

  /**
   * Render recent searches
   *
   * @return {DOM}
   */
  renderRecentSearch() {
    const { recentSearches } = this.props;
    return (
      <div>
        <div className="recent-search-title">Recent searches</div>
        {recentSearches.map((item, index) => (
          <div
            className={`recent-search-item`}
            key={`recent-search-${index}`}
            onClick={() => this.handleRecentClick(item)}
          >
            {item}
          </div>
        ))}
      </div>
    );
  }

  /**
   * Render search result
   *
   * @return {DOM}
   */
  renderSearchResult() {
    const { searchResult, cards, topics, isLoading } = this.props;

    if (isLoading) {
      return <LoadingIndicator />;
    }

    return searchResult.map(item => {
      const { attributes } = item;
      return attributes.label === 'Card' ? (
        <SearchResultItem
          resultItem={item}
          itemDetail={cards[item.id]}
          key={`${attributes.label}-${attributes.slug}`}
        />
      ) : (
        <SearchResultItem
          resultItem={item}
          itemDetail={topics[item.id]}
          key={`${attributes.label}-${attributes.slug}`}
        />
      );
    });
  }

  render() {
    const { query } = this.state;
    const { isModalShown } = this.props;

    return (
      <div id="search_modal">
        <ReactModal
          isOpen={isModalShown}
          contentLabel={'Search results'}
          shouldCloseOnOverlayClick
          className="search-result-modal"
          overlayClassName="search-result-modal-overlay"
          onRequestClose={this.handleRequestClose}
          onAfterOpen={this.handleAfterOpen}
        >
          <div>
            <div className="top-part">
              <div className="flex-pull-left">
                <form>
                  <div className="form-group">
                    <Icon icon="search" fontAwesome />
                    <input
                      type="text"
                      value={query}
                      className="search-field"
                      name="q"
                      placeholder="Search everything"
                      onChange={this.handleChangeQ}
                      autoFocus
                      autoComplete={'off'}
                    />
                  </div>
                </form>
              </div>
              <div className="flex-pull-right">
                <IconButton
                  icon={'close'}
                  fontAwesome
                  onClick={this.handleClickClose}
                />
              </div>
            </div>
            <div className="bottom-part">
              {query ? this.renderSearchResult() : this.renderRecentSearch()}
            </div>
          </div>
        </ReactModal>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const sm = stateMappings(state);
  return {
    isModalShown: sm.search.isModalShown,
    searchResult: sm.search.searchResult,
    recentSearches: sm.search.recentSearches,
    isLoading: sm.search.isLoading,
    cards: sm.cards,
    topics: sm.topics
  };
};

const mapDispatchToProps = {
  search,
  hideSearchModal
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchModal);
