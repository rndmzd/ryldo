import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { ShoppingCart, Plus, Minus, X, ArrowUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import Navigation from "./Navigation";
import {
  getProducts,
  getProductsByCategory,
  getProductsByCharacter,
  getCharacters,
} from "../services/api";

const CartItem = ({ item, onUpdateQuantity, onRemove }) => (
  <div className="flex items-center py-4">
    <img
      src={item.image || "/api/placeholder/80/80"}
      alt={item.name}
      className="h-20 w-20 rounded object-cover"
    />
    <div className="ml-4 flex-1">
      <h3 className="font-medium text-blue-900">{item.name}</h3>
      {(item.selectedSize || item.selectedColor) && (
        <p className="text-sm text-gray-600">
          {item.selectedSize && `Size: ${item.selectedSize}`}
          {item.selectedSize && item.selectedColor && " | "}
          {item.selectedColor && `Color: ${item.selectedColor}`}
        </p>
      )}
      <p className="text-sm text-blue-600">${item.price.toFixed(2)}</p>
      <div className="mt-2 flex items-center">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="mx-3">{item.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
    <Button
      variant="ghost"
      size="icon"
      className="ml-4"
      onClick={() => onRemove(item.id)}
    >
      <X className="h-4 w-4" />
    </Button>
  </div>
);

CartItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    selectedSize: PropTypes.string,
    selectedColor: PropTypes.string,
  }).isRequired,
  onUpdateQuantity: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

const CharacterCard = ({ character }) => (
  <Card className="mb-8">
    <CardHeader>
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={character.image}
          alt={character.name}
          className="w-full md:w-1/3 rounded-lg object-cover"
        />
        <div>
          <CardTitle className="text-2xl mb-4">{character.name}</CardTitle>
          <CardDescription className="text-lg whitespace-pre-line">
            {character.description}
          </CardDescription>
        </div>
      </div>
    </CardHeader>
  </Card>
);

CharacterCard.propTypes = {
  character: PropTypes.shape({
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};

const ProductCard = ({ product, onAddToCart }) => {
  const [selectedVariant, setSelectedVariant] = useState(
    product.hasVariants ? product.variants[0] : null,
  );
  const [selectedSize, setSelectedSize] = useState(
    product.hasVariants ? product.variants[0]?.size : null,
  );
  const [selectedColor, setSelectedColor] = useState(
    product.hasVariants && product.variants[0]?.color
      ? product.variants[0].color
      : null,
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get all images (main image + additional images)
  const allImages = [product.image, ...(product.additionalImages || [])];

  // Get unique sizes and colors
  const sizes = product.hasVariants
    ? [...new Set(product.variants.map((v) => v.size))]
    : [];
  const colors = product.hasVariants
    ? [...new Set(product.variants.map((v) => v.color).filter(Boolean))]
    : [];

  // Update selected variant when size or color changes
  useEffect(() => {
    if (product.hasVariants) {
      const variant = product.variants.find(
        (v) =>
          v.size === selectedSize && (!v.color || v.color === selectedColor),
      );
      setSelectedVariant(variant || null);
    }
  }, [selectedSize, selectedColor, product]);

  const handleAddToCart = () => {
    if (product.hasVariants && selectedVariant) {
      onAddToCart({
        ...product,
        price: selectedVariant.price,
        selectedSize: selectedVariant.size,
        selectedColor: selectedVariant.color,
      });
    } else {
      onAddToCart(product);
    }
  };

  const handlePrevImage = (e) => {
    e.preventDefault();
    setCurrentImageIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1,
    );
  };

  const handleNextImage = (e) => {
    e.preventDefault();
    setCurrentImageIndex((prev) =>
      prev === allImages.length - 1 ? 0 : prev + 1,
    );
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="aspect-square overflow-hidden relative group">
          <img
            src={allImages[currentImageIndex] || "/api/placeholder/300/300"}
            alt={product.name}
            className="h-full w-full object-contain transition-all hover:scale-105"
          />
          {allImages.length > 1 && (
            <>
              {/* Left Arrow */}
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                aria-label="Previous image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              {/* Right Arrow */}
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                aria-label="Next image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
              {/* Dots navigation */}
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
                {allImages.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${currentImageIndex === index ? "bg-blue-600" : "bg-gray-300 hover:bg-gray-400"}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentImageIndex(index);
                    }}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-1">
          <CardTitle className="line-clamp-2 min-h-[2rem]">
            {product.name}
          </CardTitle>
          <CardDescription className="line-clamp-2 min-h-[2rem] text-sm text-gray-500">
            {product.description}
          </CardDescription>
        </div>
        {product.hasVariants ? (
          <div className="mt-3 space-y-2">
            {sizes.length > 0 && (
              <select
                className="w-full rounded-md border p-2"
                value={selectedSize || ""}
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                <option value="">Select Size</option>
                {sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            )}
            {colors.length > 0 && (
              <select
                className="w-full rounded-md border p-2"
                value={selectedColor || ""}
                onChange={(e) => setSelectedColor(e.target.value)}
              >
                <option value="">Select Color</option>
                {colors.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            )}
            {selectedVariant && (
              <p className="mt-2 text-lg font-bold">
                ${selectedVariant.price.toFixed(2)}
              </p>
            )}
          </div>
        ) : (
          <div className="flex items-center">
            <span className="text-sm text-gray-500">Price:</span>
            <span className="ml-2 text-sm font-medium text-gray-900">
              ${product.price.toFixed(2)}
            </span>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4">
        <Button
          className="w-full"
          onClick={handleAddToCart}
          disabled={
            product.hasVariants ? !selectedVariant?.inStock : !product.inStock
          }
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    additionalImages: PropTypes.arrayOf(PropTypes.string),
    category: PropTypes.string.isRequired,
    inStock: PropTypes.bool.isRequired,
    hasVariants: PropTypes.bool.isRequired,
    variants: PropTypes.arrayOf(
      PropTypes.shape({
        size: PropTypes.string.isRequired,
        color: PropTypes.string,
        price: PropTypes.number.isRequired,
        inStock: PropTypes.bool.isRequired,
      }),
    ),
    character: PropTypes.shape({
      image: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }),
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

const ProductsPage = () => {
  const [cart, setCart] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, charactersData] = await Promise.all([
          getProducts(),
          getCharacters(),
        ]);
        setProducts(productsData);
        setCharacters(charactersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let data;
        if (!selectedCharacter) {
          data = await getProducts();
        } else if (selectedCharacter === "stream") {
          data = await getProductsByCategory("Stream Merchandise");
        } else {
          data = await getProductsByCharacter(selectedCharacter);
        }
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCharacter]);

  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  const handleRemoveItem = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <Navigation
        cartItems={cart}
        CartItem={CartItem}
        handleUpdateQuantity={handleUpdateQuantity}
        handleRemoveItem={handleRemoveItem}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Shop Merchandise
        </h1>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            variant={!selectedCharacter ? "default" : "outline"}
            onClick={() => setSelectedCharacter(null)}
            className="text-sm sm:text-base"
          >
            All Merch
          </Button>
          {characters.map((character) => (
            <Button
              key={character.id}
              variant={
                selectedCharacter === character.id ? "default" : "outline"
              }
              onClick={() => setSelectedCharacter(character.id)}
              className="text-sm sm:text-base"
            >
              {character.name}
            </Button>
          ))}
          <Button
            variant={selectedCharacter === "stream" ? "default" : "outline"}
            onClick={() => setSelectedCharacter("stream")}
            className="text-sm sm:text-base"
          >
            Stream Lore
          </Button>
        </div>

        {/* Character Information */}
        {selectedCharacter && selectedCharacter !== "stream" && (
          <CharacterCard
            character={characters.find((char) => char.id === selectedCharacter)}
          />
        )}

        {/* Guide Message */}
        {!selectedCharacter && (
          <div className="text-center mb-8 text-blue-600 text-lg flex items-center justify-center gap-4">
            <ArrowUp className="h-6 w-6 animate-bounce" />
            Select a character tab above to learn more about their story and
            exclusive merchandise!
            <ArrowUp className="h-6 w-6 animate-bounce" />
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        {/* Shopping Cart Sheet */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              className="fixed bottom-4 right-4 h-16 w-16 rounded-full"
              size="icon"
            >
              <ShoppingCart className="h-6 w-6" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Shopping Cart</SheetTitle>
            </SheetHeader>
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-gray-500">Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto">
                  {cart.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemove={handleRemoveItem}
                    />
                  ))}
                </div>
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between mb-4">
                    <span className="font-semibold">Total:</span>
                    <span className="font-semibold">
                      ${calculateTotal().toFixed(2)}
                    </span>
                  </div>
                  <Button className="w-full">Checkout</Button>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default ProductsPage;
