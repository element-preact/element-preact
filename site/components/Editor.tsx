import { h, Component } from 'preact'

declare var CodeMirror: Function
export interface EditorProps {
    onChange: (value: string) => void
    value?: string
}
export default class Editor extends Component<EditorProps> {
    cm: any
    editor: HTMLDivElement
    timeout: NodeJS.Timer
    componentDidMount() {
        const { onChange, value } = this.props

        this.cm = CodeMirror(this.editor, {
            mode: "jsx",
            keyMap: 'sublime',
        });

        this.cm.setValue(value)

        this.cm.on('changes', cm => {
            if (onChange) {
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    onChange(cm.getValue());
                }, 300);
            }
        })
    }

    render() {
        return <div className="editor" ref={ref => (this.editor = ref)} />
    }
}