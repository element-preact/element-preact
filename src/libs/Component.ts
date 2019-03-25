import * as Preact from 'preact'
import classNames from './classnames'

export default abstract class <P = {}, S = {}> extends Preact.Component<P & { className?: string, style?: any }, S> {
    classNames = classNames
    
    className (...args: any[]) {
        const { className } = this.props
        return classNames(args.concat(className))
    }
    style (args?: any) {
        const { style } = this.props;
        return Object.assign({}, args, style)
    }
}