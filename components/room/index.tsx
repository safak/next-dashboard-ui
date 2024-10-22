"use client";

import { PlusCircle } from 'lucide-react'
import Modal from '../modal';
import { Card } from '../ui/card';
import { CreateRoom } from './patient-create-form';


export const AddRoom = () => {
    return (
        <div className="flex gap-2 justify-end">
            <Modal
                title="Add your Room"
                description="Create a new room"
                trigger={
                    <Card className="flex items-center gap-2 bg-greenlight px-2 py-1.5 text-white-1 font-semibold rounded-lg text-sm hover:bg-primary">
                        <PlusCircle className="h-4 w-4" />
                        Add Room
                    </Card>
                }
            >
                <CreateRoom />
            </Modal>
        </div>
    )
}