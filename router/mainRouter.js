const express = require("express")
const router = express.Router()
const { validateRegistration, validateDiscussion, validateComment, validateAuction } = require("../middleware/validator")

const {
    register,
    login,
    logout,
    updateprofile,
    createDiscussion,
    addMessageCounter,
    getDiscussions,
    createComment,
    getComments,
    getUsers,
    // checksesssion,
    // validate,
    // upload,
    // downloadAll,
    // downloadSingle,
    // placeBid,
} = require("../controllers/mainController")

router.post('/register', validateRegistration, register)
router.post('/login', login)
router.post('/logout', logout)
router.post('/updateprofile', updateprofile)
router.post('/createDiscussion', validateDiscussion, createDiscussion)
router.post('/addMessageCounter', addMessageCounter)
router.post('/getDiscussions', getDiscussions)
router.post('/createComment', validateComment, createComment)
router.post('/getComments', getComments)
router.post('/getUsers', getUsers)
// router.post('/checksesssion', checksesssion)
// router.post('/validate', validateAuction, validate)
// router.post('/upload', upload)
// router.post('/downloadAll', downloadAll)
// router.post('/downloadSingle', downloadSingle)
// router.post('/placeBid', placeBid)


module.exports = router
