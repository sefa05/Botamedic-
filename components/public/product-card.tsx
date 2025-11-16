'use client';

import Image from 'next/image';
import { useState } from 'react';
import { MenuCategory } from '@/lib/queries';
import { getProductPrice, useCart } from './cart-context';

export function ProductCard({ product }: { product: MenuCategory['products'][number] }) {
  const { addItem } = useCart();
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});

  const handleAdd = () => {
    const options = product.product_options?.flatMap((option) => {
      const selected = selectedOptions[option.id] ?? [];
      return selected.map((valueId) => {
        const value = option.product_option_values?.find((v) => v.id === valueId);
        return {
          id: valueId,
          label: value?.label ?? '',
          extra_price: value?.extra_price ?? 0
        };
      });
    });

    addItem({
      product_id: product.id,
      name: product.name,
      price: getProductPrice(product),
      quantity: 1,
      options: options?.filter(Boolean) ?? []
    });
  };

  const toggleOption = (optionId: string, valueId: string, multi: boolean) => {
    setSelectedOptions((prev) => {
      const current = prev[optionId] ?? [];
      if (multi) {
        return {
          ...prev,
          [optionId]: current.includes(valueId)
            ? current.filter((id) => id !== valueId)
            : [...current, valueId]
        };
      }
      return { ...prev, [optionId]: [valueId] };
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-4 space-y-4">
      {product.image_url && (
        <div className="relative h-40 w-full overflow-hidden rounded-xl">
          <Image src={product.image_url} alt={product.name} fill className="object-cover" />
        </div>
      )}
      <div>
        <h3 className="font-semibold text-lg">{product.name}</h3>
        {product.description && <p className="text-sm text-slate-500">{product.description}</p>}
      </div>
      <div className="text-xl font-semibold text-brand">
        ₺{getProductPrice(product).toFixed(2)}{' '}
        {product.discounted_price && (
          <span className="text-sm text-slate-400 line-through ml-2">₺{product.price.toFixed(2)}</span>
        )}
      </div>
      {product.product_options?.map((option) => (
        <div key={option.id} className="text-sm space-y-2">
          <p className="font-medium">
            {option.name}{' '}
            {option.is_required && <span className="text-xs text-brand">(Zorunlu)</span>}
          </p>
          <div className="flex flex-wrap gap-2">
            {option.product_option_values?.map((value) => (
              <button
                type="button"
                key={value.id}
                onClick={() => toggleOption(option.id, value.id, option.type === 'multi')}
                className={`border rounded-full px-3 py-1 text-xs ${
                  selectedOptions[option.id]?.includes(value.id)
                    ? 'border-brand bg-brand/10'
                    : 'border-slate-200'
                }`}
              >
                {value.label} (+₺{value.extra_price.toFixed(2)})
              </button>
            ))}
          </div>
        </div>
      ))}
      <button className="w-full bg-brand text-white py-2 rounded-xl" onClick={handleAdd}>
        Sepete Ekle
      </button>
    </div>
  );
}
