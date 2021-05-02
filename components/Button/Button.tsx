import React from 'react'
import cs from 'classnames'

import styles from './styles.module.css'

export const Button = ({ className, onClick, ...rest }: any) => {
  if (onClick) {
    return (
      <div
        className={cs(styles.button, className)}
        {...rest}
        onClick={onClick}
      />
    )
  } else {
    return <a className={cs(styles.button, className)} {...rest} />
  }
}
