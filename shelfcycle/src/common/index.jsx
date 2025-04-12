
const domainBackend = "http://localhost:8081";

const SummaryAPI = {
  signUp: {
    url: `${domainBackend}/api/signup`,
    method: "post",
  },
  login: {
    url: `${domainBackend}/api/login`,
    method: "post",
  },
  currentUser: {
    url: `${domainBackend}/api/user-details`,
    method: "GET",
  },
  logoutUser: {
    url: `${domainBackend}/api/logout`,
    method: "GET",
  },
  updateUser: {
    url: `${domainBackend}/api/update-user`,
    method: "PUT",
  },
  googleLogin: {
    url: `${domainBackend}/api/google-auth`,
    method: "POST",
  },
  changePassword: {
    url: `${domainBackend}/api/change-password`,
    method: "POST",
  },

  // Book routes
  uploadBook: {
    url: `${domainBackend}/api/book-upload`,
    method: "POST",
  },
  getBooks: {
    url: `${domainBackend}/api/get-book`,
    method: "GET",
  },
  updateBook: {
    url: `${domainBackend}/api/book/update`,
    method: "PUT",
  },
  myUploads: {
    url: `${domainBackend}/api/my-uploads`,
    method: "GET",
  },
  deleteBook: {
    url: `${domainBackend}/api/book`,
    method: "DELETE",
  },
  wishlistFetch: {
    url: `${domainBackend}/api/wishlist`,
    method: "GET",
  },
  toggleWishlist: {
    url: `${domainBackend}/api/wishlist`,
    method: "POST",
  },

  // Chat-related routes
  getUsers: {
    url: `${domainBackend}/api/users`,
    method: "GET",
  },
  sendMessage: {
    url: `${domainBackend}/api/messages`,
    method: "POST",
  },
  getMessages: (userId) => `${domainBackend}/api/messages/${userId}`,
  getBookById: (id) => `${domainBackend}/api/book/${id}`,
  getUserById: (id) => `${domainBackend}/api/user/${id}`


};

export default SummaryAPI;
