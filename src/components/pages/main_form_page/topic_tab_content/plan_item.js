import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import CompletionSlider from 'Components/shared/CompletionSlider';
import CardPriorityControl from 'Components/shared/cards/elements/CardPriorityControl';
import DateInput from 'Components/shared/forms/DateInput';

class PlanItemContent extends Component {
  static propTypes = {
    topic: PropTypes.object
  };

  constructor(props) {
    super(props);

    if (props.topic) {
      const { attributes: attrs } = props.topic;

      this.state = {
        completionDateValue: attrs.completion_date,
        dueDateValue: attrs.due_date,
        expectedCompletionDateValue: attrs.expected_completion_date,
        priorityValue: attrs.priority_level,
        startDateValue: attrs.start_date,
        workEstimationValue: attrs.resource_required,
        pointsValue: attrs.points
      };
    } else {
      this.state = {
        completionDateValue: null,
        dueDateValue: null,
        expectedCompletionDateValue: null,
        priorityValue: null,
        startDateValue: null,
        workEstimationValue: null,
        pointsValue: null
      };
    }
  }

  handleCompletionDateChange = value => {
    const completionValue =
      value && !moment(value).diff(moment(), 'days')
        ? 100
        : this.state.completionValue;

    this.setState({ completionDateValue: value, completionValue });
  };

  handleDueDateChange = value => {
    this.setState({ dueDateValue: value });
  };

  handleExpectedCompletionChange = value => {
    this.setState({ expectedCompletionDateValue: value });
  };

  handlePriorityValueChange = value => {
    this.setState({ priorityValue: value });
  };

  handleStartDateChange = value => {
    this.setState({ startDateValue: value });
  };

  handleWorkEstimationChange = ev => {
    this.setState({ workEstimationValue: Number(ev.target.value) || 0 });
  };

  handlePointChange = ev => {
    this.setState({ pointsValue: Number(ev.target.value) || 0 });
  };

  render() {
    return (
      <div className="plan-tab-content">
        <div className="plan-tab-content__field plan-tab-content__field--half">
          <span className="plan-tab-content__label">Start date</span>
          <DateInput
            className="plan-tab-content__date"
            date={this.state.startDateValue}
            isOutsideRange={date =>
              this.state.dueDateValue && +date > this.state.dueDateValue
            }
            placeholder="Enter date"
            onChange={this.handleStartDateChange}
          />
        </div>
        <div className="plan-tab-content__field plan-tab-content__field--half">
          <span className="plan-tab-content__label">Due date</span>
          <DateInput
            className="plan-tab-content__date"
            date={this.state.dueDateValue}
            isOutsideRange={date =>
              this.state.startDateValue && +date < this.state.startDateValue
            }
            placeholder="Enter date"
            onChange={this.handleDueDateChange}
          />
        </div>
        <div className="plan-tab-content__field plan-tab-content__field--half">
          <span className="plan-tab-content__label">
            Expected completion date
          </span>
          <DateInput
            className="plan-tab-content__date"
            date={this.state.expectedCompletionDateValue}
            placeholder="Enter date"
            onChange={this.handleExpectedCompletionChange}
          />
        </div>
        <div className="plan-tab-content__field plan-tab-content__field--half">
          <span className="plan-tab-content__label">Completion date</span>
          <DateInput
            className="plan-tab-content__date"
            date={this.state.completionDateValue}
            placeholder="Enter date"
            onChange={this.handleCompletionDateChange}
          />
        </div>
        <div className="plan-tab-content__field plan-tab-content__field--half">
          <span className="plan-tab-content__label">Work estimation</span>
          <input
            className="plan-tab-content__input"
            min="0"
            placeholder="0"
            step="0.5"
            type="number"
            value={this.state.workEstimationValue || ''}
            onChange={this.handleWorkEstimationChange}
          />
          <span className="plan-tab-content__input-label">hours</span>
          <input
            className="plan-tab-content__input plan-tab-content__input-margin-left"
            min="0"
            placeholder="0"
            step="1"
            type="number"
            value={this.state.pointsValue || ''}
            onChange={this.handlePointChange}
          />
          <span className="plan-tab-content__input-label">points</span>
        </div>
        <div className="plan-tab-content__field plan-tab-content__field--half">
          <span className="plan-tab-content__label">Priority</span>
          <CardPriorityControl
            className="plan-tab-content__priority"
            value={this.state.priorityValue}
            onChange={this.handlePriorityValueChange}
          />
        </div>
      </div>
    );
  }
}

export default PlanItemContent;
