import axios from 'axios'
import React, { useEffect, useState } from 'react'
import AppsCard from '@/components/application/app-card'
import EmptyState from '@/components/forms/empty'
import { Spinner } from '@/components/spinner'

export const GetCard = (pathname: string) => {
    const [data, setData] = useState([])

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const res = await axios.get(`/api/${pathname}`)
            setData(res.data)
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <div>
            {
                data ? (
                    <>
                        {pathname === "/application" ? (
                            <>
                                {data.length > 0 ? (
                                    <div className="slide_grid">
                                        {data.map((item: any) => (
                                            <AppsCard
                                                key={item.id}
                                                id={item.id}
                                                image={item.image}
                                                name={item.name}
                                                description={item.description}
                                                classname={item.classname}
                                                packagename={item.packagename}
                                                status={item.status}
                                            />
                                        ))}
                                    </div>
                                ) : <EmptyState title="No results found" />}
                            </>
                        ) : (
                            <>
                            {data.length > 0 ? (
                                <div className="slide_grid">
                                    {data.map((item: any) => (
                                        <AppsCard
                                            key={item.id}
                                            id={item.id}
                                            image={item.image}
                                            name={item.name}
                                            classname={item.classname}
                                            description={item.description}
                                            packagename={item.packagename}
                                            status={item.status}
                                        />
                                    ))}
                                </div>
                            ) : <EmptyState title="No results found" />}
                        </>
                            )
                        }
                    </>
                ) : <Spinner />}
        </div>
    )
}