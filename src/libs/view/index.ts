import { h, VNode } from 'preact';
import Component from '../Component';

export default class extends Component<{
  show?: boolean
}> {
  render() {
    const { show = true } = this.props;
    if (this.props.children[0] instanceof Component) {
      const children = this.props.children[0]
      const props = children['attributes'];
      let mixed = { style: { ...props.style }, className: this.className(props.className) };
      if (!show) mixed.style.display = 'none';
      return h(children['nodeName'], mixed, children['children'])
    } else {
      return h('span', {})
    }
  }
}
