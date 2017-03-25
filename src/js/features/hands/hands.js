import { createStructuredSelector } from 'reselect';
import { handsSquare, percentageRange, describeRange } from 'js/poker/hands';

// Action Types
const SET_RANGE = 'hands/SET_RANGE';

export const NAME = 'hands';

// Reducer
export default function reducer(state, action) {
  if (state === undefined) {
    return reducer(
      { square: handsSquare() },
      setRange(10)
    );
  }

  switch (action.type) {
    case SET_RANGE: {
      const percent = action.payload.percent;
      const range = percentageRange(0, percent / 100);
      const description = describeRange(range);
      return {
        ...state,
        range,
        percent,
        description,
      };
    }

    default:
      return state;
  }
}

// Action Creators
function setRange(percent) {
  return {
    type: SET_RANGE,
    payload: {
      percent,
    }
  };
}

// Selectors
const square = (state) => state[NAME].square;
const range = (state) => state[NAME].range;
const percent = (state) => state[NAME].percent;
const description = (state) => state[NAME].description;

export const selector = createStructuredSelector({
  square,
  range,
  percent,
  description,
});

export const actionCreators = {
  setRange,
};
