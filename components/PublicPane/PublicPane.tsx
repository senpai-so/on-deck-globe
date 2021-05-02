import React from 'react'
import cs from 'classnames'
import { useLocalStorage } from 'react-use'

import { Tooltip } from '@chakra-ui/react'
import { AiOutlineClose } from 'react-icons/ai'

import { signupLink } from 'lib/config'
import { Button } from '../Button/Button'
import { Paper } from '../Paper/Paper'

import styles from './styles.module.css'

export const PublicPane = () => {
  const [isVisible, setIsVisible] = useLocalStorage(
    'on-deck-globe-public-pane',
    true
  )

  const onClickClose = React.useCallback(() => {
    setIsVisible(false)
  }, [setIsVisible])

  if (!isVisible) {
    return null
  }

  return (
    <div className={styles.container}>
      <Paper className={cs(styles.content, styles.info)}>
        <div className={styles.header}>
          <h3>Add yourself to the globe</h3>

          <Tooltip label='Close' aria-label='Close' placement='bottom'>
            <button
              aria-label='Close'
              className={styles.control}
              onClick={onClickClose}
            >
              <AiOutlineClose />
            </button>
          </Tooltip>
        </div>

        <p>
          If you're an On Deck fellow, you can make your profile public on the
          globe by tweeting to us.
        </p>

        <div>
          <Button href={signupLink} target='_blank' rel='noreferrer noopener'>
            Make me public
          </Button>
        </div>
      </Paper>
    </div>
  )
}
