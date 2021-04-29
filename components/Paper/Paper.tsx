import React from 'react'
import cs from 'classnames'

import styles from './styles.module.css'

export const Paper = ({ className, ...rest }) => {
  return <div className={cs(styles.container, className)} {...rest} />
}
