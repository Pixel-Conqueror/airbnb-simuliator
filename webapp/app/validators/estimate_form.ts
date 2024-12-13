import vine from '@vinejs/vine'
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
  MINIMUM_NIGHTS_MAX,
  MINIMUM_NIGHTS_MIN,
  properties,
  roomTypes,
} from './enum.js'

export const estimateFormValidator = vine.compile(
  vine.object({
    neighbourhood_cleansed: vine.enum(locations),
    latitude: vine.number(),
    longitude: vine.number(),
    property_type: vine.enum(properties),
    room_type: vine.enum(roomTypes),
    accommodates: vine.number().min(ACCOMMODATES_MIN).max(ACCOMMODATES_MAX),
    bathrooms: vine.number().min(BATHROOMS_MIN).max(BATHROOMS_MAX),
    bedrooms: vine.number().min(BEDROOMS_MIN).max(BEDROOMS_MAX),
    beds: vine.number().min(BEDS_MIN).max(BEDS_MAX),
    minimum_nights: vine.number().min(MINIMUM_NIGHTS_MIN).max(MINIMUM_NIGHTS_MAX),
    maximum_nights: vine.number().min(MAXIMUM_NIGHTS_MIN).max(MAXIMUM_NIGHTS_MAX),
    instant_bookable: vine.boolean(),
    availability_365: vine.number().min(AVAILABILITY_365_MIN).max(AVAILABILITY_365_MAX),
  })
)
