import { h, VNode } from 'preact';
import Component from '../libs/Component';
import View from '../libs/view';

type Props = {
  value: any
  label?: string
  selected?: boolean
  disabled?: boolean
  visible?: boolean
  index?: number
  hover?: boolean

  onMouseEnter?: EventListener
  onClick?: EventListener
}

type State = {
  index: number,
  visible: boolean,
  hitState: boolean
};

export default class Option extends Component<Props, State> {
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      index: -1,
      visible: true,
      hitState: false
    }
  }

  render() {
    const { visible, label, selected, disabled, hover } = this.props;
    const { onClick, onMouseEnter } = this.props;

    return (
      <View show={visible}>
        <li
          style={this.style()}
          className={this.className('el-select-dropdown__item', {
            selected,
            'is-disabled': disabled,
            hover
          })}
          onMouseEnter={onMouseEnter}
          onClick={onClick}
        >
          { this.props.children || <span>{label}</span> }
        </li>
      </View>
    )
  }
}
