import assert from 'assert';
import { useContext } from 'react';
import RecreationArea from '../classes/RecreationArea';
import RecreationAreasContext from '../contexts/RecreationAreasContext';

export default function useRecreationAreas(): RecreationArea[] {
  const ctx = useContext(RecreationAreasContext);
  assert(ctx, 'Recreation area context should be defined.');
  return ctx;
}