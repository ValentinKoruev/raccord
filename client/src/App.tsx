import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GuildList from "@components/GuildList";
import BaseSidebar from "@components/BaseSidebar";
import Content from "@components/Content";
import styles from "./App.module.scss";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className={styles.AppContainer}>
        <GuildList />
        <BaseSidebar />
        <Content />
      </div>
    </QueryClientProvider>
  );
};

export default App;
