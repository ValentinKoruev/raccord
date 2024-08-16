import ChevronDown from '@components/shared/svgs/ChevronDown';
import styles from './ServerSidebar.module.scss';
import Channel, { ChannelProps, ChannelType } from '@components/Channel';
import ChannelCategory from '@components/ChannelCategory';

export type ServerSidebarProps = {
    name: string,
    banner?: string,
}

const testCategory1 : Array<ChannelProps> = [
    {name: "General", type: ChannelType.text },
    {name: "Memes", type: ChannelType.text },
    {name: "Pics", type: ChannelType.text },
    {name: "Too-long-to-read-awawawaw", type: ChannelType.text },
];

const testCategory2 : Array<ChannelProps> = [
    {name: "Counting", type: ChannelType.text },
    {name: "Music", type: ChannelType.text },
]

const testCategory3 : Array<ChannelProps> = [
    {name: "General", type: ChannelType.voice },
    {name: "Wow voice chat", type: ChannelType.voice },
    {name: "Gaming", type: ChannelType.voice },
]

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
                <Channel type={ChannelType.text} name="Text Channel 1"/>
                <Channel type={ChannelType.voice} name="Voice Channel 1"/>
                <ChannelCategory name='Text Channels' channels={testCategory1}/>
                <ChannelCategory name='Veryyyyy long tittle for testing' channels={testCategory2}/>
                <ChannelCategory name='Voice Channels' channels={testCategory3}/>
            </div>
        </div>
    );
}

export default ServerSidebar;