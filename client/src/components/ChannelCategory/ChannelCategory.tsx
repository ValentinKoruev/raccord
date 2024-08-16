import { MouseEventHandler, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Channel, { ChannelProps } from "@components/Channel";
import styles from "./ChannelCategory.module.scss";
import ChevronDown from '@components/shared/svgs/ChevronDown';
import Plus from '@components/shared/svgs/Plus';
import ChevronRight from '@components/shared/svgs/ChevronRight';

export type ChannelCategoryProps = {
    name: string,
    channels: Array<ChannelProps>
}


const ChannelCategory = ({name, channels = []} : ChannelCategoryProps) => {
    const [channelsDropdown, useChannelsDropdown] = useState<Boolean>(true);

    const onHeaderClick : MouseEventHandler<HTMLElement> = () => {
        useChannelsDropdown(dropdown => !dropdown);
    }

    const onCreateClick : MouseEventHandler<HTMLElement> = (e) => {
        e.stopPropagation();
        console.log("Create click");
    }


    return (
        <div className={styles.ChannelCategory}>
            <div onClick={onHeaderClick} className={styles.CategoryHeader}>
                { channelsDropdown ? <ChevronDown className={styles.Dropdown}/> : <ChevronRight className={styles.Dropdown}/>}
                <div className={styles.CategoryName}>{name}</div>
                <button onClick={onCreateClick} className={styles.CreateButton}>
                    <Plus className={styles.Plus}/>
                </button>
            </div>
            {
            channelsDropdown && 
            <div className={styles.ChannelList}>
            {
                channels.map((channel) => <Channel key={uuidv4()} type={channel.type} name={channel.name}/>)
            }
            </div>
            }
        </div>
    );
}

export default ChannelCategory;