import { useForm } from '@inertiajs/react'
import { Button, NumberInput, Stack, TextInput } from '@mantine/core'
import { FormEvent } from 'react'

type FormValues = {
  maxPerson: number
  bathrooms: number
  bedrooms: number
  beds: number
  minimumNights: number
  maximumNights: number
}

type FormValueKeys = keyof FormValues

const formDefaultValues: FormValues = {
  maxPerson: 0,
  bathrooms: 0,
  bedrooms: 0,
  beds: 0,
  minimumNights: 0,
  maximumNights: 0,
} as const

const labels: Record<FormValueKeys, string> = {
  maxPerson: 'Max person',
  bathrooms: 'Bathrooms',
  bedrooms: 'Bedrooms',
  beds: 'Beds',
  minimumNights: 'Minimum nights',
  maximumNights: 'Maximum nights',
} as const

export function SearchForm() {
  const { data, setData } = useForm<FormValues>(formDefaultValues)

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setData((currentData) => ({ ...currentData, [name]: value }))
  }
  const handleNumberChange = (name: string, value: string | number) => {
    setData((currentData) => ({ ...currentData, [name]: Number(value) }))
  }
  const fields = Object.entries(data).map(([key, value]) => {
    const isNumber = typeof value === 'number'
    if (isNumber) {
      return (
        <NumberInput
          key={key}
          label={labels[key as FormValueKeys]}
          placeholder={key}
          value={value}
          onChange={(value) => handleNumberChange(key, value)}
          name={key}
          radius="md"
        />
      )
    }
    return (
      <TextInput
        key={key}
        label={labels[key as FormValueKeys]}
        placeholder={key}
        value={value}
        onChange={handleInputChange}
        name={key}
        radius="md"
      />
    )
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: '600px' }}>
      <Stack>{fields}</Stack>
      <span>Ceci est un bouton →</span>
      <Button type="submit">un bouton</Button>
    </form>
  )
}
