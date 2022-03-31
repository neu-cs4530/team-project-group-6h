import { Box } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import ConversationArea, { ConversationAreaListener, NO_TOPIC_STRING } from '../../classes/ConversationArea';
import useConversationAreas from '../../hooks/useConversationAreas';
import PlayerName from './PlayerName';
import usePlayersInTown from '../../hooks/usePlayersInTown';

/**
 * Displays a list of "active" conversation areas, along with their occupants 
 * 
 * A conversation area is "active" if its topic is not set to the constant NO_TOPIC_STRING that is exported from the ConverationArea file
 * 
 * If there are no active conversation areas, it displays the text "No active conversation areas"
 * 
 * If there are active areas, it sorts them by label ascending, using a numeric sort with base sensitivity
 * 
 * Each conversation area is represented as a Box:
 *  With a heading (H3) `{conversationAreaLabel}: {conversationAreaTopic}`,
 *  and an unordered list of occupants.
 * 
 * Occupants are *unsorted*, appearing in the order 
 *  that they appear in the area's occupantsByID array. Each occupant is rendered by a PlayerName component,
 *  nested within a ListItem.
 * 
 * Each conversation area component must subscribe to occupant updates by registering an `onOccupantsChange` listener on 
 *  its corresponding conversation area object.
 * It must register this listener when it is mounted, and remove it when it unmounts.
 * 
 * See relevant hooks: useConversationAreas, usePlayersInTown.
 */
 type ConversationAreaProps = {
  area: ConversationArea
}

type PlayerComponentProps = {
  occupantID: string;
}

function PlayerComponent({occupantID}: PlayerComponentProps) : JSX.Element {

  const playersInTown = usePlayersInTown();
  const player = playersInTown.find((p) => (p.id === occupantID));

  if (player !== undefined) {
    return <li key={occupantID}>
      <PlayerName player={player} />
    </li>
  }
  return <></>;

}

 function ConversationAreaComponent({area} : ConversationAreaProps): JSX.Element {

  const [occupants, setOccupants] = useState<string[]>(area.occupants);

  useEffect(() => {
    function handleOnOccupantsChange(newOccupants : string[]) {
      setOccupants(Array.from(newOccupants));
    }
    const listener : ConversationAreaListener = { onOccupantsChange: handleOnOccupantsChange };
    area.addListener(listener);
    return function cleanup() {
      area.removeListener(listener);
    }
  }, [area]);

  return (
    <Box>
      <h3>
        {`${area.label}: ${area.topic}`}
      </h3>
      <ul>
        {occupants?.map((occupant: string) => (
          <PlayerComponent key={occupant} occupantID={occupant} />
        ))}
      </ul>
    </Box>);
}

export default function ConversationAreasList(): JSX.Element {

  const comparator = (a: ConversationArea, b: ConversationArea) => a.label.localeCompare(b.label, 'en', { numeric: true });
  const activeConversationAreas = useConversationAreas().filter((x) => (x.topic !== NO_TOPIC_STRING));
  if (activeConversationAreas.length === 0) {
    return <div>No active conversation areas</div>;
  }
  activeConversationAreas.sort(comparator);
  return <div>{activeConversationAreas.map((area) => <ConversationAreaComponent key={area.label} area={area}/>)}</div>;
}
