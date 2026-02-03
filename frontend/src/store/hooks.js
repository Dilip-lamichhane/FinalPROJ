import { useDispatch, useSelector } from 'react-redux';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
// These are typed wrappers around the standard Redux hooks
export const useAppDispatch = () => useDispatch();
export const useAppSelector = (selector) => useSelector(selector);