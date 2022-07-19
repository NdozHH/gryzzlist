import { Stack, Text } from '@mantine/core'

const ListsIndexRoute = () => {
  return (
    <Stack
      justify={true ? 'center' : 'flex-start'}
      align={true ? 'center' : 'stretch'}
      sx={{
        width: '100%',
        maxWidth: '34.375rem',
        overflow: 'hidden',
        height: '100%',
      }}
    >
      <Text>You don't have any selected list</Text>
    </Stack>
  )
}

export default ListsIndexRoute
