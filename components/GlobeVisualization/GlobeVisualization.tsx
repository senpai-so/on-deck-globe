import React from 'react'
import { useMeasure } from 'react-use'

// import { Globe } from 'state/globe'

// import { LoadingIndicator } from '../LoadingIndicator/LoadingIndicator'
import { ThreeGlobe } from './ThreeGlobe'
import styles from './styles.module.css'

export const GlobeVisualization: React.FC = () => {
  // const { users, focusedUser, setFocusedUser } = Globe.useContainer()
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const globeRef = React.useRef<ThreeGlobe>(null)

  const defaultWidth = typeof window !== 'undefined' ? window.innerWidth : 1280
  const defaultHeight = typeof window !== 'undefined' ? window.innerHeight : 720
  const [
    measureRef,
    { width = defaultWidth, height = defaultHeight }
  ] = useMeasure()

  React.useEffect(() => {
    const globe = new ThreeGlobe({
      canvas: canvasRef.current
    })
    globeRef.current = globe
    globe.animate()

    return () => globe.destroy()
  }, [canvasRef])

  React.useEffect(() => {
    globeRef.current?.resize(width, height)
  }, [width, height])

  const onMouseDown = React.useCallback(
    (event) => {
      globeRef.current?.onMouseDown(event)
    },
    [globeRef]
  )

  const onMouseUp = React.useCallback(
    (event) => {
      globeRef.current?.onMouseUp(event)
    },
    [globeRef]
  )

  const onMouseMove = React.useCallback(
    (event) => {
      globeRef.current?.onMouseMove(event)
    },
    [globeRef]
  )

  const onMouseOut = React.useCallback(
    (event) => {
      globeRef.current?.onMouseOut(event)
    },
    [globeRef]
  )

  return (
    <div className={styles.wrapper} ref={measureRef}>
      <canvas
        width={width}
        height={height}
        ref={canvasRef}
        onMouseDownCapture={onMouseDown}
        onMouseUpCapture={onMouseUp}
        onMouseOutCapture={onMouseOut}
        onMouseMoveCapture={onMouseMove}
      />
    </div>
  )
}
