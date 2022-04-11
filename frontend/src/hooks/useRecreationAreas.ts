import assert from 'assert';
import { useContext } from 'react';
import RecreationArea from '../classes/ConversationArea';
import RecreationAreasContext from '../contexts/ConversationAreasContext';

export default function useRecreationAreas(): RecreationArea[] {
  const ctx = useContext(RecreationAreasContext);
  assert(ctx, 'Recreation area context should be defined.');
  return ctx;
}