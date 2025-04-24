import api from "@/utils/api.util"
import { reactive } from "vue";
import { defineStore } from "pinia";



export const useActionStore = defineStore('action', () => {
    // ---state
    const actions = reactive([]);
    const triggers = reactive([]);

    // ---actions
    const createAction = async (action) => {
        const res = await api.post('/user/greenhouse/action', action);
        actions.push(res.data.action);
        return res;
    }

    const retrieveAction = async (scheduleId = null, thresholdId = null) => {
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

    const updateAction = async (action) => {
        action.actionId = action.id
        const res = await api.patch(`/user/greenhouse/action`, action);
        
        const index = actions.findIndex(g => g.id == action.id);
        actions.splice(index, 1, action);
        
        return res;
    }

    const destroyAction = async (actionId) => {
        const res = await api.delete(`/user/greenhouse/action?actionId=${actionId}`);
        const index = actions.findIndex(g => g.id == actionId);
        actions.splice(index, 1);
        return res;
    }
    
    const createTrigger = async (trigger) => {
        const res = await api.post('/user/greenhouse/action/trigger', trigger);
        triggers.push(res.data.trigger);
        return res;
    }

    const retrieveTrigger = async (actionId = null, srcActionId = null) => {
        let url = `/user/greenhouse/action/trigger?`;
        url += actionId ? `actionId=${actionId}` : "";
        url += actionId && srcActionId ? "&" : "";
        url += srcActionId ? `srcActionId=${srcActionId}` : "";

        const res = await api.get(url);

        const union = [...new Map([...triggers, ...res.data.triggers].map(g => [g.id, g])).values()]
        triggers.splice(0, triggers.length);
        triggers.push(...union);

        return res;
    }

    const updateTrigger = async (trigger) => {
        trigger.triggerId = trigger.id
        const res = await api.patch(`/user/greenhouse/action/trigger`, trigger);
        
        const index = triggers.findIndex(g => g.id == trigger.id);
        triggers.splice(index, 1, trigger);
        
        return res;
    }

    const destroyTrigger = async (triggerId) => {
        const res = await api.delete(`/user/greenhouse/action/trigger?triggerId=${triggerId}`);
        const index = triggers.findIndex(g => g.id == triggerId);
        triggers.splice(index, 1);
        return res;
    }

    // ---expose
    return {
        actions,
        createAction,
        retrieveAction,
        updateAction,
        destroyAction,

        triggers,
        createTrigger,
        retrieveTrigger,
        updateTrigger,
        destroyTrigger,
    }
}, { persist: true })