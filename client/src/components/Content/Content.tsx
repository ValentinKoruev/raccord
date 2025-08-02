import Chat from '@components/Content/Chat';
import styles from './Content.module.scss';
import { useAppSelector } from 'src/redux/store';

const Content = () => {
  const contentData = useAppSelector((state) => state.content.data);

  if (contentData.variant == 'chat')
    return (
      <div className={styles.Content}>
        <Chat title={contentData.content.title} initialMessages={contentData.content.messages} />
      </div>
    );

  return <div className={styles.Content}>Loading</div>;
};

export default Content;
