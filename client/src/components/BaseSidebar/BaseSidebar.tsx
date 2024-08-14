import ServerSidebar from '@components/ServerSidebar';
import styles from './BaseSidebar.module.scss';
import banner from '../../assets/banner.png';

const BaseSidebar = () => {
    return (
        <div className={styles.BaseSidebar}>
            <ServerSidebar name="Pamela's server" banner={banner}/>
            {/* Profile comms and additional stuff componnet here */}
        </div>
    );
}

export default BaseSidebar;