const bcrypt = require("bcrypt");
const session = require("express-session");
const auctionSchema = require("../schemas/auctionSchema");
const forumCommentsSchema = require("../schemas/forumCommentsSchema");
const forumDiscussionSchema = require("../schemas/forumDiscussionSchema");
const forumUserSchema = require("../schemas/forumUserSchema");



module.exports = {


    register: async (req, res) => {
        const { name, passOne } = req.body
        const userExists = await forumUserSchema.findOne({ name })
        if (userExists) return res.send({ error: true, message: "This name is allready in use", data: 'badName' })
        const hash = await bcrypt.hash(passOne, 10)
        const user = new forumUserSchema({ name, pass: hash })
        await user.save()
        req.session.name = name;
        res.send({ error: false, message: 'session established', data: user })
    },



    login: async (req, res) => {
        const { name, pass } = req.body
        // console.log('name ===', name);
        // console.log('pass ===', pass);
        const user = await forumUserSchema.findOne({ name })
        if (!user) return res.send({ error: true, message: "user not found", data: null })
        const correctPassword = await bcrypt.compare(pass, user.pass);
        if (!correctPassword) return res.send({ error: true, message: "incorrect password", data: null })
        // console.log('correctPassword ===', correctPassword);
        req.session.name = name;

        console.log('session established')
        res.send({ error: false, message: 'session established', data: user })

    },
    logout: (req, res) => {

        console.log(req)
        req.session.destroy()
        console.log('session terminated')
        res.send({ message: 'session terminated' })

    },
    updateprofile: async (req, res) => {
        const { photo, breed, color, hair } = req.body
        const name = req.session.name
        if (!name) return res.send({ error: true, message: 'you are not logged in', data: null })
        let data = {}
        if (photo !== '') data.photo = photo
        if (breed !== '') data.breed = breed
        if (color !== '') data.color = color
        if (hair !== '') data.hair = hair

        const user = await forumUserSchema.findOneAndUpdate({ name }, data, { returnDocument: "after" })
        console.log('updated')
        res.send({ error: false, message: 'data updated', data: user })

    },
    createDiscussion: async (req, res) => {
        const { author, topic, title, description, date } = req.body
        const name = req.session.name
        if (!name) return res.send({ error: true, message: 'you are not logged in', data: null })
        const discussion = new forumDiscussionSchema({ author, topic, title, description, date })
        console.log(discussion)
        await discussion.save()
        console.log('new discusssion saved')
        res.send({ error: false, message: 'new discusssion saved', data: discussion })

    },
    addMessageCounter: async (req, res) => {
        const { name } = req.body
        console.log('message counter', req.body)
        const user = await forumUserSchema.findOneAndUpdate({ name }, { $inc: { messages: 1 } }, { returnDocument: "after" })
        res.send({ error: false, message: 'message counter added', data: user })
    },
    getDiscussions: async (req, res) => {
        const { topic } = req.body
        const discussions = await forumDiscussionSchema.find({ topic: topic })
        res.send({ error: false, message: 'discussions', data: discussions })
    },
    createComment: async (req, res) => {
        const { author, discussion, inReply, text, photo, video, time, originalComment } = req.body
        const comment = new forumCommentsSchema({ author, discussion, inReply, text, photo, video, time, originalComment })
        await comment.save()
        res.send({ error: false, message: 'comment added', data: comment })
        console.log(req.body)
    },
    getComments: async (req, res) => {
        const { discussion, commentsIndex } = req.body
        // find().skip(20).limit(10)
        const comments = await forumCommentsSchema.find({ discussion: discussion }).skip(commentsIndex - 1).limit(5)

        console.log('comments=> ', comments)
        res.send({ error: false, message: 'comments', data: comments })
    },

    getUsers: async (req, res) => {
        const users = await forumUserSchema.find()
        res.send({ error: false, message: 'comments', data: users })
    },

    // checksesssion: (req, res) => {
    //     const name = req.session.name
    //     console.log(name)
    //     name ? res.send(true) : res.send(false)

    // },
    // validate: (req, res) => {
    //     const { image, title, time, price } = req.body
    //     const name = req.session.name
    //     if (!name) return res.send({ error: true, message: 'you are not logged in', data: null })
    //     res.send(({ error: false, message: null, data: { image, title, time, price } }))
    // },
    // upload: async (req, res) => {
    //     const { image, title, time, price } = req.body
    //     const name = req.session.name
    //     if (!name) return res.send({ error: true, message: 'you are not logged in', data: null })
    //     const parsedTime = Date.parse(time)
    //     const auction = new auctionSchema({ name, image, title, time: parsedTime, startPrice: price, })
    //     await auction.save()
    //     res.send(({ error: false, message: 'Auction uploaded', data: { image, title, time, startPrice: price, } }))
    // },
    // downloadAll: async (req, res) => {
    //     const name = req.session.name
    //     if (!name) return res.send({ error: true, message: 'you are not logged in', data: null })
    //     const auctions = await auctionSchema.find()
    //     res.send({ messsage: 'OK', data: auctions })
    // },
    // downloadSingle: async (req, res) => {
    //     const { id } = req.body
    //     const name = req.session.name
    //     if (!name) return res.send({ error: true, message: 'you are not logged in', data: null })
    //     const singleAuction = await auctionSchema.findOne({ _id: id })
    //     res.send({ messsage: 'OK', data: singleAuction })
    // },

    // placeBid: async (req, res) => {
    //     const { id, newPrice, bidderName } = req.body
    //     const name = req.session.name
    //     if (!name) return res.send({ error: true, message: 'you are not logged in', data: null })
    //     const auction = await auctionSchema.findOne({ _id: id })
    //     if (auction.bids.length === 0 && newPrice <= auction.startPrice) return
    //     if (auction.bids.length > 0 && newPrice <= auction.bids[auction.bids.length - 1].price) return
    //     if (Date.parse(new Date) >= auction.time) return
    //     const bid = { name: bidderName, price: newPrice }
    //     await auctionSchema.findOneAndUpdate({ _id: id }, { $push: { bids: bid } })
    //     res.send({ messsage: 'bid placed', data: null })
    // }


}
