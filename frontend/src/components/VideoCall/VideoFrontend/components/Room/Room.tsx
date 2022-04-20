import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core';
import ChatWindow from '../ChatWindow/ChatWindow';
import ParticipantList from '../ParticipantList/ParticipantList';
import MainParticipant from '../MainParticipant/MainParticipant';
import BackgroundSelectionDialog from '../BackgroundSelectionDialog/BackgroundSelectionDialog';
import useChatContext from '../../hooks/useChatContext/useChatContext';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { Game } from 'phaser';
import MafiaGame from '../../../../../classes/MafiaGame';
import useCurrentRecreationArea from '../../../../../hooks/useCurrentRecreationArea';
import { useEffect } from 'react';
import { RecreationAreaListener } from '../../../../../classes/RecreationArea';

const useStyles = makeStyles((theme: Theme) => {
  const totalMobileSidebarHeight = `${theme.sidebarMobileHeight +
    theme.sidebarMobilePadding * 2 +
    theme.participantBorderWidth}px`;
  // return {
  //   container: {
  //     position: 'relative',
  //     height: '100%',
  //     display: 'grid',
  //     gridTemplateColumns: `1fr ${theme.sidebarWidth}px`,
  //     gridTemplateRows: '100%',
  //     [theme.breakpoints.down('sm')]: {
  //       gridTemplateColumns: `100%`,
  //       gridTemplateRows: `calc(100% - ${totalMobileSidebarHeight}) ${totalMobileSidebarHeight}`,
  //     },
  //   },
  //   rightDrawerOpen: { gridTemplateColumns: `1fr ${theme.sidebarWidth}px ${theme.rightDrawerWidth}px` },
  // };
    return {container: (props) => ({    position: 'relative',
    height: '100%',
    display: 'grid',
    gridTemplateColumns: `1fr ${theme.sidebarWidth}px`,
    gridTemplateRows: '100%',
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '100%',
      // gridTemplateRows: `1fr ${theme.sidebarMobileHeight + 26}px`,
      gridTemplateRows: `calc(100% - ${totalMobileSidebarHeight}) ${totalMobileSidebarHeight}`,
      overflow: 'auto',
    },
  }), rightDrawerOpen: { gridTemplateColumns: `1fr ${theme.sidebarWidth}px ${theme.rightDrawerWidth}px` },}
});

export default function Room() {
  const classes = useStyles();
  const { isChatWindowOpen } = useChatContext();
  const { isBackgroundSelectionOpen } = useVideoContext();
  const recArea = useCurrentRecreationArea();
  const [mafiaGame, setMafiaGame] = useState(recArea?.mafiaGame);
  const [gamePhase, setGamePhase] = useState<string | undefined>(mafiaGame?.phase);

  useEffect(() => {
    const updateListener: RecreationAreaListener = {
      onMafiaGameCreated: (game: MafiaGame) => {
        setMafiaGame(game);
        setGamePhase(game.phase);
      },
      onMafiaGameUpdated: (game: MafiaGame) => {
        setMafiaGame(game);
        setGamePhase(game.phase);
      },
      onMafiaGameStarted: (game: MafiaGame) => {
        setMafiaGame(game);
        setGamePhase(game.phase);
      },
      onMafiaGameDestroyed: () => {
        setMafiaGame(undefined);
        setGamePhase(undefined);
      },
    };

      recArea?.addRecListener(updateListener);
    return() => {
      recArea?.removeListener(updateListener);
    };

  }, [recArea, setMafiaGame])

  return (
    <div
      className={clsx(classes.container, {
        [classes.rightDrawerOpen]: isChatWindowOpen || isBackgroundSelectionOpen,
      })}
    >
      {/* <MainParticipant /> */}
      {/* if a game is going on, don't show the participant list below */}
      {mafiaGame && gamePhase !== 'lobby' ? <></> : <ParticipantList />}
      <ChatWindow />
      <BackgroundSelectionDialog />
    </div>
  );
}
