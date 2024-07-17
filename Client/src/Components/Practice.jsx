import React from 'react';
import { useSwipeable } from 'react-swipeable';

const Practice = () => {
  const handlers = useSwipeable({
    onSwipedLeft: () => console.log('Swiped left!'),
    onSwipedRight: () => console.log('Swiped right!'),
    onSwipedUp: () => console.log('Swiped up!'),
    onSwipedDown: () => console.log('Swiped down!'),
  });

  return (
    <div {...handlers} style={{ width: '100vw', height: '100vh', backgroundColor: '#ccc' }}>
      Swipe in any direction
    </div>
  );
};

export default Practice;
