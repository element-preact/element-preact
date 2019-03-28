/* @flow */

import { h, VNode } from 'preact';
import Component from '../libs/Component';
import Transition from '../libs/Transition';
import View from '../libs/View';

type State = {
  visible: boolean
};

type Props = {
    onClose?: () => void,
    title: string,
    description?: string,
    type?: string,
    closable?: boolean,
    closeText?: string,
    showIcon?: boolean
}

const TYPE_CLASSES_MAP: {[type: string]: string} = {
  'success': 'el-icon-circle-check',
  'warning': 'el-icon-warning',
  'error': 'el-icon-circle-cross'
};

export default class Alert extends Component<Props, State> {
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      visible: true
    };
  }

  close() {
    this.setState({
      visible: false
    });
  }

  onAfterLeave() {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  render() {
    const {closable = true, type='info'} = this.props;
    return (
      <Transition name="el-alert-fade" onAfterLeave={this.onAfterLeave.bind(this)}>
        <View show={this.state.visible}>
          <div style={this.style()} className={this.className('el-alert', `el-alert--${ type }`)}>
            {
              this.props.showIcon && <i className={this.classNames('el-alert__icon', TYPE_CLASSES_MAP[this.props.type] || 'el-icon-information', {
                'is-big': this.props.description
              })} />
            }
            <div className="el-alert__content">
              {
                this.props.title && (
                  <span className={this.classNames('el-alert__title', {
                    'is-bold': this.props.description
                  })}>{this.props.title}</span>
                )
              }
              {
                this.props.description && <p className="el-alert__description">{this.props.description}</p>
              }
              <View show={closable}>
                <i className={this.classNames('el-alert__closebtn', this.props.closeText ? 'is-customed' : 'el-icon-close')} onClick={this.close.bind(this)}>{this.props.closeText}</i>
              </View>
            </div>
          </div>
        </View>
      </Transition>
    )
  }
}

Alert.defaultProps = {
  type: 'info',
  closable: true
};
