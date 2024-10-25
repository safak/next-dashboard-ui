import { currentUser } from "@/lib/auth"
import { client } from "@/lib/prisma"

export const getUserClients = async () => {
    try {
        const user = await currentUser()
        if (user) {
            const clients = await client.user.count()
            if (clients) {
                return clients
            }
        }
    } catch (error) {
        console.log(error)
    }
}

export const getTvChannel = async () => {
    try {
        const user = await currentUser()
        if (user) {
            const tvChannel = await client.tvChannel.count()
            if (tvChannel) {
                return tvChannel
            }
        }
    } catch (error) {
        console.log(error)
    }
}

export const getApp = async () => {
    try {
        const user = await currentUser()
        if (user) {
            const apps = await client.apps.count()
            if (apps) {
                return apps
            }
        }
    } catch (error) {
        console.log(error)
    }
}

export const getDevices = async () => {
    try {
        const user = await currentUser()
        if (user) {
            const devices = await client.devices.count()
            if (devices) {
                return devices
            }
        }
    } catch (error) {
        console.log(error)
    }
}