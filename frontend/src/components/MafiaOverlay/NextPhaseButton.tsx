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


  const updatePhase = useCallback(async () => {
    if (myPlayerID === mafiaGame?.host.id) {
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
    } else {
      toast({
        title: `Only the host can move to the next phase.`,
      });
    }
  }, [apiClient, sessionToken, currentTownID, toast, myPlayerID, mafiaGame?.host, gameInstanceID]);

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
