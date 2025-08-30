import { useAppSelector } from '@redux/store';
import { ReactNode } from 'react';

type OwnerOnlyProps = {
  ownerId: string;
  children: ReactNode;
};

const OwnerOnly: React.FC<OwnerOnlyProps> = ({ ownerId, children }) => {
  const isOwner = useAppSelector((state) => state.auth.user?.userId === ownerId);
  if (!isOwner) return null;
  return <>{children}</>;
};

export default OwnerOnly;
