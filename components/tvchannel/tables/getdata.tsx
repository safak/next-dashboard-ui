
"use client";

import { DataTable } from '@/components/tables/data-table';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { columns } from './columns';

export default function GetData() {

    const [tvchannel, setTvchannel] = useState([])

    useEffect(() => {
        fetchTvChannel()
    }, [])

    const fetchTvChannel = async () => {
        try {
            const res = await axios.get('/api/tvchannel')
            setTvchannel(res.data)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <DataTable data={tvchannel} columns={columns} />
    )
}