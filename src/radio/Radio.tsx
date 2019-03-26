import { h } from 'preact'
import Component from '../libs/Component'

type Props = {
    model?: string
    checked?: boolean
    value?: string | number
    disabled?: boolean
    name?: string
    size?: 'large' | 'small'
    onChange?: (value: string | number) => void
}
type State = {
    checked: boolean
    focus?: boolean
}

export default class Radio extends Component<Props> {
    static elementType = 'Radio';

    state: State;

    constructor(props: Props) {
        super(props);

        this.state = {
            checked: this.getChecked(props)
        };
    }

    componentWillReceiveProps(props: Props) {
        const checked = this.getChecked(props);

        if (this.state.checked != checked) {
            this.setState({ checked });
        }
    }

    onChange(e: any) {
        const checked = e.target.checked;

        if (checked) {
            if (this.props.onChange) {
                this.props.onChange(this.props.value);
            }
        }

        this.setState({ checked });
    }

    onFocus() {
        this.setState({
            focus: true
        })
    }

    onBlur() {
        this.setState({
            focus: false
        })
    }

    getChecked(props: Props): boolean {
        return props.model == props.value || Boolean(props.checked)
    }

    render() {
        const { checked, focus } = this.state;
        const { disabled, value, children, name } = this.props;

        return (
            <label style={this.style()} className={this.className('el-radio')}>
                <span className={this.classNames({
                    'el-radio__input': true,
                    'is-checked': checked,
                    'is-disabled': disabled,
                    'is-focus': focus
                })}>
                    <span className="el-radio__inner"></span>
                    <input
                        type="radio"
                        className="el-radio__original"
                        checked={checked}
                        disabled={disabled}
                        name={name}
                        value={value}
                        onChange={this.onChange.bind(this)}
                        onFocus={this.onFocus.bind(this)}
                        onBlur={this.onBlur.bind(this)}
                    />
                </span>
                <span className="el-radio__label">
                    {children || value}
                </span>
            </label>
        )
    }
}