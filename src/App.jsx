import { NavigationProvider } from './navigation/NavigationContext.jsx';
import TvShell from './components/TvShell.jsx';

export default function App() {
  return (
    <NavigationProvider>
      <TvShell />
    </NavigationProvider>
  );
}
