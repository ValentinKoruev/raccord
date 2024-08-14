import ChevronDown from '@components/shared/ChevronDown';
import styles from './ServerSidebar.module.scss';

export type ServerSidebarProps = {
    name: string,
    banner?: string,

}

const ServerSidebar = ({name, banner} : ServerSidebarProps) => {


    return (
        <div className={styles.ServerSidebar}>
            <div className={styles.ServerHeader}>
                <div className={`${styles.ServerInfo} ${banner ? '' : styles.Base}`}>
                    <div className={styles.ServerName}>{name}</div>
                    <ChevronDown fill='inherit' width='0.8em' height='0.8em'/>
                </div>
                {
                    banner &&
                    <div className={styles.ServerBannerWrapper}>
                        <img className={styles.ServerBanner} src={banner} alt={`${name} (banner)`} />
                    </div>
                }
            </div>
            { banner && <div className={styles.BannerWhitespace} aria-label='hidden' /> /* whitespace for banner */ } 
            <div className={styles.ChannelsContainer}>
                
            </div>
        </div>
    );
}

export default ServerSidebar;