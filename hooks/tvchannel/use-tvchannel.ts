import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { AddTvChannelSchema } from "@/schemas/tvchannel.schemas"


export const useTvChannel = () => {
    const [loading, setLoading] = useState<boolean>(false)

    const {
        handleSubmit,
        register,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(AddTvChannelSchema),
    })
    const { toast } = useToast()
    const router = useRouter()

    const onCreateTvChannel = handleSubmit(async (values) => {
        try {
            setLoading(true)
           // const uploaded = await upload.uploadFile(values.image[0])
            const channel = "TEST" //await onCreateTvChannel(values.name)
            if (channel) {
                reset()
                toast({
                    title: 'Success',
                    description: channel, //campaign.message,
                })
                setLoading(false)
                router.refresh()
            }
        } catch (error) {
            console.log(error)
        }
    })

    return {
        onCreateTvChannel,
        errors,
        loading,
        register,
    }
}