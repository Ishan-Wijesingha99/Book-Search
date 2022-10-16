// import apollo authentication error
const { AuthenticationError } = require('apollo-server-express')
// import User model
const { User } = require('../models')
// import signToken utils method
const { signToken } = require('../utils/auth')

const resolvers = {
  Query: {
    // for GET_ME query in the frontend
    me: async (parent, args, { user }) => {
      if(user) {
        // if user exists, return the user document from the mongoDB database that has the same id as user._id
        return await User.findOne({ _id: user._id }).select('-__v -password')
      } else {
        // if user does not exist, throw an authentication error
        throw new AuthenticationError('Not logged in')
      }
    }
  },

  Mutation: {
    login: async (parent, { email, password }) => {
      // go into the mongoDB database and see if there is a document that has an email field that is the same as what is specified in args object
      const currentUser = await User.findOne({ email })

      // if currentUser does not exist, that means the email the user typed into the input bar does not exist in our database, therefore return an authentication error
      if (!currentUser) throw new AuthenticationError('Invalid email address!')
      
      // if we reach this line of code, a document which contains the email specified by the user exists in our database
      // now we check if the password the user specified is the same as the password in the document in our database
      const correctPasswordBoolean = await currentUser.isCorrectPassword(password)

      // if correctPasswordBoolean does not exist, that means the password the user specified is incorrect, therefore return an authentication error
      if (!correctPasswordBoolean) throw new AuthenticationError('Correct email but invalid password!')

      // if we get to this line of code, it means the email and password specified by the user is correct and matches what is in our database
      // therefore sign a token for this user
      const token = signToken(currentUser)

      // return an object that includes the token and currentUser
      return { token, currentUser }
    },

    addUser: async (parent, { username, email, password }) => {
      // create a document in the mongoDB database based of the username, email and password in the args object
      const newUser = await User.create({ username, email, password })
      
      // sign a token for the new user
      const token = signToken(newUser)

      // return an object that includes the token and the newUser object
      return { token, newUser }
    },

    saveBook: async (parent, { input }, { user }) => {
      // if user exists, go into the mongoDB database, find the relevant user document and update it's savedBooks field; add element to array
      if (user) return await User.findOneAndUpdate({ _id: user._id }, { $addToSet: { savedBooks: input } }, { new: true })
      
      // if user does not exist, this line will be executed, throw an authentication error
      throw new AuthenticationError('You must be logged in to save a book!')
    },

    removeBook: async (parent, { bookId }, { user }) => {
      // if user exists, go into mongoDB database, find the relevant user document and update it's savedBooks field; delete an element in array
      if (user) return await User.findOneAndUpdate({ _id: user._id }, { $pull: { savedBooks: { bookId: bookId } } }, { new: true })
      
      // if user does not exist, this line will be executed, throw an authentication error
      throw new AuthenticationError('You must be logged in to remove a book!')
    }
  }
}

// export resolvers
module.exports = resolvers