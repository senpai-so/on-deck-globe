import React from 'react'

import { User } from 'lib/types'
import { getUsers } from 'lib/get-users'
import { Layout } from 'components/Layout/Layout'
import { QueryParamProvider } from 'components/QueryParamProvider/QueryParamProvider'
import { GlobeVisualization } from 'components/GlobeVisualization/GlobeVisualization'
import { ZoomControls } from 'components/ZoomControls/ZoomControls'
import { Globe } from 'state/globe'
import { UserProfile } from 'components/UserProfile/UserProfile'

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
  const { setUsers, focusedUser } = Globe.useContainer()
  const [hasMounted, setHasMounted] = React.useState(false)
  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  React.useEffect(() => {
    if (!users?.length) return

    setUsers(users)
  }, [users, setUsers])

  return (
    <div className={styles.page}>
      {hasMounted && <GlobeVisualization />}

      {focusedUser && <UserProfile user={focusedUser} />}

      <ZoomControls />
    </div>
  )
}
