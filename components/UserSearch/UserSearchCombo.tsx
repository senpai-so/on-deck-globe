import React from 'react'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { makeStyles } from '@material-ui/core/styles'
import { User } from 'lib/types'

const useStyles = makeStyles({
  root: {
    width: 400
  },
  inputRoot: {
    border: 'none',
    borderRadius: 100,
    // background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    background: 'linear-gradient(90.68deg, #b439df 0.26%, #e5337e 102.37%)',
    // This matches the specificity of the default styles at https://github.com/mui-org/material-ui/blob/v4.11.3/packages/material-ui-lab/src/Autocomplete/Autocomplete.js#L90
    '&[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input:first-child': {
      // Default left padding is 6px
      paddingLeft: 26
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
  // Styling
  const classes = useStyles()

  // Filter users that are not public / do not have a name to search for
  const filteredUsers = users.filter((user) => !!user.fellow)

  return (
    <Autocomplete
      id='user-search-combo'
      options={filteredUsers}
      getOptionLabel={(option) => option.fellow?.name}
      style={{ width: 400 }} // , backgroundColor: '#282828', border: 'none'
      renderInput={(params) => (
        <TextField
          {...params}
          label='User search'
          variant='outlined'
          hiddenLabel={true}
        />
      )}
      classes={{ inputRoot: classes.inputRoot, root: classes.root }}
      onChange={onClick}
    />
  )
}
