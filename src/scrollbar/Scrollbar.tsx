import { h } from 'preact';
import Component from '../libs/Component';

import { addResizeListener, removeResizeListener } from '../libs/utils/resize-event';

import { getScrollBarWidth } from './scrollbar-width';
import { Bar } from './Bar'

type Props = {
  native?: boolean
  wrapStyle?: any
  wrapClass?: string | any
  viewClass?: string | any
  viewStyle?: any
  className?: string
  viewComponent?: any
  noresize?: boolean
}
type State = {
  sizeWidth?: string
  sizeHeight?: string
  moveX: number
  moveY: number
}

export class Scrollbar extends Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      sizeWidth: '0',
      sizeHeight: '0',
      moveX: 0,
      moveY: 0
    };
  }

  wrap: HTMLDivElement

  cleanRAF: Function
  componentDidMount(){
    let rafId = requestAnimationFrame(this._update)
    this.cleanRAF = () => { cancelAnimationFrame(rafId) }
  }

  cleanResize: () => void
  resizeDom: HTMLDivElement
  componentDidUpdate() {
    if (!this.props.noresize){
      this.cleanResize && this.cleanResize();
      addResizeListener(this.resizeDom, this._update)
      this.cleanResize = ()=>{
        removeResizeListener(this.resizeDom, this._update);
      }
    }
  }
  

  componentWillUnmount(){
    this.cleanRAF();
    this.cleanResize && this.cleanResize();
  }

  handleScroll() {
    const wrap = this.wrap;
    this.setState({
      moveY: ((wrap.scrollTop * 100) / wrap.clientHeight),
      moveX: ((wrap.scrollLeft * 100) / wrap.clientWidth)
    })
  }

  _update = () => {
    let heightPercentage, widthPercentage;
    const wrap = this.wrap;
    if (!wrap) return;

    heightPercentage = (wrap.clientHeight * 100 / wrap.scrollHeight);
    widthPercentage = (wrap.clientWidth * 100 / wrap.scrollWidth);

    let sizeHeight = (heightPercentage < 100) ? (heightPercentage + '%') : '';
    let sizeWidth = (widthPercentage < 100) ? (widthPercentage + '%') : '';

    this.setState({sizeHeight, sizeWidth})
  }

  render() {

    /* eslint-disable */
    let {
      native, viewStyle, wrapStyle, viewClass, children, viewComponent, wrapClass, noresize,
      className, ...others} = this.props;
    let {moveX, moveY, sizeWidth, sizeHeight} = this.state;
    /* eslint-enable */

    let style = wrapStyle;
    const gutter = getScrollBarWidth();
    if (gutter) {
      const gutterWith = `-${gutter}px`;
      if (Array.isArray(wrapStyle)){
        style = Object.assign.apply(null, [...wrapStyle, {marginRight: gutterWith, marginBottom: gutterWith}])
      } else {
        style = Object.assign({}, wrapStyle, {marginRight: gutterWith, marginBottom: gutterWith})
      }
    }

    const view = h(viewComponent, {
      className: this.classNames('el-scrollbar__view', viewClass),
      style: viewStyle,
      ref: (el: HTMLDivElement) => this.resizeDom = el
    }, children);

    let nodes;
    if (!native){
      const wrap = (
        <div 
          {...others}
          ref={el => this.wrap = el}
          key={0}
          style={style}
          onScroll={this.handleScroll.bind(this)}
          className={this.classNames(wrapClass, 'el-scrollbar__wrap', gutter ? '' : 'el-scrollbar__wrap--hidden-default')}
          >
          {view}
        </div>
      )
      nodes = [
        wrap,
        <Bar move={moveX} size={sizeWidth} getParentWrap={()=>this.wrap}></Bar>,
        <Bar move={moveY} size={sizeHeight} getParentWrap={()=>this.wrap} vertical></Bar>,
      ]
    }else {
      nodes = [
        (
          <div 
            {...others}
            key={0} 
            ref={(el) => this.wrap = el}
            className={this.classNames(wrapClass, 'el-scrollbar__wrap')} 
            style={style}>
            {view}
          </div>
        )
      ]
    }

    return <div className={this.classNames('el-scrollbar', className)}>
      {nodes}
    </div>
  }
}
