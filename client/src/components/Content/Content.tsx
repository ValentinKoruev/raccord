import Chat from '@components/Content/Chat';
import styles from './Content.module.scss';

const Content = () => {
  return (
    <div className={styles.Content}>
      <Chat />
    </div>
  );

  // return <div className={styles.Content}>Loading</div>;
};

export default Content;
