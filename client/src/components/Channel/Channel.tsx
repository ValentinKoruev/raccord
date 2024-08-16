import styles from './Channel.module.scss';
import VolumeHigh from '@components/shared/svgs/VolumeHigh';
import Hashtag from '@components/shared/svgs/Hasttag';

export enum ChannelType {
    text,
    voice
}

export type ChannelProps = {
    type: ChannelType,
    name: string
}

const Channel = ({type, name} : ChannelProps) => {
   
    const iconSize = "1.4em";

    const renderIcon = (type: ChannelType) => {
        switch(type) {
            case ChannelType.text: return <VolumeHigh width={iconSize} height={iconSize} /> 
            case ChannelType.voice: return <Hashtag width={iconSize} height={iconSize} />
        }
    }

    return (
        <div className={styles.Channel}>
            {renderIcon(type)}
            <div className={styles.ChannelName}>{name}</div>
            <div className={styles.OptionsMenu}>
                {/* options, create invites, chat for voice channels, etc.. */}
            </div>
        </div>
    );
}

export default Channel;