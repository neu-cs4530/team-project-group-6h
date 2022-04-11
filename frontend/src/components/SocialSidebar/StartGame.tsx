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
    area: ConversationArea,
    hostID: string,
};

export default function StartGame({ area, hostID }: ConversationAreaProps ): JSX.Element {
    const [mafiaGameState, setMafiaGameState] = useState<Phase|undefined>(undefined);
    const allPlayers = usePlayersInTown();

    const {apiClient, sessionToken, currentTownID} = useCoveyAppState();

    const toast = useToast();

    let btnTxt = 'Start Game';
    if (mafiaGameState === Phase.lobby) {
        btnTxt = 'Join Game';
    } else if (mafiaGameState) {
        btnTxt = 'Spectate Game';
    }

    // if player is in a conversation area, then show a button
    // depending on the state of the mafia game in the conversation area, update button display

    /*
    const handleClick = () => {
        // get all the players in this area
        const playersInArea = area.occupants.map((occupant) => allPlayers.filter((player) => 
        player.id === occupant)[0]);
        
        // get the host
        const host = playersInArea.filter((player) => player.id === hostID)[0];
        
        // add the current conversation area players to the new mafia game
        const createdGame = new MafiaGame(host, playersInArea);
        // modify the area to initialize a mafia game
        (area as RecreationArea).mafiaGame = createdGame;
        // initializes the mafia game
        setMafiaGameState(createdGame.phase);
        console.log('game created');
    }
    */

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
            setMafiaGameState(Phase.lobby);
        } catch (err) {
            toast({
                title: 'Unable to create Mafia Game Lobby',
                description: err.toString(),
                status: 'error',
            })
        }
    }, [mafiaGameState, allPlayers, apiClient, sessionToken, currentTownID, toast, btnTxt, area, hostID]); 

    useEffect(() => {
        
    }, [mafiaGameState]);

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