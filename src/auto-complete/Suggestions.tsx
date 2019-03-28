import { h, VNode, ComponentFactory } from 'preact';
import Component from '../libs/Component';
import Popper from 'popper.js';
import Transition from '../libs/transition'
import View from '../libs/view'
import { Scrollbar } from '../scrollbar';

type Props = {
  ref: (node: Suggestions) => void
  className?: string
  suggestions: Array<any>
  onSelect: (item: any) => void
  loading: boolean
  reference: Element
  highlighted: (index: number) => boolean
  customItem?: any
}

type State = {
  showPopper: boolean,
  dropdownWidth: string,
}

export default class Suggestions extends Component<Props, State> {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      showPopper: false,
      dropdownWidth: ''
    };

    props.ref && props.ref(this)
  }

  onVisibleChange(visible: boolean, inputWidth: string): void {
    this.setState({
      dropdownWidth: inputWidth,
      showPopper: visible
    });
  }

  parent(): Component {
    return this.context.component;
  }

  popperJS: Popper
  onEnter = () => {
    const { reference } = this.props
    this.popperJS = new Popper(reference, this.popper, {
      modifiers: {
        computeStyle: {
          gpuAcceleration: false
        }
      }
    });
  }

  onAfterLeave = () => {
    this.popperJS.destroy();
  }

  popper: HTMLDivElement
  refPopper = (popper: HTMLDivElement) => {
    this.popper = popper
  }
  render() {
    const { suggestions, onSelect, loading, highlighted, customItem } = this.props;
    const { showPopper, dropdownWidth } = this.state;

    return (
      <Transition name="el-zoom-in-top" onEnter={this.onEnter.bind(this)} onAfterLeave={this.onAfterLeave.bind(this)}>
        <View show={showPopper}>
          <div
            ref={this.refPopper}
            className={this.classNames('el-autocomplete-suggestion', 'el-popper', {
              'is-loading': loading
            })}
            style={{
              width: dropdownWidth,
              zIndex: 1
            }}
          >
            <Scrollbar
              viewComponent="ul"
              wrapClass="el-autocomplete-suggestion__wrap"
              viewClass="el-autocomplete-suggestion__list"
            >
              {
                loading ? (
                  <li><i className="el-icon-loading"></i></li>
                ) : suggestions.map((item, index) => {
                  return (
                    <li
                      key={index}
                      className={this.classNames({
                        highlighted: highlighted(index)
                      })}
                      onClick={() => onSelect(item)}>
                      {
                        !customItem ? item.value : h(customItem, {
                          index,
                          item
                        }, item.value)
                      }
                    </li>
                  )
                })
              }
            </Scrollbar>
          </div>
        </View>
      </Transition>
    )
  }
}
