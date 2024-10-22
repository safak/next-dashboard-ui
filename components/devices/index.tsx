"use client";

import { PlusCircle } from 'lucide-react'
import Modal from '@/components/modal';
import { Card } from '@/components/ui/card';
import { CreateScreen } from './device-create-form';
import { Button } from '../ui/button';

const AddScreen = () => {
    return (
        <div className="flex gap-2 justify-end">
            <Modal
                title="Add your Screen"
                description="Create a new screen"
                trigger={
                    <Button
                        className="flex items-center gap-2 bg-greenlight px-3 py-3 text-white-1 font-semibold rounded-lg text-sm hover:bg-primary"
                    >
                        <PlusCircle className="h-4 w-4" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Add Screen
                        </span>
                    </Button>
                }
            >
                <CreateScreen />
            </Modal>
        </div>
    )
}

export default AddScreen