import { lazy, Suspense, useEffect, useLayoutEffect, type ReactNode } from 'react';
import { BrowserRouter, Navigate, Routes, Route, useLocation, useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import './App.css';
import Store from './redux/store.js';
import { loadUser } from './redux/actions/userActions.js';
import { loadSeller } from './redux/actions/sellerActions.js';
import ProtectedRoute from './routes/ProtectedRoute';
import ProtectedAdminRoute from './routes/ProtectedAdminRoute';
import SellerProtectedRoute from './routes/SellerProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Loader from './components/Layout/Loader';
import HomePage from './pages/HomePage';

axios.defaults.withCredentials = true;

// Every page except the home page is code-split.
const page = (load: () => Promise<{ default: React.ComponentType<any> }>) => lazy(load);

const LoginPage = page(() => import('./pages/LoginPage'));
const RegisterPage = page(() => import('./pages/RegisterPage'));
const ActivationPage = page(() => import('./pages/ActivationPage'));
const ForgotPasswordPage = page(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = page(() => import('./pages/ResetPasswordPage'));
const ProductsPage = page(() => import('./pages/ProductsPage'));
const BestSellingPage = page(() => import('./pages/BestSellingPage'));
const EventPage = page(() => import('./pages/EventPage'));
const FaqPage = page(() => import('./pages/FaqPage'));
const ProductDetailsPage = page(() => import('./pages/ProductDetailsPage'));
const ProfilePage = page(() => import('./pages/ProfilePage'));
const CheckoutPage = page(() => import('./pages/CheckoutPage'));
const PaymentPage = page(() => import('./pages/PaymentPage'));
const OrderSuccessPage = page(() => import('./pages/OrderSuccessPage'));
const OrderDetailsPage = page(() => import('./pages/OrderDetailsPage'));
const UserInbox = page(() => import('./pages/UserInbox'));
const NotFoundPage = page(() => import('./pages/NotFoundPage'));

const ShopCreatePage = page(() => import('./pages/ShopCreatePage'));
const ShopLoginPage = page(() => import('./pages/ShopLoginPage'));
const ShopPreviewPage = page(() => import('./pages/ShopPreviewPage'));
const ShopHomePage = page(() => import('./pages/ShopHomePage'));
const ShopDashboardPage = page(() => import('./pages/ShopDashboardPage'));
const ShopCreateProduct = page(() => import('./pages/ShopCreateProduct'));
const ShopAllProducts = page(() => import('./pages/ShopAllProducts'));
const ShopAllOrders = page(() => import('./pages/ShopAllOrders'));
const ShopOrderDetails = page(() => import('./pages/ShopOrderDetails'));
const ShopCreateEvent = page(() => import('./pages/ShopCreateEvent'));
const ShopAllEvents = page(() => import('./pages/ShopAllEvents'));
const ShopDiscountCodes = page(() => import('./pages/ShopDiscountCodes'));
const ShopWithdrawMoneyPage = page(() => import('./pages/ShopWithdrawMoneyPage'));
const ShopRefundsPage = page(() => import('./pages/ShopRefundsPage'));
const ShopSettingsPage = page(() => import('./pages/ShopSettingsPage'));
const ShopInboxPage = page(() => import('./pages/ShopInboxPage'));

const AdminDashboardPage = page(() => import('./pages/AdminDashboardPage'));
const AdminUsersPage = page(() => import('./pages/AdminUsersPage'));
const AdminSellersPage = page(() => import('./pages/AdminSellersPage'));
const AdminOrdersPage = page(() => import('./pages/AdminOrdersPage'));
const AdminProductsPage = page(() => import('./pages/AdminProductsPage'));
const AdminEventsPage = page(() => import('./pages/AdminEventsPage'));
const AdminWithdrawPage = page(() => import('./pages/AdminWithdrawPage'));

// Old tracking links now land on the order page, which includes the tracker.
const TrackRedirect = () => <Navigate to={`/user/order/${useParams().id}`} replace />;

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    if (hash) {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
};

const user = (el: ReactNode) => <ProtectedRoute>{el}</ProtectedRoute>;
const seller = (el: ReactNode) => <SellerProtectedRoute>{el}</SellerProtectedRoute>;
const admin = (el: ReactNode) => <ProtectedAdminRoute>{el}</ProtectedAdminRoute>;

const App = () => {
  useEffect(() => {
    Store.dispatch(loadUser() as any);
    Store.dispatch(loadSeller() as any);
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <ErrorBoundary>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/activation/:activationToken" element={<ActivationPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/best-selling" element={<BestSellingPage />} />
            <Route path="/events" element={<EventPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/product/:id" element={<ProductDetailsPage />} />

            <Route path="/profile" element={user(<ProfilePage />)} />
            <Route path="/checkout" element={user(<CheckoutPage />)} />
            <Route path="/payment" element={user(<PaymentPage />)} />
            <Route path="/order/success" element={user(<OrderSuccessPage />)} />
            <Route path="/user/order/:id" element={user(<OrderDetailsPage />)} />
            <Route path="/user/track/order/:id" element={<TrackRedirect />} />
            <Route path="/inbox" element={user(<UserInbox />)} />

            <Route path="/shop/preview/:id" element={<ShopPreviewPage />} />
            <Route path="/shop-create" element={<ShopCreatePage />} />
            <Route path="/shop-login" element={<ShopLoginPage />} />
            <Route path="/shop/:id" element={seller(<ShopHomePage />)} />
            <Route path="/dashboard" element={seller(<ShopDashboardPage />)} />
            <Route path="/dashboard-orders" element={seller(<ShopAllOrders />)} />
            <Route path="/dashboard-products" element={seller(<ShopAllProducts />)} />
            <Route path="/dashboard-create-product" element={seller(<ShopCreateProduct />)} />
            <Route path="/dashboard-events" element={seller(<ShopAllEvents />)} />
            <Route path="/dashboard-create-event" element={seller(<ShopCreateEvent />)} />
            <Route path="/dashboard-coupons" element={seller(<ShopDiscountCodes />)} />
            <Route path="/dashboard-order/:id" element={seller(<ShopOrderDetails />)} />
            <Route path="/dashboard-withdraw-money" element={seller(<ShopWithdrawMoneyPage />)} />
            <Route path="/dashboard-refunds" element={seller(<ShopRefundsPage />)} />
            <Route path="/dashboard-messages" element={seller(<ShopInboxPage />)} />
            <Route path="/settings" element={seller(<ShopSettingsPage />)} />

            <Route path="/admin/dashboard" element={admin(<AdminDashboardPage />)} />
            <Route path="/admin/users" element={admin(<AdminUsersPage />)} />
            <Route path="/admin/sellers" element={admin(<AdminSellersPage />)} />
            <Route path="/admin/orders" element={admin(<AdminOrdersPage />)} />
            <Route path="/admin/products" element={admin(<AdminProductsPage />)} />
            <Route path="/admin/events" element={admin(<AdminEventsPage />)} />
            <Route path="/admin/withdraw" element={admin(<AdminWithdrawPage />)} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
      <ToastContainer position="bottom-center" autoClose={3500} newestOnTop pauseOnFocusLoss={false} theme="dark" limit={3} />
    </BrowserRouter>
  );
};

export default App;
