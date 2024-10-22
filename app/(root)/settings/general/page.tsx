import { GeneralSettingForm } from "@/components/settings/general-form"
import { Separator } from "@/components/ui/separator"

const GeneralForm = () => {

    return (
        <>
            <div>
                <h3 className="text-lg font-medium">General</h3>
                <p className="text-sm text-muted-foreground">
                    This is how others will see you on the site.
                </p>
            </div>
            <Separator />
            <GeneralSettingForm/>
        </>
    )
}

export default GeneralForm