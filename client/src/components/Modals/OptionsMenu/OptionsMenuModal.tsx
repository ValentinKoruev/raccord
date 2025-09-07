import { FC, ReactNode, useState } from 'react';
import classNames from 'classnames';
import { useAppDispatch } from '@redux/store';
import { closeModal } from '@redux/slices/modalSlice';

import Icon from '@components/UI/Icon';
import styles from './OptionsMenuModal.module.scss';

export type OptionSet = {
  header: string;
  components: Record<string, ReactNode>;
};

interface IOptionsMenuModalProps {
  initialOption: string;
  optionData: OptionSet[];
  extraButtons?: ReactNode;
}

const OptionsMenuModal: FC<IOptionsMenuModalProps> = ({ initialOption, optionData, extraButtons }) => {
  const dispatch = useAppDispatch();
  const [currentOption, setCurrentOption] = useState(initialOption);

  const onCloseClick = () => {
    dispatch(closeModal());
  };

  const onOptionClick = (optionName: string) => () => {
    setCurrentOption(optionName);
  };

  return (
    <div className={styles.OptionsMenuContainer}>
      <aside className={styles.OptionsAside}>
        <div className={styles.OptionsListContainer}>
          {optionData.map((set) => (
            <div className={styles.OptionSet} key={set.header}>
              <h2 className={styles.OptionsHeader}>{set.header}</h2>
              <ul className={styles.OptionsList}>
                {Object.entries(set.components).map(([optionName]) => (
                  <li key={optionName} className={styles.OptionItem}>
                    <button
                      onClick={onOptionClick(optionName)}
                      type="button"
                      className={classNames(styles.OptionButton, currentOption === optionName && styles.Active)}
                    >
                      {optionName}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {extraButtons}
        </div>
      </aside>
      <section className={styles.OptionsContentContainer}>
        <div className={styles.OptionsContent}>
          {optionData.map((set) => set.components).reduce((acc, comp) => ({ ...acc, ...comp }), {})[currentOption]}
        </div>
        <div>
          <button onClick={onCloseClick} type="button" className={styles.CloseButton}>
            <Icon name="x-mark" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default OptionsMenuModal;
