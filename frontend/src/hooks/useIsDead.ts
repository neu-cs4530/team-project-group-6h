import { useContext } from 'react';
import IsDeadContext from '../contexts/IsDeadContext';

export default function useIsDead(): boolean {
  const ctx = useContext(IsDeadContext);
  return ctx;
}