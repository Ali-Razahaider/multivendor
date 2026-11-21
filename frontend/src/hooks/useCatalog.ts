import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadCatalog } from '../redux/actions/productActions';
import type { Product } from '../lib/product';

/** The storefront catalog, fetched once and shared across pages. */
export const useCatalog = () => {
  const dispatch = useDispatch();
  const { allProducts, catalogStatus, catalogError } = useSelector((state: any) => state.product);

  useEffect(() => {
    dispatch(loadCatalog() as any);
  }, [dispatch]);

  return {
    products: (allProducts || []) as Product[],
    loading: catalogStatus === 'idle' || catalogStatus === 'loading',
    error: catalogError as string | null,
    retry: () => dispatch(loadCatalog(true) as any),
  };
};
