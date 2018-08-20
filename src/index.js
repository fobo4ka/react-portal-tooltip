import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM, {unstable_renderSubtreeIntoContainer as renderSubtreeIntoContainer} from 'react-dom'
import assign from 'object-assign'
import { canUseDOM } from 'exenv'

class Card extends React.Component {
	static propTypes = {
		active: PropTypes.bool,
		position: PropTypes.oneOf([
			'top',
			'right',
			'bottom',
			'left'
		]),
		arrow: PropTypes.oneOf([
			null,
			'center',
			'top',
			'right',
			'bottom',
			'left'
		]),
		style: PropTypes.object,
		closeFunc: PropTypes.func,
		fullWidth: PropTypes.bool,
		portalParent: PropTypes.string,
		margin: PropTypes.number,
		isDisableCloseOnHover: PropTypes.bool
	}
	static defaultProps = {
		active: false,
		position: 'right',
		arrow: null,
		style: {style: {}, arrowStyle: {}},
		fullWidth: false,
		margin: 15,
		isDisableCloseOnHover: true
	}

	constructor(props) {
		super(props)

		this.margin = this.props.margin
		this.defaultArrowStyle = {
			color: '#fff',
			borderColor: 'rgba(0,0,0,.4)'
		}

		this.state = {
			hover: false,
			transition: 'opacity',
			width: 0,
			height: 0,
			styles: this.checkWindowPosition(this.getGlobalStyle(props, false, 'opacity'), this.getArrowStyle(props))
		}
	}
	getGlobalStyle(props, hover, transition) {
		if (!props.parentEl) {
			return {display: 'none'}
		}

		let style = {
			display: hover || props.active ? 'block' : 'none',
			position: 'absolute',
			padding: '5px',
			background: '#fff',
			boxShadow: '0 0 8px rgba(0,0,0,.3)',
			borderRadius: '3px',
			transition: `${transition} .3s ease-in-out, visibility .3s ease-in-out`,
			opacity: hover || props.active ? 1 : 0,
			visibility: hover || props.active ? 'visible' : 'hidden',
			zIndex: 50
		}

		assign(style, this.getStyle(props.position, props.arrow, props.portalParent, props.parentEl))

		return this.mergeStyle(style, props.style.style)
	}
	getBaseArrowStyle() {
		return {
			position: 'absolute',
			content: '""',
			transition: 'all .3s ease-in-out'
		}
	}
	getArrowStyle() {
		const { parentEl, fullWidth } = props
		const parentPosition = parentEl.getBoundingClientRect()
		let fgStyle = this.getBaseArrowStyle()
		let bgStyle = this.getBaseArrowStyle()
		fgStyle.zIndex = 60
		bgStyle.zIndex = 55

		let arrowStyle = assign(this.defaultArrowStyle, props.style.arrowStyle)
		let bgBorderColor = arrowStyle.borderColor ? arrowStyle.borderColor : 'transparent'

		let fgSize = 8
		let bgSize = 9
		let fgColorBorder = `10px solid ${arrowStyle.color}`
		let fgTransBorder = `${fgSize}px solid transparent`
		let bgColorBorder = `11px solid ${bgBorderColor}`
		let bgTransBorder = `${bgSize}px solid transparent`

		let {position, arrow} = props

		if (position === 'left' || position === 'right') {
			fgStyle.top = '50%'
			fgStyle.borderTop = fgTransBorder
			fgStyle.borderBottom = fgTransBorder
			fgStyle.marginTop = -7

			bgStyle.borderTop = bgTransBorder
			bgStyle.borderBottom = bgTransBorder
			bgStyle.top = '50%'
			bgStyle.marginTop = -8

			if (position === 'left') {
				fgStyle.right = -10
				fgStyle.borderLeft = fgColorBorder
				bgStyle.right = -11
				bgStyle.borderLeft = bgColorBorder
			}
			else {
				fgStyle.left = -10
				fgStyle.borderRight = fgColorBorder
				bgStyle.left = -11
				bgStyle.borderRight = bgColorBorder
			}

			if (arrow === 'top') {
				fgStyle.top = this.margin
				bgStyle.top = this.margin
			}
			if (arrow === 'bottom') {
				fgStyle.top = null
				fgStyle.bottom = this.margin - 7
				bgStyle.top = null
				bgStyle.bottom = this.margin - 8
			}
		}
		else {
			fgStyle.left = '50%'
			fgStyle.marginLeft = -10
			fgStyle.borderLeft = fgTransBorder
			fgStyle.borderRight = fgTransBorder
			bgStyle.left = '50%'
			bgStyle.marginLeft = -11
			bgStyle.borderLeft = bgTransBorder
			bgStyle.borderRight = bgTransBorder

			if (position === 'top') {
				fgStyle.bottom = -9
				fgStyle.borderTop = fgColorBorder
				bgStyle.bottom = -10
				bgStyle.borderTop = bgColorBorder
			}
			else {
				fgStyle.top = -9
				fgStyle.borderBottom = fgColorBorder
				bgStyle.top = -10
				bgStyle.borderBottom = bgColorBorder
			}

			if (arrow === 'right') {
				fgStyle.left = null
				fgStyle.right = this.margin + 1 - fgSize
				fgStyle.marginLeft = 0
				bgStyle.left = null
				bgStyle.right = this.margin - fgSize
				bgStyle.marginLeft = 0
			}
			if (arrow === 'left') {
				fgStyle.left = this.margin + 1 - fgSize
				fgStyle.marginLeft = 0
				bgStyle.left = this.margin - fgSize
				bgStyle.marginLeft = 0
			}

			if (fullWidth && (arrow === 'right' || arrow === 'left')) {
				fgStyle.left = parentPosition.x + parentPosition.width/2 + fgSize/2 - this.margin
				fgStyle.marginLeft = -10
				fgStyle.right = null
				bgStyle.left = fgStyle.left
				bgStyle.marginLeft = -11
				bgStyle.right = null
			}
		}

		let {color, borderColor, ...propsArrowStyle} = props.style.arrowStyle

		return {
			fgStyle: this.mergeStyle(fgStyle, propsArrowStyle),
			bgStyle: this.mergeStyle(bgStyle, propsArrowStyle)
		}
	}
	mergeStyle(style, theme) {
		if (theme) {
			let {position, top, left, right, bottom, marginLeft, marginRight, ...validTheme} = theme

			return assign(style, validTheme)
		}

		return style
	}
	getStyle(position, arrow, portalParent, parentEl) {
		const customPortalParent = portalParent && document.querySelector(portalParent)
		let tooltipPosition = parentEl.getBoundingClientRect()

		let scrollY = (window.scrollY !== undefined) ? window.scrollY : window.pageYOffset
		let scrollX = (window.scrollX !== undefined) ? window.scrollX : window.pageXOffset
		if (customPortalParent) {
			scrollX = customPortalParent.scrollLeft - customPortalParent.getBoundingClientRect().left;
			scrollY = customPortalParent.scrollTop - customPortalParent.getBoundingClientRect().top;
		}

		let top = scrollY + tooltipPosition.top
		let left = scrollX + tooltipPosition.left
		let right = window.innerWidth - tooltipPosition.right + scrollX
		let style = {}

		const stylesFromPosition = {
			left: () => {
				style.top = top + parentEl.offsetHeight / 2 - this.state.height / 2
				style.left = left - this.state.width - this.margin
			},
			right: () => {
				style.top = top + parentEl.offsetHeight / 2 - this.state.height / 2
				style.left = left + parentEl.offsetWidth + this.margin
			},
			top: () => {
				style.left = left - this.state.width / 2 + parentEl.offsetWidth / 2
				style.right = right - this.margin
				style.top = top - this.state.height - this.margin
			},
			bottom: () => {
				style.left = left - this.state.width / 2 + parentEl.offsetWidth / 2
				style.top = top + parentEl.offsetHeight + this.margin
			},
		}

		const stylesFromArrow = {
			left: () => {
				style.left = left + parentEl.offsetWidth / 2 - this.margin
			},
			right: () => {
				style.left = left - this.state.width + parentEl.offsetWidth / 2 + this.margin
			},
			top: () => {
				style.top = top + parentEl.offsetHeight / 2 - this.margin
			},
			bottom: () => {
				style.top = top + parentEl.offsetHeight / 2 - this.state.height + this.margin
			},
		}

		executeFunctionIfExist(stylesFromPosition, position)
		executeFunctionIfExist(stylesFromArrow, arrow)

		return style
	}
	checkWindowPosition(style, arrowStyle) {
		if (this.props.position === 'top' || this.props.position === 'bottom') {

			if (this.props.fullWidth) {
				style.left = this.margin
				style.right = this.margin
				style.width = 'auto'

				return {style, arrowStyle}
			}

			if (style.left < 0) {
				let offset = style.left
				style.left = this.margin
				arrowStyle.fgStyle.marginLeft += offset
				arrowStyle.bgStyle.marginLeft += offset
			}
			else {
				let rightOffset = style.left + this.state.width - window.innerWidth
				if (rightOffset > 0) {
					let originalLeft = style.left
					style.left = window.innerWidth - this.state.width - this.margin
					arrowStyle.fgStyle.marginLeft += originalLeft - style.left
					arrowStyle.bgStyle.marginLeft += originalLeft - style.left
				}
			}
		}

		return {style, arrowStyle}
	}
	handleMouseEnter() {
		this.props.active && this.setState({hover: true})
	}
	handleMouseLeave() {
		this.setState({hover: false})
	}

	componentDidMount() {
		this.updateSize()
	}

	componentWillReceiveProps(nextProps) {
		if (this.margin !== nextProps.margin) {
			this.margin = nextProps.margin
		}
		this.setState({transition: this.state.hover || this.props.active ? 'all' : 'opacity'}, () => {
			this.updateSize()
		})

		if (nextProps.style !== this.props.style) {
			const { hover, transition } = this.state
			this.setState({
				styles: this.checkWindowPosition(this.getGlobalStyle(nextProps, hover, transition), this.getArrowStyle(nextProps))
			})
		}
	}

	updateSize() {
		let self = ReactDOM.findDOMNode(this)
		this.setState({
			width: self && self.offsetWidth,
			height: self && self.offsetHeight
		})
	}

	render() {
		const { isDisableCloseOnHover } = this.props
		const { styles } = this.state

		return (
            <div style={styles} onMouseEnter={isDisableCloseOnHover && this.handleMouseEnter.bind(this)} onMouseLeave={isDisableCloseOnHover && this.handleMouseLeave.bind(this)}>
				{this.props.arrow ? (
                        <div>
                          <span style={arrowStyle.fgStyle}/>
                          <span style={arrowStyle.bgStyle}/>
                        </div>)
					: null
				}
				{this.props.children}
            </div>
		)
	}
}

export default class ToolTip extends React.Component {
	static propTypes = {
		parent: PropTypes.string.isRequired,
		portalParent: PropTypes.string,
		active: PropTypes.bool,
		group: PropTypes.string,
		tooltipTimeout: PropTypes.number,
		closeFunc: PropTypes.func,
		onAfterOpen: PropTypes.func,
		scrollHide: PropTypes.bool,
		fullWidth: PropTypes.bool,
		margin: PropTypes.number,
		isCloseOnOutClick: PropTypes.bool,
		isCloseOnOutClickFunc: PropTypes.func,
	}
	static defaultProps = {
		active: false,
		group: 'main',
		tooltipTimeout: 500,
		fullWidth: false,
		portalParent: '',
		isCloseOnOutClick: true
	}

	constructor(props, context) {
		super(props, context)

		this.portalNodes = {}

		if (canUseDOM) {
			this.root = null;
			this.handleRootRef = (root) => {
				if (root !== this.root) {
					if (this.root) {
						this.root.removeEventListener('click', this.handleInClick);
					}
					if (root) {
						root.addEventListener('click', this.handleInClick, true);
					}
				}
				this.root = root;
			};

			this.isInClick = false;
			this.handleInClick = () => {
				this.isInClick = true;
			}

			this.handleOutClick = (event) => {
				const parentEL = document.querySelector(this.props.parent);
				const selfClick = event.target  === this.root || (this.root && this.root.contains(event.target));
				const isOutClick = !selfClick&& event.target !== parentEL && (parentEL && !parentEL.contains(event.target));
				this.isInClick = !selfClick;


				const { closeFunc, active, isCloseOnOutClickFunc } = this.props;
				if (isOutClick && typeof closeFunc === 'function' && this.root && this.root.hasChildNodes()) {

					if (active) {
						closeFunc && closeFunc();
						isCloseOnOutClickFunc && isCloseOnOutClickFunc();
					}
				}
			}
			props.isCloseOnOutClick && document.addEventListener('click', this.handleOutClick, true);
		}
	}

	componentDidMount() {
		if (!this.props.active) {
			return
		}

		this.renderPortal(this.props)
	}
	componentWillReceiveProps(nextProps) {
		if ((!this.portalNodes[this.props.group] && !nextProps.active) ||
			(!this.props.active && !nextProps.active)) {
			return
		}

		if (this.portalNodes[this.props.group] && this.portalNodes[this.props.group].timeout) {
			clearTimeout(this.portalNodes[this.props.group].timeout)
		}

		if (this.props.active && !nextProps.active) {
			this.portalNodes[this.props.group].timeout = setTimeout(() => {
				this.renderPortal(nextProps)
			}, this.props.tooltipTimeout)
		} else {
			this.renderPortal(nextProps)
		}
	}

	componentWillUnmount() {
		if (this.portalNodes[this.props.group]) {

			ReactDOM.unmountComponentAtNode(this.portalNodes[this.props.group].node)
			clearTimeout(this.portalNodes[this.props.group].timeout)
			this.portalNodes = {}
		}

		if (canUseDOM) {
			if (this.root) {
				this.root.removeEventListener('click', this.handleInClick)
			}
			document.removeEventListener('click', this.handleOutClick)
		}
	}

	createPortal() {
		const { portalParent } = this.props

		this.portalNodes[this.props.group] = {
			node: document.createElement('div'),
			timeout: false
		}
		this.portalNodes[this.props.group].node.className = 'ToolTipPortal'
		this.handleRootRef(this.portalNodes[this.props.group].node)

		if (portalParent && document.querySelector(portalParent)) {
			document.querySelector(portalParent).appendChild(this.portalNodes[this.props.group].node)
		} else {
			document.body.appendChild(this.portalNodes[this.props.group].node)
		}
	}
	renderPortal(props) {
		let render = true
		if (!this.portalNodes[this.props.group]) {
			render = false
			this.createPortal()
		}
		let {parent, ...other} = props
		const { onAfterOpen } = this.props
		const node = this.portalNodes[this.props.group].node
		let parentEl = document.querySelector(parent)
		renderSubtreeIntoContainer(this, <Card parentEl={document.querySelector(parent)} {...other}/>, this.portalNodes[this.props.group].node)

		if (!this.props.active && props.active && node && onAfterOpen) {
			this.ignoreScroll = true;
			setTimeout (() => {
				onAfterOpen(node.querySelector('div'));
			}, 0)
		}
	}

	shouldComponentUpdate() {
		return false
	}
	render() {
		return null
	}
}

const executeFunctionIfExist = (object, key) => {
	if (Object.prototype.hasOwnProperty.call(object, key)){
		object[key]()
	}
}
