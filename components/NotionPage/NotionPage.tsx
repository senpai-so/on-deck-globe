import React from 'react'
import { ExtendedRecordMap } from 'notion-types'
import { NotionRenderer } from 'react-notion-x'
import { Tweet } from 'react-static-tweets'

import { mapNotionImageUrl } from 'lib/map-image-url'

import { Layout } from '../Layout/Layout'
import styles from './styles.module.css'

export function NotionPage({ recordMap }: { recordMap: ExtendedRecordMap }) {
  return (
    <Layout>
      <section className={styles.notionSection}>
        <NotionRenderer
          recordMap={recordMap}
          fullPage={false}
          darkMode={true}
          components={{
            tweet: Tweet
          }}
          mapImageUrl={mapNotionImageUrl}
        />
      </section>
    </Layout>
  )
}
