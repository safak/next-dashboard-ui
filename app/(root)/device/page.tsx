import AddScreen from "@/components/devices";
import { GetScreen } from "@/components/devices/get-content";
import Searchbar from "@/components/search";

export default async function Device() {
    return (
        <div className="h-full flex-1 flex-col space-y-2 pt-8 md:flex">
            <div className="flex items-center justify-between">
                <p className="text-muted-foreground">
                    Here&apos;s a list of your Screen!
                </p>
            </div>
            <div className="flex items-center justify-between">
                <Searchbar route='screens' />
                <div className="relative ml-auto flex-1 md:grow-0">
                    <AddScreen />
                </div>
            </div>
            <GetScreen />
        </div>
    )
}