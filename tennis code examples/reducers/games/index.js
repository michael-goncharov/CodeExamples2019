import * as actionTypes from "../../constants/games";

const initialState = {
    payload: [],
    isFetching: false,
    sets: null,
    game: [],
    cards: [],
    gamesPlayer1: [],
    gamesPlayer2: [],
    idPlayer1: 0,
    idPlayer2: 0
};

export default function(state = initialState, action) {
    switch (action.type) {
        case actionTypes.GET_ALL_GAMES_SUCCESS: {
            const { payload } = action;

            return {
                ...initialState,
                isFetching: false,
                payload
            };
        }
        case actionTypes.CREATE_GAME_SUCCESS: {
            //const { payload } = action;

            return {
                ...initialState
                //payload: [payload, ...state.payload],
            };
        }
        case actionTypes.GET_GAME_BY_ID_SUCCESS: {
            const { payload } = action;

            return {
                ...state,
                isFetching: false,
                game: payload
            };
        }

        case actionTypes.GET_CARDS_BY_ID_SUCCESS: {
            const { payload } = action;
            return {
                ...state,
                isFetching: false,
                cards: payload
            };
        }
        case actionTypes.GET_PERSONAL_GAMES_SUCCESS: {
            return {
                ...state,
                isFetching: false,
                gamesPlayer1: action.payload.gamesPlayer1,
                gamesPlayer2: action.payload.gamesPlayer2,
                idPlayer1: action.payload.idPlayer1,
                idPlayer2: action.payload.idPlayer2
            };
        }

        case actionTypes.GET_SETS_BY_GAME_SUCCESS: {
            const { payload } = action;

            return {
                ...state,
                isFetching: false,
                sets: payload
            };
        }
        case actionTypes.UPDATE_GAME_SUCCESS: {
            const { payload } = action;

            return {
                ...state,
                isFetching: false,
                game: payload
            };
        }
        case actionTypes.DELETE_GAME_SUCCESS: {
            const { payload } = action;

            return {
                ...state
            };
        }
        default: {
            return state;
        }
    }
}
