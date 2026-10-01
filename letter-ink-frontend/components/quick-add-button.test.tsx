import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuickAddButton } from './quick-add-button';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock the cart actions
const mockAddToCart = vi.fn();
vi.mock('@/app/cart/actions', () => ({
  addToCart: (...args: any[]) => mockAddToCart(...args),
}));

// Mock the cart context
const mockOpenCart = vi.fn();
const mockDispatch = vi.fn();
const mockSyncCart = vi.fn();
const mockReconcile = vi.fn();
vi.mock('@/app/cart/cart-context', () => ({
  useCart: () => ({
    openCart: mockOpenCart,
    dispatch: mockDispatch,
    syncCart: mockSyncCart,
    reconcile: mockReconcile,
  }),
}));

// Mock tracking
const mockTrackAddToCart = vi.fn();
vi.mock('@/lib/track', () => ({
  trackAddToCart: (...args: any[]) => mockTrackAddToCart(...args),
}));

// Mock toast
const mockToastError = vi.fn();
vi.mock('sonner', () => ({
  toast: {
    error: (...args: any[]) => mockToastError(...args),
  },
}));

const defaultProps = {
  variantId: "variant_123",
  variantSku: "SKU-123",
  variantPrice: "100.00",
  variantImages: ["image.jpg"],
  product: {
    id: "prod_123",
    name: "Test Product",
    slug: "test-product",
    images: ["image.jpg"],
  },
};

describe('QuickAddButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<QuickAddButton {...defaultProps} />);
    expect(screen.getByRole('button', { name: /add test product to cart/i })).toBeInTheDocument();
  });

  it('handles successful add to cart', async () => {
    mockAddToCart.mockResolvedValue({ success: true, cart: { id: "cart_123" } });
    const user = userEvent.setup();
    
    render(<QuickAddButton {...defaultProps} />);
    const button = screen.getByRole('button', { name: /add test product to cart/i });
    
    await user.click(button);
    
    // Assert tracking was called
    expect(mockTrackAddToCart).toHaveBeenCalledWith(
      { id: "variant_123", sku: "SKU-123", price: "100.00" },
      "Test Product",
      1
    );
    
    // Assert optimistic UI updates
    expect(mockOpenCart).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "ADD_ITEM",
      item: expect.objectContaining({
        quantity: 1,
        productVariant: expect.objectContaining({ id: "variant_123" }),
      }),
    });
    
    // Server action should be called
    expect(mockAddToCart).toHaveBeenCalledWith("variant_123", 1);
  });

  it('handles failed add to cart', async () => {
    mockAddToCart.mockResolvedValue({ success: false, error: "Out of stock" });
    const user = userEvent.setup();
    
    render(<QuickAddButton {...defaultProps} />);
    const button = screen.getByRole('button', { name: /add test product to cart/i });
    
    await user.click(button);
    
    // Wait for the async IIFE to complete and call toast
    // Because the component handles this without awaiting in the onClick, we might need a small delay or retry
    await vi.waitFor(() => {
      expect(mockReconcile).toHaveBeenCalled();
      expect(mockToastError).toHaveBeenCalledWith("Out of stock");
    });
  });
});
