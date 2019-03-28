import { h, VNode } from 'preact';
import Component from '../libs/Component';
import { Scrollbar } from '../scrollbar';
import Tag from '../tag'
import Input from '../input'
import Popper from 'popper.js';
import Transition from '../libs/transition'
import View from '../libs/view'

const sizeMap: { [size: string]: number } = {
    'large': 42,
    'small': 30,
    'mini': 22
};

type Props = {
    name?: string
    value?: any
    size?: number
    disabled?: boolean
    clearable?: boolean
    filterable?: boolean
    loading?: boolean
    remote?: boolean
    remoteMethod?: (value: any) => void
    filterMethod?: (value: any) => void
    multiple?: boolean
    placeholder?: string
    onChange?: (values: any, value?: any) => void
    onVisibleChange?: (visible: boolean) => void
    onRemoveTag?: (value: any) => void
    onClear?: () => void
}

type State = {
    options: Array<any>
    isSelect: boolean
    inputLength: number
    inputWidth: number
    inputHovering: boolean
    filteredOptionsCount: number
    optionsCount: number
    hoverIndex: number
    bottomOverflowBeforeHidden: number
    cachedPlaceHolder: string
    currentPlaceholder: string
    selectedLabel: string
    value: any
    visible: boolean
    query: string
    selected: any
    voidRemoteQuery: boolean
    valueChangeBySelected: boolean
    selectedInit: boolean
    dropdownUl?: HTMLElement
};

export default class extends Component<Props, State> {
    state: State
    deleteTag: any;
    handleIconClick = (event: Event) => {
        if (this.iconClass().indexOf('circle-close') > -1) {
            this.deleteSelected(event);
        } else {
            this.toggleMenu();
        }
    }
    onMouseDown: any;
    onMouseEnter: any;
    onMouseLeave: any;
    debouncedOnInputChange: any;
    onEnter: any;
    onAfterLeave: any;

    getChildContext() {
        return {
            component: this.props
        }
    }

    constructor (props: Props) {
        super(props)
        this.state = {
            options: [],
            isSelect: true,
            inputLength: 20,
            inputWidth: 0,
            inputHovering: false,
            filteredOptionsCount: 0,
            optionsCount: 0,
            hoverIndex: -1,
            bottomOverflowBeforeHidden: 0,
            cachedPlaceHolder: props.placeholder || '请选择',
            currentPlaceholder: props.placeholder || '请选择',
            selectedLabel: '',
            selectedInit: false,
            visible: false,
            selected: undefined,
            value: props.value,
            valueChangeBySelected: false,
            voidRemoteQuery: false,
            query: ''
        };

        if (props.multiple) {
            this.state.selectedInit = true;
            this.state.selected = [];
        }

        if (props.remote) {
            this.state.voidRemoteQuery = true;
        }
    }

    componentWillReceiveProps(props: Props) {
        if (props.placeholder != this.props.placeholder) {
            this.setState({
                currentPlaceholder: props.placeholder
            });
        }

        if (props.value != this.props.value) {
            this.setState({
                value: props.value
            }, () => {
                this.handleValueChange();
            });
        }
    }

    handleValueChange() {
        const { multiple } = this.props;
        const { value, options } = this.state;

        if (multiple && Array.isArray(value)) {
            this.setState({
                selected: options.reduce((prev, curr) => {
                    return value.indexOf(curr.props.value) > -1 ? prev.concat(curr) : prev;
                }, [])
            }, () => {
                this.onSelectedChange(this.state.selected, false);
            });
        } else {
            const selected = options.filter(option => {
                return option.props.value === value
            })[0];

            if (selected) {
                this.state.selectedLabel = selected.props.label || selected.props.value;
            }
        }
    }

    tags: HTMLElement
    reference: HTMLElement
    popper: HTMLElement
    popperJS: Popper
    resetInputHeight() {
        let inputChildNodes = this.reference.childNodes;
        let input = [].filter.call(inputChildNodes, item => item.tagName === 'INPUT')[0];

        input.style.height = Math.max(this.tags.clientHeight + 6, sizeMap[this.props.size] || 36) + 'px';

        if (this.popperJS) {
            this.popperJS.update();
        }
    }

    input: HTMLInputElement
    onSelectedChange(val: any, bubble: boolean = true) {
        const { form } = this.context;
        const { multiple, filterable, onChange } = this.props;
        let { query, hoverIndex, inputLength, selectedInit, currentPlaceholder, cachedPlaceHolder, valueChangeBySelected } = this.state;

        if (multiple) {
            if (val.length > 0) {
                currentPlaceholder = '';
            } else {
                currentPlaceholder = cachedPlaceHolder;
            }

            this.setState({ currentPlaceholder }, () => {
                this.resetInputHeight();
            });

            valueChangeBySelected = true;

            if (bubble) {
                onChange && onChange(val.map(item => item.props.value), val);
                form && form.onFieldChange();
            }

            if (filterable) {
                query = '';
                hoverIndex = -1;
                inputLength = 20;

                this.input.focus();
            }

            this.setState({ valueChangeBySelected, query, hoverIndex, inputLength }, () => {
                if (this.input) {
                    this.input.value = '';
                }
            });
        } else {
            if (selectedInit) {
                return this.setState({
                    selectedInit: false
                });
            }

            if (bubble) {
                onChange && onChange(val.props.value, val);
                form && form.onFieldChange();
            }
        }
    }

    toggleMenu = () => {
        const { filterable, disabled } = this.props;
        const { query, visible } = this.state;

        if (filterable && query === '' && visible) {
            return;
        }

        if (!disabled) {
            this.setState({
                visible: !visible
            });
        }
    }
    managePlaceholder = () => {
        let { currentPlaceholder, cachedPlaceHolder } = this.state;

        if (currentPlaceholder !== '') {
            currentPlaceholder = this.input.value ? '' : cachedPlaceHolder;
        }

        this.setState({ currentPlaceholder });
    }
    toggleLastOptionHitState(hit?: boolean): any {
        const { selected } = this.state;

        if (!Array.isArray(selected)) return;

        const option = selected[selected.length - 1];

        if (!option) return;

        if (hit === true || hit === false) {
            return option.hitState = hit;
        }

        option.hitState = !option.hitState;

        return option.hitState;
    }
    resetInputState(e: any) {
        if (e.keyCode !== 8) {
            this.toggleLastOptionHitState(false);
        }

        this.setState({
            inputLength: this.input.value.length * 15 + 20
        });
    }
    deletePrevTag(e: any) {
        if (e.target instanceof HTMLInputElement && e.target.value.length <= 0 && !this.toggleLastOptionHitState()) {
            const { selected } = this.state;
            selected.pop();
            this.setState({ selected });
        }
    }
    selectOption() {
        let { hoverIndex, options } = this.state;

        if (options[hoverIndex]) {
            this.onOptionClick(options[hoverIndex]);
        }
    }
    onOptionClick(option: any) {
        const { multiple } = this.props;
        let { visible, selected, selectedLabel } = this.state;

        if (!multiple) {
            selected = option;
            selectedLabel = option.currentLabel();
            visible = false;
        } else {
            let optionIndex = -1;

            selected = selected.slice(0);

            selected.forEach((item, index) => {
                if (item === option || item.props.value === option.props.value) {
                    optionIndex = index;
                }
            });

            if (optionIndex > -1) {
                selected.splice(optionIndex, 1);
            } else {
                selected.push(option);
            }
        }

        this.setState({ selected, selectedLabel }, () => {
            if (!multiple) {
                this.onSelectedChange(this.state.selected);
            }

            this.setState({ visible });
        });
    }

    navigateOptions(direction: string) {
        let { visible, hoverIndex, options } = this.state;

        if (!visible) {
            return this.setState({
                visible: true
            });
        }

        let skip;

        if (options.length != options.filter(item => item.props.disabled === true).length) {
            if (direction === 'next') {
                hoverIndex++;

                if (hoverIndex === options.length) {
                    hoverIndex = 0;
                }

                if (options[hoverIndex].props.disabled === true ||
                    options[hoverIndex].props.groupDisabled === true ||
                    !options[hoverIndex].state.visible) {
                    skip = 'next';
                }
            }

            if (direction === 'prev') {
                hoverIndex--;

                if (hoverIndex < 0) {
                    hoverIndex = options.length - 1;
                }

                if (options[hoverIndex].props.disabled === true ||
                    options[hoverIndex].props.groupDisabled === true ||
                    !options[hoverIndex].state.visible) {
                    skip = 'prev';
                }
            }
        }

        this.setState({ hoverIndex, options }, () => {
            if (skip) {
                this.navigateOptions(skip);
            }
        });
    }

    deleteSelected(e: Event) {
        e.stopPropagation();

        if (this.state.selectedLabel != '') {
            this.setState({
                selected: {},
                selectedLabel: '',
                visible: false
            });

            this.context.form && this.context.form.onFieldChange();

            if (this.props.onChange) {
                this.props.onChange('');
            }

            if (this.props.onClear) {
                this.props.onClear();
            }
        }
    }
    showCloseIcon(): boolean {
        let criteria = this.props.clearable && this.state.inputHovering && !this.props.multiple && this.state.options.indexOf(this.state.selected) > -1;

        if (!this.root) return false;

        let icon = this.root.querySelector('.el-input__icon');

        if (icon) {
            if (criteria) {
                icon.addEventListener('click', this.deleteSelected.bind(this));
                icon.classList.add('is-show-close');
            } else {
                icon.removeEventListener('click', this.deleteSelected.bind(this));
                icon.classList.remove('is-show-close');
            }
        }

        return criteria;
    }
    iconClass(): string {
        return this.showCloseIcon() ? 'circle-close' : (this.props.remote && this.props.filterable ? '' : `caret-top ${this.state.visible ? 'is-reverse' : ''}`);
    }
    emptyText() {
        const { loading, filterable } = this.props;
        const { voidRemoteQuery, options, filteredOptionsCount } = this.state;

        if (loading) {
            return '加载中...';
        } else {
            if (voidRemoteQuery) {
                this.state.voidRemoteQuery = false;

                return false;
            }

            if (filterable && filteredOptionsCount === 0) {
                return '无匹配数据';
            }

            if (options.length === 0) {
                return '无匹配数据';
            }
        }

        return null;
    }

    root: HTMLDivElement
    timeout: NodeJS.Timer
    render () {
        const { multiple, size, disabled, filterable, loading } = this.props;
        const { selected, inputWidth, inputLength, query, selectedLabel, visible, options, filteredOptionsCount, currentPlaceholder } = this.state;

        return <div ref={root => this.root = root} style={this.style()} className={this.className('el-select')}>
            {multiple && <div ref={tags => this.tags = tags} className="el-select__tags" onClick={this.toggleMenu.bind(this)} style={{
                maxWidth: inputWidth - 32
            }}>
                {
                    selected.map(el => {
                        return (
                            <Tag
                                type="primary"
                                key={el.props.value}
                                hit={el.hitState}
                                closable={!disabled}
                                closeTransition={true}
                                onClose={this.deleteTag.bind(this, el)}
                            >
                                <span className="el-select__tags-text">{el.currentLabel()}</span>
                            </Tag>
                        )
                    })
                }
                {
                    filterable && (
                        <input
                            ref={input => this.input = input}
                            type="text"
                            className={this.classNames('el-select__input', size && `is-${size}`)}
                            style={{ width: inputLength, maxWidth: inputWidth - 42 }}
                            disabled={disabled}
                            placeholder={query}
                            onKeyUp={this.managePlaceholder.bind(this)}
                            onKeyDown={e => {
                                this.resetInputState(e);
                                switch (e.keyCode) {
                                    case 27:
                                        this.setState({ visible: false });
                                        e.preventDefault();
                                        break;
                                    case 8:
                                        this.deletePrevTag(e);
                                        break;
                                    case 13:
                                        this.selectOption();
                                        e.preventDefault();
                                        break;
                                    case 38:
                                        this.navigateOptions('prev');
                                        e.preventDefault();
                                        break;
                                    case 40:
                                        this.navigateOptions('next');
                                        e.preventDefault();
                                        break;
                                    default:
                                        break;
                                }
                            }}
                            onChange={e => {
                                clearTimeout(this.timeout);

                                this.timeout = setTimeout(() => {
                                    this.setState({
                                        query: this.state.value
                                    });
                                }, 300);

                                this.state.value = e.target['value'];
                            }}
                        />
                    )
                }
            </div>}
            <Input
                ref={r => this.reference = r}
                value={selectedLabel}
                type="text"
                placeholder={currentPlaceholder}
                name="name"
                size={'small'}
                disabled={disabled}
                readOnly={!filterable || multiple}
                icon={this.iconClass() || undefined}
                onChange={value => this.setState({ selectedLabel: value })}
                onIconClick={this.handleIconClick}
                onMouseDown={this.onMouseDown}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
                onKeyUp={this.debouncedOnInputChange}
                onKeyDown={e => {
                    switch (e.keyCode) {
                        case 9:
                        case 27:
                            this.setState({ visible: false });
                            e.preventDefault();
                            break;
                        case 13:
                            this.selectOption();
                            e.preventDefault();
                            break;
                        case 38:
                            this.navigateOptions('prev');
                            e.preventDefault();
                            break;
                        case 40:
                            this.navigateOptions('next');
                            e.preventDefault();
                            break;
                        default:
                            break;
                    }
                }}
            />
            <Transition name="el-zoom-in-top" onEnter={this.onEnter} onAfterLeave={this.onAfterLeave}>
                <View show={visible && this.emptyText() !== false}>
                    <div
                        ref={popper => this.popper = popper}
                        className={this.classNames('el-select-dropdown', { 'is-multiple': multiple })}
                        style={{ minWidth: inputWidth }}
                    >
                        <View show={options.length > 0 && filteredOptionsCount > 0 && !loading}>
                            <Scrollbar
                                viewComponent="ul"
                                wrapClass="el-select-dropdown__wrap"
                                viewClass="el-select-dropdown__list"
                            >
                                {this.props.children}
                            </Scrollbar>
                        </View>
                        {this.emptyText() && <p className="el-select-dropdown__empty">{this.emptyText()}</p>}
                    </div>
                </View>
            </Transition>
        </div>
    }
}