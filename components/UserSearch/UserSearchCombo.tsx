import React from 'react'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { makeStyles } from '@material-ui/core/styles'

import { Globe } from 'state/globe'
import { User } from 'lib/types'

// TODO: switch to using headless
// import useAutocomplete from '@material-ui/lab/useAutocomplete'

const useStyles = makeStyles({
  root: {
    width: '400px',
    '& .MuiInputLabel-shrink': {
      display: 'none',
      opacity: 0
    },
    '& label': {
      transform: 'translate(18px, 16px) scale(1)'
    }
  },
  inputRoot: {
    border: 'none',
    borderRadius: 100,
    // background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    background: '#fff',
    color: '#000',
    paddingTop: '4px !important',
    paddingBottom: '4px !important',
    // This matches the specificity of the default styles at https://github.com/mui-org/material-ui/blob/v4.11.3/packages/material-ui-lab/src/Autocomplete/Autocomplete.js#L90
    '&[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input:first-child': {
      // Default left padding is 6px
      paddingLeft: 12
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none'
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      border: 'none'
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      border: 'none'
    }
  }
})

/**
 * Renders an input box to search for Users that do have a name in the data.
 * Clicking on a user triggers the `onClick` callback
 * Material UI Autocomplete
 *
 * Examples: https://material-ui.com/components/autocomplete/
 * API Reference: https://material-ui.com/api/autocomplete/
 */
export default function UserSearchCombo({
  users,
  onClick
}: {
  users: User[]
  onClick: (event: React.ChangeEvent, value: User) => any
}) {
  const { focusedUser } = Globe.useContainer()
  const [value, setValue] = React.useState<User>(null)

  React.useEffect(() => {
    if (value && focusedUser?.userId !== value?.userId) {
      setValue(null)
    }
  }, [focusedUser, value, setValue])

  const onChangeValue = React.useCallback(
    (event, newValue) => {
      setValue(newValue)
      onClick(event, newValue)
    },
    [setValue, onClick]
  )

  // Styling
  const classes = useStyles()

  // Filter users that are not public / do not have a name to search for
  const filteredUsers = React.useMemo(
    () => users.filter((user) => !!user.fellow),
    [users]
  )

  return (
    <Autocomplete
      id='user-search-combo'
      options={filteredUsers}
      getOptionLabel={(option) => option?.fellow?.name ?? ''}
      style={{ width: 400 }} // , backgroundColor: '#282828', border: 'none'
      clearOnBlur={true}
      value={value}
      onChange={onChangeValue}
      renderInput={(params) => (
        <TextField
          {...params}
          label='User search'
          variant='outlined'
          hiddenLabel={true}
        />
      )}
      classes={{ inputRoot: classes.inputRoot, root: classes.root }}
      // onChange={onClick}
    />
  )
}
