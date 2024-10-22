import axios from "axios"

export const deleteEvent = async (id: string, pathname: string) => {
    try {
        await axios.delete(`/api/${pathname}/${id}`)
    } catch (error) {
        console.error('Failed to delete the post', error)
    }
}