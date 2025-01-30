import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Button } from "./ui/button"
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';

const QuickLook = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Combine main image with additional images
  const allImages = [product.image, ...(product.additionalImages || [])];
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full mt-2">
          <Eye className="h-4 w-4 mr-2" />
          Quick Look
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription>{product.description}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Image Gallery */}
          <div className="relative">
            <div className="aspect-square relative">
              <img
                src={allImages[currentImageIndex]}
                alt={`${product.name} view ${currentImageIndex + 1}`}
                className="rounded-lg object-cover w-full h-full"
              />
              {allImages.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={previousImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
            {/* Thumbnail Navigation */}
            {allImages.length > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {allImages.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      currentImageIndex === index ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>
          {/* Product Details */}
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg">Details</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>
            <div>
              <h3 className="font-bold text-lg">Price</h3>
              <p className="text-2xl font-bold text-blue-600">
                ${product.price.toFixed(2)}
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg">Category</h3>
              <p className="text-gray-600">{product.category}</p>
            </div>
            {product.character && (
              <div>
                <h3 className="font-bold text-lg">Character</h3>
                <p className="text-gray-600">{product.character}</p>
              </div>
            )}
            <Button className="w-full" onClick={() => {}}>
              Add to Cart
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickLook; 