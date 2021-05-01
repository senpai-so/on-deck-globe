import React from 'react'
import cs from 'classnames'

import { Tooltip } from '@chakra-ui/react'
import { ImProfile } from 'react-icons/im'

import { Globe } from 'state/globe'
import { Paper } from '../Paper/Paper'

import styles from './styles.module.css'

export const FilterControls = () => {
  const { setFilterPublicOnly, filterPublicOnly } = Globe.useContainer()

  const onClickFilterPublicOnly = React.useCallback(() => {
    setFilterPublicOnly(!filterPublicOnly)
  }, [setFilterPublicOnly, filterPublicOnly])

  return (
    <div className={styles.container}>
      <Paper className={cs(styles.content, styles.info)}>
        <Tooltip
          label='Show public profiles'
          aria-label='Show public profiles'
          placement='left'
        >
          <button
            aria-label='Show public profiles'
            className={styles.control}
            onClick={onClickFilterPublicOnly}
          >
            <ImProfile />
            <span>Toggle</span>
            <span>Public</span>
            <span>Profiles</span>
          </button>
        </Tooltip>
      </Paper>
    </div>
  )
}
