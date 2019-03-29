import { h, VNode, cloneElement } from 'preact';
import Component from '../libs/Component';
import View from '../libs/view';

type Props = {
  label?: string
  disabled?: boolean
  
}

type State = {
  hoverIndex?: number
  selectedIndex?: number
}

export default class OptionGroup extends Component<Props, State> {

  onHover = (hoverIndex: number) => {
    this.setState({ hoverIndex })
  }
  onClick = (selectedIndex?: number) => {
    this.setState({ selectedIndex })
  }

  render(node: VNode) {
    const { hoverIndex, selectedIndex } = this.state
    const { label, disabled } = this.props
    const { onHover, onClick } = this
    return (
      <ul style={this.style()} className={this.className('el-select-group__wrap')}>
        <li className="el-select-group__title">{label}</li>
        <li>
          <ul className="el-select-group">
            {node.children.map((item, index) => cloneElement(item['nodeName'], Object.assign({}, item['attributes'], {
              disabled: disabled || item['attributes']['disabled'],
              hover: hoverIndex === index,
              children: item['children']
            })))}
          </ul>
        </li>
      </ul>
    )
  }
}
