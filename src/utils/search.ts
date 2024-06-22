type Booking = {
  _id: unknown;
  quantity: number;
  maxPeople: number;
  price: number;
};
function generateCombinationDFS<T extends Booking>(
  bookings: T[],
  personNum: number,
  roomNum: number,
  delta?: number,
  index = 0,
) {
  const result: T[][] = [];
  const stack: [number, T[]][] = [[0, []]];
  delta =
    delta ??
    bookings.sort((a, b) => b.maxPeople - a.maxPeople)[0].maxPeople - 1;
  const sets = bookings.map((booking) => {
    const arr: T[] = [];
    const quantity = Math.min(
      booking.quantity,
      Math.floor(personNum / booking.maxPeople),
    );
    for (let i = 0; i <= quantity; i++) {
      arr.push({ ...booking, quantity: i });
    }
    return arr;
  });

  const calTotal = (combination: T[]) => {
    let totalPerson = 0;
    let totalRoom = 0;
    for (let booking of combination) {
      totalPerson += booking.maxPeople * booking.quantity;
      totalRoom += booking.quantity;
    }
    return [totalPerson, totalRoom];
  };
  const isValid = (combination: T[]) => {
    const [totalPerson, totalRoom] = calTotal(combination);
    return totalPerson >= personNum && totalRoom === roomNum;
  };
  const isViable = (combination: T[], delta: number) => {
    const [totalPerson, totalRoom] = calTotal(combination);
    return totalPerson <= personNum + delta && totalRoom <= roomNum;
  };
  while (stack.length > 0) {
    const [currentIndex, currentCombination] = stack.pop()!;
    if (currentIndex === sets.length) {
      if (isValid(currentCombination)) {
        result.push(currentCombination.slice());
      }
      continue;
    }
    for (let value of sets[currentIndex]) {
      currentCombination.push(value);
      const combination = currentCombination.slice();
      if (isViable(combination, delta)) {
        stack.push([currentIndex + 1, combination]);
      }
      currentCombination.pop();
    }
  }
  const rs = result
    .map((combination) => ({
      combination,
      cost: combination.reduce((acc, cur) => acc + cur.price * cur.quantity, 0),
    }))
    .sort((a, b) => a.cost - b.cost)[index];
  return { cost: rs?.cost, rooms: rs?.combination.filter(C => C.quantity > 0) }
}

export { generateCombinationDFS };
