import Chat from '@components/Content/Chat';
import styles from './Content.module.scss';

const Content = () => {
  return (
    <div className={styles.Content}>
      <Chat title="General" />
    </div>
  );
};

export default Content;
