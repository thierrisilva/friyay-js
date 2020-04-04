import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router';
import BreadcrumbDropdown from './breadcrumb/breadcrumb_dropdown';
import { last } from 'ramda';

class Breadcrumb extends Component {
  static propTypes = {
    topicPath: PropTypes.array,
    group: PropTypes.object,
    topic: PropTypes.object,
    params: PropTypes.object
  };

  static defaultProps = {
    topicPath: [],
    group: null
  };

  static contextTypes = {
    addTourSteps: PropTypes.func.isRequired
  };

  tourPoint = null;

  componentDidMount() {
    $('body').on('click', this.bodyClickListener);

    /*
     * Add tour steps
     * Check if target is not null !important
     */
    if (this.tourPoint !== null) {
      this.context.addTourSteps({
        title: 'Breadcrumbs',
        text: 'Breadcrumbs are an easy way to navigate to yays',
        selector: '#tour-step-9',
        position: 'bottom'
      });
    }
  }

  componentWillMount() {
    $('body').off('click', this.bodyClickListener);
  }

  bodyClickListener = e => {
    if (
      !$('li.dropdown.mega-dropdown').is(e.target) &&
      $('li.dropdown.mega-dropdown span').has(e.target).length === 0 &&
      $('.open').has(e.target).length === 0
    ) {
      $('li.dropdown.mega-dropdown span').removeClass('open');
    }
  };

  render() {
    const {
      props: {
        topicPath,
        topic,
        params: { group_id = null }
      }
    } = this;
    const homeBreadcrumbLink = group_id === null ? '/' : `/groups/${group_id}`;

    let topicBreadcrumbItems = [
      <li className="dropdown" key={'topic-breadcrumb-home'}>
        <Link to={homeBreadcrumbLink} className="mr5">
          Cards
        </Link>
      </li>
    ];

    if (topicPath.length > 0) {
      const lastPath = last(topicPath);

      topicBreadcrumbItems = [
        ...topicBreadcrumbItems,
        topicPath.reduce((sum, path, index) => {
          const prevParentId = index > 0 ? topicPath[index - 1].id : null;
          const breadcrumbItemLink =
            group_id === null
              ? `/yays/${path.slug}`
              : `/groups/${group_id}/yays/${path.slug}`;

          return [
            ...sum,
            <li
              className="dropdown mega-dropdown"
              key={`topic-breadcrumb-${path.id}`}
            >
              <Link to={breadcrumbItemLink}>{path.title}</Link>
              <BreadcrumbDropdown
                path={path}
                parentId={prevParentId}
                index={index}
                groupId={group_id}
              />
            </li>
          ];
        }, []),
        <li
          className="dropdown mega-dropdown"
          key={'topic-breadcrumb-select-subHive'}
        >
          <a className="mr5">Select SubTopic</a>
          <BreadcrumbDropdown
            topic={topic}
            parentId={lastPath.id}
            index={topicPath.length + 1}
            groupId={group_id}
          />
        </li>
      ];
    } else {
      topicBreadcrumbItems = [
        ...topicBreadcrumbItems,
        <li
          className="dropdown mega-dropdown"
          key={'topic-breadcrumb-select-hive'}
        >
          <a className="mr5">Select yay</a>
          <BreadcrumbDropdown groupId={group_id} />
        </li>
      ];
    }

    return (
      <div className="breadcrumb-box navbar navbar-static-top">
        <div className="breadcrumb-container">
          <ol
            className="breadcrumb mb0 p0"
            style={{ float: 'left' }}
            id="tour-step-9"
            ref={list => (this.tourPoint = list)}
          >
            {topicBreadcrumbItems}
          </ol>
        </div>
      </div>
    );
  }
}

export default withRouter(Breadcrumb);
