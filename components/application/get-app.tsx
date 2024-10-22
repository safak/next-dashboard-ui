import axios from 'axios'
import { useEffect, useState } from 'react'
import AppsCard from './app-card'
import EmptyState from '../forms/empty'
import { Spinner } from '../spinner'

export const GetApp = () => {
    const [apps, setApps] = useState([])
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchApps()
    }, [])

    const fetchApps = async () => {
        try {
            const res = await axios.get('/api/application')
            setApps(res.data)
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <div>
            {
                apps ? (
                    <>
                        {apps.length > 0 ? (
                            <div className="slide_grid">
                                {apps.map((app: any) => (
                                    <AppsCard
                                        key={app.id}
                                        id={app.id}
                                        image={app.image}
                                        name={app.name}
                                        description={app.description}
                                        packagename={app.packagename}
                                        classname={app.classname}
                                        status={app.status}
                                    />
                                ))}
                            </div>
                        ) : <EmptyState title="No results found" />}
                    </>
                ) : <Spinner />}
        </div>
    )
}