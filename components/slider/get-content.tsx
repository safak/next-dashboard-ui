import axios from 'axios'
import { useEffect, useState } from 'react'
import EmptyState from '@/components/forms/empty'
import { Spinner } from '@/components/spinner'
import SliderCard from './slider-card'

export const GetSlider = () => {
    const [slider, setSlider] = useState([])
    
    useEffect(() => {
        fetchSlider()
    }, [])

    const fetchSlider = async () => {
        try {
            const res = await axios.get('/api/slider')
            setSlider(res.data)
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <div>
            {
                slider ? (
                    <>
                        {slider.length > 0 ? (
                            <div className="slide_grid">
                                {slider.map((slider: any) => (
                                    <SliderCard
                                        key={slider.id}
                                        id={slider.id}
                                        name={slider.name}
                                        image={slider.image}
                                        isStatus={slider.isStatus}
                                    />
                                ))}
                            </div>
                        ) : <EmptyState title="No results found" />}
                    </>
                ) : <Spinner />}
        </div>
    )
}