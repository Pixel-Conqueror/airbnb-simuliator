import type HomeController from '#controllers/home_controller'
import { InferPageProps } from '@adonisjs/inertia/types'
import { Head } from '@inertiajs/react'
import { Box } from '@mantine/core'
import 'leaflet/dist/leaflet.css'
import { Map } from '~/components/map'

export default function Home(props: InferPageProps<HomeController, 'index'>) {
  console.log(props.data.length)
  return (
    <>
      <Head title="Homepage" />
      <Box
        style={{
          minHeight: '100%',
          width: '900px',
          display: 'flex',
          flex: 1,
          alignItems: 'flex-end',
        }}
      >
        <Map {...props} />
      </Box>
    </>
  )
}
