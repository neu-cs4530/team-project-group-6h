import { useContext } from 'react';
import RecreationArea from '../classes/RecreationArea';
import CurrentRecreationAreaContext from '../contexts/CurrentRecreationAreaContext';

export default function useCurrentRecreationArea(): RecreationArea | undefined {
  const ctx = useContext(CurrentRecreationAreaContext);
  return ctx;
}