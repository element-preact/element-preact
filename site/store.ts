import createStore, { IPreact } from 'ipreact'

export interface Store {
    hash: string
    document_map: Map<string, string>
}
const { dispatch, connect, getState }: IPreact<Store> = createStore()({
    hash: location.hash && location.hash.replace(/^#\/?/, '') || 'layout',
    document_map: new Map<string, string>()
})

export {
    dispatch, connect, getState
}

addEventListener('hashchange', () => dispatch(state => {
    return {
        ...state,
        hash: location.hash && location.hash.replace(/^#\/?/, '') || 'layout'
    }
}))
