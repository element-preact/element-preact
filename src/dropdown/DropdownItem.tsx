/* @flow */

import { h, VNode } from 'preact';
import Component from '../libs/Component';

type Props = {
    command?: string,
    disabled?: boolean,
    divided?: boolean,
}

export default class DropdownItem extends Component<Props> {
    handleClick(): void {
        this.context.component.handleMenuItemClick(this.props.command, this);
    }

    render() {
        const { disabled, divided } = this.props;

        return (
            <li
                style={this.style()}
                className={this.className('el-dropdown-menu__item', {
                    'is-disabled': disabled,
                    'el-dropdown-menu__item--divided': divided
                })} onClick={this.handleClick.bind(this)}
            >
                {this.props.children}
            </li>
        )
    }
}

