import { ref } from "vue"



export const useSize = () => {
    // ---state
    const _prev = { width: 0, height: 0 }
    const _target = ref(null)
    const _closed = ref(false)
    
    // ---events
    const _onResize = ref(() => { })
    
    // ---actions
    const _observe = () => {
        if (!_target.value) return
        const { width, height } = _target.value.getBoundingClientRect();
        
        if (_prev.width != width || _prev.height != height) {
            
            if (typeof _onResize.value == 'function') {
                _onResize.value({ width, height })
            }
            
            _prev.width = width
            _prev.height = height
        }

        if (!_closed.value) requestAnimationFrame(_observe)
    }
    
    const stop = () => _closed.value = true
    
    const observe = (target, cb) => {
        _onResize.value = cb
        _target.value = target
        _observe()
    }

    // ---expose
    return {
        stop,
        observe,
    };
}