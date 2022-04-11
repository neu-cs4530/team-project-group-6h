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
    const [mafiaGame, setMafiaGame] = useState<MafiaGame | undefined>(area.mafiaGame);
    const allPlayers = usePlayersInTown();

    const {apiClient, sessionToken, currentTownID} = useCoveyAppState();

    const toast = useToast();

    let btnTxt = 'Start Game';
    if (mafiaGame?._phase === Phase.lobby) {
        btnTxt = 'Join Game';
    } else if (mafiaGame?._phase) {
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
            if (!mafiaGame) {
                console.log('Mafia game undefined');
                console.log(`Area label: ${area.label}`);
            }
        } catch (err) {
            toast({
                title: 'Unable to create Mafia Game Lobby',
                description: err.toString(),
                status: 'error',
            })
        }
    }, [allPlayers, apiClient, sessionToken, currentTownID, toast, btnTxt, area, hostID]); 

    useEffect(() => {
        console.log('IN USE EFFECT');
        const updateListener: RecreationAreaListener = {
            onMafiaGameCreated: (game: MafiaGame) => {
                console.log(`In Listener, on Mafia Game Created! Phase: ${game.phase}, HOST: ${game._host.userName}, NUM PLAYERS: ${game._players.length}`);
                
                setMafiaGame(game); 
            },
            onMafiaGameUpdated: (game: MafiaGame) => {
                setMafiaGame(game);
            }
        };
        area.addRecListener(updateListener);
        return () => {
            area.removeListener(updateListener);
        };
    }, [mafiaGame, setMafiaGame, area]);

    return (
        // if player has not started game in this recreation area yet, then show "start game"
        // once start game button is clicked, then mafia overlay should show
        // otherwise show "join game" or "spectate game"
        <div>
            <Button colorScheme='teal' onClick={createGameLobby}>{btnTxt}</Button>
            <br/>
            {mafiaGame?._phase === Phase.lobby ? `You are currently in a lobby! Host: ${mafiaGame._host.userName}` : 'Not in a game'}
        </div>
    );
}