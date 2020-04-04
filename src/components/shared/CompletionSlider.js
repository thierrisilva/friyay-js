import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import Ability from 'Lib/ability';
import { completeCard } from 'Actions/tips';

const HORSE_EMOJI = '🐴';
const PARTY_EMOJI = '🎉';
const PIZZA_EMOJI = '🍕';

// CompletionSlider operates in either of two modes:
// - as a controlled component that takes 'value' prop and emits events with 'onChange'
// - as a standalone component that takes 'card' prop and dispatches actions with 'completeCard'
class CompletionSlider extends Component {
  static defaultProps = { step: 10 };

  static propTypes = {
    card: PropTypes.object,
    compactView: PropTypes.bool,
    className: PropTypes.string,
    showEmoji: PropTypes.bool,
    showPercentage: PropTypes.bool,
    step: PropTypes.number,
    tinyView: PropTypes.bool,
    value: PropTypes.number,
    completeCard: PropTypes.func,
    onChange: PropTypes.func,
    width: PropTypes.string,
    dontUpdate: PropTypes.bool
  };

  handlePercentageChange = ev => {
    if (this.props.dontUpdate) {
      return;
    }

    const value = Number(ev.target.value);

    if (this.props.onChange) {
      this.props.onChange(value);
    } else {
      this.props.completeCard(this.props.card, value);
    }
  };

  render() {
    const completion =
      this.props.value == undefined
        ? this.props.card && this.props.card.attributes.completed_percentage
        : this.props.value;

    const sliderClassNames = classNames(
      this.props.className,
      'completion-slider',
      {
        'completion-slider--compact': this.props.compactView,
        'completion-slider--tiny': this.props.tinyView
      }
    );
    const statusEmojiClassNames = classNames('completion-slider__emoji', {
      'completion-slider__emoji--reverse': completion < 100
    });
    const canUpdate = Ability.can('update', 'self', this.props.card);

    return (
      <div
        style={{ width: `${this.props.width}` }}
        className={sliderClassNames}
      >
        <div className="completion-slider__slider">
          <div
            className="completion-slider__slider-status"
            style={{ width: `${completion}%` }}
          >
            {this.props.showEmoji && (
              <span className={statusEmojiClassNames}>
                {completion < 100
                  ? completion > 0
                    ? HORSE_EMOJI
                    : null
                  : PARTY_EMOJI}
              </span>
            )}
          </div>
          {canUpdate && (
            <input
              className="completion-slider__slider-control"
              type="range"
              min="0"
              max="100"
              step={this.props.step}
              value={completion || 0}
              onChange={this.handlePercentageChange}
            />
          )}
          {this.props.showEmoji && completion === 100 && (
            <span className="completion-slider__emoji">{PARTY_EMOJI}</span>
          )}
        </div>
        {this.props.showPercentage && (
          <div className="completion-slider__percentage">
            <span
              className="completion-slider__percent"
              style={{ width: `calc(${completion}% - 10px)` }}
            >
              0%
            </span>
            <span className="completion-slider__percent">{completion}%</span>
            <span className="completion-slider__percent">100%</span>
          </div>
        )}
      </div>
    );
  }
}

const mapDispatch = { completeCard };

export default connect(
  null,
  mapDispatch
)(CompletionSlider);
