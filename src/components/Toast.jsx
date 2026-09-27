import { useEffect } from 'react';
import { useNavDispatch, useNavState } from '../navigation/NavigationContext.jsx';
import './Toast.css';

const TOAST_MS = 2600;

export default function Toast() {
  const { toast } = useNavState();
  const dispatch = useNavDispatch();

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => dispatch({ type: 'CLEAR_TOAST', id: toast.id }), TOAST_MS);
    return () => clearTimeout(timer);
  }, [toast, dispatch]);

  if (!toast) return null;
  return (
    <div className="toast" key={toast.id} role="status">
      {toast.message}
    </div>
  );
}
