import { Link } from '@inertiajs/react'
import { Anchor, Center, Divider, SimpleGrid, Stack, Text, TextInput, Title } from '@mantine/core'
import { useEffect, useState } from 'react'
import { EstimateForm } from '~/components/estimate_form'

interface EstimatePageProps {
  predictedPrice: number
}

export default function EstimatePage({ predictedPrice }: EstimatePageProps) {
  const [coordinates, setCoordinates] = useState<GeolocationCoordinates | null>(null)
  const [isErrored, setIsErrored] = useState<boolean>(false)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => setCoordinates(position.coords),
      (error) => {
        console.error(error)
        setIsErrored(true)
      }
    )
  }, [])

  console.log(coordinates, isErrored)
  if (!coordinates && !isErrored) {
    return <div>Loading...</div>
  }

  if (isErrored || !coordinates) {
    return <div>There was an error getting your location</div>
  }

  return (
    <Stack w={1200}>
      <Center>
        <Title order={1}>Estimate your property</Title>
      </Center>
      <SimpleGrid cols={2} spacing="md">
        <EstimateForm coordinates={coordinates} />
        <Stack gap="md">
          <TextInput label="Latitude" value={coordinates.latitude} disabled />
          <TextInput label="Longitude" value={coordinates.longitude} disabled />
          <Text c="dimmed">
            If you'd like to find out more about property prices around you,{' '}
            <Anchor component={Link} href="/">
              go here
            </Anchor>{' '}
            to find out more.
          </Text>
          {predictedPrice && (
            <>
              <Divider />
              <Text>
                Based on over +180k properties, we estimate the price of your property at $
                {predictedPrice
                  .toFixed(2)
                  .replace(/\d(?=(\d{3})+\.)/g, '$&,')
                  .replace('.00', '')}{' '}
                per night.
              </Text>
            </>
          )}
        </Stack>
      </SimpleGrid>
    </Stack>
  )
}
