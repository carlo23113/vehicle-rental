import { ref } from 'vue'

export interface ContractTemplate {
  companyName: string
  companyAddress: string
  companyPhone: string
  companyEmail: string
  termsAndConditions: string // Changed from array to HTML string
  additionalClauses: string
  fullContractTemplate: string // Full contract HTML with placeholder variables
}

const defaultFullContractTemplate = `
<div class="contract-header" style="text-align: center; margin-bottom: 2rem;">
  <h1 style="font-size: 2rem; font-weight: bold; margin-bottom: 0.5rem;">{{COMPANY_NAME}}</h1>
  <p style="margin: 0.25rem 0;">{{COMPANY_ADDRESS}}</p>
  <p style="margin: 0.25rem 0;">Phone: {{COMPANY_PHONE}} | Email: {{COMPANY_EMAIL}}</p>
</div>

<hr style="margin: 2rem 0; border: none; border-top: 1px solid #e0e0e0;" />

<div class="contract-title" style="text-align: center; margin-bottom: 2rem;">
  <h2 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 0.5rem;">VEHICLE RENTAL AGREEMENT</h2>
  <p style="margin: 0.25rem 0;">Contract #{{RENTAL_ID}}</p>
  <p style="margin: 0.25rem 0;">Date: {{CONTRACT_DATE}}</p>
</div>

<hr style="margin: 2rem 0; border: none; border-top: 1px solid #e0e0e0;" />

<section style="margin-bottom: 2rem;">
  <h3 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">PARTIES TO THIS AGREEMENT</h3>
  <div style="margin-bottom: 1rem;">
    <strong>Rental Company:</strong>
    <p style="margin: 0.25rem 0;">{{COMPANY_NAME}}</p>
    <p style="margin: 0.25rem 0;">{{COMPANY_ADDRESS}}</p>
  </div>
  <div style="margin-top: 1rem;">
    <strong>Renter:</strong>
    <p style="margin: 0.25rem 0;">{{CUSTOMER_NAME}}</p>
    <p style="margin: 0.25rem 0;">Email: {{CUSTOMER_EMAIL}}</p>
    <p style="margin: 0.25rem 0;">Phone: {{CUSTOMER_PHONE}}</p>
    <p style="margin: 0.25rem 0;">Driver's License: {{CUSTOMER_LICENSE}}</p>
  </div>
</section>

<section style="margin-bottom: 2rem;">
  <h3 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">VEHICLE INFORMATION</h3>
  <table style="width: 100%; border-collapse: collapse;">
    <tbody>
      <tr style="border-bottom: 1px solid #e0e0e0;">
        <td style="padding: 0.75rem 1rem;"><strong>Make & Model:</strong></td>
        <td style="padding: 0.75rem 1rem;">{{VEHICLE_MAKE}} {{VEHICLE_MODEL}}</td>
      </tr>
      <tr style="border-bottom: 1px solid #e0e0e0;">
        <td style="padding: 0.75rem 1rem;"><strong>Year:</strong></td>
        <td style="padding: 0.75rem 1rem;">{{VEHICLE_YEAR}}</td>
      </tr>
      <tr style="border-bottom: 1px solid #e0e0e0;">
        <td style="padding: 0.75rem 1rem;"><strong>License Plate:</strong></td>
        <td style="padding: 0.75rem 1rem;">{{VEHICLE_PLATE}}</td>
      </tr>
      <tr style="border-bottom: 1px solid #e0e0e0;">
        <td style="padding: 0.75rem 1rem;"><strong>Color:</strong></td>
        <td style="padding: 0.75rem 1rem;">{{VEHICLE_COLOR}}</td>
      </tr>
      <tr>
        <td style="padding: 0.75rem 1rem;"><strong>Current Mileage:</strong></td>
        <td style="padding: 0.75rem 1rem;">{{VEHICLE_MILEAGE}} miles</td>
      </tr>
    </tbody>
  </table>
</section>

<section style="margin-bottom: 2rem;">
  <h3 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">RENTAL DETAILS</h3>
  <table style="width: 100%; border-collapse: collapse;">
    <tbody>
      <tr style="border-bottom: 1px solid #e0e0e0;">
        <td style="padding: 0.75rem 1rem;"><strong>Rental Period:</strong></td>
        <td style="padding: 0.75rem 1rem;">{{RENTAL_DAYS}} days</td>
      </tr>
      <tr style="border-bottom: 1px solid #e0e0e0;">
        <td style="padding: 0.75rem 1rem;"><strong>Start Date:</strong></td>
        <td style="padding: 0.75rem 1rem;">{{START_DATE}} at {{PICKUP_TIME}}</td>
      </tr>
      <tr style="border-bottom: 1px solid #e0e0e0;">
        <td style="padding: 0.75rem 1rem;"><strong>End Date:</strong></td>
        <td style="padding: 0.75rem 1rem;">{{END_DATE}} at {{RETURN_TIME}}</td>
      </tr>
      <tr style="border-bottom: 1px solid #e0e0e0;">
        <td style="padding: 0.75rem 1rem;"><strong>Pickup Location:</strong></td>
        <td style="padding: 0.75rem 1rem;">{{PICKUP_LOCATION}}</td>
      </tr>
      <tr>
        <td style="padding: 0.75rem 1rem;"><strong>Rate Type:</strong></td>
        <td style="padding: 0.75rem 1rem;">{{RATE_TYPE}}</td>
      </tr>
    </tbody>
  </table>
</section>

<section style="margin-bottom: 2rem;">
  <h3 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">PRICING</h3>
  <table style="width: 100%; border-collapse: collapse;">
    <tbody>
      <tr style="border-bottom: 1px solid #e0e0e0;">
        <td style="padding: 0.75rem 1rem;">Daily Rate ({{RATE_TYPE}}):</td>
        <td style="padding: 0.75rem 1rem; text-align: right;">{{DAILY_RATE}}</td>
      </tr>
      <tr style="border-bottom: 1px solid #e0e0e0;">
        <td style="padding: 0.75rem 1rem;">Number of Days:</td>
        <td style="padding: 0.75rem 1rem; text-align: right;">{{RENTAL_DAYS}}</td>
      </tr>
      <tr style="background-color: #f5f5f5; font-weight: bold;">
        <td style="padding: 0.75rem 1rem;"><strong>Total Amount:</strong></td>
        <td style="padding: 0.75rem 1rem; text-align: right;"><strong>{{TOTAL_AMOUNT}}</strong></td>
      </tr>
    </tbody>
  </table>
</section>

<section style="margin-bottom: 2rem;">
  <h3 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">TERMS AND CONDITIONS</h3>
  <ol style="padding-left: 1.5rem;">
    <li style="margin-bottom: 0.5rem;">The renter agrees to return the vehicle in the same condition as received.</li>
    <li style="margin-bottom: 0.5rem;">The renter is responsible for all traffic violations and parking tickets incurred during the rental period.</li>
    <li style="margin-bottom: 0.5rem;">The renter must maintain proper insurance coverage throughout the rental period.</li>
    <li style="margin-bottom: 0.5rem;">Late returns will be charged an additional fee of $50 per hour.</li>
    <li style="margin-bottom: 0.5rem;">The vehicle must not be used for illegal purposes or in violation of any laws.</li>
    <li style="margin-bottom: 0.5rem;">The renter agrees to pay for all fuel consumed during the rental period.</li>
    <li style="margin-bottom: 0.5rem;">Smoking is strictly prohibited in all rental vehicles.</li>
    <li style="margin-bottom: 0.5rem;">The renter is responsible for all damage to the vehicle during the rental period.</li>
    <li style="margin-bottom: 0.5rem;">The security deposit will be refunded within 7 business days after vehicle return.</li>
    <li style="margin-bottom: 0.5rem;">The renter must report any accidents or damage immediately to the rental company.</li>
  </ol>
</section>

<section style="margin-bottom: 2rem;">
  <h3 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">SIGNATURES</h3>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 3rem;">
    <div>
      <div style="border-bottom: 1px solid #000; padding-bottom: 0.5rem; margin-bottom: 0.5rem;">_____________________________</div>
      <p style="margin: 0;"><strong>Renter Signature</strong></p>
      <p style="margin: 0.25rem 0;">Date: _______________</p>
    </div>
    <div>
      <div style="border-bottom: 1px solid #000; padding-bottom: 0.5rem; margin-bottom: 0.5rem;">_____________________________</div>
      <p style="margin: 0;"><strong>Company Representative</strong></p>
      <p style="margin: 0.25rem 0;">Date: _______________</p>
    </div>
  </div>
</section>
`

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
  fullContractTemplate: defaultFullContractTemplate,
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
        const parsed = JSON.parse(saved)

        // Check if fullContractTemplate is missing or too short (likely corrupted)
        const needsMigration = !parsed.fullContractTemplate || parsed.fullContractTemplate.length < 100

        // Migrate old templates - ensure all new fields exist
        const migratedTemplate: ContractTemplate = {
          companyName: parsed.companyName || defaultTemplate.companyName,
          companyAddress: parsed.companyAddress || defaultTemplate.companyAddress,
          companyPhone: parsed.companyPhone || defaultTemplate.companyPhone,
          companyEmail: parsed.companyEmail || defaultTemplate.companyEmail,
          termsAndConditions: parsed.termsAndConditions || defaultTemplate.termsAndConditions,
          additionalClauses: parsed.additionalClauses || defaultTemplate.additionalClauses,
          fullContractTemplate: needsMigration ? defaultFullContractTemplate : parsed.fullContractTemplate,
        }

        contractTemplate.value = migratedTemplate

        // Save the migrated template if it was updated
        if (needsMigration) {
          console.log('Migrating contract template with full default template')
          localStorage.setItem('contractTemplate', JSON.stringify(migratedTemplate))
        }
      } catch (e) {
        console.error('Failed to load contract template:', e)
        contractTemplate.value = { ...defaultTemplate }
      }
    } else {
      // Initialize with default template if nothing is saved
      contractTemplate.value = { ...defaultTemplate }
      // Save to localStorage so it persists
      localStorage.setItem('contractTemplate', JSON.stringify(defaultTemplate))
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
