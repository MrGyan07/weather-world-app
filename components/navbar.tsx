import Link from "next/link"
import { Globe } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"

export default function Navbar() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Globe className="h-6 w-6" />
          <span className="font-bold">World Weather</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/countries" className="text-sm font-medium transition-colors hover:text-primary">
            Countries
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}

