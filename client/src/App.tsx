import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Sidebar from '@components/Sidebar/Sidebar';
import Content from '@components/Content';
import styles from './App.module.scss';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className={styles.AppContainer}>
        <Sidebar />
        <Content />
      </div>
    </QueryClientProvider>
  );
};

export default App;
