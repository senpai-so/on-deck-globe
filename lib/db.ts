import * as firestore from '@google-cloud/firestore'
import * as config from './config'

export const db = new firestore.Firestore({
  projectId: config.googleProjectId,
  credentials: config.googleApplicationCredentials
})

export const users = db.collection(config.firebaseCollectionUsers)

export async function get<T>(
  doc: firestore.DocumentReference
): Promise<T | undefined> {
  const snapshot = await doc.get()

  if (snapshot.exists) {
    const res = getSnapshot<T>(snapshot)

    return res
  }

  return undefined
}

export function getSnapshot<T>(
  snapshot: firestore.DocumentSnapshot<firestore.DocumentData>
): T {
  const data = snapshot.data()

  return ({
    ...data,
    id: snapshot.id,
    createdAt: snapshot.createTime.toDate().toISOString(),
    updatedAt: snapshot.updateTime.toDate().toISOString()
  } as any) as T
}

export async function listUserDocs(
  where: any = {},
  {
    offset = 0,
    limit = null,
    orderBy = null
  }: {
    offset?: number
    limit?: number
    orderBy?: { key: string; direction: string | number }
  } = {}
) {
  const key = Object.keys(where)[0]
  let query

  if (key) {
    query = users.where(key, '==', where[key])
  } else {
    query = users
  }

  if (offset) {
    query = query.offset(offset)
  }

  if (limit) {
    query = query.limit(limit)
  }

  if (orderBy) {
    query = query.orderBy(orderBy.key, orderBy.direction)
  }

  return query.get()
}
