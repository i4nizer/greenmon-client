import { useTokenStore } from "@/stores/token.store"



/** Requires user to be not authenticated. */
const authBeforeEnter = async (to, from, next) => {

    // check if there are tokens
    const { expiration } = useTokenStore();
    const { refreshTokenExpired } = expiration();

    // already authenticated
    if (!refreshTokenExpired) return next("/user")

    // passed all checks
    return next();
}



export { authBeforeEnter }