'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import ThemeToggle from '@/components/ThemeToggle';
import CartWishlistIcons from '@/components/CartWishlistIcons';
import toast from 'react-hot-toast';

const SAMPLE_PRODUCTS: any = {
  '1': { id: 1, name: 'Premium Package', price: 299, description: 'Full access to all features with priority support', features: ['Unlimited projects', 'Priority support', 'Advanced analytics', 'Custom branding', 'API access', 'White-label options'] },
  '2': { id: 2, name: 'Starter Package', price: 99, description: 'Perfect for individuals and small teams', features: ['5 projects', 'Email support', 'Basic analytics', 'Standard features'] },
  '3': { id: 3, name: 'Enterprise Package', price: 999, description: 'For large organizations', features: ['Unlimited everything', '24/7 support', 'Account manager', 'Custom integrations'] },
  '4': { id: 4, name: 'Basic Package', price: 49, description: 'Essential features', features: ['2 projects', 'Community support', 'Basic features', '1 user'] },
  '5': { id: 5, name: 'Professional Package', price: 499, description: 'Advanced tools', features: ['20 projects', 'Priority support', 'Advanced tools', 'Team collaboration'] },
  '6': { id: 6, name: 'Lifetime Package', price: 1999, description: 'One-time payment, lifetime access', features: ['Lifetime access', 'All updates', 'VIP support', 'Exclusive features'] }
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();

  const product = SAMPLE_PRODUCTS[params.id as string];

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Product Not Found</h1>
          <Link href="/products" className="text-primary dark:text-blue-400 hover:underline">
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const handlePurchase = () => {
    // Add product to cart with specified quantity
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id.toString(),
        name: product.name,
        price: product.price
      });
    }
    toast.success('Added to cart! Redirecting to payment...');
    // Redirect to payment page
    router.push('/payment');
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id.toString(),
      name: product.name,
      price: product.price
    });
    toast.success('Added to cart!');
  };

  const handleToggleWishlist = () => {
    if (isInWishlist(product.id.toString())) {
      removeFromWishlist(product.id.toString());
      toast.success('Removed from wishlist');
    } else {
      addToWishlist({
        id: product.id.toString(),
        name: product.name,
        price: product.price
      });
      toast.success('Added to wishlist!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/products" className="flex items-center space-x-2 text-primary dark:text-blue-400 hover:text-primary-dark">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-semibold">Back to Products</span>
            </Link>
            <div className="flex items-center space-x-4">
              <CartWishlistIcons />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 rounded-3xl h-96 flex items-center justify-center shadow-2xl">
            <div className="text-white text-9xl font-bold opacity-30">{product.name.charAt(0)}</div>
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{product.name}</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">{product.description}</p>

            <div className="flex items-baseline mb-8">
              <span className="text-5xl font-bold text-gray-900">${product.price}</span>
              <span className="text-gray-500 ml-2">one-time payment</span>
            </div>

            {/* Features */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Included:</h3>
              <ul className="space-y-3">
                {product.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="text-2xl font-bold text-gray-900 w-16 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handlePurchase}
                className="w-full bg-primary text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-primary-dark transition transform hover:scale-105 shadow-lg"
              >
                Buy Now - ${product.price * quantity}
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className="py-3 px-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Add to Cart</span>
                </button>
                
                <button
                  onClick={handleToggleWishlist}
                  className={`py-3 px-4 border-2 rounded-xl font-semibold transition flex items-center justify-center space-x-2 ${
                    isInWishlist(product.id.toString())
                      ? 'border-red-300 bg-red-50 text-red-600 hover:bg-red-100'
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <svg
                    className={`w-5 h-5 ${isInWishlist(product.id.toString()) ? 'fill-current' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>{isInWishlist(product.id.toString()) ? 'Saved' : 'Save'}</span>
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-3 gap-4 text-center text-sm text-gray-600 dark:text-gray-400">
                <div>
                  <svg className="w-8 h-8 mx-auto mb-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Secure Payment</span>
                </div>
                <div>
                  <svg className="w-8 h-8 mx-auto mb-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span>Instant Access</span>
                </div>
                <div>
                  <svg className="w-8 h-8 mx-auto mb-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
