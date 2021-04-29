/**
 * @class BlockImage
 *
 * Component that displays a div with background-image instead of an img for
 * more control. Also allows for specifying an optional fallback image and
 * loading component.
 *
 * Imported from https://github.com/transitive-bullshit/react-block-image
 * because I'm on a flight and can't update the original package...
 */

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

export class BlockImage extends PureComponent<{
  src: string
  alt?: string
  fallback?: string
  width?: number
  height?: number
  showPreview?: boolean
  loader?: React.ReactNode
  backgroundSize?: string
  backgroundPosition?: string
  backgroundRepeat?: string
  className?: string
  style?: React.CSSProperties
}> {
  static propTypes = {
    // preferred image source url
    src: PropTypes.string,

    // fallback image source url
    fallback: PropTypes.string,

    // optional children
    children: PropTypes.node,

    // whether or not to show fallback while preferred src is loading
    showPreview: PropTypes.bool,

    // node to show while image is loading
    loader: PropTypes.node,

    // optionally control css background-size
    backgroundSize: PropTypes.string,

    // optionally control css background-position
    backgroundPosition: PropTypes.string,

    // optionally control css background-repeat
    backgroundRepeat: PropTypes.string,

    // optional style override
    style: PropTypes.object
  }

  static defaultProps = {
    showPreview: false,
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover'
  }

  state = {
    status: 'loading'
  }

  _isMounted = false

  componentDidMount() {
    this._isMounted = true
    this._reload(this.props)
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  componentWillReceiveProps(props) {
    if (
      this.props.src !== props.src ||
      (this.props.fallback !== props.fallback && this.state.status === 'error')
    ) {
      this._reload(props)
    }
  }

  render() {
    const {
      src,
      fallback,
      showPreview,
      loader,
      backgroundPosition,
      backgroundRepeat,
      backgroundSize,
      children,
      style,
      ...rest
    } = this.props

    const { status } = this.state

    const bgImageStyles: any = {}
    const loadingAndShowPreview = status === 'loading' && showPreview

    let url = src || fallback

    if (fallback && (status === 'error' || loadingAndShowPreview)) {
      url = fallback
    }

    if (url) {
      const backgroundImage = `url(${url})`
      bgImageStyles.backgroundImage = backgroundImage
      bgImageStyles.backgroundPosition = backgroundPosition
      bgImageStyles.backgroundRepeat = backgroundRepeat
      bgImageStyles.backgroundSize = backgroundSize
    }

    const rootStyle = Object.assign(bgImageStyles, style)

    return (
      <div style={rootStyle} {...rest}>
        {children}

        {loadingAndShowPreview && loader}
      </div>
    )
  }

  _reload(props) {
    const { src } = props

    if (!src) {
      this.setState({ status: 'error' })
    } else if (typeof Image !== 'undefined') {
      const img = new Image()

      img.onload = () => {
        if (this._isMounted) {
          this.setState({ status: 'success' })
        }
      }

      img.onerror = img.onabort = () => {
        if (this._isMounted) {
          this.setState({ status: 'error' })
        }
      }

      this.setState({ status: 'loading' })
      img.src = src
    }
  }
}
