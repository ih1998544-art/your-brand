import React, { useState } from 'react';

interface FooterProps {
  onOpenStoreLocator: () => void;
  onOpenTracking: () => void;
  onNotify: (msg: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenStoreLocator,
  onOpenTracking,
  onNotify,
}) => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      onNotify('Please enter a valid email address');
      return;
    }
    onNotify('Thank you for subscribing! Your 10% welcome coupon has been issued: WELCOME10');
    setEmail('');
  };

  return (
    <footer className="bg-neutral-950 text-neutral-100 pt-16 pb-8 px-4 sm:px-8 md:px-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12">
          {/* Column 1: Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-white mb-4">
              Contact
            </h3>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <a
                  href="tel:+920000000000"
                  className="hover:text-white transition-colors"
                >
                  +92 000 0000000
                </a>
              </li>
              <li>Mon–Sat: 9:30am–10:00pm</li>
              <li>Sun: 11am–8pm (PKT)</li>
              <li>
                <a
                  href="mailto:eshop@yourbrand.com"
                  className="hover:text-white transition-colors"
                >
                  eshop@yourbrand.com
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Company */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-white mb-4">
              Company
            </h3>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => onNotify('YOUR BRAND was founded with a passion for heirloom craft.')}
                  className="hover:text-white transition-colors text-left"
                >
                  About us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNotify('Explore design and retail opportunities at YOUR BRAND.')}
                  className="hover:text-white transition-colors text-left"
                >
                  Careers
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenStoreLocator}
                  className="hover:text-white transition-colors text-left"
                >
                  Store locator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNotify('Inquire about wholesale & corporate gifting.')}
                  className="hover:text-white transition-colors text-left"
                >
                  Corporate
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Support */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-white mb-4">
              Customer support
            </h3>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => onNotify('Support team available via phone and email.')}
                  className="hover:text-white transition-colors text-left"
                >
                  Contact us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNotify('Standard domestic shipping 2-4 business days. International 5-7 days.')}
                  className="hover:text-white transition-colors text-left"
                >
                  Delivery & orders
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNotify('Hassle-free 14-day exchange policy on unworn items.')}
                  className="hover:text-white transition-colors text-left"
                >
                  Returns & exchanges
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTracking}
                  className="hover:text-white transition-colors text-left"
                >
                  Track my order
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNotify('We accept Visa, Mastercard, AMEX, Apple Pay and Cash on Delivery.')}
                  className="hover:text-white transition-colors text-left"
                >
                  Payment guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNotify('100% genuine Pima Lawn, Khaddar, Karandi, and Mulberry Silk.')}
                  className="hover:text-white transition-colors text-left"
                >
                  Fabric glossary
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Connect */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-white mb-4">
              Connect
            </h3>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <a href="#instagram" onClick={(e) => { e.preventDefault(); onNotify('Follow @yourbrand on Instagram'); }} className="hover:text-white transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#facebook" onClick={(e) => { e.preventDefault(); onNotify('Follow YOUR BRAND on Facebook'); }} className="hover:text-white transition-colors">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#x" onClick={(e) => { e.preventDefault(); onNotify('Follow @yourbrand on X'); }} className="hover:text-white transition-colors">
                  X (Twitter)
                </a>
              </li>
              <li>
                <a href="#youtube" onClick={(e) => { e.preventDefault(); onNotify('Watch seasonal fashion films on YouTube'); }} className="hover:text-white transition-colors">
                  YouTube
                </a>
              </li>
              <li>
                <a href="#pinterest" onClick={(e) => { e.preventDefault(); onNotify('Explore styling moodboards on Pinterest'); }} className="hover:text-white transition-colors">
                  Pinterest
                </a>
              </li>
            </ul>
          </div>

          {/* Column 5: Newsletter */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-white mb-4">
              Newsletter
            </h3>
            <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
              By providing your email, you agree to receive previews of new collections and exclusive invitations.
            </p>
            <form onSubmit={handleSubscribe} className="flex">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-white transition-colors"
                aria-label="Email address"
                required
              />
              <button
                type="submit"
                className="bg-white text-neutral-950 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-colors shrink-0"
              >
                Sign up
              </button>
            </form>
          </div>
        </div>

        {/* Fine Print Footer */}
        <div className="pt-6 border-t border-neutral-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
          <p>&copy; 2026 YOUR BRAND. All rights reserved.</p>
          <div className="flex gap-6">
            <button
              onClick={() => onNotify('Terms & Conditions policy updated for 2026.')}
              className="hover:text-neutral-300 transition-colors"
            >
              Terms & conditions
            </button>
            <button
              onClick={() => onNotify('Privacy Policy: We do not sell your personal data.')}
              className="hover:text-neutral-300 transition-colors"
            >
              Privacy policy
            </button>
            <button
              onClick={() => onNotify('Accessibility statement: Designed for WCAG AA compliance.')}
              className="hover:text-neutral-300 transition-colors"
            >
              Accessibility
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
