// System e-commerce - podstawowe typy do wygenerowania interfejsów
type ProductCategory = 'electronics' | 'books' | 'clothing';

interface Product {
    id: string;
    name: string;
    price: number;
    category: ProductCategory;
    inStock: boolean;
}

interface Order {
    id: string;
    userId: string;
    products: Array<{
        productId: string;
        quantity: number;
    }>;
    status: 'pending' | 'processing' | 'completed';
}

// Brakujące interfejsy do wygenerowania:
// - User (z profilem i historią zamówień)
// - Cart (z produktami i rabatami)
// - DiscountSystem (z kodami i regułami)
// - PaymentDetails
// - ShippingInfo 