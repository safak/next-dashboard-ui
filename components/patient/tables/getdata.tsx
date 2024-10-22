
"use client";

import { DataTable } from '@/components/tables/data-table';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { columns } from './columns';


export default function GetData() {

    const [patient, setPatient] = useState([])

    useEffect(() => {
        fetchPatient()
    }, [])

    const fetchPatient = async () => {
        try {
            const res = await axios.get('/api/patient')
            setPatient(res.data)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <DataTable data={patient} columns={columns} />
    )
}