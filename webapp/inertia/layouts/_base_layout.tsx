import { Link } from '@inertiajs/react'
import { Anchor, AppShell, createTheme, Group, MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import { PropsWithChildren } from 'react'

const theme = createTheme({})

export default function BaseLayout({ children }: PropsWithChildren) {
  return (
    <MantineProvider theme={theme}>
      <AppShell padding="md" h="100%" header={{ height: 60, offset: true }}>
        <AppShell.Header>
          <Group gap="xl" p="md">
            <div style={{ fontSize: '1.15rem' }}>AirbnbSimuliator</div>
            <Anchor component={Link} href="/">
              Home
            </Anchor>
            <Anchor component={Link} href="/estimate">
              Estimate your property
            </Anchor>
          </Group>
        </AppShell.Header>

        <AppShell.Main
          style={{ minHeight: 'calc(100% - 40px)', display: 'flex', justifyContent: 'center' }}
        >
          {children}
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  )
}
