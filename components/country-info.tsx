import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CountryInfoProps {
  countryCode: string
}

async function getCountryData(countryCode: string) {
  try {
    const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`)
    if (!response.ok) {
      throw new Error("Failed to fetch country data")
    }
    const data = await response.json()
    return data[0]
  } catch (error) {
    console.error("Error fetching country data:", error)
    throw error
  }
}

export async function CountryInfo({ countryCode }: CountryInfoProps) {
  const country = await getCountryData(countryCode)

  if (!country) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Country Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Country information not available.</p>
        </CardContent>
      </Card>
    )
  }

  // Extract country details
  const currencies = country.currencies
    ? Object.values(country.currencies)
        .map((c: any) => `${c.name} (${c.symbol})`)
        .join(", ")
    : "N/A"

  const languages = country.languages ? Object.values(country.languages).join(", ") : "N/A"

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <img
          src={country.flags.png || "/placeholder.svg"}
          alt={country.flags.alt || `Flag of ${country.name.common}`}
          className="h-10 w-16 object-cover rounded-sm"
        />
        <CardTitle>{country.name.common}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="grid grid-cols-2">
            <span className="font-medium">Official Name:</span>
            <span>{country.name.official}</span>
          </div>
          <div className="grid grid-cols-2">
            <span className="font-medium">Capital:</span>
            <span>{country.capital ? country.capital[0] : "N/A"}</span>
          </div>
          <div className="grid grid-cols-2">
            <span className="font-medium">Region:</span>
            <span>
              {country.region} ({country.subregion || "N/A"})
            </span>
          </div>
          <div className="grid grid-cols-2">
            <span className="font-medium">Population:</span>
            <span>{country.population.toLocaleString()}</span>
          </div>
          <div className="grid grid-cols-2">
            <span className="font-medium">Area:</span>
            <span>{country.area.toLocaleString()} km²</span>
          </div>
          <div className="grid grid-cols-2">
            <span className="font-medium">Currencies:</span>
            <span>{currencies}</span>
          </div>
          <div className="grid grid-cols-2">
            <span className="font-medium">Languages:</span>
            <span>{languages}</span>
          </div>
          {country.maps?.googleMaps && (
            <div className="grid grid-cols-2">
              <span className="font-medium">Maps:</span>
              <a
                href={country.maps.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                View on Google Maps
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

