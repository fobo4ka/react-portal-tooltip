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
    portalParent: PropTypes.string
  }
  static defaultProps = {
    active: false,
    position: 'right',
    arrow: null,
    style: {style: {}, arrowStyle: {}},
    fullWidth: false
  }
  state = {
    hover: false,
    transition: 'opacity',
    width: 0,
    height: 0
  }
  margin = 20
  defaultArrowStyle = {
    color: '#fff',
    borderColor: 'rgba(0,0,0,.4)'
  }
  getGlobalStyle() {
    if (!this.props.parentEl) {
      return {display: 'none'}
    }

    let style = {
      position: 'absolute',
      padding: '5px',
      background: '#fff',
      boxShadow: '0 0 8px rgba(0,0,0,.3)',
      borderRadius: '3px',
      transition: `${this.state.transition} .3s ease-in-out, visibility .3s ease-in-out`,
      opacity: this.state.hover || this.props.active ? 1 : 0,
      visibility: this.state.hover || this.props.active ? 'visible' : 'hidden',
      zIndex: 50
    }

    assign(style, this.getStyle(this.props.position, this.props.arrow))

    return this.mergeStyle(style, this.props.style.style)
  }
  getBaseArrowStyle() {
    return {
      position: 'absolute',
      content: '""',
      transition: 'all .3s ease-in-out'
    }
  }
  getArrowStyle() {
    const { parentEl, fullWidth } = this.props
    const parentPosition = parentEl.getBoundingClientRect()
    let fgStyle = this.getBaseArrowStyle()
    let bgStyle = this.getBaseArrowStyle()
    fgStyle.zIndex = 60
    bgStyle.zIndex = 55

    let arrowStyle = assign(this.defaultArrowStyle, this.props.style.arrowStyle)
    let bgBorderColor = arrowStyle.borderColor ? arrowStyle.borderColor : 'transparent'

    let fgSize = 8
    let bgSize = 9
    let fgColorBorder = `10px solid ${arrowStyle.color}`
    let fgTransBorder = `${fgSize}px solid transparent`
    let bgColorBorder = `11px solid ${bgBorderColor}`
    let bgTransBorder = `${bgSize}px solid transparent`

    let {position, arrow} = this.props

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
        fgStyle.bottom = -10
        fgStyle.borderTop = fgColorBorder
        bgStyle.bottom = -11
        bgStyle.borderTop = bgColorBorder
      }
      else {
        fgStyle.top = -10
        fgStyle.borderBottom = fgColorBorder
        bgStyle.top = -11
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

    let {color, borderColor, ...propsArrowStyle} = this.props.style.arrowStyle

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
  getStyle(position, arrow) {
    const { portalParent, parentEl } = this.props
    const customPortalParent = portalParent && document.querySelector(portalParent)
    let tooltipPosition = parentEl.getBoundingClientRect()

    let scrollY = (window.scrollY !== undefined) ? window.scrollY : window.pageYOffset
    let scrollX = (window.scrollX !== undefined) ? window.scrollX : window.pageXOffset
    if (customPortalParent) {
      scrollX = customPortalParent.scrollLeft
      scrollY = customPortalParent.scrollTop
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
  componentWillReceiveProps() {
    this.setState({transition: this.state.hover || this.props.active ? 'all' : 'opacity'}, () => {
      this.updateSize()
    })
  }
  updateSize() {
    let self = ReactDOM.findDOMNode(this)
    this.setState({
      width: self.offsetWidth,
      height: self.offsetHeight
    })
  }
  render() {
    let {style, arrowStyle} = this.checkWindowPosition(this.getGlobalStyle(), this.getArrowStyle())

    return (
      <div style={style} onMouseEnter={::this.handleMouseEnter} onMouseLeave={::this.handleMouseLeave}>
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

var portalNodes = {}

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
    fullWidth: PropTypes.bool
  }
  static defaultProps = {
    active: false,
    group: 'main',
    tooltipTimeout: 500,
    fullWidth: false,
    portalParent: ''
  }

  constructor(props, context) {
    super(props, context)

    if (canUseDOM) {
      this.root = null;
      this.handleRootRef = (root) => {
        if (root !== this.root) {
          if (this.root) {
            // this.root.removeEventListener('click', this.handleInClick);
          }
          if (root) {
            // root.addEventListener('click', this.handleInClick, true);
            // props.scrollHide && root.addEventListener('scroll', this.props.closeFunc, true);
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
        // console.log(this.isInClick, event.target !== parentEL, parentEL, parentEL.contains(event.target))
        const isOutClick = !this.isInClick && event.target !== parentEL;
        this.isInClick = false;


        const { closeFunc, active } = this.props;
        if (isOutClick && typeof closeFunc === 'function') {

          active && closeFunc();
        }
      }
      document.addEventListener('click', this.handleOutClick, true);
      // props.scrollHide && document.addEventListener('scroll', this.props.closeFunc, true);
    }
  }

  componentDidMount() {
    if (!this.props.active) {
      return
    }

    this.renderPortal(this.props)
  }
  componentWillReceiveProps(nextProps) {
    if ((!portalNodes[this.props.group] && !nextProps.active) ||
      (!this.props.active && !nextProps.active)) {
      return
    }

    if (portalNodes[this.props.group] && portalNodes[this.props.group].timeout) {
      clearTimeout(portalNodes[this.props.group].timeout)
    }

    if (this.props.active && !nextProps.active) {
      portalNodes[this.props.group].timeout = setTimeout(() => {
        this.renderPortal(nextProps)
      }, this.props.tooltipTimeout)
    } else {
        this.renderPortal(nextProps)
    }
  }
  componentWillUnmount() {
    if (portalNodes[this.props.group]) {
      ReactDOM.unmountComponentAtNode(portalNodes[this.props.group].node)
      clearTimeout(portalNodes[this.props.group].timeout)
    }

    if (canUseDOM) {
      if (this.root) {
        // this.root.removeEventListener('click', this.handleInClick);
        // this.root.removeEventListener('scroll', this.props.closeFunc);
      }
      document.removeEventListener('click', this.handleOutClick);
      // document.removeEventListener('scroll', this.props.closeFunc);
    }
  }

  createPortal() {
    const { portalParent } = this.props

    portalNodes[this.props.group] = {
      node: document.createElement('div'),
      timeout: false
    }
    portalNodes[this.props.group].node.className = 'ToolTipPortal'
    portalNodes[this.props.group].node.ref = this.handleRootRef

    if (portalParent && document.querySelector(portalParent)) {
	    document.querySelector(portalParent).appendChild(portalNodes[this.props.group].node)
    } else {
	    document.body.appendChild(portalNodes[this.props.group].node)
    }
  }
  renderPortal(props) {
    if (!portalNodes[this.props.group]) {
      this.createPortal()
    }
    let {parent, ...other} = props
    const { onAfterOpen } = this.props
    const node = portalNodes[this.props.group].node
    let parentEl = document.querySelector(parent)
    renderSubtreeIntoContainer(this, <Card parentEl={document.querySelector(parent)} {...other}/>, portalNodes[this.props.group].node)

    if (node && props.active ) {
	    onAfterOpen && onAfterOpen(node.querySelector('div').getBoundingClientRect().height)
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
