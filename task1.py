import asyncio
import time
from typing import Callable, List, Any

# async filterMap
async def asyncFilterMap(
    theArray: List[Any], 
    theCallback: Callable[[Any], asyncio.Future], 
    debounceValue: float = 0.0
) -> List[Any]:
    resultItems = []

    for currentItem in theArray:
        startTime = time.time() # start timing for debounce
        resultValue = await theCallback(currentItem) # do the async callback

        if resultValue is not None:
            resultItems.append(resultValue) # keep the valid ones

        elapsedTime = time.time() - startTime
        if debounceValue > elapsedTime:
            await asyncio.sleep(debounceValue - elapsedTime) # add delay if too fast

    return resultItems
    
# callback, does even number checks
async def exampleCallback(theItem: int) -> Any:
    await asyncio.sleep(0.1) # pretend this takes time
    if theItem % 2 == 0:
        return theItem ** 2 # square if even
    return None # nothing if odd

