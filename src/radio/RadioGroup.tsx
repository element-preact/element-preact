import { h, VNode } from 'preact'
import Component from '../libs/Component'
import Radio from './Radio'
import RadioButton from './RadioButton'

type mixed = string | number
type Color = string
export type RadioGroupProps = {
    value?: mixed
    size?: 'large' | 'small'
    fill?: Color
    textColor?: Color
    onChange?: (value: any) => void
}
export default class RadioGroup extends Component<RadioGroupProps, { value: mixed }> {

    constructor(props: RadioGroupProps) {
        super(props)
        this.state = {
            value: props.value
        }
    }

    getChildContext() {
        const { props } = this
        return {
            props
        };
    }

    onChange(value: mixed) {
        this.setState({ value })
        if (this.props.onChange) {
            this.props.onChange(value)
        }
    }

    render(node: VNode) {
        return (
            <div style={this.style()} className={this.className('el-radio-group')}>
                {node.children.map(item => h(item['nodeName'], Object.assign({}, item['attributes'], {
                    onChange: this.onChange.bind(this),
                    model: this.state.value,
                    size: this.props.size,
                    children: item['children']
                })))}
            </div>
        )
    }
}