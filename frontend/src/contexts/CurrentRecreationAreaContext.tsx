import React from 'react';
import RecreationArea from '../classes/RecreationArea';
/**
 * Hint: You will never need to use this directly. Instead, use the
 * `useCoveyAppState` hook.
 */
const Context = React.createContext<RecreationArea | undefined>(undefined);

export default Context;