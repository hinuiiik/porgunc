'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Navbar08, Navbar08NavItem } from '@/components/ui/shadcn-io/navbar-08'
import { useRouter } from 'next/navigation'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  const userNavigationLinks: Navbar08NavItem[] =
    data.navItems?.map((item, index) => ({
      // @ts-ignore
      href: item.link.url ?? "/"+item.link?.reference?.value?.slug,
      label: item.link.label ?? "TELL VIKRAM TO FUCKING FIX ME",
      active: true, // Possible Todo: actually make this functional
    })) ?? [];

  return (
    <div className="relative w-full">
      <Navbar08 navigationLinks={userNavigationLinks} logoHref={"/home"} onSearchSubmit={(query) => router.push(`/search?q=${encodeURIComponent(query)}`)} />
    </div>
  )
}
