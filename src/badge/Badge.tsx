import { h, VNode } from 'preact';
import Component from '../libs/Component';
// import { Component, PropTypes } from '../../libs';

type Props = {
  children?: VNode,
  value?: number | string,
  max?: number,
  isDot?: boolean,
}

export default class Badge extends Component<Props> {
  props: Props;

  render(){
    const { children, value, max, isDot } = this.props;
    const className = this.classNames({
      'el-badge__content': true,
      'is-fixed': !!children,
      'is-dot': !!isDot,
    });
    let content;

    if (isDot) {
      content = null;
    } else {
      if (typeof value === 'number' && typeof max === 'number') {
        content = max < value ? `${max}+` : value;
      } else {
        content = value;
      }
    }

    return (
      <div style={this.style()} className={this.className('el-badge')}>
        { children }
        <sup className={ className }>{ content }</sup>
      </div>
    )
  }
}


Badge.defaultProps = {
  isDot: false,
}
