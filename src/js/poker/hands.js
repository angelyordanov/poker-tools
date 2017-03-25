import _ from 'lodash';

// http://www.tightpoker.com/poker_hands.html
const handStrength = [
  'AA',
  'KK',
  'QQ',
  'JJ',
  'AKs',
  'AQs',
  'TT',
  'AK',
  'AJs',
  'KQs',
  '99',
  'ATs',
  'AQ',
  'KJs',
  '88',
  'QJs',
  'KTs',
  'A9s',
  'AJ',
  'QTs',
  'KQ',
  '77',
  'JTs',
  'A8s',
  'K9s',
  'AT',
  'A5s',
  'A7s',
  'KJ',
  '66',
  'T9s',
  'A4s',
  'Q9s',
  'J9s',
  'QJ',
  'A6s',
  '55',
  'A3s',
  'K8s',
  'KT',
  '98s',
  'T8s',
  'K7s',
  'A2s',
  '87s',
  'QT',
  'Q8s',
  '44',
  'A9',
  'J8s',
  '76s',
  'JT',
  '97s',
  'K6s',
  'K5s',
  'K4s',
  'T7s',
  'Q7s',
  'K9',
  '65s',
  'T9',
  '86s',
  'A8',
  'J7s',
  '33',
  '54s',
  'Q6s',
  'K3s',
  'Q9',
  '75s',
  '22',
  'J9',
  '64s',
  'Q5s',
  'K2s',
  '96s',
  'Q3s',
  'J8',
  '98',
  'T8',
  '97',
  'A7',
  'T7',
  'Q4s',
  'Q8',
  'J5s',
  'T6',
  '75',
  'J4s',
  '74s',
  'K8',
  '86',
  '53s',
  'K7',
  '63s',
  'J6s',
  '85',
  'T6s',
  '76',
  'A6',
  'T2',
  '95s',
  '84',
  '62',
  'T5s',
  '95',
  'A5',
  'Q7',
  'T5',
  '87',
  '83',
  '65',
  'Q2s',
  '94',
  '74',
  '54',
  'A4',
  'T4',
  '82',
  '64',
  '42',
  'J7',
  '93',
  '85s',
  '73',
  '53',
  'T3',
  '63',
  'K6',
  'J6',
  '96',
  '92',
  '72',
  '52',
  'Q4',
  'K5',
  'J5',
  '43s',
  'Q3',
  '43',
  'K4',
  'J4',
  'T4s',
  'Q6',
  'Q2',
  'J3s',
  'J3',
  'T3s',
  'A3',
  'Q5',
  'J2',
  '84s',
  '82s',
  '42s',
  '93s',
  '73s',
  'K3',
  'J2s',
  '92s',
  '52s',
  'K2',
  'T2s',
  '62s',
  '32',
  'A2',
  '83s',
  '94s',
  '72s',
  '32s',
];

const cards = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

const isPair = (h) => h.length === 2 && h[0] === h[1];
const isUnsuited = (h) => h.length === 2 && h[0] !== h[1];
const isSuited = (h) => h.length === 3 && h[0] !== h[1] && h[2] === 's';

const handDistance = (h1, h2) => {
  const h1IsPair = isPair(h1);
  const h2IsPair = isPair(h2);

  if ((h1IsPair && !h2IsPair) ||
      (!h1IsPair && h2IsPair) ||
      (!h1IsPair && h1[0] !== h2[0]) || //not a dominated hands pair
      (h1.length !== h2.length) // different suit
  ) {
    throw new Error('Hand distance can be calculated for pairs or dominated non-pairs of the same suit.');
  }

  if (h1IsPair) {
    return cards.indexOf(h1[0]) - cards.indexOf(h2[0]);
  }

  return cards.indexOf(h1[1]) - cards.indexOf(h2[1]);
};

export function percentageRange(from, to) {
  const f = Math.floor(from * 1326);
  const t = Math.floor(to * 1326);
  const handsInRange = [];

  let count = 0;
  for (let i = 0; i < handStrength.length; i++) {
    const hand = handStrength[i];
    if (isPair(hand)) {
      count += 6;
    } else if (isSuited(hand)) {
      count += 4;
    } else if (isUnsuited(hand)) {
      count += 12;
    } else {
      throw new Error(hand);
    }

    if (count > t) {
      break;
    }
    if (count > f) {
      handsInRange.push(hand);
    }
  }

  return handsInRange;
}

export function describeRange(hands) {
  let pairBuckets = [];
  let suitedBuckets = {};
  let unsuitedBuckets = {};

  const reducer = (buckets, b) => {
    const adj = buckets.find((rb) =>
      handDistance(rb[rb.length - 1], b[0]) === 1 ||
        handDistance(b[b.length - 1], rb[0]) === 1
    );
    if (adj) {
      if (handDistance(adj[adj.length - 1], b[0]) === 1) {
        b.forEach((h) => adj.push(h));
      } else {
        b.reverse().forEach((h) => adj.unshift(h));
      }

      return buckets;
    }

    return [...buckets, b];
  };

  const reduceBuckets = (buckets) =>
    buckets
      .sort((b1, b2) => -1 * handDistance(b1[0], b2[0])) //stronger buckets first
      .reduce(reducer, []);

  hands.forEach((hand) => {
    if (isPair(hand)) {
      pairBuckets = reducer(pairBuckets, [hand]);
    } else if (isSuited(hand)) {
      suitedBuckets[hand[0]] = reducer(suitedBuckets[hand[0]] || [], [hand]);
    } else if (isUnsuited(hand)) {
      unsuitedBuckets[hand[0]] = reducer(unsuitedBuckets[hand[0]] || [], [hand]);
    } else {
      throw new Error(hand);
    }
  });

  pairBuckets = reduceBuckets(pairBuckets);
  suitedBuckets = _.mapValues(suitedBuckets, (buckets) => reduceBuckets(buckets));
  unsuitedBuckets = _.mapValues(unsuitedBuckets, (buckets) => reduceBuckets(buckets));

  const allBuckets = pairBuckets
    .concat(...(_.values(suitedBuckets)))
    .concat(...(_.values(unsuitedBuckets)));

  return allBuckets
    .map((b) => `${b[0]}${b.length > 1 ? '+' : ''}`)
    .join(', ');
}

export function handsSquare() {
  const handRows = [];
  for (let i = 0; i < cards.length; i++) {
    const row = [];
    for (let j = 0; j < cards.length; j++) {
      let hand;
      let suited;
      if (i < j) {
        hand = `${cards[i]}${cards[j]}s`;
        suited = true;
      } else {
        hand = `${cards[j]}${cards[i]}`;
        suited = false;
      }
      row.push({
        hand,
        suited,
        pair: i === j,
      });
    }
    handRows.push(row);
  }

  return handRows;
}
