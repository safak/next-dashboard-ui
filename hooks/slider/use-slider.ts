import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { AddTvChannelSchema } from "@/schemas/tables.schemas"


export const useSlider = () => {
    const [loading, setLoading] = useState<boolean>(false)

    const {
        handleSubmit,
        register,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(AddTvChannelSchema)
    })
   
    const { toast } = useToast()
    const router = useRouter()

    const onCreateSlider = handleSubmit(async (values) => {
        try {
            setLoading(true)
           // const uploaded = await upload.uploadFile(values.image[0])
            const campaign = "test" //await onCreateTvChannel(values.name)
            if (campaign) {
                reset()
                toast({
                    title: 'Success',
                    description: campaign, //campaign.message,
                })
                setLoading(false)
                router.refresh()
            }
        } catch (error) {
            console.log(error)
        }
    })

    return {
        onCreateSlider,
        errors,
        loading,
        register,
    }
}