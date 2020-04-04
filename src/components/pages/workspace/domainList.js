import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ListItem from './listItem';
import { getDomains } from 'Src/newRedux/database/domains/selectors';
import DomainFormPage from '../domain_form_page';
import { dragItemTypes } from 'Src/components/shared/drag_and_drop/_index';

export const generateUrl = domain => {
  const baseUrl =
    window.APP_ENV === 'development'
      ? `${window.APP_DOMAIN}:5000`
      : `${window.APP_DOMAIN}`;

  return `//${domain.attributes.tenant_name}.${baseUrl}`;
};

class DomainList extends Component {
  state = {
    isFormOpen: false
  };

  toggleForm = () => {
    this.setState({ isFormOpen: !this.state.toggleForm });
  };
  render() {
    const { domains, onSelectDomain, selectedDomain } = this.props;
    return (
      <Fragment>
        {(domains || []).map(domain => (
          <ListItem
            key={domain.id}
            text={domain.attributes.name}
            onExpand={() => onSelectDomain(domain)}
            selected={selectedDomain && domain.id === selectedDomain.id}
            url={generateUrl(domain)}
            item={domain}
            itemType={dragItemTypes.DOMAIN}
            dragDisabled
            domain={domain}
          />
        ))}
        <div className="add-item-btn" onClick={this.toggleForm}>
          +Add Workspace
        </div>
        {this.state.isFormOpen && <DomainFormPage onClose={this.toggleForm} />}
      </Fragment>
    );
  }
}

DomainList.propTypes = {
  domains: PropTypes.array,
  selectedDomain: PropTypes.object,
  onSelectDomain: PropTypes.func
};

const mapState = state => ({
  domains: getDomains(state)
});

export default connect(
  mapState,
  {}
)(DomainList);
