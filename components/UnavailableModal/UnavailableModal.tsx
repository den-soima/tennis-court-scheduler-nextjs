import Image from 'next/image';
import { getCloseMenuIcon } from '../../lib/getImages';
import styles from './UnavailableModal.module.scss';

type Props = {
  onClose: () => void;
};

export default function UnavailableModal({ onClose }: Props) {
  return (
    <div className={styles.modal}>
      <div className={styles.container}>
        <button onClick={onClose} className={styles.buttonClose}>
          <Image src={getCloseMenuIcon()} alt="Close" width={24} height={24} />
        </button>

        <p className={styles.text}>Цей корт буде доступний незабаром!</p>
      </div>
    </div>
  );
}
