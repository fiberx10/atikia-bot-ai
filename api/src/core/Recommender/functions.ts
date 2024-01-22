// openai call functions

interface IFunction {
  name: string
  description: string
  parameters: {
    type: string
    properties: {
      [key: string]: {
        type: string
        description: string
      }
    }
    required?: string[]
  }
}

const RecommendProperty: IFunction = {
  name: 'recommendProperty',
  description: 'recommend a Property from the properties database',
  parameters: {
    type: 'object',
    properties: {
      type: {
        type: 'string',
        description: 'the user budget or range of price',
      },
      price: {
        type: 'string',
        description: 'the user budget or range of price',
      },
      size: {
        type: 'string',
        description: 'the size of the property or the range',
      },
      location: {
        type: 'string',
        description: 'the property location, city , country or even village',
      },
      numBathrooms: {
        type: 'string',
        description: 'the number of bathrooms or the range',
      },
      numBedrooms: {
        type: 'string',
        description: 'the number of bedrooms or the range',
      },
      amenities: {
        type: 'string',
        description: 'the amenities of the property',
      },
    },
    required: ['size', 'amenities'],
  },
}



const foundMatchedProperty: IFunction = {
  name: 'foundMatchedProperty',
  description: 'returns the matched property ID from the properties database with an informative message to the user that you found a good property for him without giving him the property details',
  parameters: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'the property id',
      },
      message: {
        type: 'string',
        description: 'the message to the user , professional and friendly , informative to the user that you found a good property for him without giving him the property details',
      },
    },
  },
}


const EstimatePrice: IFunction = {
  name: 'estimateProperty',
  description:
    'give a price estimation based on the user preference (size, type , location ...)',
  parameters: {
    type: 'object',
    properties: {
      type: {
        type: 'string',
        description: 'the user budget or range of price',
      },
      price: {
        type: 'string',
        description: 'the user budget or range of price',
      },
      size: {
        type: 'string',
        description: 'the size of the property or the range',
      },
      location: {
        type: 'string',
        description: 'the property location, city , country or even village',
      },
      numBathrooms: {
        type: 'string',
        description: 'the number of bathrooms or the range',
      },
      numBedrooms: {
        type: 'string',
        description: 'the number of bedrooms or the range',
      },
      amenities: {
        type: 'string',
        description: 'the amenities of the property',
      },
    },
  },
}

export { RecommendProperty, EstimatePrice, foundMatchedProperty }
