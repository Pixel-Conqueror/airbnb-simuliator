export const locations = [
  'Observatoire',
  'Hôtel-de-Ville',
  'Entrepôt',
  'Opéra',
  'Vaugirard',
  'Louvre',
  'Luxembourg',
  'Popincourt',
  'Gobelins',
  'Bourse',
  'Buttes-Montmartre',
  'Buttes-Chaumont',
  'Temple',
  'Reuilly',
  'Panthéon',
  'Batignolles-Monceau',
  'Ménilmontant',
  'Élysée',
  'Palais-Bourbon',
  'Passy',
]

export const properties = [
  'Entire rental unit',
  'Entire loft',
  'Private room in rental unit',
  'Entire condo',
  'Private room in guest suite',
  'Entire home',
  'Entire guesthouse',
  'Private room in bed and breakfast',
  'Private room in townhouse',
  'Private room in condo',
  'Entire serviced apartment',
  'Private room in loft',
  'Shared room in rental unit',
  'Tiny home',
  'Entire townhouse',
  'Room in bed and breakfast',
  'Private room in guesthouse',
  'Private room in home',
  'Private room',
  'Entire place',
  'Private room in earthen home',
  'Room in serviced apartment',
  'Entire bed and breakfast',
  'Boat',
  'Shared room in condo',
  'Shared room in loft',
  'Cave',
  'Entire guest suite',
  'Private room in villa',
  'Room in hotel',
  'Shared room in home',
  'Room in boutique hotel',
  'Shared room in townhouse',
  'Shared room in tiny home',
  'Shared room in farm stay',
  'Dome',
  'Private room in serviced apartment',
  'Shared room in guesthouse',
  'Shared room in bed and breakfast',
  'Entire vacation home',
  'Room in aparthotel',
  'Room in hostel',
  'Casa particular',
  'Private room in hostel',
  'Private room in casa particular',
  'Private room in boat',
  'Shared room in hostel',
  'Camper/RV',
  'Entire home/apt',
  'Shared room in boutique hotel',
  'Entire bungalow',
  'Barn',
  'Entire villa',
  'Private room in vacation home',
  'Room in rental unit',
  'Private room in tiny home',
  'Shared room in hotel',
  'Private room in cottage',
  'Shared room in guest suite',
  'Shared room in ice dome',
  'Private room in houseboat',
  'Shared room in serviced apartment',
  'Private room in cave',
  'Shipping container',
  'Farm stay',
  'Houseboat',
  'Religious building',
  'Shared room',
  'Tower',
  'Shared room in casa particular',
  'Earthen home',
] as const

export const roomTypes = ['Entire home/apt', 'Private room', 'Shared room', 'Hotel room'] as const

export const ACCOMMODATES_MIN = 1
export const ACCOMMODATES_MAX = 16

export const BATHROOMS_MIN = 1
export const BATHROOMS_MAX = 8

export const BEDROOMS_MIN = 1
export const BEDROOMS_MAX = 8

export const BEDS_MIN = 1
export const BEDS_MAX = 16

export const MINIMUM_NIGHTS_MIN = 1
export const MINIMUM_NIGHTS_MAX = 30

export const MAXIMUM_NIGHTS_MIN = 1
export const MAXIMUM_NIGHTS_MAX = 365

export const INSTANT_BOOKABLE_DEFAULT = false

export const AVAILABILITY_365_MIN = 100
export const AVAILABILITY_365_MAX = 365
