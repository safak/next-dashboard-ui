import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

type SideSheetProps = {
  trigger: React.ReactNode
  title: string
  description: string
  children: React.ReactNode
  className?: string
  icon?: JSX.Element
}

export const SideSheet = ({
  trigger,
  title,
  description,
  children,
  className,
  icon,
}: SideSheetProps) => {
  return (
    <Sheet>
      <SheetTrigger className={className}>{trigger}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className={"flex flex-1 gap-2"}>{icon} {title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  )
}
