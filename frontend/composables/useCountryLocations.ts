import { Country, State, City } from 'country-state-city'
import type { ICountry, IState, ICity } from 'country-state-city'

export const useCountryLocations = () => {
  const getCountryOptions = () => {
    const countries = Country.getAllCountries()
    return countries
      .map((country: ICountry) => ({
        title: country.name,
        value: country.isoCode,
      }))
      .sort((a, b) => a.title.localeCompare(b.title))
  }

  const getStateOptions = (countryCode: string) => {
    if (!countryCode) return []
    const states = State.getStatesOfCountry(countryCode)
    return states
      .map((state: IState) => ({
        title: state.name,
        value: state.isoCode,
      }))
      .sort((a, b) => a.title.localeCompare(b.title))
  }

  const getCityOptions = (countryCode: string, stateCode: string) => {
    if (!countryCode || !stateCode) return []
    const cities = City.getCitiesOfState(countryCode, stateCode)
    return cities
      .map((city: ICity) => ({
        title: city.name,
        value: city.name,
      }))
      .sort((a, b) => a.title.localeCompare(b.title))
  }

  const getCountryName = (countryCode: string) => {
    if (!countryCode) return ''
    const country = Country.getCountryByCode(countryCode)
    return country?.name || ''
  }

  const getStateName = (countryCode: string, stateCode: string) => {
    if (!countryCode || !stateCode) return ''
    const states = State.getStatesOfCountry(countryCode)
    const state = states.find((s: IState) => s.isoCode === stateCode)
    return state?.name || ''
  }

  const getCityName = (countryCode: string, stateCode: string, cityName: string) => {
    if (!countryCode || !stateCode || !cityName) return ''
    return cityName // Cities are already stored by name
  }

  return {
    getCountryOptions,
    getStateOptions,
    getCityOptions,
    getCountryName,
    getStateName,
    getCityName,
  }
}
