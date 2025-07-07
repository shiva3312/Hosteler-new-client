//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Button } from '@mantine/core';
import { useSelector, useDispatch } from 'react-redux';

import { AppDispatch, RootState } from '@/lib/store';
import { increment, decrement } from '@/lib/store/slice/counter-slice';

const Counter = () => {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch: AppDispatch = useDispatch();

  return (
    <div>
      <h2>Counter: {count}</h2>
      <Button onClick={() => dispatch(increment())}>+</Button>
      <Button onClick={() => dispatch(decrement())}>-</Button>
    </div>
  );
};

export default Counter;
