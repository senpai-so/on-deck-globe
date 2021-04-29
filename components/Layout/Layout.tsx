import React from 'react'

import { Head } from '../Head/Head'

export const Layout: React.FC<{
  title?: string
  description?: string
  twitter?: string
  socialImage?: string
}> = ({ children, title, description, twitter, socialImage }) => {
  return (
    <>
      <Head
        title={title}
        description={description}
        twitter={twitter}
        socialImage={socialImage}
      />

      {children}
    </>
  )
}
