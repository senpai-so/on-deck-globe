import React from 'react'
import NextHead from 'next/head'

const siteName = 'On Deck Globe'
const defaultSocialImage = 'https://ondeckglobe.com/social.jpg'

export const Head: React.FC<{
  title?: string
  domain?: string
  twitter?: string
  description?: string
  socialImage?: string
}> = ({
  title = siteName,
  domain = 'ondeckglobe.com',
  twitter = 'ondeckglobe',
  description = 'Shaping the world together via On Deck 💪',
  socialImage = defaultSocialImage
}) => {
  return (
    <NextHead>
      <meta
        name='viewport'
        content='width=device-width, user-scalable=no'
        key='viewport'
      />

      <link rel='shortcut icon' href='/favicon.png' />

      <meta name='twitter:title' content={title} />
      <meta property='og:title' content={title} />

      <meta name='twitter:site' content={'@transitive_bs'} />
      <meta property='og:site_name' content={siteName} />

      <meta property='twitter:domain' content={domain} />
      <meta name='twitter:creator' content={`@${twitter}`} />

      <meta name='description' content={description} />
      <meta property='og:description' content={description} />
      <meta name='twitter:description' content={description} />

      {socialImage ? (
        <>
          {socialImage === defaultSocialImage ? (
            <meta name='twitter:card' content='summary_large_image' />
          ) : (
            <meta name='twitter:card' content='summary' />
          )}

          <meta name='twitter:image' content={socialImage} />
          <meta property='og:image' content={socialImage} />
        </>
      ) : (
        <meta name='twitter:card' content='summary' />
      )}

      <title>{title}</title>
    </NextHead>
  )
}
