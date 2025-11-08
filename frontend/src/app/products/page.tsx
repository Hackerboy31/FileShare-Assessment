'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import CartWishlistIcons from '@/components/CartWishlistIcons';

// Sample products data (will be replaced with backend API later)
const SAMPLE_PRODUCTS = [
  {
    id: 1,
    name: 'Premium Package',
    description: 'Full access to all features with priority support',
    price: 299,
    image: '/api/placeholder/400/300',
    features: ['Unlimited projects', 'Priority support', 'Advanced analytics', 'Custom branding'],
    badge: 'Popular'
  },
  {
    id: 2,
    name: 'Starter Package',
    description: 'Perfect for individuals and small teams',
    price: 99,
    image: '/api/placeholder/400/300',
    features: ['5 projects', 'Email support', 'Basic analytics', 'Standard features'],
    badge: 'Best Value'
  },
  {
    id: 3,
    name: 'Enterprise Package',
    description: 'For large organizations with advanced needs',
    price: 999,
    image: '/api/placeholder/400/300',
    features: ['Unlimited everything', '24/7 phone support', 'Dedicated account manager', 'Custom integrations'],
    badge: 'Enterprise'
  },
  {
    id: 4,
    name: 'Basic Package',
    description: 'Get started with essential features',
    price: 49,
    image: '/api/placeholder/400/300',
    features: ['2 projects', 'Community support', 'Basic features', '1 user'],
    badge: null
  },
  {
    id: 5,
    name: 'Professional Package',
    description: 'Advanced tools for growing businesses',
    price: 499,
    image: '/api/placeholder/400/300',
    features: ['20 projects', 'Priority email support', 'Advanced tools', 'Team collaboration'],
    badge: null
  },
  {
    id: 6,
    name: 'Lifetime Package',
    description: 'One-time payment, lifetime access',
    price: 1999,
    image: '/api/placeholder/400/300',
    features: ['Lifetime access', 'All future updates', 'VIP support', 'Exclusive features'],
    badge: 'Limited Time'
  }
];

export default function ProductsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = SAMPLE_PRODUCTS.filter(product => {
    // Filter by search query
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by category
    if (selectedCategory === 'all') return matchesSearch;
    if (selectedCategory === 'popular') return matchesSearch && product.badge === 'Popular';
    if (selectedCategory === 'new') return matchesSearch && product.badge === 'Limited Time';
    if (selectedCategory === 'sale') return matchesSearch && product.badge === 'Best Value';
    
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center space-x-2 text-primary hover:text-primary-dark transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="font-semibold">Back to Dashboard</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-3">
              <CartWishlistIcons />
              <ThemeToggle />
              <div className="w-10 h-10 gradient-primary dark:from-blue-600 dark:to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="text-xl font-bold text-gray-800 dark:text-white">FileShare</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="gradient-primary dark:from-blue-900 dark:via-purple-900 dark:to-indigo-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">Our Products</h1>
          <p className="text-xl text-blue-100 dark:text-blue-200 mb-8">Choose the perfect plan for your needs</p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600 rounded-xl border-2 border-transparent focus:border-white focus:outline-none shadow-lg"
                placeholder="Search for products..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Tabs */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex space-x-2 overflow-x-auto">
            {['all', 'popular', 'new', 'sale'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-semibold transition capitalize ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
            >
              {/* Product Image */}
              <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500 overflow-hidden">
                {product.badge && (
                  <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold shadow-lg z-10">
                    {product.badge}
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-6xl font-bold opacity-20">
                    {product.name.charAt(0)}
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>

                {/* Features List */}
                <ul className="space-y-2 mb-6">
                  {product.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                  {product.features.length > 3 && (
                    <li className="text-sm text-primary font-semibold">
                      +{product.features.length - 3} more features
                    </li>
                  )}
                </ul>

                {/* Price & Actions */}
                <div className="flex items-center justify-between border-t pt-4">
                  <div>
                    <span className="text-3xl font-bold text-gray-900">${product.price}</span>
                    <span className="text-gray-500 text-sm ml-1">once</span>
                  </div>
                  
                  <button
                    onClick={() => router.push(`/products/${product.id}`)}
                    className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition transform hover:scale-105"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filter</p>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Need help choosing?</h3>
              <p className="text-gray-600">Our team is here to help you find the perfect plan</p>
            </div>
            <button className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition transform hover:scale-105 shadow-lg">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
