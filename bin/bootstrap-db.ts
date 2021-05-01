/* eslint-disable import/first */

// npx ts-node -O '{"module":"commonjs"}' bin/bootstrap-db.ts

import dotenv from 'dotenv-safe'
dotenv.config()

import users from '../data/users.json'
import * as db from '../lib/db'
import { User } from '../lib/types'
// import { getUsers } from '../lib/get-users'

async function main() {
  for (const user of users as Partial<User>[]) {
    const doc = await db.users.add(user)
    const u = await db.get<User>(doc)
    console.log(u)
  }

  // const users = await getUsers()
  // console.log('users', users)
}

main().catch((err) => {
  console.error(err)
})
