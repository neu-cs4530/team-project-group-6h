import React, { useCallback }from 'react';
import { Button, useToast } from "@chakra-ui/react";
import RecreationArea from '../../classes/RecreationArea';
import useCoveyAppState from '../../hooks/useCoveyAppState';

export enum Phase {
    'lobby',
    'day_discussion',
    'day_voting',
    'night',
    'win',
}

type ConversationAreaProps = {
    area: RecreationArea,
    myPlayerID: string,
};

export default function CreateGameButton({ area, myPlayerID }: ConversationAreaProps ): JSX.Element {

    const {apiClient, sessionToken, currentTownID} = useCoveyAppState();

    const toast = useToast();


    const createGameLobby = useCallback(async () => {
        try {
            await apiClient.createGameLobby({
                coveyTownID: currentTownID,
                sessionToken,
                recreationAreaLabel: area.label,
                hostID: myPlayerID,
            });
            toast({
                title: 'Mafia Game Lobby Created!',
                status: 'success',
            });
        } catch (err: unknown) {
            if (err instanceof Error) {
                toast({
                    title: 'Unable to create Mafia Game Lobby',
                    description: err.toString(),
                    status: 'error',
                })
            }
        }
    }, [apiClient, sessionToken, currentTownID, toast, area, myPlayerID]); 

    return (
        // if player has not started game in this recreation area yet, then show "start game"
        // once start game button is clicked, then mafia overlay should show
        // otherwise show "join game" or "spectate game"
        <div>
            <Button colorScheme='teal' onClick={createGameLobby}>Create Game</Button>
        </div>
    );
}