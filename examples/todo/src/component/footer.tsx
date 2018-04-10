import React from 'react';
import { Relax } from 'plume2';
import { countQL } from '../ql';
import actionType from '../action-type';
import actionCreator from '../action-creator';

@Relax
export default class Footer extends React.Component {
  // 只是typeScript中不标红
  props: {
    relaxProps?: {
      count: number;
      filterStatus: string;
    };
  };

  static relaxProps = {
    count: countQL,
    filterStatus: 'filterStatus'
  };

  render() {
    const { count, filterStatus } = this.props.relaxProps;
    const countText = this._getCountText(count);

    return (
      <footer className="footer">
        <span className="todo-count">{countText}</span>
        <ul className="filters">
          <li>
            <a
              href="javascript:;"
              className={'' === filterStatus ? 'selected' : ''}
              onClick={() => actionCreator.fire(actionType.CHANGE_FILTER, '')}
            >
              All
            </a>
          </li>
          <li>
            <a
              href="javascript:;"
              className={'active' === filterStatus ? 'selected' : ''}
              onClick={() =>
                actionCreator.fire(actionType.CHANGE_FILTER, 'active')
              }
            >
              Active
            </a>
          </li>
          <li>
            <a
              href="javacript:;"
              className={'completed' === filterStatus ? 'selected' : ''}
              onClick={() =>
                actionCreator.fire(actionType.CHANGE_FILTER, 'completed')
              }
            >
              Completed
            </a>
          </li>
        </ul>
        <button
          className="clear-completed"
          onClick={() => actionCreator.fire(actionType.CLEAN_COMPLETED)}
        >
          Clear completed
        </button>
      </footer>
    );
  }

  _getCountText(count: number) {
    if (count > 1) {
      return `${count} items left`;
    } else if (count === 1) {
      return '1 item left';
    }
  }
}
