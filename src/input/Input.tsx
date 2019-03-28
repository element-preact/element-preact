import { h, VNode } from 'preact';
import Component from '../libs/Component';
import { TypeIcon, TypeSize } from '../interfaces'

import calcTextareaHeight from './calcTextareaHeight'

type State = {
    textareaStyle: { resize: string, height?: string }
}


type Props = {
    type?: "text" | "textarea"
    icon?: TypeIcon
    disabled?: boolean
    name?: string
    placeholder?: string
    readOnly?: boolean
    autoFocus?: boolean
    maxLength?: number
    minLength?: number
    defaultValue?: string
    value?: string
    trim?: boolean

    size?: TypeSize
    prepend?: VNode
    append?: VNode

    autosize?: boolean | any
    rows?: number
    resize?: 'none' | 'both' | 'horizontal' | 'vertical'

    onFocus?: EventListener
    onBlur?: EventListener
    onChange?: (value: any) => void
    onIconClick?: EventListener
    onMouseEnter?: EventListener
    onMouseLeave?: EventListener

    autocomplete?: 'off'
    inputSelect?: (value: any) => void

    form?: string
    validating?: boolean
}

export default class extends Component<Props, State> {
    state: State;

    static defaultProps = {
        type: 'text',
        autosize: false,
        rows: 2,
        trim: false,
        autoComplete: 'off'
    }

    constructor(props: Props) {
        super(props);

        this.state = {
            textareaStyle: { resize: props.resize }
        };
    }

    componentDidMount() {
        this.resizeTextarea();
    }

    focus(): void {
        setTimeout(() => {
            this.input.focus();
        });
    }

    blur(): void {
        setTimeout(() => {
            this.input.blur();
        });
    }

    /* Instance Methods> */

    fixControlledValue(value: any) {
        if (typeof value === 'undefined' || value === null) {
            return '';
        }
        return value;
    }

    handleChange(e: Event): void {
        const { onChange } = this.props;
        if (onChange) {
            onChange(e.target['value']);
        }
        this.resizeTextarea();
    }

    handleFocus(e: Event): void {
        const { onFocus } = this.props;
        if (onFocus) onFocus(e)
    }

    handleBlur(e: Event): void {
        const { onBlur } = this.props
        if (this.props.trim) this.handleTrim()
        if (onBlur) onBlur(e)
    }

    handleTrim(): void {
        this.input.value = this.input.value.trim()
        if (this.props.onChange) {
            // this's for controlled components
            this.props.onChange(this.input.value.trim())
        }
    }

    handleIconClick(e: Event): void {
        if (this.props.onIconClick) {
            this.props.onIconClick(e)
        }
    }

    resizeTextarea(): void {
        const { autosize, type } = this.props;

        if (!autosize || type !== 'textarea') {
            return;
        }

        const minRows = autosize.minRows;
        const maxRows = autosize.maxRows;
        const textareaCalcStyle = calcTextareaHeight(this.input, minRows, maxRows);

        this.setState({
            textareaStyle: Object.assign({}, this.state.textareaStyle, textareaCalcStyle)
        });
    }

    input: HTMLInputElement | HTMLTextAreaElement
    refInput = (input: any) => {
        this.input = input
    }
    render() {
        const { type, size, prepend, append, icon, autocomplete, validating, rows, onMouseEnter, onMouseLeave, trim,
            ...otherProps
        } = this.props;

        const classname = this.classNames(
            type === 'textarea' ? 'el-textarea' : 'el-input',
            size && `el-input--${size}`, {
                'is-disabled': this.props.disabled,
                'el-input-group': prepend || append,
                'el-input-group--append': !!append,
                'el-input-group--prepend': !!prepend
            }
        );

        if ('value' in this.props) {
            otherProps.value = this.fixControlledValue(this.props.value);
            delete otherProps.defaultValue;
        }

        delete otherProps.resize;
        delete otherProps.style;
        delete otherProps.autosize;
        delete otherProps.onIconClick;

        if (type === 'textarea') {
            return (
                <div style={this.style()} className={this.className(classname)}>
                    <textarea {...otherProps}
                        ref={this.refInput}
                        className="el-textarea__inner"
                        style={this.state.textareaStyle}
                        rows={rows}
                        onChange={this.handleChange.bind(this)}
                        onFocus={this.handleFocus.bind(this)}
                        onBlur={this.handleBlur.bind(this)}
                    ></textarea>
                </div>
            )
        } else {
            return (
                <div style={this.style()} className={this.className(classname)} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                    {prepend && <div className="el-input-group__prepend">{prepend}</div>}
                    {typeof icon === 'string' ? <i className={`el-input__icon el-icon-${icon}`} onClick={this.handleIconClick.bind(this)}>{prepend}</i> : icon}
                    <input {...otherProps}
                        ref={this.refInput}
                        type={type}
                        className="el-input__inner"
                        autocomplete={autocomplete}
                        onChange={this.handleChange.bind(this)}
                        onFocus={this.handleFocus.bind(this)}
                        onBlur={this.handleBlur.bind(this)}
                    />
                    {validating && <i className="el-input__icon el-icon-loading"></i>}
                    {append && <div className="el-input-group__append">{append}</div>}
                </div>
            )
        }
    }
}
