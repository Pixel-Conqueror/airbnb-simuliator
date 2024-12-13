import {
  ACCOMMODATES_MAX,
  ACCOMMODATES_MIN,
  AVAILABILITY_365_MAX,
  AVAILABILITY_365_MIN,
  BATHROOMS_MAX,
  BATHROOMS_MIN,
  BEDROOMS_MAX,
  BEDROOMS_MIN,
  BEDS_MAX,
  BEDS_MIN,
  locations,
  MAXIMUM_NIGHTS_MAX,
  MAXIMUM_NIGHTS_MIN,
  MINIMUM_NIGHTS_MIN,
  properties,
  roomTypes,
} from '@/app/validators/enum'
import { useForm } from '@inertiajs/react'
import { Button, Checkbox, NativeSelect, NumberInput, Stack } from '@mantine/core'
import { FormEvent, Fragment } from 'react'

type FormField = {
  type: 'number' | 'select' | 'checkbox'
  label: string
  min?: number
  max?: number
  defaultValue: string | number | boolean
}

type FormFields = {
  [key: string]: FormField
}

type FormValues = {
  neighbourhood_cleansed: (typeof locations)[number]
  latitude: number
  longitude: number
  property_type: (typeof properties)[number]
  room_type: (typeof roomTypes)[number]
  accommodates: number
  bathrooms: number
  bedrooms: number
  beds: number
  minimum_nights: number
  maximum_nights: number
  instant_bookable: boolean
  availability_365: number
}

type FormKeys = keyof FormValues

const formFields: FormFields = {
  neighbourhood_cleansed: {
    type: 'select',
    label: 'Neighbourhood',
    defaultValue: locations[0],
  },
  latitude: {
    type: 'number',
    label: 'Latitude',
    defaultValue: 0,
  },
  longitude: {
    type: 'number',
    label: 'Longitude',
    defaultValue: 0,
  },
  property_type: {
    type: 'select',
    label: 'Property type',
    defaultValue: properties[0],
  },
  room_type: {
    type: 'select',
    label: 'Room type',
    defaultValue: roomTypes[0],
  },
  accommodates: {
    type: 'number',
    label: 'Accommodates',
    min: ACCOMMODATES_MIN,
    max: ACCOMMODATES_MAX,
    defaultValue: ACCOMMODATES_MIN,
  },
  bathrooms: {
    type: 'number',
    label: 'Bathrooms',
    min: BATHROOMS_MIN,
    max: BATHROOMS_MAX,
    defaultValue: BATHROOMS_MIN,
  },
  bedrooms: {
    type: 'number',
    label: 'Bedrooms',
    min: BEDROOMS_MIN,
    max: BEDROOMS_MAX,
    defaultValue: BEDROOMS_MIN,
  },
  beds: {
    type: 'number',
    label: 'Beds',
    min: BEDS_MIN,
    max: BEDS_MAX,
    defaultValue: BEDS_MIN,
  },
  minimum_nights: {
    type: 'number',
    label: 'Minimum nights',
    min: MINIMUM_NIGHTS_MIN,
    max: MAXIMUM_NIGHTS_MAX,
    defaultValue: MINIMUM_NIGHTS_MIN,
  },
  maximum_nights: {
    type: 'number',
    label: 'Maximum nights',
    min: MAXIMUM_NIGHTS_MIN,
    max: MAXIMUM_NIGHTS_MAX,
    defaultValue: MAXIMUM_NIGHTS_MAX,
  },
  instant_bookable: {
    type: 'checkbox',
    label: 'Instant bookable',
    defaultValue: false,
  },
  availability_365: {
    type: 'number',
    label: 'Availability 365',
    min: AVAILABILITY_365_MIN,
    max: AVAILABILITY_365_MAX,
    defaultValue: AVAILABILITY_365_MAX,
  },
}

const formDefaultValues = Object.fromEntries(
  Object.entries(formFields).map(([name, stuff]) => [name, stuff.defaultValue])
)

interface EstimateFormProps {
  coordinates: GeolocationCoordinates
}

export function EstimateForm({ coordinates }: EstimateFormProps) {
  const { data, setData, processing, post, hasErrors, isDirty, wasSuccessful } =
    useForm<FormValues>({
      ...formDefaultValues,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    } as FormValues)

  const handleNumberChange = (name: string, value: string | number) => {
    setData((currentData) => ({ ...currentData, [name]: Number(value) }))
  }

  const fields = Object.entries(formFields).map(([name, stuff]) => {
    const { type, label, min, max } = stuff
    if (name === 'latitude' || name === 'longitude') {
      return <Fragment />
    }

    const commonProps = {
      label: label,
    }

    const key = name
    const value = data[key as FormKeys]
    if (type === 'number') {
      return (
        <NumberInput
          {...commonProps}
          key={key}
          value={value as number}
          onChange={(val) => handleNumberChange(key, val)}
          min={min}
          max={max}
        />
      )
    }

    if (type === 'checkbox') {
      return (
        <Checkbox
          {...commonProps}
          key={key}
          checked={value as boolean}
          onChange={(val) => setData((currentData) => ({ ...currentData, [key]: val }))}
        />
      )
    }

    const selectData =
      key === 'neighbourhood_cleansed'
        ? locations
        : key === 'property_type'
          ? properties
          : roomTypes
    return (
      <NativeSelect
        {...commonProps}
        key={key}
        value={value as string}
        onChange={(event) =>
          setData((currentData) => ({ ...currentData, [key]: event.target.value }))
        }
        data={selectData}
      />
    )
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    post('/estimate')
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        {fields}
        <Button
          type="submit"
          loading={processing}
          disabled={hasErrors || (wasSuccessful && !isDirty)}
        >
          Estimate
        </Button>
      </Stack>
    </form>
  )
}
