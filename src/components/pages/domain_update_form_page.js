import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DomainFormPageActions from '../../actions/domain_form_page_actions';
import { connect } from 'react-redux';
import DomainFormPageStore from '../../stores/domain_form_page_store';
import PageModal from './page_modal';
import DomainTabContent from './domain_form_page/domain_tab_content';
import analytics from 'Src/lib/analytics';
import tiphive from 'Src/lib/tiphive';
import { getThisDomain } from 'Src/lib/utilities';
import { getDomains } from 'Src/newRedux/database/domains/selectors';
import {
  archiveDomain,
  deleteDomain
} from "Src/newRedux/database/domains/thunks";
import { setEditDomainModalOpen } from 'Src/newRedux/interface/modals/actions';
import { updateDomain } from 'Src/newRedux/database/domains/actions';

class DomainUpdateFormPage extends Component {
  static propTypes = {
    setEditDomainModalOpen: PropTypes.func.isRequired,
    archiveDomain: PropTypes.func,
    deleteDomain: PropTypes.func,
    currentDomain: PropTypes.object,
    updateDomain: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.archiveDomain = props.archiveDomain;
    this.deleteDomain = props.deleteDomain;
    this.updateDomain = props.updateDomain;
    this.state = {
      currentDomain: window.currentDomain
    };
  }

  componentDidMount() {
    DomainFormPageStore.addEventListener(window.DOMAIN_UPDATE_EVENT, this.onDomainUpdate);
  }

  componentWillUnmount() {
    DomainFormPageStore.removeEventListener(window.DOMAIN_UPDATE_EVENT, this.onDomainUpdate);
  }

  handleDomainFormSubmit = e => {
    e.preventDefault();

    // TODO: Replace jquery library
    const domainID = $('#main-domain-form #domain_id').val().trim();
    const domainName = $('#main-domain-form #domain_name').val().trim();
    const domainTenantName = $('#main-domain-form #domain_tenant_name').val().trim();
    const domainColor = $('#main-domain-form #domain_color').val();
    const domainSSOSettings = {
      domainSSOEnabled: $('#main-domain-form #domain_sso_enabled').val(),
      domainIDPEntityID: $('#main-domain-form #domain_idp_entity_id').val().trim(),
      domainIDPSSOTargetURL: $('#main-domain-form #domain_idp_sso_target_url').val().trim(),
      domainIDPSLOTargetURL: $('#main-domain-form #domain_idp_slo_target_url').val().trim(),
      domainIssuer: $('#main-domain-form #domain_issuer').val().trim()
    };

    const adminUserIDs = $('#main-domain-form #admin_sharing_item_ids').val();
    const permissionID = $('#main-domain-form .permissions-domain').data('permission-id');
    let domainPermission;
    const accessHash = {};
    $('select[name^="domain-permissions"]').each((index, elem) => {
      const $elem = $(elem);
      const action = $elem.data('action');
      const permissionValue = $elem.val();

      if (permissionValue) {
        accessHash[action] = {
          roles: permissionValue
        };
      } else {
        accessHash[action] = {
          roles: {}
        };
      }
    });

    domainPermission = { id: permissionID, access_hash: accessHash };

    DomainFormPageActions.updateDomain(
      domainID,
      domainName,
      domainTenantName,
      domainSSOSettings,
      adminUserIDs,
      domainPermission,
      domainColor,
    );

  };

  onDomainUpdate = response => {
    window.currentDomain = response.data;
    this.updateDomain(response.data);
    analytics.track('Workspace(Domain) Updated');
    tiphive.hidePrimaryModal();
    this.closeModal();
  };

  closeModal = () => {
    this.props.setEditDomainModalOpen(false);
  };

  handleClickArchive = (e) => {
    e.preventDefault();

    const { currentDomain } = this.props;
    (async () => {
      try {
        await this.archiveDomain(currentDomain);
      } catch (err) {

        console.error(err);
      }
    })();
  }

  handleClickDelete = (e) => {
    e.preventDefault();
    vex.dialog.confirm({
      message: 'Are you sure you want to delete this workspace?',
      callback: async (value) => {
        if (value) {
          try {
            await this.deleteDomain(currentDomain);
          } catch (err) {
            console.error(err);
          }
        }
      }
    });
  }

  render() {
    return (
      <PageModal
        size="domain"
        anim="slide"
        backdrop="static"
        keyboard={false}
        onClose={this.closeModal}
      >
        <nav className="navbar navbar-fixed-top domain-update-form-page">
          <div className="container-fluid">
            <a
              className="btn btn-link btn-close-side-left"
              data-dismiss="modal"
              onClick={this.closeModal}
            >
              <i className="fa fa-times" />
            </a>
            <div className="pull-right buttons">
              <button className="btn btn-default btn-alt btn-alt-sm pl10 pr10" onClick={this.handleClickArchive}>Archive</button>
              <button className="btn btn-default btn-alt danger btn-alt-sm pl10 pr10" onClick={this.handleClickDelete}>Delete</button>
            </div>

            <ul className="nav navbar-nav" role="tablist">
              <li role="presentation" className="active">
                <a
                  href="#domain-pane"
                  aria-controls="home"
                  role="tab"
                  data-toggle="tab"
                >
                  WORKSPACE SETTINGS
                </a>
              </li>
            </ul>
          </div>
        </nav>

        <div className="tab-content domain-update-form-page" id="main-form-tab-content">
          <DomainTabContent
            domain={this.state.currentDomain}
            handleDomainFormSubmit={this.handleDomainFormSubmit}
          />
        </div>
      </PageModal>
    );
  }
}

const mapState = (state) => ({
  currentDomain: getThisDomain(getDomains(state))
})

const mapDispatch = {
  setEditDomainModalOpen,
  archiveDomain,
  deleteDomain,
  updateDomain
}

export default connect( mapState, mapDispatch )( DomainUpdateFormPage );
