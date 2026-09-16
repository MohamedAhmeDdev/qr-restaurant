import React from 'react';
import { useRestaurant } from '../contexts/RestaurantContext';
import { formatDate } from '../utils/formatDate';

export default function ReceiptPrinter({
  order,
  width = "80mm",
  formatPrice,
}) {
  const { activeRestaurant } =   useRestaurant();
  if (!order) return null;


  return (
    <div
      className="hidden print:block mx-auto p-2 font-mono text-[12px] leading-tight text-black bg-white print:m-0"
      style={{ width }}
    >
      <div className="text-center border-b border-black pb-2 mb-2">
        <h2 className="text-base font-bold uppercase tracking-wider">
          {activeRestaurant?.name}
        </h2>
        <p className="text-[10px]">Order Receipt</p>
      </div>

      <div className="flex justify-between text-[11px] mb-1">
        <span>Order #:</span>
        <span className="font-bold">{order.order_number}</span>
      </div>
      <div className="flex justify-between text-[11px] mb-1">
        <span>Table:</span>
        <span className="font-bold">{order.table?.id || 'N/A'}</span>
      </div>
      <div className="flex justify-between text-[11px] mb-2 border-b border-black pb-2">
        <span>Date & Time:</span>
       {formatDate(order.created_at, {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })}
        </div>

      <table className="w-full text-left my-2 border-b border-black pb-2">
        <thead>
          <tr className="border-b border-black text-[10px]">
            <th className="py-1">QTY</th>
            <th className="py-1">ITEM</th>
            <th className="py-1 text-right">AMT</th>
          </tr>
        </thead>
        <tbody>
          {order.items?.map((item, idx) => (
            <React.Fragment key={item.id || idx}>
              <tr>
                <td className="py-1 align-top font-bold">{item.quantity}x</td>
                <td className="py-1 align-top font-bold">{item.item_name}</td>
                <td className="py-1 align-top text-right font-bold">
                  {formatPrice ? formatPrice(item.subtotal) : item.subtotal}
                </td>
              </tr>
              {item.modifiers && item.modifiers.length > 0 && (
                item.modifiers.map((mod, i) => (
                  <tr key={i} className="text-[10px]">
                    <td />
                    <td className="pl-2">+ {mod.modifier_option_name}</td>
                    <td className="text-right">
                      {formatPrice ? formatPrice(mod.unit_price) : mod.unit_price}
                    </td>
                  </tr>
                ))
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <div className="space-y-1 text-right mb-4">
        <div className="flex justify-between text-[11px]">
          <span>Subtotal:</span>
          <span>{formatPrice ? formatPrice(order.subtotal) : order.subtotal}</span>
        </div>
        <div className="flex justify-between text-sm font-bold border-t border-black pt-1">
          <span>TOTAL:</span>
          <span>{formatPrice ? formatPrice(order.total_amount) : order.total_amount}</span>
        </div>
      </div>

      <div className="text-center text-[10px] border-t border-dashed border-black pt-2">
        <p>Thank you for dining with us!</p>
      </div>
    </div>
  );
}