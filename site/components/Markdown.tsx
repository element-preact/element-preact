import { h, Component, VNode, render } from "preact";
import Demo from "./Demo";

declare var marked: any
export default class Markdown extends Component<{
    name?: string
    document?: string
}> {
    components = new Map<string, VNode>()
    renderer = new marked.Renderer()
    constructor(props: any) {
        super(props)
        this.renderer.table = (header, body) => {
            return `<table class="grid"><thead>${header}</thead><tbody>${body}</tbody></table>`;
        };
    }

    componentDidMount() {
        this.renderDOM();
    }

    componentDidUpdate() {
        this.renderDOM();
    }

    renderDOM() {
        for (const [id, component] of this.components) {
            const div = document.getElementById(id);
            if (div instanceof HTMLElement) {
                render(component, div);
            }
        }
    }

    render() {
        const { components } = this
        const { document, name } = this.props

        if (document) {
            components.clear();
            const html = marked(document.replace(/:::\s?demo\s?([^]+?):::/g, (match, code, offset) => {
                const id = offset.toString(36);
                components.set(id, h(Demo, { name, code }, code));
                return `<div id=${id}></div>`;
            }), { renderer: this.renderer });

            return (
                <div className="content">
                    <div dangerouslySetInnerHTML={{
                        __html: html
                    }} />
                </div>
            )
        } else {
            return <div className="content">
                <span />
            </div>
        }
    }
}