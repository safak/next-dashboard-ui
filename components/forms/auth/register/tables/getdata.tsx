
"use client";

import { DataTable } from '@/components/tables/data-table';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { columns } from './columns';
import { Spinner } from '@/components/spinner'
import EmptyState from '@/components/forms/empty';


export default function GetData() {

    const [regis, setRegis] = useState([])

    useEffect(() => {
        fetchRegis()
    }, [])

    const fetchRegis = async () => {
        try {
            const res = await axios.get('/api/register')
            setRegis(res.data)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <DataTable data={regis} columns={columns} />
    )
}