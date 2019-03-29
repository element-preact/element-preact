import { h, VNode, cloneElement } from 'preact'
import Component from '../libs/Component'

type Color = string
type State = {
    options?: Array<string>
}
type Props = {
    min?: number,
    max?: number,
    size?: "small" | "large",
    fill?: Color,
    textColor?: Color,
    value?: string[],
    onChange?: (value: string[]) => void
}

export default class CheckboxGroup extends Component<Props, State> {
    state: State;

    constructor(props: Props) {
        super(props);

        this.state = {
            options: this.props.value || []
        };
    }

    componentWillReceiveProps(nextProps: Props): void {
        if (nextProps.value !== this.props.value) {
            this.setState({
                options: nextProps.value
            });
        }
    }

    getChildContext(): { ElCheckboxGroup: CheckboxGroup } {
        return {
            ElCheckboxGroup: this
        };
    }

    onChange(value: string, checked: boolean): void {
        const index = this.state.options.indexOf(value);

        if (checked) {
            if (index === -1) {
                this.state.options.push(value);
            }
        } else {
            this.state.options.splice(index, 1);
        }

        this.forceUpdate();

        if (this.props.onChange) {
            this.props.onChange(this.state.options);
        }
    }

    render(node: VNode) {
        const { options } = this.state;
        return (
            <div style={this.style()} className={this.className("el-checkbox-group")}>
                {node.children.map((item, index) => {
                    const props = Object.assign({}, item['attributes'])
                    return cloneElement(item['nodeName'], Object.assign({}, props, {
                        key: index,
                        checked:
                            props.checked ||
                            options.indexOf(props.value) >= 0 ||
                            options.indexOf(props.label) >= 0,
                        onChange: this.onChange.bind(this, props.value ? props.value : props.value === 0 ? 0 : props.label),
                        children: item['children']
                    }))
                })}
            </div>
        );
    }
}