import React from 'react'
import { NotionAPI } from 'notion-client'
import { TwitterContextProvider } from 'react-static-tweets'
import { fetchTweetAst } from 'static-tweets'
import pMap from 'p-map'

import { NotionPage } from 'components/NotionPage/NotionPage'

const notion = new NotionAPI()
const notionPageId = '470e4e14e6af4af18fd296161e9c1d4d'

export const getStaticProps = async () => {
  const recordMap = await notion.getPage(notionPageId)
  const blockIds = Object.keys(recordMap.block)

  const tweetIds: string[] = blockIds
    .map((blockId) => {
      const block = recordMap.block[blockId]?.value

      if (block) {
        if (block.type === 'tweet') {
          const src = block.properties?.source?.[0]?.[0]

          if (src) {
            const id = src.split('?')[0].split('/').pop()
            if (id) return id
          }
        }
      }

      return null
    })
    .filter(Boolean)

  const tweetAsts = await pMap(
    tweetIds,
    async (tweetId) => {
      try {
        return {
          tweetId,
          tweetAst: await fetchTweetAst(tweetId)
        }
      } catch (err) {
        console.error('error fetching tweet info', tweetId, err)
      }
    },
    {
      concurrency: 4
    }
  )

  const tweetAstMap = tweetAsts.reduce((acc, { tweetId, tweetAst }) => {
    if (tweetAst) {
      return {
        ...acc,
        [tweetId]: tweetAst
      }
    } else {
      return acc
    }
  }, {})

  return {
    props: {
      recordMap,
      tweetAstMap
    },
    revalidate: 10
  }
}

export default function App({ tweetAstMap, recordMap, ...props }) {
  return (
    <TwitterContextProvider
      value={{
        tweetAstMap: tweetAstMap,
        swrOptions: {
          fetcher: (id) =>
            fetch(`/api/get-tweet-ast/${id}`).then((r) => r.json())
        }
      }}
    >
      <NotionPage recordMap={recordMap} {...props} />
    </TwitterContextProvider>
  )
}
