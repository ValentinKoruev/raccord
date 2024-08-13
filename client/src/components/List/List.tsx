import ListElement from '@components/ListElement';
import styles from './List.module.scss';
import whatsapp from '../../assets/whatsapp.jpg';

const List = () => {

  return (
    <div className={styles.ListContainer}>
        <ListElement image={whatsapp} tooltip="Pamela's server"/>
        <ListElement image={whatsapp} tooltip="Pamela's server"/>
        <ListElement image={whatsapp} tooltip="Pamela's server"/>
    </div>
  )
}

export default List;
