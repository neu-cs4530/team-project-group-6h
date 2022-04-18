import React, { useCallback, useEffect, useState }from 'react';
import { Button, useToast } from "@chakra-ui/react";
import RecreationArea, { RecreationAreaListener } from '../../classes/RecreationArea';
import MafiaGame from '../../classes/MafiaGame';
import useCoveyAppState from '../../hooks/useCoveyAppState';

export enum Phase {
    'lobby',
    'day_discussion',
    'day_voting',
    'night',
    'win',
}


type StartGameProps = {
    area: RecreationArea,
    myPlayerID: string,
};

export default function StartGameButton({ area, myPlayerID }: StartGameProps ): JSX.Element {
    const [mafiaGame, setMafiaGame] = useState<MafiaGame | undefined>(area.mafiaGame);

    const {apiClient, sessionToken, currentTownID} = useCoveyAppState();

    const toast = useToast();


    const startGame = useCallback(async () => {
        try {
            await apiClient.startGame({
                coveyTownID: currentTownID,
                sessionToken,
                recreationAreaLabel: area.label,
                playerStartID: myPlayerID,
            });
            toast({
                title: 'Mafia Game Started!',
                status: 'success',
            });
            if (!mafiaGame) {
                console.log('Mafia game undefined');
                console.log(`Area label: ${area.label}`);
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                toast({
                    title: 'Unable to start Mafia Game',
                    description: err.toString(),
                    status: 'error',
                });
            }
        }
    }, [apiClient, sessionToken, currentTownID, toast, area, mafiaGame, myPlayerID]); 

    useEffect(() => {
        console.log('IN USE EFFECT');
        const updateListener: RecreationAreaListener = {
            onMafiaGameStarted: (game: MafiaGame) => {
                console.log(`In Listener, on Mafia Game Started! Phase: ${game.phase}, HOST: ${game._host.userName}, NUM PLAYERS: ${game.players.length}`);
                setMafiaGame(game); 
            },
            
        };
        area.addRecListener(updateListener);
        return () => {
            area.removeRecListener(updateListener);
        };
    }, [mafiaGame, setMafiaGame, area]);

    return (
        <div>
            <Button colorScheme='blue' onClick={startGame}>Start Game</Button>
        </div>
    );
}