import React from 'react'
import cs from 'classnames'

import { Tooltip } from '@chakra-ui/react'
import { FaGlobeAmericas } from 'react-icons/fa'
import { FiMap } from 'react-icons/fi'

import { Globe } from 'state/globe'
import { Paper } from '../Paper/Paper'

import styles from './styles.module.css'

export const MapToggleControls = () => {
  const { isGlobeMode, onToggleGlobeMode } = Globe.useContainer()

  const filterLabel = isGlobeMode ? 'View 2D Map' : 'View 3D Globe'

  return (
    <div className={styles.container}>
      <Paper className={cs(styles.content, styles.reset)}>
        <Tooltip label={filterLabel} aria-label={filterLabel} placement='left'>
          <button
            aria-label={filterLabel}
            className={cs(styles.control)}
            onClick={onToggleGlobeMode}
          >
            {isGlobeMode ? <FiMap /> : <FaGlobeAmericas />}
          </button>
        </Tooltip>
      </Paper>
    </div>
  )
}
