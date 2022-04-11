import React, { useCallback, useEffect, useState }from 'react';
import { Alert, AlertIcon, Button, useToast } from "@chakra-ui/react";
import RecreationArea, { RecreationAreaListener } from '../../classes/RecreationArea';
import MafiaGame from '../../classes/MafiaGame';
import ConversationArea from '../../classes/ConversationArea';
import usePlayersInTown from '../../hooks/usePlayersInTown';
import Player from '../../classes/Player';
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
    hostID: string,
};

export default function StartGame({ area, hostID }: ConversationAreaProps ): JSX.Element {
    const [mafiaGameState, setMafiaGameState] = useState<Phase|undefined>(area.mafiaGame?._phase);
    const allPlayers = usePlayersInTown();

    const {apiClient, sessionToken, currentTownID} = useCoveyAppState();

    const toast = useToast();

    let btnTxt = 'Start Game';
    if (mafiaGameState === Phase.lobby) {
        btnTxt = 'Join Game';
    } else if (mafiaGameState) {
        btnTxt = 'Spectate Game';
    }

    const createGameLobby = useCallback(async () => {
        try {
            await apiClient.createGameLobby({
                coveyTownID: currentTownID,
                sessionToken,
                recreationAreaLabel: area.label,
                hostID,
            });
            toast({
                title: 'Mafia Game Lobby Created!',
                status: 'success',
            });
            if (!area.mafiaGame) {
                console.log('Mafia game undefined');
                console.log(`Area label: ${area.label}`);
            }
            setMafiaGameState(area.mafiaGame?._phase);
        } catch (err) {
            toast({
                title: 'Unable to create Mafia Game Lobby',
                description: err.toString(),
                status: 'error',
            })
        }
    }, [mafiaGameState, allPlayers, apiClient, sessionToken, currentTownID, toast, btnTxt, area, hostID]); 

    useEffect(() => {
        console.log('IN USE EFFECT');
        const updateListener: RecreationAreaListener = {
            onMafiaGameCreated: (game: MafiaGame) => {
                setMafiaGameState(game._phase);
            }
        };
        area.addRecListener(updateListener);
        return () => {
            area.removeListener(updateListener);
        };
    }, [setMafiaGameState, area]);

    return (
        // if player has not started game in this recreation area yet, then show "start game"
        // once start game button is clicked, then mafia overlay should show
        // otherwise show "join game" or "spectate game"
        <div>
            <Button colorScheme='teal' onClick={createGameLobby}>{btnTxt}</Button>
            <br/>
            {mafiaGameState === Phase.lobby ? `You are currently in a lobby! Host: ${hostID}` : 'Not in a game'}
        </div>
    );
}