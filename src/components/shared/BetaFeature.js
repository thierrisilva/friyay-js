import React, { Component } from 'react';
import PropTypes from 'prop-types';

// **************************************************************
// BetaFeatures may require work outside of TipHive
// For instance, DropBox integration currently rquires each
// subdomain to have their own OAuth callback.
// **************************************************************

class BetaFeature extends Component {
  constructor(props) {
    super(props);

    this.state = {
      betaTenants: [],
    };

    this.renderChildren = this.renderChildren.bind(this);
    this.buildBetaList  = this.buildBetaList.bind(this);
  }

  componentDidMount() {
    // DomainFormPageStore.addEventListener(window.DOMAINS_LOAD_EVENT, this.buildBetaList);
  }

  componentWillUnmount() {
    // DomainFormPageStore.removeEventListener(window.DOMAINS_LOAD_EVENT, this.buildBetaList);
  }

  buildBetaList() {
    const { featureName } = this.props;

    let tenant_list = [
      'tiphiveteam',
      'bagels',
      'starkrfid',
      'bandwagon',
      'ahreclemson',
      'zipit',
      'k2g',
      'ayogo',
      'kiyatec',
      'sparksresearch',
      'portnexus',
      'mtn',
      'ccl',
      'eastsidepres',
      'triangleconstruction',
      'papamurphys',
      'cebi',
      'simplifuldesign',
      'enveritas-group',
      'monaview-health-fair',
      'fireforge',
      'dealer10x',
      'bigelfgames',
      'sunsetvacations'
    ];

    let csv_tenant_list = [
      'tiphiveteam',
    ];

    if (featureName === 'csvFeature') {
      tenant_list = csv_tenant_list;
    }

    // this.setState({
    //   betaTenants: tenant_list
    // });

    return tenant_list;
  }

  renderChildren() {
    // all beta features are available when in development mode
    if (window.APP_ENV === 'development') {
      return this.props.children;
    }

    let { currentDomain } = window;

    if (!currentDomain) return;

    let tenant_list = this.buildBetaList();

    const currentTenant = window.currentDomain.attributes.tenant_name || 'public';

    if (tenant_list.includes(currentTenant)) {
      return this.props.children;
    } else {
      return '';
    }
  }

  render() {
    return (
      <div>
        {this.renderChildren()}
      </div>
    );
  }
}

BetaFeature.propTypes = {
  children: PropTypes.object,
  featureName: PropTypes.string
};

export default BetaFeature;
