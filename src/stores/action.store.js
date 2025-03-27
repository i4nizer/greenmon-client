import api from "@/utils/api.util"
import { reactive } from "vue";
import { defineStore } from "pinia";



export const useActionStore = defineStore('action', () => {
    // ---state
    const actions = reactive([]);

    // ---actions
    const create = async (action) => {
        const res = await api.post('/user/greenhouse/action', action);
        actions.push(res.data.action);
        return res;
    }

    const retrieve = async (scheduleId = null, thresholdId = null) => {
        let url = `/user/greenhouse/action?`;
        url += scheduleId ? `scheduleId=${scheduleId}` : "";
        url += scheduleId && thresholdId ? "&" : "";
        url += thresholdId ? `thresholdId=${thresholdId}` : "";

        const res = await api.get(url);

        const union = [...new Map([...actions, ...res.data.actions].map(g => [g.id, g])).values()]
        actions.splice(0, actions.length);
        actions.push(...union);

        return res;
    }

    const update = async (action) => {
        action.actionId = action.id
        const res = await api.patch(`/user/greenhouse/action`, action);
        
        const index = actions.findIndex(g => g.id == action.id);
        actions.splice(index, 1, action);
        
        return res;
    }

    const destroy = async (actionId) => {
        const res = await api.delete(`/user/greenhouse/action?actionId=${actionId}`);
        const index = actions.findIndex(g => g.id == actionId);
        actions.splice(index, 1);
        return res;
    }

    // ---expose
    return {
        actions,
        create,
        retrieve,
        update,
        destroy,
    }
}, { persist: true })