import { h, Component, render } from "preact";
import * as Element from '../../src'
import Editor from './Editor'

declare var marked: any
declare var Babel: any
export default class extends Component<{
    name: string
    code: string
}, {
    showBlock: boolean
    code: string
}> {

    playerId: string
    document: string[]
    description: string
    source: string[]

    constructor(props) {
        super(props)

        this.playerId = `${Math.floor(Math.random() * 1e9).toString(36)}`
        this.document = this.props.code.match(/([^]*)\n?(```[^]+```)/)
        this.description = marked(this.document[1])
        this.source = this.document[2].match(/```(.*)\n?([^]+)```/)

        this.state = {
            showBlock: false,
            code: this.source[2]
        }
    }

    componentDidMount() {
        this.renderSource()
    }

    blockControl = () => {
        this.setState({
            showBlock: !this.state.showBlock
        })
    }

    renderSource = () => {
        const $ = { createElement: h, vnode: null }
        const args = ['context', 'React', 'Component']
        const argv = [this, $, Element.Component]
        for (const key in Element) {
            args.push(key)
            argv.push(Element[key])
        }
        
        const code = Babel.transform(`
        class Demo extends Component {
            ${this.state.code}
        }
        React.vnode = <Demo {...context.props} />
        `, {
            presets: ['react']
        }).code
        args.push(code)
        new Function(...args).apply(null, argv)
        return $.vnode
    }

    container: HTMLDivElement
    refContainer = (container: HTMLDivElement) => {
        this.container = container
    }
    render () {
        const { name } = this.props
        const { code } = this.state

        return <div className={`demo-block demo-box demo-${name}`}>
            <div className="source">{this.renderSource()}</div>
            {
                this.state.showBlock && (
                    <div className="meta">
                        {
                            this.description && (
                                <div
                                    className="description"
                                    dangerouslySetInnerHTML={{ __html: this.description }}
                                />
                            )
                        }
                        <Editor
                            value={code}
                            onChange={code => this.setState({code})}
                        />
                    </div>
                )
            }
            <div className="demo-block-control" onClick={this.blockControl}>
                {
                    this.state.showBlock
                    ?
                    <span>
                        <i className="el-icon-caret-top" /> 隐藏
                    </span>
                    :
                    <span>
                        <i className="el-icon-caret-bottom" /> 显示
                    </span>
                }
            </div>
        </div>
    }
}
