import api from "@/utils/api.util"
import { reactive } from "vue";
import { defineStore } from "pinia";



export const useScheduleStore = defineStore('schedule', () => {
    // ---state
    const schedules = reactive([]);

    // ---actions
    const createSchedule = async (schedule) => {
        const res = await api.post('/user/greenhouse/schedule', schedule);
        schedules.push(res.data.schedule);
        return res;
    }

    const retrieveSchedule = async (greenhouseId) => {
        const url = `/user/greenhouse/schedule?greenhouseId=${greenhouseId}`;
        const res = await api.get(url);

        const union = [...new Map([...schedules, ...res.data.schedules].map(g => [g.id, g])).values()]
        schedules.splice(0, schedules.length);
        schedules.push(...union);

        return res;
    }

    const updateSchedule = async (schedule) => {
        schedule.scheduleId = schedule.id
        const res = await api.patch(`/user/greenhouse/schedule`, schedule);
        
        const index = schedules.findIndex(g => g.id == schedule.id);
        schedules.splice(index, 1, schedule);
        
        return res;
    }

    const destroySchedule = async (scheduleId) => {
        const res = await api.delete(`/user/greenhouse/schedule?scheduleId=${scheduleId}`);
        const index = schedules.findIndex(g => g.id == scheduleId);
        schedules.splice(index, 1);
        return res;
    }

    // ---expose
    return {
        schedules,
        createSchedule,
        retrieveSchedule,
        updateSchedule,
        destroySchedule,
    }
}, { persist: true })