import React from 'react'
import cs from 'classnames'

import styles from './styles.module.css'

export const Button = ({ className, ...rest }: any) => {
  return <a className={cs(styles.button, className)} {...rest} />
}
