import api from "@/utils/api.util"
import { reactive } from "vue";
import { defineStore } from "pinia";



export const useThresholdStore = defineStore('threshold', () => {
    // ---state
    const thresholds = reactive([]);
    const conditions = reactive([]);

    // ---actions
    const createThreshold = async (threshold) => {
        const res = await api.post('/user/greenhouse/threshold', threshold);
        thresholds.push(res.data.threshold);
        return res;
    }

    const retrieveThreshold = async (greenhouseId) => {
        const url = `/user/greenhouse/threshold?greenhouseId=${greenhouseId}`;
        const res = await api.get(url);

        const union = [...new Map([...thresholds, ...res.data.thresholds].map(g => [g.id, g])).values()]
        thresholds.splice(0, thresholds.length);
        thresholds.push(...union);

        return res;
    }

    const updateThreshold = async (threshold) => {
        threshold.thresholdId = threshold.id
        const res = await api.patch(`/user/greenhouse/threshold`, threshold);
        
        const index = thresholds.findIndex(g => g.id == threshold.id);
        thresholds.splice(index, 1, threshold);
        
        return res;
    }

    const destroyThreshold = async (thresholdId) => {
        const res = await api.delete(`/user/greenhouse/threshold?thresholdId=${thresholdId}`);
        const index = thresholds.findIndex(g => g.id == thresholdId);
        thresholds.splice(index, 1);
        return res;
    }
    
    const createCondition = async (condition) => {
        const res = await api.post('/user/greenhouse/threshold/condition', condition);
        conditions.push(res.data.condition);
        return res;
    }

    const retrieveCondition = async (thresholdId) => {
        const url = `/user/greenhouse/threshold/condition?thresholdId=${thresholdId}`;
        const res = await api.get(url);

        const union = [...new Map([...conditions, ...res.data.conditions].map(g => [g.id, g])).values()]
        conditions.splice(0, conditions.length);
        conditions.push(...union);

        return res;
    }

    const updateCondition = async (condition) => {
        condition.conditionId = condition.id
        const res = await api.patch(`/user/greenhouse/threshold/condition`, condition);
        
        const index = conditions.findIndex(g => g.id == condition.id);
        conditions.splice(index, 1, condition);
        
        return res;
    }

    const destroyCondition = async (conditionId) => {
        const res = await api.delete(`/user/greenhouse/threshold/condition?conditionId=${conditionId}`);
        const index = conditions.findIndex(g => g.id == conditionId);
        conditions.splice(index, 1);
        return res;
    }

    // ---expose
    return {
        thresholds,
        createThreshold,
        retrieveThreshold,
        updateThreshold,
        destroyThreshold,

        conditions,
        createCondition,
        retrieveCondition,
        updateCondition,
        destroyCondition,
    }
}, { persist: true })