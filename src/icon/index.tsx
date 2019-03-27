import { h } from 'preact'
import Component from '../libs/Component'
import { TypeIcon } from '../interfaces';

interface Props {
    name: TypeIcon
}
export default class Icon extends Component<Props> {
    render() {
        return <i style={this.style()} className={this.className(`el-icon-${this.props.name}`)}></i>;
    }
}