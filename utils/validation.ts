import {
  MIN_ORDER_SIZE,
  MIN_PRICE_CENTS,
  MAX_PRICE_CENTS,
} from "@/constants/validation";

export const isValidSize = (size: number) => size > MIN_ORDER_SIZE;

export const isValidPriceCents = (cents: number) =>
  !isNaN(cents) && cents >= MIN_PRICE_CENTS && cents <= MAX_PRICE_CENTS;

export const isValidDecimalInput = (value: string) =>
  value === "" || /^\d*\.?\d*$/.test(value);

export const isValidCentsInput = (value: string) =>
  value === "" || /^\d{0,2}$/.test(value);

