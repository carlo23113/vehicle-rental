import { ref } from 'vue'

export interface ContractTemplate {
  companyName: string
  companyAddress: string
  companyPhone: string
  companyEmail: string
  termsAndConditions: string // Changed from array to HTML string
  additionalClauses: string
}

const defaultTemplate: ContractTemplate = {
  companyName: 'ABC Vehicle Rentals',
  companyAddress: '123 Main Street, Downtown City, ST 12345',
  companyPhone: '(555) 123-4567',
  companyEmail: 'info@abcrentals.com',
  termsAndConditions: `
    <h3>Terms and Conditions</h3>
    <ol>
      <li>The renter agrees to return the vehicle in the same condition as received.</li>
      <li>The renter is responsible for all traffic violations and parking tickets incurred during the rental period.</li>
      <li>The renter must maintain proper insurance coverage throughout the rental period.</li>
      <li>Late returns will be charged an additional fee of $50 per hour.</li>
      <li>The vehicle must not be used for illegal purposes or in violation of any laws.</li>
      <li>The renter agrees to pay for all fuel consumed during the rental period.</li>
      <li>Smoking is strictly prohibited in all rental vehicles.</li>
      <li>The renter is responsible for all damage to the vehicle during the rental period.</li>
      <li>The security deposit will be refunded within 7 business days after vehicle return.</li>
      <li>The renter must report any accidents or damage immediately to the rental company.</li>
    </ol>
  `,
  additionalClauses: '<p>Additional terms and conditions may apply. Please contact us for more information.</p>',
}

const contractTemplate = ref<ContractTemplate>({ ...defaultTemplate })

export const useContractTemplate = () => {
  const saveTemplate = (template: ContractTemplate) => {
    contractTemplate.value = { ...template }
    // TODO: Save to localStorage or API
    localStorage.setItem('contractTemplate', JSON.stringify(template))
  }

  const loadTemplate = () => {
    const saved = localStorage.getItem('contractTemplate')
    if (saved) {
      try {
        contractTemplate.value = JSON.parse(saved)
      } catch (e) {
        console.error('Failed to load contract template:', e)
        contractTemplate.value = { ...defaultTemplate }
      }
    }
  }

  const resetTemplate = () => {
    contractTemplate.value = { ...defaultTemplate }
    localStorage.removeItem('contractTemplate')
  }

  const getTemplate = () => {
    return contractTemplate.value
  }

  return {
    contractTemplate,
    saveTemplate,
    loadTemplate,
    resetTemplate,
    getTemplate,
    defaultTemplate,
  }
}
