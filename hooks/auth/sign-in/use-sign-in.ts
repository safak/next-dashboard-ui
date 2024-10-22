import { auth } from '@/auth'
import { useToast } from '@/components/ui/use-toast'
import { UserLoginProps, UserLoginSchema } from '@/schemas/auth.schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export const  useSignInForm = async () => {
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()
  const { toast } = useToast()
  const methods = useForm<UserLoginProps>({
    resolver: zodResolver(UserLoginSchema),
    mode: 'onChange',
  })
  const onHandleSubmit = methods.handleSubmit(
    async (values: UserLoginProps) => {
      try {
        setLoading(true)
        
      } catch (error: any) {
        setLoading(false)
        if (error.errors[0].code === 'form_password_incorrect')
          toast({
            title: 'Error',
            description: 'email/password is incorrect try again',
          })
      }
    }
  )

  return {
    methods,
    onHandleSubmit,
    loading,
  }
}
