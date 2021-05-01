import React from 'react'
import cs from 'classnames'
import { useLocalStorage } from 'react-use'

import { Tooltip } from '@chakra-ui/react'
import { AiOutlineClose } from 'react-icons/ai'

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

  const tweetLink =
    'https://twitter.com/intent/tweet?original_referer=https%3A%2F%2Fpublish.twitter.com%2F&ref_src=twsrc%5Etfw&screen_name=ondeckglobe&text=%23MakeMePublic%20%F0%9F%93%A3%20I%20am%20going%20public%20on%20OnDeckGlobe.com%20with%20the%20On%20Deck%20Fellows.%20Join%20us%20on%20the%20globe!%20%20%23ondeck%20%23odf9%20%F0%9F%9A%80%F0%9F%9A%80%F0%9F%9A%80&tw_p=tweetbutton'

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
          <Button href={tweetLink} target='_blank' rel='noreferrer noopener'>
            Make me public
          </Button>
        </div>
      </Paper>
    </div>
  )
}
