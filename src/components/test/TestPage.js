import React, { Component } from 'react';
import PropTypes from 'prop-types';

import DragDropCardContainer from 'Components/shared/drag_and_drop/DragDropCardContainer';
import CardDropZone from 'Components/shared/drag_and_drop/CardDropZone';

class TestPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cat1: [
        {
          id: 1,
          name: 'something'
        },
        {
          id: 2,
          name: 'something else'
        }
      ],
      cat2: [
        {
          id: 3,
          name: 'arse'
        },
        {
          id: 4,
          name: 'poo else'
        }
      ]
    };
  }

  hoverOver = attrs => {
    //console.log('hoverOver', attrs);
  };

  hoverOver2 = attrs => {
    //console.log('hoverOver', attrs);
  };

  dropACard = attrs => {
    console.log('dropACard', attrs);
  };

  dropAnotherCard = attrs => {
    console.log('dropAnotherCard', attrs);
    //console.log(attrs.item.cardId);
  };

  handleDragEnter = attrs => {
    console.log('enter', attrs);
  };

  handleDragLeave = attrs => {
    console.log('leave', attrs);
  };

  render() {
    return (
      <div
        style={{ width: '100vw', height: '100vh', backgroundColor: '#EDB744' }}
      >
        {this.state.cat1.map(item => (
          <DragDropCardContainer
            key={item.id}
            item={item}
            dropCard={this.dropACard}
            hoverOver={this.hoverOver}
          >
            <div style={{ backgroundColor: '#C70C15', width: 100, height: 80 }}>
              <h5>{item.name}</h5>
            </div>
          </DragDropCardContainer>
        ))}
        <div style={{ width: '100vw', height: 100 }} />
        {this.state.cat2.map(item => (
          <DragDropCardContainer
            key={item.id}
            item={item}
            dropCard={this.dropAnotherCard}
            hoverOver={this.hoverOver2}
          >
            <div style={{ backgroundColor: '#93EE2E', width: 70, height: 180 }}>
              <h5>{item.name}</h5>
            </div>
          </DragDropCardContainer>
        ))}
        <CardDropZone
          style={{ width: '100vw', height: 200, border: '1px solid #4E92ED' }}
          onDragEnter={this.handleDragEnter}
          onDragLeave={this.handleDragLeave}
          dropCard={this.dropAnotherCard}
          hoverOver={this.hoverOver2}
        />
      </div>
    );
  }
}

export default TestPage;
