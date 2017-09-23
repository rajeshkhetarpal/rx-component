
import * as React from 'react'
import 'rxjs/add/observable/merge'
import 'rxjs/add/observable/of'
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/mapTo'
import 'rxjs/add/operator/scan'
import 'rxjs/add/operator/startWith'
import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'
import reactive from '../rx-component'

// This is one of the most simple examples of a "stateful" component

export const Counter = reactive(props => {

    // We have a set of events (increment, decrement) that need to result in a different value,
    // where the new value is dependent on the previous

    const increments = new Subject<void>()
    const nextIncrement = () => increments.next()

    const decrements = new Subject<void>()
    const nextDecrement = () => decrements.next()

    // We want the view to update every time a button is clicked, so this is the start of our chain
    return Observable.merge(
        // We represents increment and decrement events as the change to apply compared to the previous state,
        // For this simple Counter example, that is simply the difference to the previous value
        increments.mapTo(1),
        decrements.mapTo(-1)
    )
        // Start with a noop change to render the initial value
        .startWith(0)
        // Always combine one value and a change to produce a new value
        // The initial value will be 0
        .scan((count, change) => count + change, 0)
        // And finally map each new value to a rendered view
        .do(count => console.log('render', count))
        .map(count => (
            <div>
                <p>{count}</p>
                <button className='btn btn-primary' onClick={nextDecrement}>-</button>&nbsp;
                <button className='btn btn-primary' onClick={nextIncrement}>+</button>
            </div>
        ))
})
