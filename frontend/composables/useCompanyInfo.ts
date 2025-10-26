import type { CompanyInfo } from '~/types/invoice'

export const useCompanyInfo = () => {
  // In production, this would fetch from settings/API
  const companyInfo: CompanyInfo = {
    name: 'Vehicle Rental Company',
    address: {
      street: '123 Business St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'USA',
    },
    phone: '+1 (555) 123-4567',
    email: 'contact@vehiclerental.com',
    website: 'www.vehiclerental.com',
    taxId: '12-3456789',
    registrationNumber: 'REG-2024-001',
  }

  return {
    companyInfo,
  }
}
