import { useCartStore } from "../store/use-cart-store";

export const useCart = (tenantSlug: string) => {
  const {
    addProduct,
    removeProduct,
    clearCart,
    clearAllCarts,
    getCartByTenant,
  } = useCartStore();

  const productIds = getCartByTenant(tenantSlug);

  const toggleProduct = (productId: string) => {
    if (productIds.includes(productId)) {
      removeProduct(tenantSlug, productId);
    } else {
      addProduct(tenantSlug, productId);
    }
  };

  const isProductInCart = (productId: string) => {
    return productIds.includes(productId);
  };

  const clearTenantCart = () => {
    clearCart(tenantSlug);
  };

  return {
    productIds,
    addProduct: (productId: string) => addProduct(tenantSlug, productId),
    removeProduct: (productId: string) => removeProduct(tenantSlug, productId),
    clearCart: clearTenantCart,
    toggleProduct,
    isProductInCart,
    clearAllCarts,
    totalItems: productIds.length,
  };
};
