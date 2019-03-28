import { h } from 'preact';
import Component from '../libs/Component';
import { BAR_MAP, renderThumbStyle } from './util';
import { on, off } from '../libs/utils/dom';


type Props = {
  vertical?: boolean
  size?: number | string
  move?: number | string
  getParentWrap: () => any
}

export class Bar extends Component<Props> {

  get bar() {
    return BAR_MAP[this.props.vertical ? 'vertical' : 'horizontal'];
  }

  get wrap() {
    return this.props.getParentWrap();
  }

  clickThumbHandler = (e: any) => {
    this.startDrag(e);
    this[this.bar.axis] = (e.currentTarget[this.bar.offset] - (e[this.bar.client] - e.currentTarget.getBoundingClientRect()[this.bar.direction]));
  }

  clickTrackHandler = (e: any) => {
    const offset = Math.abs(e.target.getBoundingClientRect()[this.bar.direction] - e[this.bar.client]);
    const thumbHalf = (this.thumbRef[this.bar.offset] / 2);
    const thumbPositionPercentage = ((offset - thumbHalf) * 100 / this.rootRef[this.bar.offset]);

    this.wrap[this.bar.scroll] = (thumbPositionPercentage * this.wrap[this.bar.scrollSize] / 100);
  }

  cursorDown: boolean
  startDrag = (e: any) => {
    e.nativeEvent.stopImmediatePropagation;
    this.cursorDown = true;

    on(document, 'mousemove', this.mouseMoveDocumentHandler);
    on(document, 'mouseup', this.mouseUpDocumentHandler);
    document['onselectstart'] = () => false;
  }

  rootRef: HTMLDivElement
  thumbRef: HTMLDivElement
  mouseMoveDocumentHandler = (e: any) => {
    if (this.cursorDown === false) return;
    const prevPage = this[this.bar.axis];

    if (!prevPage) return;

    const offset = (e[this.bar.client] - this.rootRef.getBoundingClientRect()[this.bar.direction]);
    const thumbClickPosition = (this.thumbRef[this.bar.offset] - prevPage);
    const thumbPositionPercentage = ((offset - thumbClickPosition) * 100 / this.rootRef[this.bar.offset]);

    this.wrap[this.bar.scroll] = (thumbPositionPercentage * this.wrap[this.bar.scrollSize] / 100);
  }

  mouseUpDocumentHandler() {
    this.cursorDown = false;
    this[this.bar.axis] = 0;
    off(document, 'mousemove', this.mouseMoveDocumentHandler);
    document['onselectstart'] = null;
  }

  render() {
    const { size, move } = this.props;

    return (
      <div
        ref={root => this.rootRef = root}
        className={this.classNames('el-scrollbar__bar', `is-${this.bar.key}`)}
        onMouseDown={ this.clickTrackHandler } >
        <div
          ref={thumb => this.thumbRef = thumb}
          className="el-scrollbar__thumb"
          onMouseDown={ this.clickThumbHandler }
          style={ renderThumbStyle({ size, move, bar: this.bar }) }>
        </div>
      </div>
    );
  }
}

