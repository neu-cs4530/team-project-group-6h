import React from 'react'
import Player from '../../classes/Player'
import RecreationArea from '../../classes/RecreationArea'


type CreateGameProps = {
    player: Player,
    recreationArea: RecreationArea,
}


const CreateGame = ({player, recreationArea}: CreateGameProps): JSX.Element => {


    
  return (
    <div>CreateGame</div>
  )
}

export default CreateGame