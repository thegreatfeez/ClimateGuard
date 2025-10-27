// src/components/SubscriptionModal.jsx
import { useState } from 'react';
import { X, Check, Crown, Building2 } from 'lucide-react';
import { ethers } from 'ethers';

function SubscriptionModal({ isOpen, onClose, contracts }) {
  const [selectedTier, setSelectedTier] = useState(null);
  const [subscribing, setSubscribing] = useState(false);

  const tiers = [
    {
      name: 'Premium',
      price: '0.01',
      priceUsd: '$9.99',
      icon: Crown,
      color: 'from-yellow-500 to-orange-500',
      features: [
        '14-day weather forecasts',
        'Unlimited activity logging',
        '2x token multiplier',
        'Priority verification',
        'Advanced analytics',
        'API access'
      ]
    },
    {
      name: 'Enterprise',
      price: '0.05',
      priceUsd: '$49.99',
      icon: Building2,
      color: 'from-purple-500 to-pink-500',
      features: [
        'Everything in Premium',
        'Custom locations monitoring',
        'Team accounts (up to 10)',
        'White-label option',
        'Dedicated support',
        '5x token multiplier',
        'Custom integrations'
      ]
    }
  ];

  const handleSubscribe = async (tier) => {
    if (!contracts?.subscription) {
      alert('Subscription contract not loaded');
      return;
    }

    setSubscribing(true);
    try {
      const price = tier.name === 'Premium' ? '0.01' : '0.05';
      const tierIndex = tier.name === 'Premium' ? 1 : 2;

      const tx = await contracts.subscription.subscribe(tierIndex, {
        value: ethers.parseEther(price)
      });

      await tx.wait();
      alert(`Successfully subscribed to ${tier.name}!`);
      onClose();
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Failed to subscribe: ' + (error.reason || error.message));
    } finally {
      setSubscribing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0a1f1a] rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-[#22c55e]/30">
        {/* Header */}
        <div className="sticky top-0 bg-[#0a1f1a] border-b border-[#1a3a2e] p-6 flex items-center justify-between">
          <div>
            <h2 className="text-white text-3xl font-bold mb-2">Upgrade Your Plan</h2>
            <p className="text-gray-400">Unlock premium features and maximize your impact</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Pricing Cards */}
        <div className="p-6 grid md:grid-cols-2 gap-6">
          {tiers.map((tier) => {
            const Icon = tier.icon;
            return (
              <div
                key={tier.name}
                className="bg-[#153029] rounded-xl border border-[#1a3a2e] overflow-hidden hover:border-[#22c55e] transition-all duration-300"
              >
                {/* Tier Header */}
                <div className={`bg-gradient-to-r ${tier.color} p-6 text-white`}>
                  <div className="flex items-center justify-between mb-4">
                    <Icon size={40} />
                    <div className="text-right">
                      <p className="text-sm opacity-90">{tier.priceUsd}/month</p>
                      <p className="text-2xl font-bold">{tier.price} HBAR</p>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold">{tier.name}</h3>
                </div>

                {/* Features */}
                <div className="p-6">
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <Check size={20} className="text-[#22c55e] flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSubscribe(tier)}
                    disabled={subscribing}
                    className={`w-full bg-gradient-to-r ${tier.color} hover:opacity-90 text-white font-bold py-3 px-6 rounded-lg transition disabled:opacity-50`}
                  >
                    {subscribing ? 'Processing...' : `Subscribe to ${tier.name}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-[#1a3a2e] p-6 bg-[#0a1f1a]">
          <p className="text-gray-400 text-sm text-center">
            💳 Secure payment via blockchain • Cancel anytime • 30-day money-back guarantee
          </p>
        </div>
      </div>
    </div>
  );
}

export default SubscriptionModal;