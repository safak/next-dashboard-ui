
"use client";

import { DataTable } from '@/components/tables/data-table';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { columns } from './columns';


export default function GetData() {

    const [room, setRoom] = useState([])

    useEffect(() => {
        fetchRoom()
    }, [])

    const fetchRoom = async () => {
        try {
            const res = await axios.get('/api/room')
            setRoom(res.data)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <DataTable data={room} columns={columns} />
    )
}