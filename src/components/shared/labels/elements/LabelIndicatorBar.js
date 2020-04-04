import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { array, object, string } from 'prop-types';
import { stateMappings } from 'Src/newRedux/stateMappings';

const LabelIndicatorBar = ({ additionalClassNames = '', dbLabels, labels, labelIds = [] }) => {

  const labelArray = labels || labelIds.map( id => dbLabels[ id ]).filter( label => !!label );

  return (
    <div className={`label-indicator-bar ${ additionalClassNames }`}>
      {labelArray.map(label =>
        <div
          className={`label-indicator-bar_segment color-${label.attributes.color}`}
          key={label.id}
          >
        </div>
      )}
    </div>
  )
}


LabelIndicatorBar.propTypes = {
  additionalClassNames: string,
  dbLabels: object,
  labels: array,
  labelIds: array
};


const mapState = (state, props) => {
  const sm = stateMappings(state);
  return {
    dbLabels: sm.labels
  }
};

export default connect( mapState )(LabelIndicatorBar);
