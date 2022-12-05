module.exports = {
    validateRegistration: (req, res, next) => {
        const { name, passOne, passTwo } = req.body

        if (name.trim().length < 1) return res.send({ error: true, message: "Name is required", data: 'badName' })
        if (passOne !== passTwo) return res.send({ error: true, message: "Passwords do not match", data: 'badPass' })
        if (passOne.trim().length < 4 || passOne.trim().length > 20 || !/\d/.test(passOne.trim())) return res.send({ error: true, message: "Password should be 4 - 20 characters long and contain at least one number", data: 'badPass' })
        next()
    },
    validateDiscussion: (req, res, next) => {
        const { title, description } = req.body;

        if ((title.trim().length < 1) || (description.trim().length < 1)) return res.send({ error: true, message: "Title and description fields are requirred", data: null })
        next()
    },
    validateComment: (req, res, next) => {
        const { text, photo, video } = req.body;

        if ((text.trim().length < 1) && (photo.trim().length < 1) && (video.trim().length < 1)) return res.send({ error: true, message: "Comment should contain content", data: null })
        next()
    },
}

