'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _exenv = require('exenv');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Card = function (_React$Component) {
	_inherits(Card, _React$Component);

	function Card() {
		var _ref;

		var _temp, _this, _ret;

		_classCallCheck(this, Card);

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Card.__proto__ || Object.getPrototypeOf(Card)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
			hover: false,
			transition: 'opacity',
			width: 0,
			height: 0
		}, _this.margin = _this.props.margin, _this.defaultArrowStyle = {
			color: '#fff',
			borderColor: 'rgba(0,0,0,.4)'
		}, _temp), _possibleConstructorReturn(_this, _ret);
	}

	_createClass(Card, [{
		key: 'getGlobalStyle',
		value: function getGlobalStyle() {
			if (!this.props.parentEl) {
				return { display: 'none' };
			}

			var style = {
				display: this.state.hover || this.props.active ? 'block' : 'none',
				position: 'absolute',
				padding: '5px',
				background: '#fff',
				boxShadow: '0 0 8px rgba(0,0,0,.3)',
				borderRadius: '3px',
				transition: this.state.transition + ' .3s ease-in-out, visibility .3s ease-in-out',
				opacity: this.state.hover || this.props.active ? 1 : 0,
				visibility: this.state.hover || this.props.active ? 'visible' : 'hidden',
				zIndex: 50
			};

			(0, _objectAssign2.default)(style, this.getStyle(this.props.position, this.props.arrow));

			return this.mergeStyle(style, this.props.style.style);
		}
	}, {
		key: 'getBaseArrowStyle',
		value: function getBaseArrowStyle() {
			return {
				position: 'absolute',
				content: '""',
				transition: 'all .3s ease-in-out'
			};
		}
	}, {
		key: 'getArrowStyle',
		value: function getArrowStyle() {
			var _props = this.props,
			    parentEl = _props.parentEl,
			    fullWidth = _props.fullWidth;

			var parentPosition = parentEl.getBoundingClientRect();
			var fgStyle = this.getBaseArrowStyle();
			var bgStyle = this.getBaseArrowStyle();
			fgStyle.zIndex = 60;
			bgStyle.zIndex = 55;

			var arrowStyle = (0, _objectAssign2.default)(this.defaultArrowStyle, this.props.style.arrowStyle);
			var bgBorderColor = arrowStyle.borderColor ? arrowStyle.borderColor : 'transparent';

			var fgSize = 8;
			var bgSize = 9;
			var fgColorBorder = '10px solid ' + arrowStyle.color;
			var fgTransBorder = fgSize + 'px solid transparent';
			var bgColorBorder = '11px solid ' + bgBorderColor;
			var bgTransBorder = bgSize + 'px solid transparent';

			var _props2 = this.props,
			    position = _props2.position,
			    arrow = _props2.arrow;


			if (position === 'left' || position === 'right') {
				fgStyle.top = '50%';
				fgStyle.borderTop = fgTransBorder;
				fgStyle.borderBottom = fgTransBorder;
				fgStyle.marginTop = -7;

				bgStyle.borderTop = bgTransBorder;
				bgStyle.borderBottom = bgTransBorder;
				bgStyle.top = '50%';
				bgStyle.marginTop = -8;

				if (position === 'left') {
					fgStyle.right = -10;
					fgStyle.borderLeft = fgColorBorder;
					bgStyle.right = -11;
					bgStyle.borderLeft = bgColorBorder;
				} else {
					fgStyle.left = -10;
					fgStyle.borderRight = fgColorBorder;
					bgStyle.left = -11;
					bgStyle.borderRight = bgColorBorder;
				}

				if (arrow === 'top') {
					fgStyle.top = this.margin;
					bgStyle.top = this.margin;
				}
				if (arrow === 'bottom') {
					fgStyle.top = null;
					fgStyle.bottom = this.margin - 7;
					bgStyle.top = null;
					bgStyle.bottom = this.margin - 8;
				}
			} else {
				fgStyle.left = '50%';
				fgStyle.marginLeft = -10;
				fgStyle.borderLeft = fgTransBorder;
				fgStyle.borderRight = fgTransBorder;
				bgStyle.left = '50%';
				bgStyle.marginLeft = -11;
				bgStyle.borderLeft = bgTransBorder;
				bgStyle.borderRight = bgTransBorder;

				if (position === 'top') {
					fgStyle.bottom = -10;
					fgStyle.borderTop = fgColorBorder;
					bgStyle.bottom = -11;
					bgStyle.borderTop = bgColorBorder;
				} else {
					fgStyle.top = -10;
					fgStyle.borderBottom = fgColorBorder;
					bgStyle.top = -11;
					bgStyle.borderBottom = bgColorBorder;
				}

				if (arrow === 'right') {
					fgStyle.left = null;
					fgStyle.right = this.margin + 1 - fgSize;
					fgStyle.marginLeft = 0;
					bgStyle.left = null;
					bgStyle.right = this.margin - fgSize;
					bgStyle.marginLeft = 0;
				}
				if (arrow === 'left') {
					fgStyle.left = this.margin + 1 - fgSize;
					fgStyle.marginLeft = 0;
					bgStyle.left = this.margin - fgSize;
					bgStyle.marginLeft = 0;
				}

				if (fullWidth && (arrow === 'right' || arrow === 'left')) {
					fgStyle.left = parentPosition.x + parentPosition.width / 2 + fgSize / 2 - this.margin;
					fgStyle.marginLeft = -10;
					fgStyle.right = null;
					bgStyle.left = fgStyle.left;
					bgStyle.marginLeft = -11;
					bgStyle.right = null;
				}
			}

			var _props$style$arrowSty = this.props.style.arrowStyle,
			    color = _props$style$arrowSty.color,
			    borderColor = _props$style$arrowSty.borderColor,
			    propsArrowStyle = _objectWithoutProperties(_props$style$arrowSty, ['color', 'borderColor']);

			return {
				fgStyle: this.mergeStyle(fgStyle, propsArrowStyle),
				bgStyle: this.mergeStyle(bgStyle, propsArrowStyle)
			};
		}
	}, {
		key: 'mergeStyle',
		value: function mergeStyle(style, theme) {
			if (theme) {
				var position = theme.position,
				    top = theme.top,
				    left = theme.left,
				    right = theme.right,
				    bottom = theme.bottom,
				    marginLeft = theme.marginLeft,
				    marginRight = theme.marginRight,
				    validTheme = _objectWithoutProperties(theme, ['position', 'top', 'left', 'right', 'bottom', 'marginLeft', 'marginRight']);

				return (0, _objectAssign2.default)(style, validTheme);
			}

			return style;
		}
	}, {
		key: 'getStyle',
		value: function getStyle(position, arrow) {
			var _this2 = this;

			var _props3 = this.props,
			    portalParent = _props3.portalParent,
			    parentEl = _props3.parentEl;

			var customPortalParent = portalParent && document.querySelector(portalParent);
			var tooltipPosition = parentEl.getBoundingClientRect();

			var scrollY = window.scrollY !== undefined ? window.scrollY : window.pageYOffset;
			var scrollX = window.scrollX !== undefined ? window.scrollX : window.pageXOffset;
			if (customPortalParent) {
				scrollX = customPortalParent.scrollLeft;
				scrollY = customPortalParent.scrollTop;
			}

			var _top = scrollY + tooltipPosition.top;
			var _left = scrollX + tooltipPosition.left;
			var right = window.innerWidth - tooltipPosition.right + scrollX;
			var style = {};

			var stylesFromPosition = {
				left: function left() {
					style.top = _top + parentEl.offsetHeight / 2 - _this2.state.height / 2;
					style.left = _left - _this2.state.width - _this2.margin;
				},
				right: function right() {
					style.top = _top + parentEl.offsetHeight / 2 - _this2.state.height / 2;
					style.left = _left + parentEl.offsetWidth + _this2.margin;
				},
				top: function top() {
					style.left = _left - _this2.state.width / 2 + parentEl.offsetWidth / 2;
					style.right = right - _this2.margin;
					style.top = _top - _this2.state.height - _this2.margin;
				},
				bottom: function bottom() {
					style.left = _left - _this2.state.width / 2 + parentEl.offsetWidth / 2;
					style.top = _top + parentEl.offsetHeight + _this2.margin;
				}
			};

			var stylesFromArrow = {
				left: function left() {
					style.left = _left + parentEl.offsetWidth / 2 - _this2.margin;
				},
				right: function right() {
					style.left = _left - _this2.state.width + parentEl.offsetWidth / 2 + _this2.margin;
				},
				top: function top() {
					style.top = _top + parentEl.offsetHeight / 2 - _this2.margin;
				},
				bottom: function bottom() {
					style.top = _top + parentEl.offsetHeight / 2 - _this2.state.height + _this2.margin;
				}
			};

			executeFunctionIfExist(stylesFromPosition, position);
			executeFunctionIfExist(stylesFromArrow, arrow);

			return style;
		}
	}, {
		key: 'checkWindowPosition',
		value: function checkWindowPosition(style, arrowStyle) {
			if (this.props.position === 'top' || this.props.position === 'bottom') {

				if (this.props.fullWidth) {
					style.left = this.margin;
					style.right = this.margin;
					style.width = 'auto';

					return { style: style, arrowStyle: arrowStyle };
				}

				if (style.left < 0) {
					var offset = style.left;
					style.left = this.margin;
					arrowStyle.fgStyle.marginLeft += offset;
					arrowStyle.bgStyle.marginLeft += offset;
				} else {
					var rightOffset = style.left + this.state.width - window.innerWidth;
					if (rightOffset > 0) {
						var originalLeft = style.left;
						style.left = window.innerWidth - this.state.width - this.margin;
						arrowStyle.fgStyle.marginLeft += originalLeft - style.left;
						arrowStyle.bgStyle.marginLeft += originalLeft - style.left;
					}
				}
			}

			return { style: style, arrowStyle: arrowStyle };
		}
	}, {
		key: 'handleMouseEnter',
		value: function handleMouseEnter() {
			this.props.active && this.setState({ hover: true });
		}
	}, {
		key: 'handleMouseLeave',
		value: function handleMouseLeave() {
			this.setState({ hover: false });
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			this.updateSize();
		}
	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps) {
			var _this3 = this;

			if (this.margin !== nextProps.margin) {
				this.margin = nextProps.margin;
			}
			this.setState({ transition: this.state.hover || this.props.active ? 'all' : 'opacity' }, function () {
				_this3.updateSize();
			});
		}
	}, {
		key: 'updateSize',
		value: function updateSize() {
			var self = _reactDom2.default.findDOMNode(this);
			this.setState({
				width: self && self.offsetWidth,
				height: self && self.offsetHeight
			});
		}
	}, {
		key: 'render',
		value: function render() {
			var _checkWindowPosition = this.checkWindowPosition(this.getGlobalStyle(), this.getArrowStyle()),
			    style = _checkWindowPosition.style,
			    arrowStyle = _checkWindowPosition.arrowStyle;

			return _react2.default.createElement(
				'div',
				{ style: style, onMouseEnter: this.handleMouseEnter.bind(this), onMouseLeave: this.handleMouseLeave.bind(this) },
				this.props.arrow ? _react2.default.createElement(
					'div',
					null,
					_react2.default.createElement('span', { style: arrowStyle.fgStyle }),
					_react2.default.createElement('span', { style: arrowStyle.bgStyle })
				) : null,
				this.props.children
			);
		}
	}]);

	return Card;
}(_react2.default.Component);

Card.propTypes = {
	active: _propTypes2.default.bool,
	position: _propTypes2.default.oneOf(['top', 'right', 'bottom', 'left']),
	arrow: _propTypes2.default.oneOf([null, 'center', 'top', 'right', 'bottom', 'left']),
	style: _propTypes2.default.object,
	closeFunc: _propTypes2.default.func,
	fullWidth: _propTypes2.default.bool,
	portalParent: _propTypes2.default.string,
	margin: _propTypes2.default.number
};
Card.defaultProps = {
	active: false,
	position: 'right',
	arrow: null,
	style: { style: {}, arrowStyle: {} },
	fullWidth: false,
	margin: 15
};

var ToolTip = function (_React$Component2) {
	_inherits(ToolTip, _React$Component2);

	function ToolTip(props, context) {
		_classCallCheck(this, ToolTip);

		var _this4 = _possibleConstructorReturn(this, (ToolTip.__proto__ || Object.getPrototypeOf(ToolTip)).call(this, props, context));

		_this4.portalNodes = {};

		if (_exenv.canUseDOM) {
			_this4.root = null;
			_this4.handleRootRef = function (root) {
				if (root !== _this4.root) {
					if (_this4.root) {
						_this4.root.removeEventListener('click', _this4.handleInClick);
					}
					if (root) {
						root.addEventListener('click', _this4.handleInClick, true);
					}
				}
				_this4.root = root;
			};

			_this4.isInClick = false;
			_this4.handleInClick = function () {
				_this4.isInClick = true;
			};

			_this4.handleOutClick = function (event) {
				var parentEL = document.querySelector(_this4.props.parent);
				var isOutClick = !_this4.isInClick && event.target !== parentEL && parentEL && !parentEL.contains(event.target);
				_this4.isInClick = false;

				var _this4$props = _this4.props,
				    closeFunc = _this4$props.closeFunc,
				    active = _this4$props.active;

				if (isOutClick && typeof closeFunc === 'function') {

					active && closeFunc();
				}
			};
			document.addEventListener('click', _this4.handleOutClick, true);
		}
		return _this4;
	}

	_createClass(ToolTip, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			if (!this.props.active) {
				return;
			}

			this.renderPortal(this.props);
		}
	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps) {
			var _this5 = this;

			if (!this.portalNodes[this.props.group] && !nextProps.active || !this.props.active && !nextProps.active) {
				return;
			}

			if (this.portalNodes[this.props.group] && this.portalNodes[this.props.group].timeout) {
				clearTimeout(this.portalNodes[this.props.group].timeout);
			}

			if (this.props.active && !nextProps.active) {
				this.portalNodes[this.props.group].timeout = setTimeout(function () {
					_this5.renderPortal(nextProps);
				}, this.props.tooltipTimeout);
			} else {
				this.renderPortal(nextProps);
			}
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			if (this.portalNodes[this.props.group]) {

				_reactDom2.default.unmountComponentAtNode(this.portalNodes[this.props.group].node);
				clearTimeout(this.portalNodes[this.props.group].timeout);
				this.portalNodes = {};
			}

			if (_exenv.canUseDOM) {
				if (this.root) {
					this.root.removeEventListener('click', this.handleInClick);
				}
				document.removeEventListener('click', this.handleOutClick);
			}
		}
	}, {
		key: 'createPortal',
		value: function createPortal() {
			var portalParent = this.props.portalParent;


			this.portalNodes[this.props.group] = {
				node: document.createElement('div'),
				timeout: false
			};
			this.portalNodes[this.props.group].node.className = 'ToolTipPortal';
			this.portalNodes[this.props.group].node.ref = this.handleRootRef;

			if (portalParent && document.querySelector(portalParent)) {
				document.querySelector(portalParent).appendChild(this.portalNodes[this.props.group].node);
			} else {
				document.body.appendChild(this.portalNodes[this.props.group].node);
			}
		}
	}, {
		key: 'renderPortal',
		value: function renderPortal(props) {
			var render = true;
			if (!this.portalNodes[this.props.group]) {
				render = false;
				this.createPortal();
			}

			var parent = props.parent,
			    other = _objectWithoutProperties(props, ['parent']);

			var onAfterOpen = this.props.onAfterOpen;

			var node = this.portalNodes[this.props.group].node;
			var parentEl = document.querySelector(parent);
			(0, _reactDom.unstable_renderSubtreeIntoContainer)(this, _react2.default.createElement(Card, _extends({ parentEl: document.querySelector(parent) }, other)), this.portalNodes[this.props.group].node);

			if (!this.props.active && props.active && node && onAfterOpen) {
				this.ignoreScroll = true;
				setTimeout(function () {
					onAfterOpen(node.querySelector('div'));
				}, 0);
			}
		}
	}, {
		key: 'shouldComponentUpdate',
		value: function shouldComponentUpdate() {
			return false;
		}
	}, {
		key: 'render',
		value: function render() {
			return null;
		}
	}]);

	return ToolTip;
}(_react2.default.Component);

ToolTip.propTypes = {
	parent: _propTypes2.default.string.isRequired,
	portalParent: _propTypes2.default.string,
	active: _propTypes2.default.bool,
	group: _propTypes2.default.string,
	tooltipTimeout: _propTypes2.default.number,
	closeFunc: _propTypes2.default.func,
	onAfterOpen: _propTypes2.default.func,
	scrollHide: _propTypes2.default.bool,
	fullWidth: _propTypes2.default.bool,
	margin: _propTypes2.default.number
};
ToolTip.defaultProps = {
	active: false,
	group: 'main',
	tooltipTimeout: 500,
	fullWidth: false,
	portalParent: ''
};
exports.default = ToolTip;


var executeFunctionIfExist = function executeFunctionIfExist(object, key) {
	if (Object.prototype.hasOwnProperty.call(object, key)) {
		object[key]();
	}
};