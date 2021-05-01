import React from 'react'

import { User } from 'lib/types'
import { getUsers } from 'lib/get-users'
import { Layout } from 'components/Layout/Layout'
import { QueryParamProvider } from 'components/QueryParamProvider/QueryParamProvider'
import { GlobeVisualization } from 'components/GlobeVisualization/GlobeVisualization'
import { ZoomControls } from 'components/ZoomControls/ZoomControls'
import { Globe } from 'state/globe'
import { UserProfile } from 'components/UserProfile/UserProfile'
import { FilterControls } from 'components/FilterControls/FilterControls'

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
    <Globe.Provider>
      <Layout>
        <QueryParamProvider>
          <GlobePage users={users} />
        </QueryParamProvider>
      </Layout>
    </Globe.Provider>
  )
}

function GlobePage({ users }: { users: User[] }) {
  const { setUsers, focusedUser, filterPublicOnly } = Globe.useContainer()
  const [hasMounted, setHasMounted] = React.useState(false)
  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  React.useEffect(() => {
    if (!users?.length) return

    if (filterPublicOnly) {
      const publicUsers = users.filter((user) => !!user.isPublic)
      setUsers(publicUsers)
    } else {
      setUsers(users)
    }
  }, [users, setUsers, filterPublicOnly])

  return (
    <div className={styles.page}>
      {hasMounted && <GlobeVisualization />}

      {focusedUser && <UserProfile user={focusedUser} />}

      <FilterControls />
      <ZoomControls />
    </div>
  )
}
