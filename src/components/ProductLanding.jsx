import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Plus, Minus, X } from "lucide-react";
import PropTypes from "prop-types";

const CartItem = ({ item, onUpdateQuantity, onRemove }) => (
  <div className="flex items-center py-4">
    <img
      src={item.image || "/api/placeholder/80/80"}
      alt={item.name}
      className="h-20 w-20 rounded object-cover"
    />
    <div className="ml-4 flex-1">
      <h3 className="font-medium text-blue-900">{item.name}</h3>
      <div className="flex items-center">
        <span className="text-sm text-gray-500">Price:</span>
        <span className="ml-2 text-sm font-medium text-gray-900">
          ${item.price.toFixed(2)}
        </span>
      </div>
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
  }).isRequired,
  onUpdateQuantity: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

const ProductLanding = ({ cartItems, setCartItems }) => {
  const [showNotification, setShowNotification] = useState(false);

  const handleAddToCart = () => {
    const newItem = {
      id: Date.now(),
      name: "Limited Edition Streamer Merch",
      price: 29.99,
      quantity: 1,
      image: "/api/placeholder/800/450",
    };

    const existingItem = cartItems.find((item) => item.name === newItem.name);
    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      setCartItems([...cartItems, newItem]);
    }

    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  return (
    <div className="mt-16 bg-blue-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-blue-900 sm:text-5xl md:text-6xl">
            Featured Product
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-blue-600 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Your go-to streaming merchandise store. Get the latest gear from
            your favorite streamer!
          </p>
        </div>
      </div>

      {/* Featured Product */}
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        id="featured"
      >
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Limited Edition Streamer Merch</CardTitle>
            <CardDescription>Exclusive design, premium quality</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-w-16 aspect-h-9 mb-4">
              <img
                src="/api/placeholder/800/450"
                alt="Featured Product"
                className="rounded-lg object-cover"
              />
            </div>
            <div className="space-y-4">
              <p className="text-lg">
                Show your support with our signature merchandise, designed for
                true fans.
              </p>
              <div className="flex items-center">
                <span className="text-sm text-gray-500">Price:</span>
                <span className="ml-2 text-sm font-medium text-gray-900">
                  $29.99
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleAddToCart}>
              Add to Cart
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* About Section */}
      <div className="bg-white py-12" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-blue-900">
              About the Stream
            </h2>
            <p className="mt-4 text-lg text-blue-600">
              Join our community of passionate viewers and get access to
              exclusive merchandise.
            </p>
          </div>
        </div>
      </div>

      {/* Stream Section */}
      <div className="bg-blue-50 py-12" id="stream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-blue-900">
              Live Stream Schedule
            </h2>
            ,
            <p className="mt-4 text-lg text-blue-600">
              Catch us live and be the first to know about new merchandise
              drops!
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-blue-600">
            © 2025 StreamStore. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Notification */}
      {showNotification && (
        <div className="fixed bottom-4 right-4">
          <Alert>
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>Item added to cart</AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
};

ProductLanding.propTypes = {
  cartItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
    }),
  ).isRequired,
  setCartItems: PropTypes.func.isRequired,
};

export default ProductLanding;
