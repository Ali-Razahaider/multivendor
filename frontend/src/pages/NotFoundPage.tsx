import { Link } from 'react-router-dom';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';

const NotFoundPage = () => (
  <>
    <Header />
    <main id="main" className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">404</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">We couldn’t find that page</h1>
      <p className="mt-3 max-w-md text-slate-600">The link may be broken or the page may have moved. Try searching, or head back to the shop.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn-primary">Back to home</Link>
        <Link to="/products" className="btn-secondary">Browse products</Link>
      </div>
    </main>
    <Footer />
  </>
);

export default NotFoundPage;
