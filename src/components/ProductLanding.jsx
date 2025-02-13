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
      <h3 className="font-medium text-blue-900 dark:text-blue-100">{item.name}</h3>
      <div className="flex items-center">
        <span className="text-sm text-gray-500 dark:text-gray-400">Price:</span>
        <span className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">
          ${item.price.toFixed(2)}
        </span>
      </div>
      <div className="mt-2 flex items-center">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 dark:border-gray-600 dark:text-gray-200"
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="mx-3 dark:text-gray-200">{item.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 dark:border-gray-600 dark:text-gray-200"
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
    <Button
      variant="ghost"
      size="icon"
      className="ml-4 dark:text-gray-200 dark:hover:text-white"
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
    <div className="mt-16 bg-blue-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-blue-900 dark:text-blue-100 sm:text-5xl md:text-6xl">
            Featured Product
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-blue-600 dark:text-blue-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
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
        <Card className="max-w-2xl mx-auto bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Limited Edition Streamer Merch</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">Exclusive design, premium quality</CardDescription>
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
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Show your support with our signature merchandise, designed for
                true fans.
              </p>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">Price:</span>
                <span className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                  $29.99
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white" onClick={handleAddToCart}>
              Add to Cart
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* About Section */}
      <div className="bg-white dark:bg-gray-800 py-12" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-blue-900 dark:text-blue-100">
              About the Stream
            </h2>
            <p className="mt-4 text-lg text-blue-600 dark:text-blue-400">
              Join our community of passionate viewers and get access to
              exclusive merchandise.
            </p>
          </div>
        </div>
      </div>

      {/* Stream Section */}
      <div className="bg-blue-50 dark:bg-gray-900 py-12" id="stream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-blue-900 dark:text-blue-100">
              Live Stream Schedule
            </h2>
            <p className="mt-4 text-lg text-blue-600 dark:text-blue-400">
              Catch us live and be the first to know about new merchandise
              drops!
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-blue-600 dark:text-blue-400">
            © 2025 StreamStore. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Notification */}
      {showNotification && (
        <div className="fixed bottom-4 right-4">
          <Alert className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <AlertTitle className="text-gray-900 dark:text-white">Success!</AlertTitle>
            <AlertDescription className="text-gray-600 dark:text-gray-300">Item added to cart</AlertDescription>
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
