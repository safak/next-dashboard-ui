"use client";

import { Images } from "lucide-react";

import Drawer from "@/components/ui/Drawer";

import GalleryImageManager from "./GalleryImageManager";

interface GalleryImageDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: number | null;
}

export default function GalleryImageDrawer({
  open,
  onOpenChange,
  eventId,
}: GalleryImageDrawerProps) {
  if (!eventId) {
    return null;
  }

  return (
    <Drawer
      open={open}
      onClose={() => onOpenChange(false)}
      title="Manage Gallery Images"
      description="Upload and manage event photos."
      width="lg"
      icon={<Images className="h-6 w-6" />}
    >
      <GalleryImageManager eventId={String(eventId)} embedded />
    </Drawer>
  );
}
