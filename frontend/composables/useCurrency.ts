export interface Currency {
  code: string
  symbol: string
  name: string
  locale: string
}

const DEFAULT_CURRENCY = { code: 'PHP', symbol: '₱', name: 'Philippine Peso', locale: 'en-PH' }

export const useCurrency = () => {
  const currencies: Currency[] = [
    DEFAULT_CURRENCY,
    { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
    { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
    { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', locale: 'zh-CN' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
  ]

  // Always start with default currency for SSR consistency
  const selectedCurrency = useState<Currency>('selectedCurrency', () => DEFAULT_CURRENCY)

  // Load from localStorage on client-side only, after hydration
  if (process.client) {
    onMounted(() => {
      const saved = localStorage.getItem('currency')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          selectedCurrency.value = parsed
        } catch (e) {
          // If parsing fails, keep default
        }
      }
    })
  }

  const setCurrency = (currency: Currency) => {
    selectedCurrency.value = currency
    if (process.client) {
      localStorage.setItem('currency', JSON.stringify(currency))
    }
  }

  const formatCurrency = (amount: number | string): string => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount

    if (isNaN(numAmount)) return `${selectedCurrency.value.symbol}0`

    return `${selectedCurrency.value.symbol}${numAmount.toLocaleString(selectedCurrency.value.locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`
  }

  const getCurrencySymbol = (): string => {
    return selectedCurrency.value.symbol
  }

  const getCurrencyCode = (): string => {
    return selectedCurrency.value.code
  }

  const getCurrencyIcon = (): string => {
    const iconMap: Record<string, string> = {
      PHP: 'mdi-currency-php',
      USD: 'mdi-currency-usd',
      EUR: 'mdi-currency-eur',
      GBP: 'mdi-currency-gbp',
      JPY: 'mdi-currency-jpy',
      CAD: 'mdi-currency-usd', // No specific CAD icon, use USD
      AUD: 'mdi-currency-usd', // No specific AUD icon, use USD
      CNY: 'mdi-currency-cny',
      INR: 'mdi-currency-inr',
    }
    return iconMap[selectedCurrency.value.code] || 'mdi-currency-usd'
  }

  return {
    currencies,
    selectedCurrency,
    setCurrency,
    formatCurrency,
    getCurrencySymbol,
    getCurrencyCode,
    getCurrencyIcon,
  }
}
