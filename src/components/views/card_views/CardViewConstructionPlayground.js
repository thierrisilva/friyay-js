import React, { Component } from 'react';
import { connect } from 'react-redux';
// import CardDropZone from 'Components/shared/drag_and_drop/CardDropZone';
// import DragDropCardListing from 'Components/shared/drag_and_drop/DragDropCardListing';


//A construction playground for building new components that relate to cards.
// Feel free to edit this component as much as you like as you build new componentry for displaying cards and related views
// Please try to remember not to commit changes to this component
//For your reference, a set of Drag and Drop Components can be found under shared/drag_and_drop and should be reasonably well documented

//
// const constructionOptions: {
//   0: 'Card',
//   1: 'Multiple Cards',
//   2: 'Labels'
// }
//
// const selectedConstructionOption = 0;

class CardViewConstructionPlayground extends Component {

  state={selectedLabel: this.props.allLabels[0]}

  onSelectLabel = (label) => {
    this.setState({selectedLabel: label});
  }

  render() {
    const { topic, group, allCards, allLabels, someTopics, thisUser } = this.props;
    const subtopics = someTopics.filter(subtopic => subtopic.parent_id === topic.id);

    return (
      <div style={{width: '100%'}}>

        {/* {allCards.map(card =>
          <div key={card.id} style={{padding: 10}}>
            <KanbanCard card={card} topic={topic} />
          </div>
        )} */}


      </div>
    )
  };
}
//Feel free to connect to more props and actions in the redux store here.
const mapState = (state, props) => ({
    allCards: state.tips.collection,
    allLabels: state.labels.collection,
    someTopics: state.topic.subtopics,
    thisUser: state.appUser.user
});
// const mapDispatch = {
// };
export default connect(mapState)(CardViewConstructionPlayground);
