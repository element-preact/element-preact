import { h, VNode, cloneElement } from 'preact';
import Component from '../Component';
import View from '../view'

type Props = {
  name?: string
  children?: any
  onEnter?: EventListener
  onAfterEnter?: EventListener
  onLeave?: EventListener
  onAfterLeave?: EventListener
}
export default class Transition extends Component<Props, {
  children: VNode
}> {
  constructor(props: Props) {
    super(props);
    if (props.children[0]) {
      const { attributes, nodeName, children } = props.children[0]
      this.state = {
        children: this.enhanceChildren(nodeName, Object.assign({}, attributes, { children }))
      }
    }
  }
  componentWillReceiveProps(nextProps: Props) {
    const children = this.props.children[0]
    const nextChildren = nextProps.children[0]

    if (!nextProps.name) {
      this.setState({
        children: nextChildren
      });
      return;
    }

    if (this.isViewComponent(nextChildren)) {
      this.setState({
        children: this.enhanceChildren(nextChildren.nodeName, { show: children ? children.props.show : true })
      })
    } else {
      if (nextChildren) {
        this.setState({
          children: this.enhanceChildren(nextChildren.nodeName)
        })
      }
    }
  }

  el: any
  enhanceChildren(nodeName, props?) {
    return h(nodeName, Object.assign({ ref: (el) => { this.el = el } }, props), props.children)
  }

  componentDidUpdate(preProps) {
    console.log(this.props.name)
    
    if (!this.props.name) return;
    const children = this.props.children[0]
    const preChildren = preProps.children[0]

    if (this.isViewComponent(children)) {
      if ((!preChildren || !preChildren.attributes.show) && children.attributes.show) {
        this.toggleVisible();
      } else if (preChildren && preChildren.attributes.show && !children.attributes.show) {
        this.toggleHidden();
      }
    } else {
      if (!preChildren && children) {
        this.toggleVisible();
      } else if (preChildren && !children) {
        this.toggleHidden();
      }
    }

  }

  get transitionClass() {
    const { name } = this.props;

    return {
      enter: `${name}-enter`,
      enterActive: `${name}-enter-active`,
      enterTo: `${name}-enter-to`,
      leave: `${name}-leave`,
      leaveActive: `${name}-leave-active`,
      leaveTo: `${name}-leave-to`,
    }
  }

  isViewComponent(element) {
    return element && element.nodeName === View
  }

  /* css animation fix when animation applyied to .{action} instanceof .{action}-active */

  timeout: NodeJS.Timer
  animateElement(element: Element, action: string, active: string, fn: () => void) {
    element.classList.add(active);

    const styles = getComputedStyle(element);
    const duration = parseFloat(styles['animationDuration']) || parseFloat(styles['transitionDuration']);

    element.classList.add(action);

    if (duration === 0) {
      const styles = getComputedStyle(element);
      const duration = parseFloat(styles['animationDuration']) || parseFloat(styles['transitionDuration']);

      clearTimeout(this.timeout);

      this.timeout = setTimeout(() => {
        fn();
      }, duration * 1000)
    }

    element.classList.remove(action, active);
  }

  didEnter = (e: Event) => {
    const childDOM = this.el

    if (!e || e.target !== childDOM) return;

    const { onAfterEnter } = this.props;
    const { enterActive, enterTo } = this.transitionClass;

    childDOM.classList.remove(enterActive, enterTo);

    childDOM.removeEventListener('transitionend', this.didEnter);
    childDOM.removeEventListener('animationend', this.didEnter);

    onAfterEnter && onAfterEnter(e);
  }

  didLeave = (e: Event) => {
    const childDOM = this.el
    if (!e || e.target !== childDOM) return;

    const { onAfterLeave, children } = this.props;
    const { leaveActive, leaveTo } = this.transitionClass;

    new Promise((resolve) => {
      if (this.isViewComponent(children)) {
        childDOM.removeEventListener('transitionend', this.didLeave);
        childDOM.removeEventListener('animationend', this.didLeave);

        requestAnimationFrame(() => {
          childDOM.style.display = 'none';
          childDOM.classList.remove(leaveActive, leaveTo);

          requestAnimationFrame(resolve);
        })
      } else {
        this.setState({ children: null }, resolve);
      }
    }).then(() => {
      onAfterLeave && onAfterLeave(e)
    })
  }

  toggleVisible() {
    const { onEnter } = this.props;
    const { enter, enterActive, enterTo, leaveActive, leaveTo } = this.transitionClass;
    const childDOM = this.el;

    childDOM.addEventListener('transitionend', this.didEnter);
    childDOM.addEventListener('animationend', this.didEnter);

    // this.animateElement(childDOM, enter, enterActive, this.didEnter);

    requestAnimationFrame(() => {
      // when hidden transition not end
      if (childDOM.classList.contains(leaveActive)) {
        childDOM.classList.remove(leaveActive, leaveTo);

        childDOM.removeEventListener('transitionend', this.didLeave);
        childDOM.removeEventListener('animationend', this.didLeave);
      }

      childDOM.style.display = '';
      childDOM.classList.add(enter, enterActive);

      onEnter && onEnter(new CustomEvent('transitionenter'));

      requestAnimationFrame(() => {
        childDOM.classList.remove(enter);
        childDOM.classList.add(enterTo);
      })
    })
  }

  toggleHidden() {
    const { onLeave } = this.props;
    const { leave, leaveActive, leaveTo, enterActive, enterTo } = this.transitionClass;
    const childDOM = this.el

    childDOM.addEventListener('transitionend', this.didLeave);
    childDOM.addEventListener('animationend', this.didLeave);

    // this.animateElement(childDOM, leave, leaveActive, this.didLeave);

    requestAnimationFrame(() => {
      // when enter transition not end
      if (childDOM.classList.contains(enterActive)) {
        childDOM.classList.remove(enterActive, enterTo);

        childDOM.removeEventListener('transitionend', this.didEnter);
        childDOM.removeEventListener('animationend', this.didEnter);
      }

      childDOM.classList.add(leave, leaveActive);

      onLeave && onLeave(new CustomEvent('transitionleave'));

      requestAnimationFrame(() => {
        childDOM.classList.remove(leave);
        childDOM.classList.add(leaveTo);
      })
    })
  }

  componentDidMount () {
    console.log(this.el)
  }
  
  render() {
    return this.state.children || null;
  }
}
