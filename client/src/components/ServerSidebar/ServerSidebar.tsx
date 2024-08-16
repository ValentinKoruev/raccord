import ChevronDown from '@components/shared/svgs/ChevronDown';
import styles from './ServerSidebar.module.scss';
import Channel, { ChannelType } from '@components/Channel';

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
                <Channel type={ChannelType.text} name="General"/>
                <Channel type={ChannelType.voice} name="GeneralGeneralGeneralGeneralGeneral"/>
            </div>
        </div>
    );
}

export default ServerSidebar;