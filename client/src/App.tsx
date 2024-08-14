import styles from './App.module.scss';

import List from "@components/List";
import BaseSidebar from "@components/BaseSidebar";
import Content from "@components/Content";

const App = () => {

  return (
    <div className={styles.AppContainer}>  
      <List />
      <BaseSidebar />
      <Content />
    </div>
  )
}

export default App;
