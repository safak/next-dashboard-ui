'use client';

import AddApps from '@/components/application'
import Searchbar from '@/components/search'
import { GetApp } from '@/components/application/get-app';

const Application = () => {
  return (
    <div className="h-full flex-1 flex-col space-y-2 pt-8 md:flex">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Here&apos;s a list of your Application!
        </p>
      </div>
      <div className="flex items-center justify-between">
        <Searchbar route='/application' />
        <div className="relative ml-auto flex-1 md:grow-0">
          <AddApps />
        </div>
      </div>
      <GetApp />
    </div>
  )

}

export default Application