export const calculateTotalCost = (size: number, price: number) => size * price;

export const convertCentsToPrice = (cents: number) => cents / 100;

export const convertPriceToCents = (price: number) => Math.round(price * 100);

