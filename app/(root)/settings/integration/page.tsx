import { IntegrationSettingForm } from "@/components/settings/integration-form"
import { Separator } from "@/components/ui/separator"

const IntegrationForm = () => {

    return (
        <>
            <div>
                <h3 className="text-lg font-medium">Integration</h3>
                <p className="text-sm text-muted-foreground">
                    This is how others will see you on the site.
                </p>
            </div>
            <Separator />
           <IntegrationSettingForm/>
        </>
    )
}

export default IntegrationForm