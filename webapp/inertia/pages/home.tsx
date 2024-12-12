import type HomeController from '#controllers/home_controller'
import { InferPageProps } from '@adonisjs/inertia/types'
import { Head } from '@inertiajs/react'
import 'leaflet/dist/leaflet.css'
import { Map } from '~/components/map'

export default function Home({ data }: InferPageProps<HomeController, 'index'>) {
  return (
    <>
      <Head title="Homepage" />
      <Map data={data} />
    </>
  )
}
