// ─── Auth ────────────────────────────────────────────────────────────────────

export type UserRole = 'seller' | 'buyer' | 'admin'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  storeId?: string
  avatarUrl?: string
  createdAt: string
}

export interface AuthTokens {
  accessToken: string
  expiresIn: number
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

// ─── Products ────────────────────────────────────────────────────────────────

export interface ProductVariant {
  id: string
  sku: string
  name: string
  price: number
  stock: number
  attributes: Record<string, string>
}

export interface Product {
  id: string
  storeId: string
  name: string
  description: string
  price: number
  imageUrls: string[]
  category: string
  tags: string[]
  variants: ProductVariant[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductCreateRequest {
  name: string
  description: string
  price: number
  category: string
  tags: string[]
  variants: Omit<ProductVariant, 'id'>[]
  isActive: boolean
}

export interface ProductUpdateRequest extends Partial<ProductCreateRequest> {}

export interface ProductSearchParams {
  query?: string
  category?: string
  page?: number
  limit?: number
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'PENDING'
  | 'PAYMENT_INITIATED'
  | 'PAID'
  | 'FULFILLED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED'

export interface OrderLineItem {
  id: string
  productId: string
  productName: string
  variantId: string
  variantName: string
  quantity: number
  unitPrice: number
  totalPrice: number
  imageUrl?: string
}

export interface OrderAddress {
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface Order {
  id: string
  storeId: string
  buyerEmail: string
  buyerName: string
  status: OrderStatus
  lineItems: OrderLineItem[]
  subtotal: number
  tax: number
  shippingCost: number
  total: number
  shippingAddress: OrderAddress
  stripePaymentIntentId?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface OrderListParams {
  status?: OrderStatus
  page?: number
  limit?: number
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export interface RevenueDataPoint {
  date: string
  revenue: number
  orders: number
}

export interface TopProduct {
  productId: string
  productName: string
  imageUrl?: string
  totalRevenue: number
  unitsSold: number
}

export interface ConversionFunnel {
  impressions: number
  clicks: number
  addedToCart: number
  checkoutStarted: number
  purchased: number
}

export interface AnalyticsSummary {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  conversionRate: number
  revenueChange: number
  ordersChange: number
}

export interface AnalyticsDateRange {
  from: string
  to: string
}

// ─── Settings ────────────────────────────────────────────────────────────────

export interface StoreSettings {
  storeName: string
  storeDescription: string
  logoUrl?: string
  primaryColor: string
  widgetTheme: 'light' | 'dark'
  defaultProductCount: number
  notifyOnOrder: boolean
  notifyOnLowStock: boolean
  lowStockThreshold: number
  stripeConnectAccountId?: string
  stripeConnectStatus?: 'not_connected' | 'pending' | 'active'
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// ─── API Error ───────────────────────────────────────────────────────────────

export interface ApiError {
  message: string
  code?: string
  statusCode: number
}
