import { RouterProvider } from 'react-router-dom';
import router from '@/router/router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from '@/components/common/Toast/Toast';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Toast />
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

export default App;
