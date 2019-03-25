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
            { title: 'Layout 布局', key: 'layout' }
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
                                <a href={`#/${item.key}`} className={activeKey === item.key ? 'active' : ''}>Layout 布局</a>
                            </li>)}
                        </ul>
                    </div>)}
                </li>
            </ul>
        </nav>
    }
}
