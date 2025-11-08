'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import ThemeToggle from '@/components/ThemeToggle';
import CartWishlistIcons from '@/components/CartWishlistIcons';
import { useCreatePurchaseMutation } from '@/redux/reducer/features/Purchase/purchaseSlice';
import toast from 'react-hot-toast';

type PaymentMethod = 'upi' | 'card' | 'paypal' | 'emi' | 'cod' | null;

export default function PaymentPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();
  const [createPurchase, { isLoading: purchasing }] = useCreatePurchaseMutation();
  
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
  const [processing, setProcessing] = useState(false);

  // UPI Payment Details
  const [upiMethod, setUpiMethod] = useState<'phonepay' | 'paytm' | 'googlepay' | 'upiid' | null>(null);
  const [upiId, setUpiId] = useState('');

  // Card Payment Details
  const [cardType, setCardType] = useState<'credit' | 'debit' | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // PayPal Details
  const [paypalEmail, setPaypalEmail] = useState('');

  // EMI Details
  const [emiTenure, setEmiTenure] = useState<'3' | '6' | '9' | '12' | null>(null);

  // COD Details
  const [codAddress, setCodAddress] = useState('');
  const [codPhone, setCodPhone] = useState('');

  useEffect(() => {
    setMounted(true);
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);

    if (!storedToken) {
      router.push('/login?redirect=/payment');
    }
  }, [router]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300 text-xl">Loading payment...</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">No items to pay for</h1>
          <Link
            href="/products"
            className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const validatePayment = (): boolean => {
    if (!selectedMethod) {
      toast.error('Please select a payment method');
      return false;
    }

    if (selectedMethod === 'upi') {
      if (!upiMethod) {
        toast.error('Please select a UPI payment method');
        return false;
      }
      if (upiMethod === 'upiid' && !upiId) {
        toast.error('Please enter your UPI ID');
        return false;
      }
    }

    if (selectedMethod === 'card') {
      if (!cardType || !cardNumber || !cardName || !cardExpiry || !cardCvv) {
        toast.error('Please fill all card details');
        return false;
      }
      if (cardNumber.replace(/\s/g, '').length < 16) {
        toast.error('Please enter a valid card number');
        return false;
      }
    }

    if (selectedMethod === 'paypal' && !paypalEmail) {
      toast.error('Please enter your PayPal email');
      return false;
    }

    if (selectedMethod === 'emi' && !emiTenure) {
      toast.error('Please select EMI tenure');
      return false;
    }

    if (selectedMethod === 'cod') {
      if (!codAddress || !codPhone) {
        toast.error('Please fill delivery address and phone number');
        return false;
      }
    }

    return true;
  };

  const handlePayment = async () => {
    if (!validatePayment()) return;

    setProcessing(true);

    try {
      // Create purchases for all items in cart
      for (const item of cart) {
        await createPurchase({
          productId: item.id,
          productName: item.name,
          amount: item.price * item.quantity
        }).unwrap();
      }

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success('Payment successful! Your order has been placed.');
      clearCart();
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Payment failed:', error);
      const errorMessage = error?.data?.message || 'Payment failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="text-xl font-bold text-gray-800 dark:text-white">FileShare</span>
            </Link>

            <div className="flex items-center space-x-4">
              <CartWishlistIcons />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
                ✓
              </div>
              <span className="ml-2 text-gray-700 dark:text-gray-300 font-semibold">Cart</span>
            </div>
            <div className="w-16 h-1 bg-green-500"></div>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
                ✓
              </div>
              <span className="ml-2 text-gray-700 dark:text-gray-300 font-semibold">Checkout</span>
            </div>
            <div className="w-16 h-1 bg-primary"></div>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                3
              </div>
              <span className="ml-2 text-gray-700 dark:text-gray-300 font-semibold">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Select Payment Method</h2>

              {/* UPI Payment */}
              <div className="mb-6">
                <button
                  onClick={() => setSelectedMethod(selectedMethod === 'upi' ? null : 'upi')}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    selectedMethod === 'upi'
                      ? 'border-primary bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-900 dark:text-white">UPI Payment</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">PhonePe, Paytm, Google Pay, or UPI ID</p>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 ${
                      selectedMethod === 'upi' ? 'border-primary bg-primary' : 'border-gray-300 dark:border-gray-600'
                    } flex items-center justify-center`}>
                      {selectedMethod === 'upi' && (
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>
                </button>

                {selectedMethod === 'upi' && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setUpiMethod('phonepay')}
                        className={`p-4 rounded-lg border-2 transition ${
                          upiMethod === 'phonepay'
                            ? 'border-primary bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <div className="text-center font-semibold text-gray-900 dark:text-white">PhonePe</div>
                      </button>
                      <button
                        onClick={() => setUpiMethod('paytm')}
                        className={`p-4 rounded-lg border-2 transition ${
                          upiMethod === 'paytm'
                            ? 'border-primary bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <div className="text-center font-semibold text-gray-900 dark:text-white">Paytm</div>
                      </button>
                      <button
                        onClick={() => setUpiMethod('googlepay')}
                        className={`p-4 rounded-lg border-2 transition ${
                          upiMethod === 'googlepay'
                            ? 'border-primary bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <div className="text-center font-semibold text-gray-900 dark:text-white">Google Pay</div>
                      </button>
                      <button
                        onClick={() => setUpiMethod('upiid')}
                        className={`p-4 rounded-lg border-2 transition ${
                          upiMethod === 'upiid'
                            ? 'border-primary bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <div className="text-center font-semibold text-gray-900 dark:text-white">Enter UPI ID</div>
                      </button>
                    </div>

                    {upiMethod === 'upiid' && (
                      <input
                        type="text"
                        placeholder="yourname@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    )}

                    {upiMethod && upiMethod !== 'upiid' && (
                      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <p className="text-sm text-yellow-800 dark:text-yellow-300">
                          You'll be redirected to {upiMethod === 'phonepay' ? 'PhonePe' : upiMethod === 'paytm' ? 'Paytm' : 'Google Pay'} app to complete the payment.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Credit/Debit Card */}
              <div className="mb-6">
                <button
                  onClick={() => setSelectedMethod(selectedMethod === 'card' ? null : 'card')}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    selectedMethod === 'card'
                      ? 'border-primary bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Credit/Debit Card</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Visa, Mastercard, Amex, etc.</p>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 ${
                      selectedMethod === 'card' ? 'border-primary bg-primary' : 'border-gray-300 dark:border-gray-600'
                    } flex items-center justify-center`}>
                      {selectedMethod === 'card' && (
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>
                </button>

                {selectedMethod === 'card' && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setCardType('credit')}
                        className={`p-3 rounded-lg border-2 transition ${
                          cardType === 'credit'
                            ? 'border-primary bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <div className="text-center font-semibold text-gray-900 dark:text-white">Credit Card</div>
                      </button>
                      <button
                        onClick={() => setCardType('debit')}
                        className={`p-3 rounded-lg border-2 transition ${
                          cardType === 'debit'
                            ? 'border-primary bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <div className="text-center font-semibold text-gray-900 dark:text-white">Debit Card</div>
                      </button>
                    </div>

                    {cardType && (
                      <>
                        <input
                          type="text"
                          placeholder="Card Number"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          maxLength={19}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <input
                          type="text"
                          placeholder="Cardholder Name"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            maxLength={5}
                            className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                          <input
                            type="text"
                            placeholder="CVV"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            maxLength={3}
                            className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* PayPal */}
              <div className="mb-6">
                <button
                  onClick={() => setSelectedMethod(selectedMethod === 'paypal' ? null : 'paypal')}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    selectedMethod === 'paypal'
                      ? 'border-primary bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                        <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">P</span>
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-900 dark:text-white">PayPal</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Fast and secure payment</p>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 ${
                      selectedMethod === 'paypal' ? 'border-primary bg-primary' : 'border-gray-300 dark:border-gray-600'
                    } flex items-center justify-center`}>
                      {selectedMethod === 'paypal' && (
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>
                </button>

                {selectedMethod === 'paypal' && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <input
                      type="email"
                      placeholder="PayPal Email"
                      value={paypalEmail}
                      onChange={(e) => setPaypalEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                )}
              </div>

              {/* EMI */}
              <div className="mb-6">
                <button
                  onClick={() => setSelectedMethod(selectedMethod === 'emi' ? null : 'emi')}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    selectedMethod === 'emi'
                      ? 'border-primary bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-900 dark:text-white">EMI (Easy Monthly Installments)</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Pay in easy installments</p>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 ${
                      selectedMethod === 'emi' ? 'border-primary bg-primary' : 'border-gray-300 dark:border-gray-600'
                    } flex items-center justify-center`}>
                      {selectedMethod === 'emi' && (
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>
                </button>

                {selectedMethod === 'emi' && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Select EMI Tenure:</p>
                    <div className="grid grid-cols-2 gap-4">
                      {(['3', '6', '9', '12'] as const).map((months) => (
                        <button
                          key={months}
                          onClick={() => setEmiTenure(months)}
                          className={`p-4 rounded-lg border-2 transition ${
                            emiTenure === months
                              ? 'border-primary bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          <div className="text-center">
                            <div className="font-semibold text-gray-900 dark:text-white">{months} Months</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              ${(cartTotal / parseInt(months)).toFixed(2)}/mo
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Cash on Delivery */}
              <div className="mb-6">
                <button
                  onClick={() => setSelectedMethod(selectedMethod === 'cod' ? null : 'cod')}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    selectedMethod === 'cod'
                      ? 'border-primary bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                        <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Cash on Delivery</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Pay when you receive</p>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 ${
                      selectedMethod === 'cod' ? 'border-primary bg-primary' : 'border-gray-300 dark:border-gray-600'
                    } flex items-center justify-center`}>
                      {selectedMethod === 'cod' && (
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>
                </button>

                {selectedMethod === 'cod' && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg space-y-4">
                    <textarea
                      placeholder="Delivery Address"
                      value={codAddress}
                      onChange={(e) => setCodAddress(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={codPhone}
                      onChange={(e) => setCodPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{item.name} x{item.quantity}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
                <div className="flex justify-between text-2xl font-bold text-gray-900 dark:text-white">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={processing || purchasing}
                className="w-full py-4 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {processing || purchasing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Complete Payment'
                )}
              </button>

              <Link
                href="/checkout"
                className="block w-full py-3 mt-4 text-center text-primary hover:text-purple-600 transition"
              >
                ← Back to Checkout
              </Link>

              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  🔒 Secure payment powered by FileShare
                  <br />
                  Your payment information is safe with us
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
