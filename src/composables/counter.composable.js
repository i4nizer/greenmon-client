import { reactive, ref } from "vue"



export const useCounter = () => {
    // ---state
    const counter = ref(0);
    const _interval = ref(null);
    const _config = reactive({
        end: 0,
        type: "Down",
        start: 0,
        delay: 1000,
        current: 0,
    })

    // ---events
    const onCount = ref(() => {});
    const onCountEnd = ref(() => {});
    const onCountStart = ref(() => {});

    // ---actions
    const _loop = () => {
        let started = _config.current == _config.start;
        
        // increment/decrement
        _config.current =
            _config.type == "Up"
                ? ++_config.current
                : --_config.current;
        counter.value = _config.current;

        // count start event
        if (!started && typeof onCountStart.value == "function") {
            onCountStart.value(_config.current);
            started = true;
        }

        // count event
        if (typeof onCount.value == "function") {
            onCount.value(_config.current);
        }

        // stop condition
        if (_config.current != _config.end) return;

        // count end event
        if (typeof onCountEnd.value == "function") {
            onCountEnd.value(_config.current);
        }

        clearInterval(_interval.value);
    };

    /**
     * Uses interval to count.
     *
     * @param {"Up"|"Down"} type 'Up' to count up and 'Down' to count down.
     * @param {Number} start
     * @param {Number} end
     * @param {Number} delay Delay in milliseconds.
     * @param {Boolean} immediate Counts immediately.
     */
    const startCount = (start, end, type = "Down", delay = 1000, immediate = true) => {
        // initialize
        _config.end = end;
        _config.type = type;
        _config.start = start;
        _config.delay = delay;
        _config.current = start;

        // restart
        clearInterval(_interval.value)
        if (immediate) _loop();
        _interval.value = setInterval(() => _loop(), _config.delay);
    };

    const stopCount = () => {
        if (_interval.value) clearInterval(_interval.value);
    }

    // ---expose
    return {
        counter,
        onCount,
        onCountEnd,
        onCountStart,
        stopCount,
        startCount,
    };
}