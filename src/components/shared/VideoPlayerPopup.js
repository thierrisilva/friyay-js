import React from 'react';
import PageModal from '../pages/page_modal';

const VideoPlayerPopup = (props) => {
  return (
    <PageModal anim=' ' width="937px" height="500px" alignClass="m-x-auto m-t-50px" extraClass="p-x-10px p-y-10px" keyboard={true}>
        <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <iframe width="853" height="480" src="https://www.youtube.com/embed/h3cODBI-XQo" frameBorder="0" allowFullScreen></iframe>
    </PageModal>
  );
};

VideoPlayerPopup.defaultProps = {
  url: ''
};

export default VideoPlayerPopup;
