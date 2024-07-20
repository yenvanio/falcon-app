import React from 'react';
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import Image from "next/image";

interface PhotoGalleryProps {
    photos: google.maps.places.PlacePhoto[];
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({photos}) => {
    return (
        <ScrollArea className="whitespace-nowrap rounded-md">
            <div className="flex w-max space-x-4 p-4">
                {photos.map((photo, index) => (
                    <figure key={index} className="shrink-0">
                        <div className="overflow-hidden rounded-md">
                            <img
                                src={photo.getUrl()}
                                alt={`Photo ${index + 1}`}
                                className="object-cover rounded-lg aspect-[3/4] h-fit w-fit object-cover"
                                style={{width: 200, height: 150}} // Adjust the size as needed
                            />
                        </div>
                    </figure>
                ))}
            </div>
            <ScrollBar orientation="horizontal"/>
        </ScrollArea>
    );
};

export default PhotoGallery;
