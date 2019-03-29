import { h, VNode, cloneElement } from 'preact';
import Component from '../Component';

export default class extends Component<{
  show?: boolean
}> {
  render(node: VNode) {
    const { show = true } = this.props;
    const child = node.children[0]
    const props = child['attributes'];
    let mixed = { ...props, style: { ...props.style }, className: this.className(props.className) };
    if (!show) mixed.style.display = 'none';
    return h(child['nodeName'], mixed, child['children'])
  }
}
