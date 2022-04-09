import React, { useCallback, useEffect, useState }from 'react';
import { Button, Input } from "@chakra-ui/react";
import RecreationArea, { RecreationAreaListener } from '../../classes/RecreationArea';
import MafiaGame from '../../classes/MafiaGame';
import useConversationAreas from '../../hooks/useConversationAreas';
import ConversationArea, { ConversationAreaListener } from '../../classes/ConversationArea';
import RecreationPlayer from '../../../../services/townService/src/lib/mafia_lib/RecreationPlayer';

export enum Phase {
    'unstarted',
    'lobby',
    'day_discussion',
    'day_voting',
    'night',
    'win',
}

type RecreationAreaProps = {
    area: ConversationArea,
};

export default function StartGame({ area }: RecreationAreaProps ): JSX.Element {
    const [mafiaGameState, setMafiaGameState] = useState<Phase>(Phase.unstarted);

    let btnTxt: string;
    if (mafiaGameState === Phase.unstarted) {
        btnTxt = 'Start Game';
    } else if (mafiaGameState === Phase.lobby) {
        btnTxt = 'Join Game';
    } else {
        btnTxt = 'Spectate Game';
    }

    // if player is in a conversation area, then show a button
    // depending on the state of the mafia game in the conversation area, update button display

    const handleClick = () => {
        setMafiaGameState(Phase.lobby); // initializes the mafia game
        // add the current conversation area players to the new mafia game
        const createdGame = new MafiaGame(area.occupants.map((userName) => new RecreationPlayer(userName)));
        // modify the area to have a mafia game playing
        (area as RecreationArea).mafiaGame = createdGame;
    }

    return (
        // if player has not started game in this recreation area yet, then show "start game"
        // once start game button is clicked, then mafia overlay should show
        // otherwise show "join game" or "spectate game"
        <div>
            <Button colorScheme='teal' onClick={handleClick}>{btnTxt}</Button>
        </div>
    );
}