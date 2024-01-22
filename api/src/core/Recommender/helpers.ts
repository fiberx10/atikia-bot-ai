const JustifyPreferences = (args: { [key: string]: string | undefined }) => {
  const { type, price, size, location, numBathrooms, numBedrooms, amenities } =
    args

  const propertyTypeString = type ? `a ${type} property` : ''
  const sizeString = size ? `with a size of ${size}` : ''
  const priceRangeString = price ? `in the price range of ${price}` : ''
  const locationString = location ? `in ${location}` : ''
  const numberOfBedroomsString = numBedrooms
    ? `with ${numBedrooms} bedrooms`
    : ''
  const numberOfBathroomsString = numBathrooms
    ? `with ${numBathrooms} bathrooms`
    : ''

  const amenitiesString = amenities ? `with ${amenities}` : ''

  return `I am looking for ${propertyTypeString} ${sizeString} ${priceRangeString} ${locationString} ${numberOfBedroomsString} ${numberOfBathroomsString}. ${amenitiesString}`
}

export { JustifyPreferences }
