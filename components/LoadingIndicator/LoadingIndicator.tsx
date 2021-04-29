import React from 'react'
import cs from 'classnames'
import { motion, AnimatePresence } from 'framer-motion'
import Lottie from 'react-lottie-player'

import loading from './loading.json'
import styles from './styles.module.css'

export const LoadingIndicator: React.FC<{
  isLoading?: boolean
  fill?: boolean
  className?: string
  initial?: any
  animate?: any
  exit?: any
}> = ({
  isLoading = false,
  fill = true,
  className,
  initial,
  animate,
  exit,
  ...rest
}) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className={cs(styles.loading, fill && styles.fill, className)}
          initial={{ opacity: 1, ...initial }}
          animate={{ opacity: 1, ...animate }}
          exit={{ opacity: 0, ...exit }}
          {...rest}
        >
          <Lottie
            play
            loop
            animationData={loading}
            className={styles.loadingAnimation}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
