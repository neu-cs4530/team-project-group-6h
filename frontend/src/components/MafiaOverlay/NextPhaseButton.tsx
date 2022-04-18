import React, { useEffect, useState }from 'react';
import { Button, useToast } from "@chakra-ui/react";
import RecreationArea, { RecreationAreaListener } from '../../classes/RecreationArea';
import MafiaGame from '../../classes/MafiaGame';
import useCoveyAppState from '../../hooks/useCoveyAppState';



type NextPhaseProps = {
    area: RecreationArea,
};

export default function NextPhaseButton({ area }: NextPhaseProps ): JSX.Element {
    const [mafiaGame, setMafiaGame] = useState<MafiaGame | undefined>(area.mafiaGame);

    const {apiClient, sessionToken, currentTownID} = useCoveyAppState();

    const toast = useToast();

    let updatePhase;
    if (mafiaGame) {
      updatePhase = (async () => {
          try {
              await apiClient.nextPhase({
                coveyTownID: currentTownID,
                sessionToken, 
                mafiaGameID: mafiaGame.id,
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
      });
    } else {
      console.log('Mafia game phase not updated');
      console.log(`Area label: ${area.label}`);
    }

    useEffect(() => {
        console.log('IN USE EFFECT');
        const updateListener: RecreationAreaListener = {
            onMafiaGameUpdated: (game: MafiaGame) => {
                console.log(`In Listener, on Mafia Game Started! Phase: ${game.phase}, HOST: ${game._host.userName}, NUM PLAYERS: ${game.players.length}`);
                setMafiaGame(game); 
            },
            
        };
        area.addRecListener(updateListener);
        return () => {
            area.removeRecListener(updateListener);
        };
    }, [mafiaGame, area]);

    return (
        <div>
            <Button colorScheme='blue' onClick={updatePhase}>Next Phase</Button>
        </div>
    );
}