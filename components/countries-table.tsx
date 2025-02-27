"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Loader2 } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface Country {
  name: {
    common: string
    official: string
  }
  cca2: string
  capital?: string[]
  region: string
  population: number
  flags: {
    png: string
    svg: string
    alt?: string
  }
}

export function CountriesTable() {
  const [countries, setCountries] = useState<Country[]>([])
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const itemsPerPage = 10

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all")
        if (!response.ok) {
          throw new Error("Failed to fetch countries")
        }
        const data = await response.json()
        // Sort countries by name
        const sortedData = data.sort((a: Country, b: Country) => a.name.common.localeCompare(b.name.common))
        setCountries(sortedData)
        setFilteredCountries(sortedData)
      } catch (err) {
        setError("Failed to load countries. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCountries()
  }, [])

  useEffect(() => {
    if (search) {
      const filtered = countries.filter(
        (country) =>
          country.name.common.toLowerCase().includes(search.toLowerCase()) ||
          country.region.toLowerCase().includes(search.toLowerCase()) ||
          (country.capital && country.capital[0]?.toLowerCase().includes(search.toLowerCase())),
      )
      setFilteredCountries(filtered)
      setCurrentPage(1)
    } else {
      setFilteredCountries(countries)
    }
  }, [search, countries])

  const handleRowClick = (country: Country) => {
    if (country.capital && country.capital.length > 0) {
      router.push(`/weather/${country.cca2}?capital=${encodeURIComponent(country.capital[0])}`)
    } else {
      alert("This country doesn't have a capital city listed.")
    }
  }

  // Calculate pagination
  const totalPages = Math.ceil(filteredCountries.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCountries = filteredCountries.slice(startIndex, startIndex + itemsPerPage)

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages are less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Always show first page
      pageNumbers.push(1)

      // Calculate start and end of middle pages
      let startPage = Math.max(2, currentPage - 1)
      let endPage = Math.min(totalPages - 1, currentPage + 1)

      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        endPage = Math.min(4, totalPages - 1)
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3)
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pageNumbers.push("...")
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i)
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push("...")
      }

      // Always show last page
      pageNumbers.push(totalPages)
    }

    return pageNumbers
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-md bg-destructive/15 p-4 text-center">
        <p className="text-destructive">{error}</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search countries by name, region or capital..."
          className="pl-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Flag</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Capital</TableHead>
              <TableHead>Region</TableHead>
              <TableHead className="text-right">Population</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCountries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  No countries found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              paginatedCountries.map((country) => (
                <TableRow
                  key={country.cca2}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(country)}
                >
                  <TableCell>
                    <img
                      src={country.flags.png || "/placeholder.svg"}
                      alt={country.flags.alt || `Flag of ${country.name.common}`}
                      className="h-6 w-10 object-cover rounded-sm"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{country.name.common}</TableCell>
                  <TableCell>{country.capital ? country.capital[0] : "N/A"}</TableCell>
                  <TableCell>{country.region}</TableCell>
                  <TableCell className="text-right">{country.population.toLocaleString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (currentPage > 1) setCurrentPage(currentPage - 1)
                }}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {getPageNumbers().map((page, index) => (
              <PaginationItem key={index}>
                {page === "..." ? (
                  <span className="px-4 py-2">...</span>
                ) : (
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (typeof page === "number") setCurrentPage(page)
                    }}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                }}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}

