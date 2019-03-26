import * as Preact from 'preact'
import classNames from './classnames'

export default abstract class <P = {}, S = {}> extends Preact.Component<P & { className?: string, style?: any }, S> {
    classNames = classNames.bind(this)
    
    className (...args: any[]) {
        return classNames(args.concat(this.props.className))
    }
    style (args?: any) {
        return Object.assign({}, args, this.props.style)
    }
}