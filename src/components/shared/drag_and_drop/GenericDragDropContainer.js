import React from 'react';

import GenericDropZone from 'Components/shared/drag_and_drop/GenericDropZone';
import GenericDragContainer from 'Components/shared/drag_and_drop/GenericDragContainer';

//A container that makes anything draggable and also a dropzone - useful when you want to be able to drop one
//thing ontop of another to reorder them

const GenericDragDropContainer = (props) => (
  <GenericDragContainer {...props} >
    <GenericDropZone {...props} >
      {props.children}
    </GenericDropZone>
  </GenericDragContainer>
)

export default GenericDragDropContainer;
