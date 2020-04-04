import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import TipActionListDropdown from './list_item/tip_action_list_dropdown';
import { setCreateActive } from 'Actions/tipsModal';
import { setTipNestedTips, selectTipForWikiView } from 'Actions/topic';
import { connect } from 'react-redux';
import Ability from 'Lib/ability';
import ItemsContainer from 'Components/shared/items_container';
class WikiItem extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    group: PropTypes.object,
    topic: PropTypes.object.isRequired,
    setCreateActive: PropTypes.func.isRequired,
    tipViewMode: PropTypes.number,
    tipsWithNestedTips: PropTypes.object,
    subtopicsWithTips : PropTypes.object,
    setTipNestedTips: PropTypes.func.isRequired,
    selectTipForWikiView: PropTypes.func.isRequired,
    selectedTip: PropTypes.object,
    removeItem: PropTypes.func.isRequired,
    archiveItem: PropTypes.func.isRequired,
  }

  state = {
    collapsed: true
  }
  
  componentWillMount() {
    const { item } = this.props;
    const { id: tipId, relationships: {nested_tips} } = item;
    this.props.setTipNestedTips(tipId, nested_tips);
  }

  handleCollapse = () => this.setState({collapsed: !this.state.collapsed})

  handleTipAddClick = () => {
    const { props: { item, topic } } = this;
    this.props.setCreateActive(topic.id, item.id);
  }

  getTipFollowerTips = () => {
    const { tipsWithNestedTips, item, subtopicsWithTips, topic } = this.props;   
    const tipId = item.id;
    //Note: Currently created seperate list to display nested tips as API returns nested_tip with id and type only, not its attributes and relationships
    //return tipsWithNestedTips[tipId] || {};
    let nestedTipsArray = tipsWithNestedTips[tipId] || {};   
    let nestedTips = null;
    if(nestedTipsArray !== undefined && nestedTipsArray.tips !== undefined && nestedTipsArray.tips.data.length > 0)
    {
      let nestedTipsIds = nestedTipsArray.tips.data.map(function(tip){
        return tip.id;
      })     
      let topicsWithTips = subtopicsWithTips[topic.id];
      nestedTips = topicsWithTips.tips.filter(function(itm){
        if(nestedTipsIds.indexOf(itm.id) > -1)
        {
          return itm;
        }
      });
    }
    return nestedTips;
  }

  render() {
    const { state: { collapsed }, props: { item, topic, group, tipViewMode, selectedTip,removeItem, archiveItem } } = this;
    const { attributes: {title} } = item;
    //const {tips: nestedTips} = this.getTipFollowerTips();
    const nestedTips = this.getTipFollowerTips();
    const topicCollapseIcon = collapsed ? 'arrow_drop_up' : 'arrow_drop_down';
    const wikiTipClassNames = classNames('wiki-item-row flex-r-center-spacebetween',
      {
        'active': selectedTip ? item.id === selectedTip.id : false
      }
    );

    let tipActionListDropdown = null;
    let addTipButton = null;
    if (Ability.can('update', 'self', item)) {
      tipActionListDropdown = (
        <TipActionListDropdown
          item={item}
          topic={topic} 
          removeItem = {removeItem}
          archiveItem = {archiveItem}
          topicView={tipViewMode}
          />
      );

      addTipButton = (
        <a className="btn btn-link p0 pr5"
          onClick={this.handleTipAddClick}>
          +
        </a>
      );
    }

    return (
      <div className="wiki-item-content">
        <div className={wikiTipClassNames}>
          <div className="flex-r-center">
            <a onClick={this.handleCollapse} className="btn-collapse pr5 flex-r-center">
              <span className="material-icons" 
                style={{transform: collapsed && 'rotate(90deg)', fontSize: '20px'}}>
                {topicCollapseIcon}
              </span>
            </a>
            <a onClick={() => this.props.selectTipForWikiView(item)} className="tip-title-content flex-r-center">
              <span className="material-icons pr5">description</span>
              <span className="tip-title">{title}</span>
            </a>
          </div>
          <div className="flex-r-center wiki-item-actions">
            {addTipButton}
            {tipActionListDropdown}
          </div>
        </div>
        
         { (!collapsed && nestedTips != null) &&
          <div className="collapse">
           <div className="subtopic__cards">
              <ItemsContainer
                items={nestedTips}
                //items={(nestedTips !=== undefined?nestedTips : [])}
                isLoadingItems={false}
                group={group} 
                topic={topic}
                hideTipFilter={true}
                topicView={tipViewMode}
              /> 
            </div>
          </div>
        }
      </div>
    );
  }
}

const mapState = ({
  topic: { tipsWithNestedTips, wiki: {selectedTip}, subtopicsWithTips }
}) => ({
  tipsWithNestedTips,
  selectedTip,
  subtopicsWithTips
});
const mapDispatch = {
  setCreateActive,
  setTipNestedTips,
  selectTipForWikiView
};

export default connect(mapState, mapDispatch)(WikiItem);
