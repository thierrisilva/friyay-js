import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateCard } from 'Src/newRedux/database/cards/thunks';

const priorityLevels = [
  {id: 1, level: 'Highest', color: '#60cf8b'},
  {id: 2, level: 'High', color: '#5f8ccf'},
  {id: 3, level: 'Medium', color: '#cf61c4'},
  {id: 4, level: 'Low', color: '#3b3155'},
  {id: 5, level: 'Lowest', color: '#f2ab13'}
];

class PrioritySelector extends Component {

  changePriority = (priorityLevel, id) => {
    const { updateCard } = this.props;
    const attributes = { priority_level: priorityLevel};
    updateCard( {id, attributes} );
  }

  render() {
    const { card } = this.props;

    return(
      <div className="priority-selector">
        {priorityLevels.map(priority => {
          let styles = null;
          if (priority.level == card.attributes.priority_level) {
            styles = { color: 'white', backgroundColor: `${priority.color}`};
          }
          return (
          <div className="priority-btn" key={priority.id} onClick={() => {this.changePriority(priority.level, card.id);}} style={styles}>
              {priority.level}
          </div>
        );
      })}
      </div>
    );
  }
}

const mapDispatch = {
  updateCard
}

export default connect(undefined, mapDispatch)(PrioritySelector);
