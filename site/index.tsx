import { h, render } from 'preact';
import SideNav from './containers/SideNav';
import Markdown from './containers/Markdown';

const app = document.getElementById('app')

render(<div className="main container">
    <SideNav />
    <Markdown />
</div>, app)
