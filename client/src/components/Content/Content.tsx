import { useAppSelector } from '@redux/store';
import { Variant } from '@redux/slices/content';
import Chat from '@components/Content/Chat';
import FriendList from '@components/Content/FriendList';
import styles from './Content.module.scss';

const variantMap: Record<Variant, React.ComponentType> = {
  chat: Chat,
  friends: FriendList,
};

const Content = () => {
  const variant = useAppSelector((state) => state.content.variant);

  const ContentComponent = variantMap[variant];

  return (
    <div className={styles.Content}>
      <ContentComponent />
    </div>
  );
};

export default Content;
