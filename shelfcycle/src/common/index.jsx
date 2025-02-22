const domainBackend =  "http://localhost:8081"


const SummaryAPI = {
    signUp : {
        url : `${domainBackend}/api/signup`,
        method : "post"
    },
    login : {
        url : `${domainBackend}/api/login`,
        method : "post"
    }
}

export default SummaryAPI;