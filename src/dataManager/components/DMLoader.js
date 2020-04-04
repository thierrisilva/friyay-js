import React, { Fragment, PureComponent } from 'react';
import { func } from 'prop-types';
import LoadingIndicator from 'Components/shared/LoadingIndicator';
import Waypoint from 'react-waypoint';
import withDataManager from 'Src/dataManager/components/withDataManager';

//A component for placing at the bottom of an incomplete list.  When it enters the viewport it will call the DataManager for the next page of data
class DMLoader extends React.PureComponent {
  timer = null;
  mounted_ = false;
  state = {
    loading: false,
    currentPosition: 'inside'
  };

  componentDidMount() {
    this.mounted_ = true;
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    this.mounted_ = false;
  }

  handleCheckIfStillOnPage = () => {
    const { dmData, loaderKey } = this.props;
    this.mounted_ &&
    this.state.currentPosition == 'inside' &&
    dmData[loaderKey] &&
    !dmData[loaderKey].allLoaded
      ? this.handleCallNextPageOfData()
      : this.setState({ loading: false });
  };

  handlePositionChange = ({ previousPosition, currentPosition }) => {
    this.setState({ currentPosition });
    currentPosition == 'inside' && this.handleCallNextPageOfData();
  };

  handleCallNextPageOfData = async () => {
    const { dmData, dmRequestNextPageForRequirement, loaderKey } = this.props;
    if (loaderKey && dmData[loaderKey] && !dmData[loaderKey].allLoaded) {
      this.setState({ loading: true });
      await dmRequestNextPageForRequirement(loaderKey);
      this.timer = setTimeout(() => this.handleCheckIfStillOnPage(), 200);
    }
  };

  render() {
    const { dmData, loaderKey } = this.props;

    return (
      <Waypoint onPositionChange={this.handlePositionChange}>
        {this.state.loading && (
          <div className="dmloader" style={this.props.style}>
            <LoadingIndicator />
          </div>
        )}
      </Waypoint>
    );
  }
}

const mapState = (state, props) => ({});
const dataRequirements = props => props.dataRequirements;

export default withDataManager(dataRequirements, mapState, {})(DMLoader);
