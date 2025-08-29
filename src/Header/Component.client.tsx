'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'
import { Navbar02 } from '@/components/ui/shadcn-io/navbar-02'
import { Navbar08, Navbar08NavItem } from '@/components/ui/shadcn-io/navbar-08'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()
  console.log(data.navItems?.at(1)?.link.label);
  console.log(data.navItems?.at(1)?.link.url);

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
      href: item.link.url ?? "#",
      label: item.link.label ?? "",
      active: true, // Possible Todo: actually make this functional
    })) ?? [];
  console.log(userNavigationLinks);
  console.log(data);
  console.log(data.navItems?.at(0)?.link.url);
  return (
    <div className="relative w-full">
      <Navbar08 navigationLinks={userNavigationLinks} />
    </div>
  )
}
