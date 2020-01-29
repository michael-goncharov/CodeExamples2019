import { takeEvery } from "redux-saga/effects";

import {
    GET_ALL_GAMES,
    CREATE_GAME,
    GET_GAME_BY_ID,
    GET_SETS_BY_GAME,
    UPDATE_GAME,
    DELETE_GAME,
    GET_CARDS_BY_ID,
    GET_PERSONAL_GAMES
} from "../../constants/games";

import getAllGames from "./getAllGames";
import createGame from "./createGame";
import getGameById from "./getGameById";

import getCardsById from "./getGameById";
import getSetsByGame from "./getSetsByGame";
import updateGame from "./updateGame";
import deleteGame from "./deleteGame";
import getPersonalGames from "./getPersonalGames";

export default function*() {
    yield takeEvery(GET_ALL_GAMES, getAllGames);
    yield takeEvery(CREATE_GAME, createGame);
    yield takeEvery(GET_GAME_BY_ID, getGameById);
    yield takeEvery(GET_CARDS_BY_ID, getCardsById);
    yield takeEvery(GET_SETS_BY_GAME, getSetsByGame);
    yield takeEvery(UPDATE_GAME, updateGame);
    yield takeEvery(DELETE_GAME, deleteGame);
    yield takeEvery(GET_PERSONAL_GAMES, getPersonalGames);
}
