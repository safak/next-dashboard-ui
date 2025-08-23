"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { useEffect, useState } from "react"

interface InputFileProps {
  label?: string
  onChange?: (imageBase64OrUrl: string) => void
  defaultValue?: string
}

export default function InputFile({ label, onChange, defaultValue }: InputFileProps) {
  const [preview, setPreview] = useState<string>("")

  // Vérifie si c’est une URL absolue ou un base64
  const isAbsoluteOrBase64 = (src?: string) =>
    !!src && (src.startsWith("http") || src.startsWith("data:") || src.startsWith("/"))

  useEffect(() => {
    if (defaultValue) {
      if (isAbsoluteOrBase64(defaultValue)) {
        // C’est déjà une URL absolue ou base64
        setPreview(defaultValue)
      } else {
        // Sinon on suppose que c’est un chemin relatif dans public/uploads
        setPreview("/uploads/" + defaultValue)
      }
    }
  }, [defaultValue])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        const base64 = reader.result as string
        setPreview(base64)
        onChange?.(base64)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="grid w-full max-w-sm items-start gap-3">
      {label && <Label htmlFor="picture">{label}</Label>}

      <Input id="picture" type="file" accept="image/*" onChange={handleFileChange} />

      <div className="mt-2">
        <Image
          src={preview || "/uploads/profile.png"}
          alt="Preview"
          width={96}
          height={96}
          className="rounded border object-cover"
        />
      </div>
    </div>
  )
}
