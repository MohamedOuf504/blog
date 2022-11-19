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
                    {
                        $project: {
                            "interactions": {
                                "$arrayToObject": {
                                    "$map": {
                                        "input": "$interactions",
                                        "as": "el",
                                        "in": {
                                            "k": "$$el._id",
                                            "v": "$$el"
                                        }
                                    }
                                }
                            }}
                    }
                    

                ]
            },
        },
        {
            $skip: 0
        }, {
            $limit: 100
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


    res.send(posts)

})

module.exports = {
    CreatePost,
    getPosts
}