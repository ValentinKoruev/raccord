import classNames from 'classnames';
import apiQueries from '@queries/api';

import OptionsMenuModal from '@components/Modals/OptionsMenu';
import Profile from './sections/Profile';
import styles from '@components/Modals/OptionsMenu/OptionsMenuModal.module.scss';

const userData = {
  header: 'User Settings',
  components: {
    Profile: <Profile />,
    Theme: <div>Privacy Settings Component</div>,
  },
};

const onLogoutClick = async () => {
  await apiQueries.authQueries.logout();
  window.location.href = '/login';
};

const extraButtons = (
  <div className={styles.OptionSet}>
    <ul className={styles.OptionsList}>
      <li className={styles.OptionItem}>
        <button onClick={onLogoutClick} type="button" className={classNames(styles.OptionButton, styles.Danger)}>
          Log Out
        </button>
      </li>
    </ul>
  </div>
);

const UserOptionsMenu = () => {
  return <OptionsMenuModal initialOption="Profile" optionData={[userData]} extraButtons={extraButtons} />;
};

export default UserOptionsMenu;
