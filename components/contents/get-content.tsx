import axios from 'axios'
import { useEffect, useState } from 'react'
import ContentCard from './content-card'
import EmptyState from '@/components/forms/empty'
import { Spinner } from '@/components/spinner'
import { CreateContentForm } from './content-create-form'

export const GetContent = () => {
    const [content, setContent] = useState([])

    useEffect(() => {
        fetchContent()
    }, [])

    const fetchContent = async () => {
        try {
            const res = await axios.get('/api/content')
            setContent(res.data)
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <div>
            {
                content ? (
                    <>
                        {content.length > 0 ? (
                            <div className="slide_grid">
                                {content.map((content: any) => (
                                    <ContentCard
                                        key={content.id}
                                        id={content.id}
                                        title={content.title}
                                        description={content.description}
                                        icon={content.icon}
                                        backdrop={content.backdrop}
                                        isStatus={content.isStatus}
                                    />
                                ))}
                            </div>
                        ) : <EmptyState title="No results found"/>}
                    </>
                ) : <Spinner /> }
        </div>
    )
}