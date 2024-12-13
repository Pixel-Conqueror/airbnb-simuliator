import type HomeController from '#controllers/home_controller'
import { InferPageProps } from '@adonisjs/inertia/types'
import { Head, Link } from '@inertiajs/react'
import { Anchor, Box, Group, Stack, Text } from '@mantine/core'
import 'leaflet/dist/leaflet.css'
import { Map } from '~/components/map'

export default function Home(props: InferPageProps<HomeController, 'index'>) {
  console.log(props.data.length)
  const steps = [10, 20, 50, 100, 200, 500, 1000]
  return (
    <>
      <Head title="Homepage" />
      <Stack
        style={{
          width: '100%',
        }}
      >
        <Group justify="end">
          <Text>Show</Text>
          {steps.map((step) => (
            <Anchor component={Link} key={step} href={`?count=${step}`}>
              {step}
            </Anchor>
          ))}
        </Group>
        <Box
          style={{
            minHeight: '100%',
            display: 'flex',
            flex: 1,
            alignItems: 'flex-end',
          }}
        >
          <Map {...props} />
        </Box>
      </Stack>
    </>
  )
}
