import { createTheme, MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import { PropsWithChildren } from 'react'

const theme = createTheme({})

export default function BaseLayout({ children }: PropsWithChildren) {
  return <MantineProvider theme={theme}>{children}</MantineProvider>
}
