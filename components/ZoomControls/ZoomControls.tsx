import React from 'react'
import cs from 'classnames'

import { Tooltip } from '@chakra-ui/react'
import { AiOutlineMinus, AiOutlinePlus, AiOutlineFilter } from 'react-icons/ai'
import { MdZoomOutMap } from 'react-icons/md'
// import { FaQuestion } from 'react-icons/fa'

import { Globe } from 'state/globe'
import { Paper } from '../Paper/Paper'

import styles from './styles.module.css'

export const ZoomControls = () => {
  const {
    globeRef,
    // infoModal,
    setFilterPublicOnly,
    filterPublicOnly
  } = Globe.useContainer()

  const onClickZoomToFit = React.useCallback(() => {
    globeRef.current?.zoom()
  }, [globeRef])

  const onClickZoomIn = React.useCallback(() => {
    globeRef.current?.zoom(100)
  }, [globeRef])

  const onClickZoomOut = React.useCallback(() => {
    globeRef.current?.zoom(-100)
  }, [globeRef])

  const onClickFilterPublicOnly = React.useCallback(() => {
    setFilterPublicOnly((filterPublicOnly) => !filterPublicOnly)
  }, [setFilterPublicOnly])

  const filterLabel = filterPublicOnly
    ? 'View all users'
    : 'View public users only'

  return (
    <div className={styles.container}>
      {/* <Paper className={cs(styles.content, styles.info)}>
        <Tooltip label='Info' aria-label='Info' placement='left'>
          <button
            aria-label='Info'
            className={styles.control}
            onClick={infoModal.onOpen}
          >
            <FaQuestion />
          </button>
        </Tooltip>
      </Paper> */}

      <Paper className={cs(styles.content, styles.reset)}>
        <Tooltip label={filterLabel} aria-label={filterLabel} placement='left'>
          <button
            aria-label={filterLabel}
            className={cs(styles.control, filterPublicOnly && styles.active)}
            onClick={onClickFilterPublicOnly}
          >
            <AiOutlineFilter />
          </button>
        </Tooltip>
      </Paper>

      <Paper className={cs(styles.content, styles.reset)}>
        <Tooltip label='Zoom to Fit' aria-label='Zoom to Fit' placement='left'>
          <button
            aria-label='Zoom to Fit'
            className={styles.control}
            onClick={onClickZoomToFit}
          >
            <MdZoomOutMap />
          </button>
        </Tooltip>
      </Paper>

      <Paper className={cs(styles.content, styles.zoom)}>
        <Tooltip label='Zoom In' aria-label='Zoom In' placement='left'>
          <button
            aria-label='Zoom In'
            className={styles.control}
            onClick={onClickZoomIn}
          >
            <AiOutlinePlus />
          </button>
        </Tooltip>

        <div className={styles.spacer} />

        <Tooltip label='Zoom Out' aria-label='Zoom Out' placement='left'>
          <button
            aria-label='Zoom Out'
            className={styles.control}
            onClick={onClickZoomOut}
          >
            <AiOutlineMinus />
          </button>
        </Tooltip>
      </Paper>
    </div>
  )
}
