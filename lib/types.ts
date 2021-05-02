export interface User {
  id?: string // firestore document id
  userId: string // on deck user id
  isPublic: boolean
  lat?: number
  lng?: number
  fellow?: Fellow
  twitterBio?: string
}

export interface Fellow {
  id: string
  name: string
  imageUrl?: string
  oneLiner?: string
  bio?: string
  doingNext?: string
  slackIntro?: string
  twitterId?: string
  linkedinId?: string
  personalUrl?: string
  calendlyUrl?: string
  dmsOpen?: boolean
  needsOnboarding?: boolean
  isMe?: boolean
  fave?: null
  workspaces?: Workspace[]
  locations?: Location[]
  cohorts?: Cohort[]
  skills?: Tag[]
  expertises?: Tag[]
  statuses?: KeyValue[]
  objectives?: KeyValue[]
  interests?: KeyValue[]
  lookingFor?: KeyValue[]
  legacyReferralId?: string
  referredBy?: any
  writings?: any[]
  investments?: any[]
  projects?: any[]
  visibility?: string
  createdAt?: string
  updatedAt?: string
}

export interface Cohort {
  cohort:
    | {
        id: string
        active: boolean
        name: string
        programId: string
        createdAt: string
        updatedAt: string
      }
    | KeyValue
}

export interface KeyValue {
  value: string
  label: string
}

export type Location = KeyValue
export type Tag = KeyValue

export interface Workspace {
  slackId: string
  slackUrl: string
  workspace: WorkspaceProgram
}

export interface WorkspaceProgram {
  programId: string
  program?: Program
}

export interface Program {
  id: string
  name: string
  color: string
}
