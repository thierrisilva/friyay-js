import React from 'react';
import PageContainer from './page_container';

const BlankItemPage = () => (
  <PageContainer>
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-12">
          <p style={{ paddingTop: '15px' }} className="text-center">
            <img src="/images/ajax-loader.gif" />
          </p>
        </div>
      </div>
    </div>
  </PageContainer>
);

export default BlankItemPage;
