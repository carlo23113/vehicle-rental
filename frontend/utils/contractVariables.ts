import type { Rental } from '~/types/rental'

export interface ContractVariables {
  // Company Info
  COMPANY_NAME: string
  COMPANY_ADDRESS: string
  COMPANY_PHONE: string
  COMPANY_EMAIL: string

  // Contract Meta
  RENTAL_ID: string | number
  CONTRACT_DATE: string

  // Customer Info
  CUSTOMER_NAME: string
  CUSTOMER_EMAIL: string
  CUSTOMER_PHONE: string
  CUSTOMER_LICENSE: string

  // Vehicle Info
  VEHICLE_MAKE: string
  VEHICLE_MODEL: string
  VEHICLE_YEAR: string | number
  VEHICLE_PLATE: string
  VEHICLE_COLOR: string
  VEHICLE_MILEAGE: string

  // Rental Details
  RENTAL_DAYS: string | number
  START_DATE: string
  END_DATE: string
  PICKUP_TIME: string
  RETURN_TIME: string
  PICKUP_LOCATION: string
  RATE_TYPE: string

  // Pricing
  DAILY_RATE: string
  TOTAL_AMOUNT: string
}

/**
 * Replaces template variables with actual values
 * Variables format: {{VARIABLE_NAME}}
 */
export function replaceContractVariables(
  template: string,
  variables: Partial<ContractVariables>
): string {
  let result = template

  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`
    const regex = new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
    result = result.replace(regex, String(value || ''))
  })

  return result
}

/**
 * Extracts variables from rental data for contract generation
 */
export function getContractVariablesFromRental(
  rental: Rental,
  companyInfo: {
    name: string
    address: string
    phone: string
    email: string
  }
): ContractVariables {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return {
    // Company Info
    COMPANY_NAME: companyInfo.name,
    COMPANY_ADDRESS: companyInfo.address,
    COMPANY_PHONE: companyInfo.phone,
    COMPANY_EMAIL: companyInfo.email,

    // Contract Meta
    RENTAL_ID: rental.id,
    CONTRACT_DATE: formatDate(new Date()),

    // Customer Info
    CUSTOMER_NAME: rental.customer.name,
    CUSTOMER_EMAIL: rental.customer.email,
    CUSTOMER_PHONE: rental.customer.phone,
    CUSTOMER_LICENSE: rental.customer.license || 'N/A',

    // Vehicle Info
    VEHICLE_MAKE: rental.vehicle.make,
    VEHICLE_MODEL: rental.vehicle.model,
    VEHICLE_YEAR: rental.vehicle.year,
    VEHICLE_PLATE: rental.vehicle.licensePlate,
    VEHICLE_COLOR: rental.vehicle.color,
    VEHICLE_MILEAGE: rental.vehicle.mileage?.toLocaleString() || 'N/A',

    // Rental Details
    RENTAL_DAYS: rental.amountOfDays,
    START_DATE: formatDate(rental.startDate),
    END_DATE: formatDate(rental.endDate),
    PICKUP_TIME: rental.pickupTime || 'TBD',
    RETURN_TIME: rental.returnTime || 'TBD',
    PICKUP_LOCATION: `${rental.pickupLocation.name}, ${rental.pickupLocation.address}`,
    RATE_TYPE: rental.rateType === 'city' ? 'City Drive' : 'Province Drive',

    // Pricing
    DAILY_RATE: formatCurrency(rental.dailyRate),
    TOTAL_AMOUNT: formatCurrency(rental.totalAmount),
  }
}

/**
 * Gets list of all available template variables for documentation
 */
export function getAvailableVariables(): Array<{ key: string; description: string }> {
  return [
    { key: '{{COMPANY_NAME}}', description: 'Company name' },
    { key: '{{COMPANY_ADDRESS}}', description: 'Company address' },
    { key: '{{COMPANY_PHONE}}', description: 'Company phone number' },
    { key: '{{COMPANY_EMAIL}}', description: 'Company email address' },
    { key: '{{RENTAL_ID}}', description: 'Rental agreement ID' },
    { key: '{{CONTRACT_DATE}}', description: 'Contract generation date' },
    { key: '{{CUSTOMER_NAME}}', description: 'Customer full name' },
    { key: '{{CUSTOMER_EMAIL}}', description: 'Customer email' },
    { key: '{{CUSTOMER_PHONE}}', description: 'Customer phone number' },
    { key: '{{CUSTOMER_LICENSE}}', description: "Customer's driver's license number" },
    { key: '{{VEHICLE_MAKE}}', description: 'Vehicle manufacturer' },
    { key: '{{VEHICLE_MODEL}}', description: 'Vehicle model' },
    { key: '{{VEHICLE_YEAR}}', description: 'Vehicle year' },
    { key: '{{VEHICLE_PLATE}}', description: 'Vehicle license plate' },
    { key: '{{VEHICLE_COLOR}}', description: 'Vehicle color' },
    { key: '{{VEHICLE_MILEAGE}}', description: 'Current vehicle mileage' },
    { key: '{{RENTAL_DAYS}}', description: 'Number of rental days' },
    { key: '{{START_DATE}}', description: 'Rental start date' },
    { key: '{{END_DATE}}', description: 'Rental end date' },
    { key: '{{PICKUP_TIME}}', description: 'Vehicle pickup time' },
    { key: '{{RETURN_TIME}}', description: 'Vehicle return time' },
    { key: '{{PICKUP_LOCATION}}', description: 'Pickup location details' },
    { key: '{{RATE_TYPE}}', description: 'Rate type (City/Province Drive)' },
    { key: '{{DAILY_RATE}}', description: 'Daily rental rate' },
    { key: '{{TOTAL_AMOUNT}}', description: 'Total rental amount' },
  ]
}
