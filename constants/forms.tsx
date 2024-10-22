import { ImageUp, LayoutTemplate } from 'lucide-react'

type UserRegistrationProps = {
  id: string
  type: 'email' | 'text' | 'password'
  inputType: 'select' | 'input'
  options?: { value: string; label: string; id: string }[]
  label?: string
  placeholder: string
  name: string
}

type TABS_MENU_PROPS = {
  label: string
  icon?: JSX.Element
}

export const USER_REGISTRATION_FORM: UserRegistrationProps[] = [
  {
    id: '1',
    inputType: 'input',
    placeholder: 'Full name',
    name: 'fullname',
    type: 'text',
  },
  {
    id: '2',
    inputType: 'input',
    placeholder: 'Email',
    name: 'email',
    type: 'email',
  },
  {
    id: '3',
    inputType: 'input',
    placeholder: 'Confirm Email',
    name: 'confirmEmail',
    type: 'email',
  },
  {
    id: '4',
    inputType: 'input',
    placeholder: 'Password',
    name: 'password',
    type: 'password',
  },
  {
    id: '5',
    inputType: 'input',
    placeholder: 'Confrim Password',
    name: 'confirmPassword',
    type: 'password',
  },
]

export const USER_LOGIN_FORM: UserRegistrationProps[] = [
  {
    id: '1',
    inputType: 'input',
    placeholder: 'Enter your email',
    name: 'email',
    type: 'email',
  },
  {
    id: '2',
    inputType: 'input',
    placeholder: 'Password',
    name: 'password',
    type: 'password',
  },
]

export const UPLOAD_TABS_MENU: TABS_MENU_PROPS[] = [
  {
    label: 'Upload files',
    icon:  <ImageUp className="h-4 w-4"/>
  },
  {
    label: 'Web content',
    icon: <LayoutTemplate className='h-4 w-4'/>
  },
]
