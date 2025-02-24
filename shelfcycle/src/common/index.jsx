
const domainBackend =  "http://localhost:8081"


const SummaryAPI = {
    signUp : {
        url : `${domainBackend}/api/signup`,
        method : "post"
    },
    login : {
        url : `${domainBackend}/api/login`,
        method : "post"
    },
    currentUser : {
        url : `${domainBackend}/api/user-details`,
        method : "GET"
    },
    logoutUser : {
        url : `${domainBackend}/api/logout`,
        method : "GET"
    }
}

export default SummaryAPI;