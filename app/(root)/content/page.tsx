"use client";

import AddContent from '@/components/contents'
import { GetContent } from '@/components/contents/get-content'
import Searchbar from '@/components/search'

const Content = () => {
  return (
    <div className="h-full flex-1 flex-col space-y-2 pt-8 md:flex">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Here&apos;s a list of your Content!
        </p>
      </div>
      <div className="flex items-center justify-between">
        <Searchbar route='content' />
        <div className="relative ml-auto flex-1 md:grow-0">
          <AddContent />
        </div>
      </div>
      <GetContent />
    </div>
  )
}

export default Content