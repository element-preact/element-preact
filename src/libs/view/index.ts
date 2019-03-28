import { h, VNode } from 'preact';
import Component from '../Component';

export default class View extends Component<{
  show?: boolean
}> {
  render(node: VNode) {
    const classNames = [];
    if (node.children[0] && node.children[0]['nodeName'] instanceof Component) {
      const children = node.children[0];
      const props = children['attributes'];
      const { show = true, className = '' } = this.props;
      const mixed = { style: { ...props.style }, className: '' };
      
      if (!show) mixed.style.display = 'none';
      if (props.className) classNames.push(props.className);
      if (className) classNames.push(className);
      mixed.className = classNames.join(' ');

      return h(children['nodeName'], mixed, children['children']);
    } else {
      return h('div', {})
    }
  }
}
