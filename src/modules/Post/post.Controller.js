const config = require("../../../config/config");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");
const { Post } = require("./post.model");
const CreatePost = catchAsync(async (req, res, next) => {
    const post = {
        title: req.body.title,
        body: req.body.body,
        createdBy: req.user._id
    }
    const result = await Post.create(post)

    res.status(201).json({
        message: 'created',
        post: result
    })
})

const getPosts = catchAsync(async (req, res, next) => {

    let isAdmin = false
    let hasNextPage = false
    let hasPrevPage = false
    const defaultValue = 1
    const limit = parseInt(req.query.limit) || parseInt(config.limit)
    const page = parseInt(req.query.page) || defaultValue
    const skip = ((page - defaultValue) * limit) || parseInt(config.skip)

    if (req.user.role == "ADMIN") {
        isAdmin = true
    }

    const posts = await Post.aggregate([
        {
            $match: {
                status: isAdmin ? { $in: ["APPROVED", "PENDING", 'REJECTED'] } : { $eq: 'APPROVED' }
            }
        }, {
            $lookup: {
                from: `users`,
                localField: 'createdBy',
                foreignField: '_id',
                as: 'createdBy',
            }
        }, {
            $unwind: { path: '$createdBy', preserveNullAndEmptyArrays: true },
        },
        {
            $lookup: {
                from: `interactions`,
                localField: '_id',
                foreignField: 'post',
                as: 'interactions',
                "pipeline": [
                    {
                        $group: {
                            _id: "$type",
                            'count': { $count: {} }
                        }
                    },
                    {
                        $replaceRoot: {
                            newRoot: {
                                $arrayToObject: [
                                    [
                                        {
                                            k: "$_id",
                                            v: "$count"
                                        }
                                    ]
                                ]
                            }
                        }
                    },
                ]
            },
        },
        {
            $skip: skip
        }, {
            $limit: limit
        }, {
            $sort: { "updatedAt": -1 }
        }
        , {
            $project: {
                'createdBy.password': 0,
                'createdBy.updatedAt': 0,
                'createdBy.createdAt': 0,
                'createdBy.__v': 0,
                '__v': 0
            }
        }

    ])

    if (!posts.length) return next(new AppError('No found ', 404))

    const total = await Post.countDocuments({

        status: isAdmin ? { $in: ["APPROVED", "PENDING", 'REJECTED'] } : { $eq: 'APPROVED' }

    })

    const totalPages = Math.ceil(total / limit)

    if (page < totalPages) { hasNextPage = true }
    if (page > defaultValue) { hasPrevPage = true }

    res.status(200).json({
        data: posts,
        total,
        page,
        limit,
        totalPages,
        hasNextPage,
        hasPrevPage


    })

})

module.exports = {
    CreatePost,
    getPosts
}


