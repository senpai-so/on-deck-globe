import React from 'react'
import { useMeasure } from 'react-use'

import { Globe } from 'state/globe'

// import { LoadingIndicator } from '../LoadingIndicator/LoadingIndicator'
import { ThreeGlobe } from './ThreeGlobe'
import styles from './styles.module.css'

export const GlobeVisualization: React.FC = () => {
  const {
    users,
    globeRef,
    hoveredUser,
    setHoveredUser,
    setFocusedUser
  } = Globe.useContainer()
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  const defaultWidth = typeof window !== 'undefined' ? window.innerWidth : 1280
  const defaultHeight = typeof window !== 'undefined' ? window.innerHeight : 720
  const [
    measureRef,
    { width = defaultWidth, height = defaultHeight }
  ] = useMeasure()
  const [isMouseDown, setMouseDown] = React.useState(false)

  React.useEffect(() => {
    const globe = new ThreeGlobe({
      canvas: canvasRef.current
    })
    globeRef.current = globe
    globe.animate()

    return () => globe.destroy()
  }, [canvasRef, globeRef])

  React.useEffect(() => {
    globeRef.current?.resize(width, height)
  }, [globeRef, width, height])

  React.useEffect(() => {
    globeRef.current?.setUsers(users)
  }, [globeRef, users])

  React.useEffect(() => {
    globeRef.current._callbacks = {
      onClickUser: setFocusedUser,
      onHoverUser: setHoveredUser
    }
  }, [globeRef, setFocusedUser, setHoveredUser])

  const onMouseDown = React.useCallback(
    (event) => {
      globeRef.current?.onMouseDown(event)
      setMouseDown(globeRef.current?._mouseDown)
    },
    [globeRef, setMouseDown]
  )

  const onMouseUp = React.useCallback(() => {
    globeRef.current?.onMouseUp()
    setMouseDown(globeRef.current?._mouseDown)
  }, [globeRef, setMouseDown])

  const onMouseMove = React.useCallback(
    (event) => {
      globeRef.current?.onMouseMove(event)
      canvasRef.current?.focus()
    },
    [globeRef, canvasRef]
  )

  const onMouseOut = React.useCallback(() => {
    globeRef.current?.onMouseOut()
    setMouseDown(globeRef.current?._mouseDown)
  }, [globeRef, setMouseDown])

  const onMouseWheel = React.useCallback(
    (event) => {
      globeRef.current?.onMouseWheel(event)
    },
    [globeRef]
  )

  const onClick = React.useCallback(
    (event) => {
      globeRef.current?.onClick(event)
    },
    [globeRef]
  )

  const wrapperStyle = React.useMemo(
    () => ({
      cursor: hoveredUser ? 'pointer' : isMouseDown ? 'move' : 'auto'
    }),
    [isMouseDown, hoveredUser]
  )

  React.useLayoutEffect(() => {
    const obj = canvasRef.current
    if (!obj) return

    obj.addEventListener('wheel', onMouseWheel)
    return () => {
      obj.removeEventListener('wheel', onMouseWheel)
    }
  }, [canvasRef, onMouseWheel])

  return (
    <div className={styles.wrapper} ref={measureRef} style={wrapperStyle}>
      <canvas
        width={width}
        height={height}
        ref={canvasRef}
        tabIndex={-1}
        onMouseDownCapture={onMouseDown}
        onMouseUpCapture={onMouseUp}
        onMouseOutCapture={onMouseOut}
        onMouseMoveCapture={onMouseMove}
        onClick={onClick}
      />
    </div>
  )
}
