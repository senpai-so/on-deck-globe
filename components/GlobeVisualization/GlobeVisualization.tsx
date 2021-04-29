import React from 'react'
import { useMeasure } from 'react-use'

// import { User } from 'lib/types'
// import { Globe } from 'state/globe'

// import { LoadingIndicator } from '../LoadingIndicator/LoadingIndicator'
import styles from './styles.module.css'

export const GlobeVisualization: React.FC = () => {
  // const {
  //   users,
  //   focusedUser,
  //   setFocusedUser,
  //   simulation
  // } = Globe.useContainer()

  const defaultWidth = typeof window !== 'undefined' ? window.innerWidth : 1280
  const defaultHeight = typeof window !== 'undefined' ? window.innerHeight : 720
  const [
    measureRef,
    { width = defaultWidth, height = defaultHeight }
  ] = useMeasure()

  return (
    <div className={styles.wrapper} ref={measureRef}>
      <h1>TODO</h1>
    </div>
  )
}
