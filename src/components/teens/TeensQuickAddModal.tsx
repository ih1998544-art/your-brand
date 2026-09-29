import React, { useState } from 'react';
import { TeenProduct } from '../../data/teensData';
import { Currency } from '../../types';
import { X, ShoppingBag, Check } from 'lucide-react';

interface TeensQuickAddModalProps {
  product: TeenProduct | null;
  currency: Currency;
  onClose: () => void;
  onConfirmAdd: (product: TeenProduct, size: string) => void;
}

export const TeensQuickAddModal: React.FC<TeensQuickAddModalProps> = ({
  product,
  currency,
  onClose,
  onConfirmAdd,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>('');

  if (!product) return null;

  const formatPrice = (pkr: number) => {
    const converted = pkr * currency.rate;
    if (currency.code === 'PKR') {
      return `${currency.symbol} ${pkr.toLocaleString('en-US')}`;
    }
    return `${currency.symbol}${converted.toFixed(2)}`;
  };

  const handleAdd = () => {
    if (!selectedSize) return;
    onConfirmAdd(product, selectedSize);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-sm rounded-xs shadow-2xl p-5 border border-neutral-200 z-10 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-12 h-16 object-cover bg-neutral-100 rounded-xs"
            />
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">
                {product.category}
              </span>
              <h3 className="font-serif text-sm font-bold text-neutral-900 uppercase truncate max-w-[190px]">
                {product.name}
              </h3>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xs font-bold text-neutral-950">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-[10px] text-neutral-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-black transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Size Selection */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-2">
            <span>Select Available Size:</span>
            {selectedSize && (
              <span className="text-neutral-950 font-bold">Selected: {selectedSize}</span>
            )}
          </div>

          {product.sizes.length === 0 || !product.inStock ? (
            <div className="p-3 text-center bg-neutral-50 text-neutral-500 text-xs rounded-xs">
              This article is currently out of stock.
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {product.sizes.map((sz) => {
                const isSelected = selectedSize === sz;
                return (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`h-10 text-xs font-bold uppercase transition-all rounded-xs border flex items-center justify-center gap-1 ${
                      isSelected
                        ? 'border-neutral-950 bg-neutral-950 text-white shadow-xs'
                        : 'border-neutral-200 bg-white text-neutral-800 hover:border-black'
                    }`}
                  >
                    <span>{sz}</span>
                    {isSelected && <Check className="w-3 h-3" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handleAdd}
          disabled={!selectedSize || !product.inStock}
          className="w-full h-11 bg-neutral-950 text-white text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 rounded-xs disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{selectedSize ? `Add Size ${selectedSize} to Bag` : 'Please Select Size'}</span>
        </button>
      </div>
    </div>
  );
};
