
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
    },
    updateUser : {
        url : `${domainBackend}/api/update-user`,
        method : "POST"
    },
    uploadBook : {
        url : `${domainBackend}/api/book-upload`,
        method : "POST"
    },
    getBooks : {
        url : `${domainBackend}/api/get-book`,
        method : "GET"
    }
}

export default SummaryAPI;