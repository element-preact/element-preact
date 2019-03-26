import { h } from 'preact'
import Radio from './Radio';

export default class RadioButton extends Radio {
    static elementType = 'RadioButton';

    parent () {
        return this.context;
    }

    size = (): string => {
        return this.parent().props.size;
    }

    isDisabled = (): boolean => {
        return this.props.disabled || this.parent().props.disabled;
    }

    activeStyle = (): { backgroundColor: string, borderColor: string, color: string } => {
        return {
            backgroundColor: this.parent().props.fill || '',
            borderColor: this.parent().props.fill || '',
            color: this.parent().props.textColor || ''
        };
    }

    render() {
        const { children, value, name } = this.props
        return (
            <label style={this.style()} className={this.className('el-radio-button',
                this.props.size && `el-radio-button--${this.size()}`, {
                    'is-active': this.state.checked
                })
            }>
                <input
                    type="radio"
                    className="el-radio-button__orig-radio"
                    checked={this.state.checked}
                    disabled={this.isDisabled()}
                    name={name}
                    value={value}
                    onChange={this.onChange.bind(this)}
                />
                <span className="el-radio-button__inner" style={this.state.checked ? this.activeStyle() : {}}>
                    {children && children['length'] || value}
                </span>
            </label>
        )
    }
}
