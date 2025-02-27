import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Cloud,
  CloudRain,
  Droplets,
  Thermometer,
  Wind,
  Sun,
  CloudFog,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
} from "lucide-react"

interface WeatherDisplayProps {
  capital: string
  countryCode: string
}

interface WeatherData {
  main: {
    temp: number
    feels_like: number
    humidity: number
    pressure: number
  }
  weather: {
    id: number
    main: string
    description: string
    icon: string
  }[]
  wind: {
    speed: number
    deg: number
  }
  rain?: {
    "1h"?: number
    "3h"?: number
  }
  clouds: {
    all: number
  }
  sys: {
    country: string
    sunrise: number
    sunset: number
  }
  name: string
  dt: number
}

async function getWeatherData(capital: string, countryCode: string) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${capital},${countryCode}&APPID=794ee95e63c5a32aaf88cd813fa2e425&units=metric`,
      { next: { revalidate: 1800 } }, // Revalidate every 30 minutes
    )

    if (!response.ok) {
      throw new Error("Failed to fetch weather data")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching weather data:", error)
    throw error
  }
}

function getWeatherIcon(weatherId: number) {
  // Weather condition codes: https://openweathermap.org/weather-conditions
  if (weatherId >= 200 && weatherId < 300) {
    return <CloudLightning className="h-12 w-12 text-yellow-500" />
  } else if (weatherId >= 300 && weatherId < 400) {
    return <CloudDrizzle className="h-12 w-12 text-blue-400" />
  } else if (weatherId >= 500 && weatherId < 600) {
    return <CloudRain className="h-12 w-12 text-blue-500" />
  } else if (weatherId >= 600 && weatherId < 700) {
    return <CloudSnow className="h-12 w-12 text-blue-200" />
  } else if (weatherId >= 700 && weatherId < 800) {
    return <CloudFog className="h-12 w-12 text-gray-400" />
  } else if (weatherId === 800) {
    return <Sun className="h-12 w-12 text-yellow-400" />
  } else if (weatherId > 800) {
    return <Cloud className="h-12 w-12 text-gray-500" />
  }

  return <Cloud className="h-12 w-12" />
}

function formatTime(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export async function WeatherDisplay({ capital, countryCode }: WeatherDisplayProps) {
  let weatherData: WeatherData
  let error = null

  try {
    weatherData = await getWeatherData(capital, countryCode)
  } catch (err) {
    error = "Failed to load weather data. Please try again later."
    weatherData = {} as WeatherData
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weather Information</CardTitle>
          <CardDescription>Current weather for {capital}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-40">
            <p className="text-destructive">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const precipitation = weatherData.rain?.["1h"] || weatherData.rain?.["3h"] || 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weather Information</CardTitle>
        <CardDescription>
          Current weather for {capital} as of {new Date(weatherData.dt * 1000).toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {getWeatherIcon(weatherData.weather[0].id)}
              <div>
                <p className="text-2xl font-bold">{Math.round(weatherData.main.temp)}°C</p>
                <p className="text-muted-foreground">Feels like {Math.round(weatherData.main.feels_like)}°C</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium capitalize">{weatherData.weather[0].description}</p>
              <p className="text-muted-foreground">
                {formatTime(weatherData.sys.sunrise)} - {formatTime(weatherData.sys.sunset)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium">Humidity</p>
                <p className="text-xl">{weatherData.main.humidity}%</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Wind className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Wind</p>
                <p className="text-xl">{(weatherData.wind.speed * 3.6).toFixed(1)} km/h</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-sm font-medium">Precipitation</p>
                <p className="text-xl">{precipitation} mm</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Cloudiness</p>
                <p className="text-xl">{weatherData.clouds.all}%</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

