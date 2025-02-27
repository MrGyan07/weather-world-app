import { Suspense } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WeatherDisplay } from "@/components/weather-display"
import { CountryInfo } from "@/components/country-info"

interface WeatherPageProps {
  params: {
    countryCode: string
  }
  searchParams: {
    capital?: string
  }
}

export default async function WeatherPage({ params, searchParams }: WeatherPageProps) {
  const { countryCode } = params
  const capital = searchParams.capital

  if (!capital) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/countries">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back to countries</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Weather for {capital}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Suspense
          fallback={
            <div className="rounded-lg border p-6 flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          }
        >
          <CountryInfo countryCode={countryCode} />
        </Suspense>

        <Suspense
          fallback={
            <div className="rounded-lg border p-6 flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          }
        >
          <WeatherDisplay capital={capital} countryCode={countryCode} />
        </Suspense>
      </div>
    </div>
  )
}

