import env from "@/configs/env.config"
import { useTokenStore } from "@/stores/token.store";



class WsEvent {
    static #increment = 0;

    /**
     * @param {String} name The event name.
     * @param {Function} callback The callback function the will receive the data[].
     * @param {'Create'|'Retrieve'|'Update'|'Delete'} query Commonly 'Create' as http reqs are used for others.
     */
    constructor(name, callback, query = 'Create') {
        this.id = WsEvent.#increment++;
        this.name = name
        this.callback = callback
        this.query = query
    }
}


/**
 * @type {WebSocket} WebSocket instance.
 */
let _webSocket = null
let _connected = false
let _connecting = false
let _reconnectInterval = 5000

/**
 * @type {WsEvent[]} Holds the events made.
 */
const _onMessageEvents = []



/** Starts connecting. */
const connectWebSocket = () => {
    if (_connected || _connecting) return;
    _connecting = true

    const { accessToken } = useTokenStore()
    _webSocket = new WebSocket(`${env.webSocketUrl}?token=${accessToken}`)
    
    _webSocket.onopen = e => {
        _connected = true
        _connecting = false
        // console.log('Web Socket connected successfully.')
    }

    _webSocket.onmessage = e => {
        // console.log('Web socket received: ', e.data)
        _executeOnMessageEvent(e.data).catch(console.error)
    }

    _webSocket.onclose = e => {
        _connected = false
        _connecting = true
        // console.log('Web socket closed, reconnecting.')
        setTimeout(() => connectWebSocket(), _reconnectInterval)
    }

    _webSocket.onerror = e => {
        // console.error('Web socket error: ', e)
        _webSocket.close();
    }
}

/**
 * 
 */
const _executeOnMessageEvent = async (msg) => {
    const { event, data, query } = JSON.parse(msg)

    for (const e of _onMessageEvents) {
        if (e.name == event && e.query == query) e.callback(data)
    }
}

/**
 * @param {String} event Could be 'reading'/'log'.
 * @param {Function} callback Will receive an array of data.
 * @param {'Create'|'Retrieve'|'Update'|'Delete'} query The query sent by the ws.
 * @returns {WsEvent} The event created.
 */
const addWsEvent = (event, callback, query = 'Create') => {
    const e = new WsEvent(event, callback, query)
    _onMessageEvents.push(e)
    return e
}

/**
 * @param {WsEvent} event The event to be removed.
 */
const delWsEvent = (event) => {
    const index = _onMessageEvents.findIndex(e => e?.id == event?.id)
    if (index != -1) _onMessageEvents.splice(index, 1)
}



export {
    WsEvent,
    addWsEvent,
    delWsEvent,
    connectWebSocket,
}