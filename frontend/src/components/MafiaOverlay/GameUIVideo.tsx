import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';
import React from 'react';
import MafiaGame from '../../classes/MafiaGame';
import Participant from '../VideoCall/VideoFrontend/components/Participant/Participant';
import useParticipants from '../VideoCall/VideoFrontend/hooks/useParticipants/useParticipants';
import useVideoContext from '../VideoCall/VideoFrontend/hooks/useVideoContext/useVideoContext';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            overflowY: 'auto',
            background: 'rgb(79, 83, 85)',
            gridArea: '1 / 2 / 1 / 3',
            zIndex: 5,
            [theme.breakpoints.down('sm')]: {
                gridArea: '2 / 1 / 3 / 3',
                overflowY: 'initial',
                overflowX: 'auto',
                display: 'flex',
            },
        },
        transparentBackground: {
            background: 'transparent',
        },
        scrollContainer: {
            display: 'flex',
            justifyContent: 'center',
        },
        innerScrollContainer: {
            width: `calc(${theme.sidebarWidth}px - 3em)`,
            padding: '1.5em 0',
            [theme.breakpoints.down('sm')]: {
                width: 'auto',
                padding: `${theme.sidebarMobilePadding}px`,
                display: 'flex',
            },
        },
        gridContainer: {
            gridArea: '1 / 1 / 1 / 3',
            overflowX: 'hidden',
            overflowY: 'auto',
            [theme.breakpoints.down('sm')]: {
                gridArea: '1 / 1 / 3 / 1',
            },
        },
        gridInnerContainer: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr',
            gridAutoRows: '1fr',
            [theme.breakpoints.down('md')]: {
                gridTemplateColumns: '1fr 1fr 1fr',
            },
            [theme.breakpoints.down('sm')]: {
                gridTemplateColumns: '1fr 1fr',
            },
            [theme.breakpoints.down('xs')]: {
                gridTemplateColumns: '1fr',
            },
        },
    })
);

type GameVideoProps = {
    game: MafiaGame;
    gamePhase: string | undefined;
}

export default function GameUIVideo({ game, gamePhase }: GameVideoProps) {
    // const classes = useStyles();
    const { room } = useVideoContext();
    const { localParticipant } = room!;
    const participants = useParticipants();

    const classes = useStyles('fullwidth');

    // function participantSorter(x: ParticipantWithSlot, y: ParticipantWithSlot): number {
    //     return x.slot < y.slot ? -1 : x.slot === y.slot ? 0 : 1;
    // }

    // during the day, everyone can see each other
    // at night, only mafia can see one another
    const { mafiaPlayers } = game;
    const mafiaIds = mafiaPlayers.map((mafia) => mafia.id);

    const mafiaParticipants = participants.filter((p) => mafiaIds.includes(p.participant.identity));

    return <main
        className={clsx(
            classes.gridContainer,
            {
                [classes.transparentBackground]: true,
            },
            'participants-grid-container',
            {
                'single-column': false,
            },
        )}
    >
        <div className={classes.gridInnerContainer}>
            {/* my video */}
            <Participant
                participant={localParticipant}
                isLocalParticipant
                insideGrid
                slot={0}
            />

            {/* other players' videos */}
            {localParticipant && mafiaIds.includes(localParticipant.identity) && gamePhase === 'night' &&
                mafiaParticipants.map((mafia) => {
                    const thisPlayer = game.mafiaPlayers.find((player) => player.id === mafia.participant.identity);
                    const remoteProfile = { displayName: thisPlayer ? thisPlayer.userName : 'unknown', id: mafia.participant.identity };

                    return (mafia && mafia.participant && <Participant
                        key={mafia?.participant.identity}
                        participant={mafia?.participant}
                        profile={remoteProfile}
                        isLocalParticipant={false}
                        insideGrid
                        slot={undefined}
                    />)
                })}

            {(gamePhase === 'day_discussion' || gamePhase === 'day_voting') && participants && participants.map((p) => {

                const thisPlayer = game.players.find((player) => player.id === p.participant.identity);
                const remoteProfile = { displayName: thisPlayer ? thisPlayer.userName : 'unknown', id: p.participant.identity };


                return (<Participant
                    key={p.participant.identity}
                    participant={p.participant}
                    profile={remoteProfile}
                    isLocalParticipant={false}
                    insideGrid
                    slot={undefined}
                />)
            })
            }

        </div>
    </main>
}
