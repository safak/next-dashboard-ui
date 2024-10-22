import React from 'react'

type SectionProps = {
  label: string
  message: string
}

const Section = ({ label, message }: SectionProps) => {
  return (
    <div >
      <p className="text-sm font-medium">{label}</p>
      <p className="text-sm font-light text-muted-foreground">{message}</p>
    </div>
  )
}

export default Section
