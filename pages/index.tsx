import React from 'react'

import { User } from 'lib/types'
import { getUsers } from 'lib/get-users'
import { Layout } from 'components/Layout/Layout'
import { QueryParamProvider } from 'components/QueryParamProvider/QueryParamProvider'
import { Globe } from 'state/globe'

import styles from 'styles/index.module.css'

export async function getStaticProps() {
  const users = await getUsers()

  return {
    props: {
      users
    },
    revalidate: 60 * 5
  }
}

export default function HomePage({ users }: { users: User[] }) {
  return (
    <Layout>
      <QueryParamProvider>
        <Globe.Provider>
          <GlobePage users={users} />
        </Globe.Provider>
      </QueryParamProvider>
    </Layout>
  )
}

function GlobePage({ users }: { users: User[] }) {
  return <div>TODO</div>
}
