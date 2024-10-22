"use client";

import Searchbar from '@/components/search';
import AddSlider from '@/components/slider';
import { GetSlider } from '@/components/slider/get-content';
import React from 'react'

const Slider = () => {
  return (
    <div className="h-full flex-1 flex-col space-y-2 pt-8 md:flex">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Here&apos;s a list of your Slider!
        </p>
      </div>
      <div className="flex items-center justify-between">
        <Searchbar route='slider' />
        <div className="relative ml-auto flex-1 md:grow-0">
          <AddSlider />
        </div>
      </div>
      <GetSlider />
    </div>
  )
}

export default Slider