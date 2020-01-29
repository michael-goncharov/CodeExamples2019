import { call, put } from "redux-saga/effects";
import axios from "../../utils/axios";
import { GAMES_CARDS_BASE_URL } from "../../constants/games";
import { getCardByIdSuccess } from "../../actions/games";

export default function*({ payload: GameId, UserId }) {
    try {
        const payload = yield call(() =>
            axios
                .get(`${GAMES_CARDS_BASE_URL}/${GameId}/${UserId}`)
                .then(({ data }) => data)
        );
        yield put(getCardByIdSuccess(payload));
    } catch ({ message }) {
        console.log("MESSAGE", message);
    }
}
