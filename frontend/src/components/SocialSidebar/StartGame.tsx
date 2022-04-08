import React, { useCallback, useEffect, useState }from 'react';
import { Button } from "@chakra-ui/react";
import RecreationArea, { RecreationAreaListener } from '../../classes/RecreationArea';
import Player from '../../classes/Player';
import useRecreationAreas from '../../hooks/useRecreationAreas';
import MafiaGame from '../../../../services/townService/src/lib/mafia_lib/MafiaGame';
import useConversationAreas from '../../hooks/useConversationAreas';
import ConversationArea, { ConversationAreaListener } from '../../classes/ConversationArea';

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

    let btnTxt;
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
        // setMafiaGameState(Phase.lobby);
        console.log("Print some text");
    }

    return (
        // if player has not started game in this recreation area yet, then show "start game"
        // once start game button is clicked, then mafia overlay should show
        // otherwise show "join game" or "spectate game"
        <div>
            <Button isDisabled={false} colorScheme='teal' onClick={handleClick}>Hi</Button>
        </div>
    );
}