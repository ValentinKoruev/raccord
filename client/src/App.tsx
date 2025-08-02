import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MainApp from '@components/MainApp/MainApp';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <MainApp />
    </QueryClientProvider>
  );
};

export default App;
