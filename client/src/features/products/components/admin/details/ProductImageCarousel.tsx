import {Card, CardContent} from "@/components/ui/card";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel";
import {SetStateAction, useEffect, useState} from "react";
import Image from "next/image";
import {Badge} from "@/components/ui/badge";
import {Dialog, DialogContent, DialogTrigger} from "@radix-ui/react-dialog";
import {Button} from "@/components/ui/button";
import {ZoomIn} from "lucide-react";
import {ProductDetails} from "@/features/products/types/product.types";

interface ProductImageCarouselProps {
    product: ProductDetails;
    className?: string;
}

export function ProductImageCarousel({product, className = ""}: ProductImageCarouselProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [carouselApi, setCarouselApi] = useState(null);

    const images = product?.images && product?.images.length > 0
        ? product.images
        : product?.images[0]
            ? [{id: "main", url: product.images[0].url, isMain: true}]
            : [];

    const sortedImages = [...images].sort((a, b) => {
        if (a.isMain && !b.isMain) return -1;
        if (!a.isMain && b.isMain) return 1;
        return 0;
    });

    // Sync carousel with selected index
    useEffect(() => {
        if (!carouselApi) return;

        // @ts-ignore
        carouselApi.on("select", () => {
            // @ts-ignore
            setSelectedImageIndex(carouselApi.selectedScrollSnap());
        });

        // @ts-ignore
        carouselApi.scrollTo(selectedImageIndex);
    }, [carouselApi, selectedImageIndex]);

    // Handle thumbnail click
    const handleThumbnailClick = (index: SetStateAction<number>) => {
        setSelectedImageIndex(index);
    };

    if (sortedImages.length === 0) {
        return (
            <Card className={`lg:col-span-1 ${className} shadow-none`}>
                <CardContent>
                    <div className="relative aspect-square bg-muted rounded-lg flex items-center justify-center">
                        <span className="text-muted-foreground">No images available</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const currentImage = sortedImages[selectedImageIndex];

    return (
        <Card className={`lg:col-span-1 ${className}`}>
            <CardContent className={""}>
                <div className={"space-y-4"}>
                    {/* Main Carousel */}
                    <Carousel
                        className={"w-full"}
                        // @ts-ignore
                        setApi={setCarouselApi}
                        opts={{
                            align: "start",
                            loop: sortedImages.length > 1,
                        }}
                    >
                        <CarouselContent>
                            {sortedImages.map((image, index) => (
                                <CarouselItem key={image.id || index}>
                                    <div className="relative aspect-square group rounded-lg overflow-hidden">
                                        <Image
                                            src={image.url}
                                            alt={product?.title || "Product image"}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-100"
                                            sizes="(max-width: 768px) 100vw, 400px"
                                            priority={index === 0}
                                        />

                                        {/* Overlay */}
                                        <div className="absolute inset-0">
                                            {image.isMain && (
                                                <Badge className="bg-primary/70 absolute top-2 left-2 z-10">Main Image</Badge>
                                            )}
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        {sortedImages.length > 1 && (
                            <div>
                                <CarouselPrevious className="left-2 hover:bg-muted" />
                                <CarouselNext className="right-2 hover:bg-muted" />
                            </div>
                        )}
                    </Carousel>

                    {/* Thumbnail Navigation */}
                    {sortedImages.length > 1 && (
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium text-muted-foreground">
                                Images ({sortedImages.length})
                            </h4>
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {sortedImages.map((image, index) => (
                                    <button
                                        key={`thumb-${image.id || index}`}
                                        onClick={() => handleThumbnailClick(index)}
                                        className={`relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                                            selectedImageIndex === index
                                                ? 'border-primary scale-100'
                                                : 'border-muted hover:border-primary/20 hover:scale-102'
                                        }`}
                                    >
                                        <Image
                                            src={image.url}
                                            alt={`${product?.title || 'Product'} thumbnail ${index + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="64px"
                                        />
                                        {image.isMain && (
                                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                                <Badge variant="secondary" className="text-xs px-1 py-0">
                                                    Main
                                                </Badge>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Image Info */}
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>
                            Image {selectedImageIndex + 1} of {sortedImages.length}
                        </span>
                        {currentImage?.isMain && (
                            <span className="text-primary font-medium">Main Image</span>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}