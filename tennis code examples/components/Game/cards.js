import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import axios from "../../utils/axios";
import { getCardByIdSuccess, getGameById } from "../../actions/games/index";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import InputLabel from "@material-ui/core/InputLabel";
import { Icon } from "@material-ui/core";
import ThumbsDownIcon from "@material-ui/icons/ThumbDown";
import KeyboardArrowDown from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUp from "@material-ui/icons/KeyboardArrowUp";

const styles = {
    cards: {
        boxSizing: "content-box",
        display: "flex",
        flexDirection: "column"
    },
    yellow: {
        backgroundColor: "#fdd835",
        height: 50,
        width: 40,
        marginLeft: 15,
        marginRight: 15,
        borderRadius: 5
    },
    red: {
        backgroundColor: "#f44235",
        height: 50,
        width: 40,
        marginLeft: 15,
        marginRight: 15,
        borderRadius: 5
    },
    white: {
        backgroundColor: "#fafafa",
        height: 50,
        width: 40,
        marginLeft: 15,
        marginRight: 15,
        borderRadius: 5
    },
    number: {
        border: "none",
        paddingLeft: 15,
        lineHeight: 2.5,
        color: "black",
        fontSize: 20,
        height: 30
    },
    disqualifiedTrue: {
        color: "#f44235",
        paddingLeft: 20,
        paddingBottom: 12,
        cursor: "pointer"
    },
    disqualifiedFalse: {
        color: "#9e9e9e",
        paddingLeft: 20,
        paddingBottom: 12,
        cursor: "pointer"
    },
    remove: {
        size: "large",
        cursor: "pointer",
        marginLeft: 23
    },
    add: {
        size: "large",
        cursor: "pointer",
        marginLeft: 23
    }
};

class Cards extends Component {
    state = {
        card: null,
        disqualified: false,
        yellow_card: 0,
        red_card: 0,
        is_timeout: 0
    };

    componentDidMount() {

        axios
            .get(
                `http://www.league-tt.com/tennis/public/api/showstatisticsgame/${
                    this.props.game.id
                }/${this.props.playerId}`
            )
            .then(
                ({ data }) =>{
                    this.setState({
                        yellow_card: data.yellow_card,
                        red_card: data.red_card,
                        is_timeout: data.is_timeout,
                        disqualified: data.is_disqualified
                    })},
            );
    }

    handleCardClick = (key, i = 1) => e => {
        axios
            .post(
                `http://www.league-tt.com/tennis/public/api/addstatisticsgame/${
                    this.props.game.id
                }/${this.props.playerId}`,
                { [key]: this.state[key] + i }
            )
            .then(({ data }) => console.log("Clicked Data", data));
        this.setState(prevState => {
                return {
                    [key]: (prevState[key] === undefined) ? 1 : prevState[key] + 1
                };
        });
    };

    handleCardClickRemove = (key, i = 1) => e => {
        console.log("Clicked key", key)
        axios
            .post(
                `http://www.league-tt.com/tennis/public/api/addstatisticsgame/${
                    this.props.game.id
                }/${this.props.playerId}`,
                { [key]: this.state[key] - i }
            )
            .then(({ data }) => console.log("Data", data));
        this.setState(prevState => {
            if (prevState[key] > 0) {
                return {
                    [key]: prevState[key] - i
                };
            }
        });
    };

    handleClickDisqualified = () => {
        const confirmDialogDisqualify = window.confirm("Подтвердите действие!");
        if (confirmDialogDisqualify) {
            this.setState(
                state => {
                    return { disqualified: !state.disqualified };
                },
                () => {
                    axios
                        .post(
                            `http://www.league-tt.com/tennis/public/api/addstatisticsgame/${
                                this.props.game.id
                            }/${this.props.playerId}`,
                            {
                                is_disqualified: this.state.disqualified
                            }
                        )
                        .then(({ data }) => console.log("Data", data));
                }
            );
            console.log("Disqualified", this.state.disqualified);
        }
    };

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.cards}>
                <ThumbsDownIcon
                    className={
                        this.state.disqualified
                            ? classes.disqualifiedTrue
                            : classes.disqualifiedFalse
                    }
                    onClick={this.handleClickDisqualified}
                />
                <KeyboardArrowUp
                    className={classes.add}
                    style={{ color: "#fdd835" }}
                    onClick={this.handleCardClick("yellow_card")}
                >
                    add
                </KeyboardArrowUp>
                <div className={classes.yellow}>
                    <InputLabel
                        className={classes.number}
                        // onClick={this.handleCardClick("yellow_card")}
                    >
                        {this.state.yellow_card ? this.state.yellow_card : 0}
                    </InputLabel>
                </div>
                <KeyboardArrowDown
                    className={classes.remove}
                    style={{ color: "#fdd835" }}
                    onClick={this.handleCardClickRemove("yellow_card")}
                >
                    remove
                </KeyboardArrowDown>
                <KeyboardArrowUp
                    className={classes.add}
                    style={{ color: "#f44235" }}
                    onClick={this.handleCardClick("red_card")}
                >
                    add
                </KeyboardArrowUp>
                <div className={classes.red}>
                    <InputLabel
                        className={classes.number}
                        // onClick={this.handleCardClick("red_card")}
                    >
                        {this.state.red_card ? this.state.red_card : 0}
                    </InputLabel>
                </div>
                <KeyboardArrowDown
                    className={classes.remove}
                    style={{ color: "#f44235" }}
                    onClick={this.handleCardClickRemove("red_card")}
                >
                    remove
                </KeyboardArrowDown>
                <KeyboardArrowUp
                    className={classes.add}
                    style={{ color: "#fafafa" }}
                    onClick={this.handleCardClick("is_timeout")}
                >
                    add
                </KeyboardArrowUp>
                <div className={classes.white}>
                    <InputLabel
                        className={classes.number}
                        // onClick={this.handleCardClick("is_timeout")}
                    >
                        {this.state.is_timeout ? this.state.is_timeout : 0}
                    </InputLabel>
                </div>
                <KeyboardArrowDown
                    className={classes.remove}
                    style={{ color: "#fafafa" }}
                    onClick={this.handleCardClickRemove("is_timeout")}
                >
                    remove
                </KeyboardArrowDown>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    game: state.games.game
});

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            getCardByIdSuccess,
            getGameById
        },
        dispatch
    );

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(Cards));
