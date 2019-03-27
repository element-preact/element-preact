import { h, Component } from 'preact'

interface Item {
    key: string
    title: string
}
interface NavGroup {
    title: string
    list: Item[]
}
const NAV_GROUPS: NavGroup[]  = [
    {
        title: 'Basic',
        list: [
            { title: 'Layout 布局', key: 'layout' },
            { title: 'Color 色彩', key: 'color' },
            { title: 'Typography 字体', key: 'typography' },
            { title: 'Icon 图标', key: 'icon' },
            { title: 'Button 按钮', key: 'button' },
        ]
    },
    {
        title: 'Form',
        list: [
            { title: 'Radio 单选框', key: 'radio' },
            { title: 'Checkbox 多选框', key: 'checkbox' },
        ]
    }
]

export default class extends Component<{ activeKey: string }> {
    render () {
        const { activeKey = 'layout' } = this.props
        return <nav className="side-nav">
            <ul>
                <li className="nav-item">
                    <a>基础组件</a>
                    {NAV_GROUPS.map(group => <div className="nav-group">
                        <div className="nav-group__title">{group.title}</div>
                        <ul className="pure-menu-list">
                            {group.list && group.list.map(item => <li className="nav-item">
                                <a href={`#/${item.key}`} className={activeKey === item.key ? 'active' : ''}>{item.title}</a>
                            </li>)}
                        </ul>
                    </div>)}
                </li>
            </ul>
        </nav>
    }
}
