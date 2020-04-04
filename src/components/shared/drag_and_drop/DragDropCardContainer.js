import React from 'react';

import CardDropZone from 'Components/shared/drag_and_drop/CardDropZone';
import GenericDropZone from 'Components/shared/drag_and_drop/GenericDropZone';
import DragCardContainer from 'Components/shared/drag_and_drop/DragCardContainer';
import GenericDragContainer from 'Components/shared/drag_and_drop/GenericDragContainer';

//A container that makes a card draggable and also a dropzone - useful when you want to be able to drop one
//card ontop of another to reorder them

const DragDropCardContainer = (props) => (
  <GenericDragContainer {...props} itemType='draggable_card' item={props.card} >
    <GenericDropZone {...props} itemType='draggable_card'>
      {props.children}
    </GenericDropZone>
  </GenericDragContainer>
)

// const DragDropCardContainer = (props) => (
//   <DragCardContainer {...props}>
//     <CardDropZone {...props}>
//     {props.children}
//     </CardDropZone>
//   </DragCardContainer>
// )

export default DragDropCardContainer;
