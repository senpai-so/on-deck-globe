import React from 'react'
import cs from 'classnames'
import { useLockBodyScroll, useMedia } from 'react-use'

import { User } from 'lib/types'
import { getUsers } from 'lib/get-users'
import { Layout } from 'components/Layout/Layout'
import { QueryParamProvider } from 'components/QueryParamProvider/QueryParamProvider'
import { GlobeVisualization } from 'components/GlobeVisualization/GlobeVisualization'
import { GoogleMap } from 'components/GoogleMap/GoogleMap'
import { ZoomControls } from 'components/ZoomControls/ZoomControls'
import { UserProfile } from 'components/UserProfile/UserProfile'
import { PublicPane } from 'components/PublicPane/PublicPane'
import { MapToggleControls } from 'components/MapToggleControls/MapToggleControls'
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
  const {
    setUsers,
    focusedUser,
    filterPublicOnly,
    isGlobeMode
  } = Globe.useContainer()
  const [hasMounted, setHasMounted] = React.useState(false)
  React.useEffect(() => {
    setHasMounted(true)
  }, [])
  const isMobile = useMedia('(max-width: 480px)', false)

  React.useEffect(() => {
    if (!users?.length) return

    if (filterPublicOnly) {
      const publicUsers = users.filter((user) => !!user.isPublic)
      setUsers(publicUsers)
    } else {
      setUsers(users)
    }
  }, [users, setUsers, filterPublicOnly])

  useLockBodyScroll(isMobile)

  return (
    <div className={cs(styles.page, isGlobeMode && styles.globe)}>
      {hasMounted && (
        <>
          <GlobeVisualization />

          <GoogleMap />

          {focusedUser && <UserProfile user={focusedUser} />}

          {isGlobeMode && <ZoomControls />}

          <PublicPane />

          <MapToggleControls />
        </>
      )}
    </div>
  )
}
