import { h, VNode } from 'preact'
import Component from '../libs/Component'
import { TypeIcon } from '../interfaces';

interface Props {
    onClick?: (e: Event) => void
    size?: "large" | "small" | "mini"
    type?: "primary" | "success" | "warning" | "danger" | "info" | "text"
    plain?: boolean
    loading?: boolean
    disabled?: boolean
    icon?: TypeIcon
    nativeType?: "submit" | "reset"
}

export default class Button extends Component<Props> {
    onClick = (e: Event) => {
        if (!this.props.loading) {
            this.props.onClick && this.props.onClick(e);
        }
    }

    render(node: VNode) {
        const { type = 'default', size, disabled, loading, plain, nativeType = 'button', icon } = this.props

        return (
            <button style={this.style()} className={this.className('el-button', `el-button--${type}`, size && `el-button--${size}`, {
                'is-disabled': disabled,
                'is-loading': loading,
                'is-plain': plain
            })} disabled={disabled} type={nativeType} onClick={this.onClick}>
                {loading && <i className="el-icon-loading" />}
                {icon && !loading && <i className={`el-icon-${icon}`} />}
                {node.children && !!node.children.length && <span>{node.children}</span>}
            </button>
        )
    }
}