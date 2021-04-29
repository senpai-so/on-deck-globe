export interface User {
  id: string
  isPublic: boolean
  fellow: Fellow
}

export interface Fellow {
  id: string
  name: string
  imageUrl?: string
  oneLiner?: string
  bio?: string
  doingNext?: string
  twitterId?: string
  linkedinId?: string
  personalUrl?: string
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
  visibility?: string
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
