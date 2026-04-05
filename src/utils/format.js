export function formatMoneyINR(amount) {
  // Use Indian locale and INR currency symbol
  try {
    return amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });
  } catch (e) {
    // Fallback
    const sign = amount < 0 ? '-' : '';
    return `${sign}₹${Math.abs(amount).toFixed(2)}`;
  }
}
