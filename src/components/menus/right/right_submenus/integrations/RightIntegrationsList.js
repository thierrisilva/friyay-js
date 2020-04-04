/* globals vex */
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import inflection from 'inflection';
import Cookies from 'js-cookie';
import {connect} from 'react-redux';
import { stateMappings } from 'Src/newRedux/stateMappings';

import IntegrationHeaderDropdown from 'Src/components/menus/right/right_submenus/elements/integrationHeaderDropDown';
import IntegrationFileItem from 'Src/components/menus/right/right_submenus/files_content/integration_file_item.js';
import MoreItemsLoader from 'Src/components/shared/MoreItemsLoader';
import { setRightMenuOpenForMenu } from 'Src/newRedux/interface/menus/actions';

import {
  showDropboxFiles,
  listFiles as listDropboxFiles,
  disconnect as disconnectDropbox } from 'Src/newRedux/integrationFiles/dropbox/thunks';
import {
  getGoogleFileURL as showGoogleFiles,
  listFiles as listGoogleFiles,
  disconnect as disconnectGoogle } from 'Src/newRedux/integrationFiles/google-drive/thunks';
import {
  listFiles as listBoxFiles,
  disconnect as disconnectBox } from 'Src/newRedux/integrationFiles/box/thunks';

class RightIntegrationsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      folderID:    this.defaultFolderID(),
      folderName:  null,
      foldersPath: [],
      pageToken:   null
    };
  }

  static propTypes = {
    listFiles:  PropTypes.arrayOf(PropTypes.shape({})),
    listDropbox: PropTypes.func,
    listDropboxFiles: PropTypes.func,
    showDropboxFiles: PropTypes.func,
    showGoogleFiles: PropTypes.func,
    nextPageToken: PropTypes.string,
    provider:      PropTypes.oneOf(['dropbox', 'google', 'box']).isRequired,
    setRightMenuOpenForMenu: PropTypes.func,
    googleData: PropTypes.shape({
      files: PropTypes.arrayOf(PropTypes.shape({})),
    }),
    dropboxData: PropTypes.shape({
      files: PropTypes.arrayOf(PropTypes.shape({})),
    }),
    boxData: PropTypes.shape({
      files: PropTypes.arrayOf(PropTypes.shape({}))
    }),
  }

  componentWillReceiveProps = (nextProps) => {
    let { provider } = this.props;
    let nextProvider = nextProps.provider;

    if (provider && nextProvider && provider !== nextProvider) {
      this.setState({
        folderID:    this.defaultFolderID(),
        folderName:  null,
        pageToken:   null,
        foldersPath: []
      });
    }
  }

  defaultFolderID = (provider = this.props.provider) => {
    return { 'box': 0, 'google': 'root', 'dropbox': '' }[provider];
  }

  buildFoldersPath = (folderPaths, folderID, folderName) => {
    let newFoldersPath = [...folderPaths];
    if (folderID && folderID !== this.defaultFolderID() && folderName) {

      // check if folder already present in trail and make it last in trail
      const folderIndex = newFoldersPath.findIndex(folder => folder.folderID === folderID);

      if (folderIndex >= 0) newFoldersPath.splice(folderIndex, folderPaths.length);

      newFoldersPath.push({ folderID, folderName });
    } else {
      newFoldersPath = [];
    }

    return newFoldersPath;
  }

  getFileUrl = (fileItem) => {
    const { props:{ provider }} = this;
    const accessToken = Cookies.get(`${provider}AccessToken`);
     
    if (provider === 'dropbox') { 
      this.props.showDropboxFiles(accessToken, fileItem);
    } else { 
      this.props.showGoogleFiles(accessToken, {}, fileItem);
    }
  }

  handleFolderChange = (options) => {
    let { provider, listDropboxFiles, listBoxFiles, listGoogleFiles } = this.props; // eslint-disable-line
    let { folderID, folderName, foldersPath, pageToken } = this.state;
    options = (options.folderID || options.folderID === this.defaultFolderID() || options.folderID === '') && options
    || options.target.id && foldersPath.find(fp => fp.folderID == options.target.id)
    || options.target.id === this.defaultFolderID() && { folderID: this.defaultFolderID() }
    || options.currentTarget.id === this.defaultFolderID() && { folderID: this.defaultFolderID() };

    let accessToken = Cookies.get(`${provider}AccessToken`);

    // If a folderID && pageToken presents, and next page token is null, this is last page - do nothing.
    if (!accessToken || folderID && folderID === options.folderID && pageToken && !options.nextPageToken) return;

    if (options) {
      folderID   = options.folderID;
      folderName = options.folderName;
      pageToken  = options.nextPageToken;
    }

    const newFoldersPath = this.buildFoldersPath(foldersPath, folderID, folderName);

    this.setState({ folderID, folderName, foldersPath: newFoldersPath, pageToken });

    const methodsMap = { google: listGoogleFiles, dropbox: listDropboxFiles, box: listBoxFiles };

    methodsMap[provider](accessToken, folderID, pageToken);
  }

  onFilesListScrollEnd = () => {
    let { provider } = this.props;
    let { folderID, folderName } = this.state;
    let providerState = this.props[`${provider}Data`];

    let nextPageToken = providerState && providerState.nextPageToken ? providerState.nextPageToken : null;

    this.handleFolderChange({ folderID, folderName, nextPageToken });
  }

  handleDisconnectClick = () => {
    let { provider, setRightMenuOpenForMenu, disconnectDropbox, disconnectGoogle, disconnectBox } = this.props; // eslint-disable-line

    const methodsMap = { google: disconnectGoogle, dropbox: disconnectDropbox, box: disconnectBox };

    vex.dialog.confirm({
      message: `Are you sure you want to remove ${inflection.capitalize(provider)} connection?`,
      callback: (value) => {
        if (value) {
          methodsMap[provider](Cookies.get(`${provider}AccessToken`));
          setRightMenuOpenForMenu(null);
        }
      }
    });
  }

  handleIntegrationExpansion = (provider) => {
    let { setRightMenuOpenForMenu, listDropboxFiles, listGoogleFiles, listBoxFiles } = this.props; // eslint-disable-line
    let defaultFolderID = this.defaultFolderID(provider);

    const listFilesMethods = {
      'google': listGoogleFiles,
      'dropbox': listDropboxFiles,
      'box': listBoxFiles,
    };

    listFilesMethods[provider](Cookies.get(`${provider}AccessToken`), defaultFolderID, null);

    setRightMenuOpenForMenu(`Integrations_${provider}`);
  }

  formatFileAndFolderForRender = (provider, files) => {
    let folderItems = [];
    let fileItems   = [];
    const googleType = 'application/vnd.google-apps.folder';

    const isFolder = f => f['.tag'] === 'folder' || f['mimeType'] === googleType || f['type'] === 'folder';

    const isFile = f => f['.tag'] === 'file' || (provider === 'google' && f['mimeType'] !== googleType) || f['type'] === 'file';

    for (let file of files) {
      if (isFolder(file)) {
        file['itemType'] = 'folder';
        folderItems.push(file);
      } else if (isFile(file)) {
        file['itemType'] = 'file';
        fileItems.push(file);
      }
    }

    folderItems = this.sortByKey(folderItems, 'name');
    fileItems = this.sortByKey(fileItems, 'name');
    return folderItems.concat(fileItems);
  }

  renderFileAndFolder = () => {
    let { provider } = this.props;

    let { files } = this.props[`${provider}Data`];

    const filesAndFolders = this.formatFileAndFolderForRender(provider, files);

    return filesAndFolders.map((fileItem, index) =>
      <IntegrationFileItem
        provider={provider}
        key={`dropbox-file-${index}`}
        fileItem={fileItem}
        handleFolderChange={this.handleFolderChange}
        getFileUrl={this.getFileUrl}
      />
    );
  }

  sortByKey = (array, key) => {
    return array.sort(function(a, b) {
      let x = a[key].toLowerCase();
      let y = b[key].toLowerCase();
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }

  breadcrumbElement = ({ folderID, folderName }) => (
    <span key={`path-${folderID}`}>
      {' / '}
      <a
        id={folderID}
        style={{ cursor: 'pointer' }}
        className="text-muted"
        onClick={this.handleFolderChange}
      >
        {folderName}
      </a>
    </span>
  )

  renderBreadCrumb = () => {
    let { foldersPath } = this.state;
    const DisplayingFoldersPath = () => {
      if (foldersPath.length < 3) return foldersPath.map(this.breadcrumbElement);
      return (
        <Fragment>
          { this.breadcrumbElement({ folderID: foldersPath[0]['folderID'], folderName: foldersPath[0]['folderName']}) }
          { this.breadcrumbElement({ folderID: foldersPath[foldersPath.length - 2]['folderID'], folderName: '...'}) }
          { this.breadcrumbElement({ folderID: foldersPath[foldersPath.length - 1]['folderID'], folderName: foldersPath[foldersPath.length - 1]['folderName']}) }
        </Fragment>
      );
    };

    return (
      <div className="file-list-breadcrumb text-muted">
        <a
          id={this.defaultFolderID()}
          style={{ cursor: 'pointer' }}
          className="text-muted"
          onClick={this.handleFolderChange}
        >
          <i className="glyphicon glyphicon-home" />
        </a>
        <DisplayingFoldersPath />
      </div>
    );
  }

  render() {
    let { provider } = this.props;
    let providerAccessToken = Cookies.get(`${provider}AccessToken`);
    let providerIconClass = classNames('fa', `fa-${provider}`, 'icon', { connected: !!providerAccessToken });
    let providerIcon = <i className={providerIconClass} style={{ cursor: 'pointer' }} onClick={this.handleFolderChange} />;

    if (provider == 'box') {
      let boxImageSrc = providerAccessToken ? '/images/icon-box-com-active.png' : '/images/icon-box-com.png';
      providerIcon = <img src={boxImageSrc} style={{position: 'relative', top: '-4px', cursor: 'pointer'}} onClick={this.handleFolderChange} />;
    }

    return (
      <div className="right-submenu">
        <h3 className="right-submenu_header mr-1">
          {providerIcon}
          <span style={{ cursor: 'pointer', marginLeft: '5px' }} onClick={this.handleFolderChange}>
            {inflection.capitalize(provider)}
          </span>
          <small className="full-width">
            <IntegrationHeaderDropdown
              className="text-muted pull-right"
              handleClickDisconnect={this.handleDisconnectClick}
            />
          </small>
        </h3>

        <div className="rab-content-body">
          {this.renderBreadCrumb()}
          <div className="rab-items-listing" onScroll={this.handleFilesScroll}>
            <div className="rab-items-container">
              {this.renderFileAndFolder()}
              <MoreItemsLoader onVisible={this.onFilesListScrollEnd}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


const mapState = (state) => {
  const sm = stateMappings(state);
  return {
    googleData: sm.integrationFiles.google,
    dropboxData: sm.integrationFiles.dropbox,
    boxData: sm.integrationFiles.box,
    slack: sm.integrationFiles.slack,
  };
};

const mapDispatch = {
  disconnectDropbox,
  setRightMenuOpenForMenu,
  listDropboxFiles,
  listGoogleFiles,
  disconnectGoogle,
  listBoxFiles,
  disconnectBox,
  showDropboxFiles,
  showGoogleFiles,
};

export default connect(mapState, mapDispatch)(RightIntegrationsList);
