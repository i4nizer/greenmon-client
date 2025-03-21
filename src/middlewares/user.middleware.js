import { useGreenhouseStore } from "@/stores/greenhouse.store";
import { useTokenStore } from "@/stores/token.store";



/** Requires an authenticated user. */
const userBeforeEnter = async (to, from, next) => {

    // check if need token rotation
    const { rotate, expiration } = useTokenStore();
    const { accessTokenExpired, refreshTokenExpired } = expiration();

    // must reauthenticate
    if (refreshTokenExpired) {
        console.log("Your session has expired, kindly login again.")
        return next("/auth/sign-in");
    }

    // must rotate
    if (accessTokenExpired) {
        let error = null;
        await rotate().catch(err => error = err);
        
        // failed to rotate
        if (error) {
            console.log("Authentication error occurred, kindly login again.");
            return next("/auth/sign-in");
        }
    }

    // load user's greenhouses
    const { retrieve } = useGreenhouseStore()
    retrieve().catch(console.error)

    // passed all checks
    return next();
}



export { userBeforeEnter }