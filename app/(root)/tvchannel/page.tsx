
import GetData from '@/components/tvchannel/tables/getdata';

export default function TvChannel () {
  return (
    <div className="h-full flex-1 flex-col space-y-2 pt-8 md:flex">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Here&apos;s a list of your TV channels!
        </p>
      </div>
      <GetData/>
    </div>
  )
}