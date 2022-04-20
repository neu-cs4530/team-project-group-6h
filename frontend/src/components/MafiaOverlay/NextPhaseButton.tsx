import { Button, useToast } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import MafiaGame from '../../classes/MafiaGame';
import RecreationArea, { RecreationAreaListener } from '../../classes/RecreationArea';
import useCoveyAppState from '../../hooks/useCoveyAppState';

type NextPhaseProps = {
  area: RecreationArea;
  myPlayerID: string;
  gameInstanceID: string;
};

export default function NextPhaseButton({
  area,
  myPlayerID,
  gameInstanceID,
}: NextPhaseProps): JSX.Element {
  const [mafiaGame, setMafiaGame] = useState<MafiaGame | undefined>(area.mafiaGame);

  const { apiClient, sessionToken, currentTownID } = useCoveyAppState();

  const toast = useToast();

  // let updatePhase;

  const updatePhase = useCallback(async () => {
    try {
      await apiClient.nextPhase({
        coveyTownID: currentTownID,
        sessionToken,
        mafiaGameID: gameInstanceID,
      });
      toast({
        title: 'Mafia Game Phase Updated!',
        status: 'success',
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast({
          title: 'Unable to advance Mafia Game to next phase',
          description: err.toString(),
          status: 'error',
        });
      }
    }
  }, [apiClient, sessionToken, currentTownID, toast, area, mafiaGame, myPlayerID, gameInstanceID]);

  useEffect(() => {
    const updateListener: RecreationAreaListener = {
      onMafiaGameUpdated: (game: MafiaGame) => {
        setMafiaGame(game);
      },
      onMafiaGameDestroyed: () => {
        setMafiaGame(undefined);
      },
    };
    area.addRecListener(updateListener);
    return () => {
      area.removeRecListener(updateListener);
    };
  }, [mafiaGame, area]);

  return (
    <div>
      <Button colorScheme='blue' onClick={updatePhase}>
        Next Phase
      </Button>
    </div>
  );
}
