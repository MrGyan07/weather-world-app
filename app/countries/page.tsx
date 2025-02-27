import { CountriesTable } from "@/components/countries-table"

export default async function CountriesPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Countries</h1>
        <p className="text-muted-foreground">
          Browse countries from around the world and check their weather information.
        </p>
      </div>
      <CountriesTable />
    </div>
  )
}

