import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import styled from "styled-components";
import {
    Typography,
    Icon,
    Button,
    List,
    ListItem,
    ListItemText,
    Divider
} from "@material-ui/core";
import { unstable_Box as Box } from "@material-ui/core/Box";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";

import { getGameById, getSetsByGame } from "../../actions/games";
import { getSetByID } from "../../actions/sets";

import axios from "../../utils/axios";

import dateWithTZ from "../../utils/dateWithTZ";

import Cards from "./cards";

const ScoreField = styled(Box)`
    border: 1px solid #f44336;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60px;
    height: 60px;
    margin: 10px;
    font-size: xx-large;
    font-weight: 500;
    color: #ffffff;
`;

const SetsField = styled(Box)`
    border: 1px solid #f44336;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 180px;
    height: 60px;
    margin: 10px;
    font-size: xx-large;
    font-weight: 500;
    color: #ffffff;
`;

const StyledBtn = styled(Button)`
    width: 220px;
    margin: 5px !important;
`;

const FIRSTPALYER = 0;
const SECONDPLAYER = 1;

const dateOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric"
};

export class Game extends Component {
    state = {
        currentSet: null,
        gameId: null
    };

    componentDidMount() {
        const gameId = this.props.match.params.id;
        this.setState({ gameId });
        this.props.getGameById(gameId);
        this.props.getSetsByGame(gameId);
    }

    render() {
        const { currentSet } = this.state;

        const { game, sets, set } = this.props;

        console.log("Game from props", game);

        if (game.id && sets) {
            return (
                <Box>
                    <Typography variant="h4" align="center">
                        {game.tournament.tournament_name}
                    </Typography>
                    <Typography variant="h4" align="center">
                        {game.date &&
                            dateWithTZ(game.date).toLocaleDateString(
                                "ru",
                                dateOptions
                            )}
                    </Typography>
                    {/* <Typography variant="h6" margin="10px" align="center">
                        {game.player_1.user1_id_surname +
                            " " +
                            game.player_1.user1_id_name}{" "}
                        -{" "}
                        {game.player_2.user2_id_surname +
                            " " +
                            game.player_2.user2_id_name}
                    </Typography> */}
                    <Box
                        display="flex"
                        justifyContent="space-around"
                        margin="10px"
                    >
                        <Box>
                            <Typography
                                variant="h6"
                                margin="10px"
                                align="center"
                            >
                                {game.player_1.user1_id_surname +
                                    " " +
                                    game.player_1.user1_id_name}{" "}
                                -{" "}
                                {game.player_2.user2_id_surname +
                                    " " +
                                    game.player_2.user2_id_name}
                            </Typography>
                            <Typography
                                variant="h6"
                                margin="10px"
                                align="center"
                            >
                                ОЧКИ
                            </Typography>
                            <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                flexDirection="column"
                            >
                                {currentSet && (
                                    <Box display="flex">
                                        <Cards
                                            playerId={game.player_1.user1_id}
                                        />
                                        <Box
                                            margin="10px"
                                            marginTop="105px"
                                            align="center"
                                        >
                                            <Icon
                                                color="primary"
                                                fontSize="large"
                                                onClick={this.addScore.bind(
                                                    this,
                                                    FIRSTPALYER
                                                )}
                                                style={{ cursor: "pointer" }}
                                            >
                                                add
                                            </Icon>
                                            <ScoreField>
                                                {set.player1_score}
                                            </ScoreField>
                                            <Icon
                                                color="primary"
                                                fontSize="large"
                                                onClick={this.removeScore.bind(
                                                    this,
                                                    FIRSTPALYER
                                                )}
                                                style={{ cursor: "pointer" }}
                                            >
                                                remove
                                            </Icon>
                                        </Box>
                                        <Box
                                            margin="10px"
                                            marginTop="105px"
                                            align="center"
                                        >
                                            <Icon
                                                color="primary"
                                                fontSize="large"
                                                onClick={this.addScore.bind(
                                                    this,
                                                    SECONDPLAYER
                                                )}
                                                style={{ cursor: "pointer" }}
                                            >
                                                add
                                            </Icon>
                                            <ScoreField>
                                                {set.player2_score}
                                            </ScoreField>
                                            <Icon
                                                color="primary"
                                                fontSize="large"
                                                onClick={this.removeScore.bind(
                                                    this,
                                                    SECONDPLAYER
                                                )}
                                                style={{ cursor: "pointer" }}
                                            >
                                                remove
                                            </Icon>
                                        </Box>
                                        <Cards
                                            playerId={game.player_2.user2_id}
                                        />
                                    </Box>
                                )}
                                <List
                                    color="#ffffff"
                                    component="nav"
                                    subheader="Сеты:"
                                    style={{
                                        color: "#ffffff",
                                        display: "flex",
                                        alignItems: "center",
                                        whiteSpace: "nowrap"
                                    }}
                                >
                                    <hr
                                        style={{
                                            height: "46px",
                                            marginLeft: "16px"
                                        }}
                                    />
                                    {sets.map((el, i) => (
                                        <React.Fragment key={i}>
                                            <ListItem
                                                button
                                                selected={
                                                    this.state.selectedIndex ===
                                                    i
                                                }
                                                onClick={this.getScore.bind(
                                                    this,
                                                    el.id,
                                                    i
                                                )}
                                                align="center"
                                            >
                                                <ListItemText
                                                    primary={i + 1}
                                                    style={{ padding: "0" }}
                                                />
                                            </ListItem>
                                            <hr style={{ height: "46px" }} />
                                        </React.Fragment>
                                    ))}
                                </List>
                            </Box>
                        </Box>
                        <hr style={{ margin: "0" }} />
                        <Box display="grid" justifyContent="center">
                            <Typography
                                variant="h6"
                                margin="10px"
                                align="center"
                            >
                                СЧЕТ
                            </Typography>
                            <SetsField display="flex">{game.score}</SetsField>
                        </Box>
                    </Box>
                    <Box
                        display="flex"
                        justifyContent="center"
                        flexDirection="column"
                        alignItems="center"
                    >
                        <Link to="/tournaments">
                            <StyledBtn
                                variant="contained"
                                color="primary"
                                margin="10px"
                                width="220px"
                                onClick={this.saveResult}
                            >
                                Завершить игру
                            </StyledBtn>
                        </Link>
                        {/* <Link to="/meets">
                <StyledBtn variant="contained" color="primary">
                  Создать Встречу
                </StyledBtn>
              </Link> */}
                    </Box>
                </Box>
            );
        }
        return null;
    }

    getScore = (id, i) => {
        this.props.getSetByID(id);
        this.setState({
            currentSet: id,
            selectedIndex: i
        });
    };

    addScore = Player => {
        const { currentSet, gameId } = this.state;
        const { set } = this.props;

        if (Player) {
            if (
                (set.player2_score === 11 && set.player1_score < 10) ||
                (set.player2_score > 10 &&
                    Math.abs(set.player2_score - set.player1_score) === 2)
            ) {
                return;
            }
            axios
                .post(
                    `http://www.league-tt.com/tennis/public/api/sets-scope-user2/${currentSet}`
                )
                .then(response => {
                    if (response.status === 200) {
                        this.props.getSetByID(currentSet);
                        this.props.getGameById(gameId);
                    }
                });
        } else {
            if (
                (set.player1_score === 11 && set.player2_score < 10) ||
                (set.player1_score > 10 &&
                    Math.abs(set.player2_score - set.player1_score) === 2)
            ) {
                return;
            }
            axios
                .post(
                    `http://www.league-tt.com/tennis/public/api/sets-scope-user1/${currentSet}`
                )
                .then(response => {
                    if (response.status === 200) {
                        this.props.getSetByID(currentSet);
                        this.props.getGameById(gameId);
                    }
                });
        }
    };

    removeScore = Player => {
        const { currentSet, gameId } = this.state;
        const { set } = this.props;

        if (Player) {
            if (set.player2_score === 0) {
                return;
            }
            axios
                .post(
                    `http://www.league-tt.com/tennis/public/api/minus-scope-user2/${currentSet}`
                )
                .then(response => {
                    if (response.status === 200) {
                        this.props.getSetByID(currentSet);
                        this.props.getGameById(gameId);
                    }
                });
        } else {
            if (set.player1_score === 0) {
                return;
            }
            axios
                .post(
                    `http://www.league-tt.com/tennis/public/api/minus-scope-user1/${currentSet}`
                )
                .then(response => {
                    if (response.status === 200) {
                        this.props.getSetByID(currentSet);
                        this.props.getGameById(gameId);
                    }
                });
        }
    };
}

const mapStateToProps = state => ({
    game: state.games.game,
    sets: state.games.sets,
    set: state.sets.payload
});

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            getGameById,
            getSetsByGame,
            getSetByID
        },
        dispatch
    );

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Game)
);
