import styles from './ListElement.module.scss';

type ListElementProps = {
  image: string,
  tooltip: string
}

const ListElement = ({image, tooltip} : ListElementProps) => {

  return (
    <div className={styles.ListElement}>
      <div className={styles.IconWrapper}>
        <img className={styles.Icon} src={image} alt={tooltip}/>
        <div className={styles.TooltipContainer}>
          <div className={styles.Tooltip}>
            {tooltip}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListElement;
