"use client"

import axios from 'axios'
import { useEffect, useState } from 'react'
import EmptyState from '@/components/forms/empty'
import { Spinner } from '@/components/spinner'
import ScreenCard from './screen-card'

export const GetScreen = () => {
    const [screen, setScreen] = useState([])
    
    useEffect(() => {
        fetchScreen()
    }, [])

    const fetchScreen = async () => {
        try {
            const res = await axios.get('/api/device')
            setScreen(res.data)
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <div>
            {
                screen ? (
                    <>
                        {screen.length > 0 ? (
                            <div className="slide_grid">
                                {screen.map((sc: any) => (
                                    <ScreenCard
                                        key={sc.id}
                                        id={sc.id}
                                        name={sc.name}
                                        ipaddress={sc.ipaddress}
                                    />
                                ))}
                            </div>
                        ) : <EmptyState title="No results found" />}
                    </>
                ) : <Spinner />}
        </div>
    )
}