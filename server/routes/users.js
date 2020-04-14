const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { auth } = require("../middleware/auth");
const { Product } = require('../models/Product');
const { Payment } = require('../models/Payment');
const async = require('async');

router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        fullname: req.user.fullname,
        address: req.user.address,
        sex: req.user.sex,
        major: req.user.major,
        phone: req.user.phone,
        birthday: req.user.birthday,
        description: req.user.description,
        role: req.user.role,
        image: req.user.image,
        cart: req.user.cart,
        favorite: req.user.favorite,
        history: req.user.history
    });
});

router.post("/register", (req, res) => {
    const user = new User(req.body);
    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});

router.post('/facebook', (req, res) => {
    User.findOneAndUpdate({email: req.body.email}, req.body, {new: true, upsert: true}, (err, user) => {
        if (err) return res.json({ success: false, err });
        user.generateToken((err, user) => {
            if (err) return res.status(400).send(err);
            res.cookie("w_authExp", user.tokenExp);
            res
                .cookie("w_auth", user.token)
                .status(200)
                .json({
                    success: true, userId: user._id
                });
        });
    });
});

router.post("/login", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });

            

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res
                    .cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id
                    });
            });
        });
    });
});

router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});

router.get('/addToCart', auth, (req, res) => {
    User.findOne({ _id: req.user._id }, (err, userInfo) => {
        let duplicate = false;

        console.log(userInfo)

        userInfo.cart.forEach((item) => {
            if (item.id == req.query.productId) {
                duplicate = true;
            }
        })
        if (duplicate) {
            User.findOneAndUpdate(
                { _id: req.user._id, "cart.id": req.query.productId },
                { $inc: { "cart.$.quantity": 1 } },
                { new: true },
                () => {
                    if (err) return res.json({ success: false, err });
                    res.status(200).json(userInfo.cart)
                }
            )
        } else {
            User.findOneAndUpdate(
                { _id: req.user._id },
                {
                    $push: {
                        cart: {
                            id: req.query.productId,
                            quantity: 1,
                            date: Date.now()
                        }
                    }
                },
                { new: true },
                (err, userInfo) => {
                    if (err) return res.json({ success: false, err });
                    res.status(200).json(userInfo.cart)
                }
            )
        }
    })
});


router.get('/removeFromCart', auth, (req, res) => {
    User.findOneAndUpdate(
        { _id: req.user._id },
        {
            "$pull":
                { "cart": { "id": req.query._id } }
        },
        { new: true },
        (err, userInfo) => {
            let cart = userInfo.cart;
            let array = cart.map(item => {
                return item.id
            })

            Product.find({ '_id': { $in: array } })
                .populate('writer')
                .exec((err, cartDetail) => {
                    return res.status(200).json({
                        cartDetail,
                        cart
                    })
                })
        }
    )
})


router.get('/userCartInfo', auth, (req, res) => {
    User.findOne(
        { _id: req.user._id },
        (err, userInfo) => {
            let cart = userInfo.cart;
            let array = cart.map(item => {
                return item.id
            })
            Product.find({ '_id': { $in: array } })
                .populate('writer')
                .exec((err, cartDetail) => {
                    if (err) return res.status(400).send(err);
                    return res.status(200).json({ success: true, cartDetail, cart })
                })

        }
    )
})

router.post('/successPost', auth, (req, res) => {
    let post = [];
    post.push({
        images: req.body.images,
        dateOfPost: Date().toString(),
        title: req.body.title,
        id: req.body._id,
        price: req.body.price,
        author: req.body.author
    })
    User.findOneAndUpdate(
        { _id: req.user._id },
        { $push: { post: post } },
        { new: true },
        (err, user) => {
            if (err) return res.json({ success: false, err });
        }
    )
})

router.post('/successBuy', auth, (req, res) => {
    let history = [];
    let transactionData = {};
    req.body.cartDetail.forEach((item) => {
        history.push({
            dateOfPurchase: Date().toString(),
            name: item.title,
            id: item._id,
            price: item.price,
            quantity: item.quantity,
            paymentId: req.body.paymentData.paymentID
        })
    })
    transactionData.user = {
        id: req.user._id,
        fullname: req.user.fullname,
        email: req.user.email
    }
    transactionData.data = req.body.paymentData;
    transactionData.product = history

    User.findOneAndUpdate(
        { _id: req.user._id },
        { $push: { history: history }, $set: { cart: [] } },
        { new: true },
        (err, user) => {
            if (err) return res.json({ success: false, err });
            const payment = new Payment(transactionData)
            payment.save((err, doc) => {
                if (err) return res.json({ success: false, err });
                let products = [];
                doc.product.forEach(item => {
                    products.push({ id: item.id, quantity: item.quantity })
                })
                async.eachSeries(products, (item, callback) => {
                    Product.update(
                        { _id: item.id },
                        {
                            $inc: {
                                "sold": item.quantity
                            }
                        },
                        { new: false },
                        callback
                    )
                }, (err) => {
                    if (err) return res.json({ success: false, err })
                    res.status(200).json({
                        success: true,
                        cart: user.cart,
                        cartDetail: []
                    })
                })
            })
        }
    )
})

router.get('/getHistory', auth, (req, res) => {
    User.findOne(
        { _id: req.user._id },
        (err, doc) => {
            let history = doc.history;
            if (err) return res.status(400).send(err)
            return res.status(200).json({ success: true, history })
        }
    )
})

router.get('/getPost', auth, (req, res) => {
    User.findOne(
        { _id: req.user._id },
        (err, doc) => {
            let post = doc.post;
            if (err) return res.status(400).send(err)
            return res.status(200).json({ success: true, post })
        }
    )
})

router.get('/addToFavorite', auth, (req, res) => {
    User.findOne({ _id: req.user._id }, (err, userInfo) => {
        let duplicate = false;

        console.log(userInfo)

        userInfo.favorite.forEach((item) => {
            if (item.id == req.query.productId) {
                duplicate = true;
            }
        })
        if (duplicate) {
            User.findOneAndUpdate(
                { _id: req.user._id, "favorite.id": req.query.productId },
                { $inc: { "favorite.$.quantity": 1 } },
                { new: true },
                () => {
                    if (err) return res.json({ success: false, err });
                    res.status(200).json(userInfo.favorite)
                }
            )
        } else {
            User.findOneAndUpdate(
                { _id: req.user._id },
                {
                    $push: {
                        favorite: {
                            id: req.query.productId,
                            quantity: 1,
                            date: Date.now()
                        }
                    }
                },
                { new: true },
                (err, userInfo) => {
                    if (err) return res.json({ success: false, err });
                    res.status(200).json(userInfo.favorite)
                }
            )
        }
    })
});

router.get('/removeFromFavorite', auth, (req, res) => {
    User.findOneAndUpdate(
        { _id: req.user._id },
        {
            "$pull":
                { "favorite": { "id": req.query._id } }
        },
        { new: true },
        (err, userInfo) => {
            let favorite = userInfo.favorite;
            let array = favorite.map(item => {
                return item.id
            })

            Product.find({ '_id': { $in: array } })
                .populate('writer')
                .exec((err, favoriteDetail) => {
                    return res.status(200).json({
                        favoriteDetail,
                        favorite
                    })
                })
        }
    )
})

router.get('/userFavoriteInfo', auth, (req, res) => {
    User.findOne(
        { _id: req.user._id },
        (err, userInfo) => {
            let favorite = userInfo.favorite;
            let array = favorite.map(item => {
                return item.id
            })
            Product.find({ '_id': { $in: array } })
                .populate('writer')
                .exec((err, favoriteDetail) => {
                    if (err) return res.status(400).send(err);
                    return res.status(200).json({ success: true, favoriteDetail, favorite })
                })
        }
    )
})

router.get('/profile', auth, (req, res) => {
    res.status(200).json({
        email: req.user.email,
        fullname: req.user.fullname,
        address: req.user.address,
        sex: req.user.sex,
        major: req.user.major,
        phone: req.user.phone,
        birthday: req.user.birthday,
        description: req.user.description,
        image: req.user.image
    });
})

router.put('/profile', auth, (req, res) => {
    const fullname = req.body.fullname;
    const birthday = req.body.birthday;
    const sex = req.body.sex;
    const major = req.body.major;
    const phone = req.body.phone;
    const address = req.body.address;
    const description = req.body.description;
    // Get user
    const user = req.user;
    // Update user profile
    User.findByIdAndUpdate(user._id, { $set: {
        fullname: fullname,
        birthday: birthday,
        sex: sex,
        major: major,
        phone: phone,
        address: address,
        description: description,
    } }, { new: true }, function(err, updatedUser) {
        if (err) {
            return res.status(400).send(err);
        }
        // Delete unused properties: _id, password, __v
        updatedUser = updatedUser.toObject();
        delete updatedUser['_id'];
        delete updatedUser['password'];
        delete updatedUser['__v'];
        // Return updated user profile
        res.status(200).json(updatedUser)
    })
    Product.updateMany({ writer: user._id }, { $set: { username: fullname, userphone: phone, usermajor: major, userbio: description, useraddr: address }}, function(err) {
        if (err) {
            return res.status(400).send(err);
        }
    });
})

router.put('/resetpassword', auth, (req, res) => {
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const user = req.user;
    user.comparePassword(oldPassword, function(err, isMatch) {
      if (err) {
        return res.status(400).send(err);
      }
      if (!isMatch) {
        return res.status(422).send({ message: 'You old password is incorrect! Please try again.' })
      }
      if (oldPassword === newPassword) {
        return res.status(422).send({ message: 'Your new password must be different from your old password!' });
      }
      user.password = newPassword;
      user.save(function(err) {
        if (err) {
            return res.status(400).send(err);
        }
        res.json({ message: 'You have successfully updated your password.' });
      });
    });
  })

  router.get('/sendemail', auth, (req, res) => {
    const { recipient, sender, topic, text } = req.query; 
    const msg = {
        to: recipient, 
        from: sender,
        subject: topic,
        text: text,
    }
    sgMail.send(msg)
    .then((msg) => console.log(recipient));
  })

module.exports = router;