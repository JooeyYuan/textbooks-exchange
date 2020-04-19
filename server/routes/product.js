const express = require('express');
const router = express.Router();
const path = require('path');
const { Product } = require("../models/Product");
const { Comment } = require("../models/Comment");
const multer = require('multer');
const { auth } = require("../middleware/auth");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve(`${__dirname}/../../uploads`))
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.jpg' || ext !== '.png') {
            return cb(res.status(400).end('only jpg, png are allowed'), false);
        }
        cb(null, true)
    }
})

var upload = multer({ storage: storage }).single("file")
router.post("/uploadImage", auth, (req, res) => {

    upload(req, res, err => {
        if (err) {
            return res.json({ success: false, err })
        }
        return res.json({ success: true, image: res.req.file.path, fileName: res.req.file.filename })
    })

});

router.post("/uploadProduct", auth, (req, res) => {

    //save all the data we got from the client into the DB 
    const product = new Product(req.body)
    product.save((err) => {
        if (err) returnres.status(400).json({ success: false, err })
        return res.status(200).json({ success: true, product })
    })

});

router.post("/getProducts", (req, res) => {

    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};
    let term = req.body.searchTerm;

    for (let key in req.body.filters) {

        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                }
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }
    console.log(findArgs)
    if (term) {
        Product.find(findArgs)
            .find({ $text: { $search: term } })
            .populate("writer")
            .sort([[sortBy, order]])
            .skip(skip)
            .limit(limit)
            .exec((err, products) => {
                if (err) return res.status(400).json({ success: false, err })
                res.status(200).json({ success: true, products, postSize: products.length })
            })
    } else {
        Product.find(findArgs)
            .populate("writer")
            .sort([[sortBy, order]])
            .skip(skip)
            .limit(limit)
            .exec((err, products) => {
                if (err) return res.status(400).json({ success: false, err })
                res.status(200).json({ success: true, products, postSize: products.length })
            })
    }

});

router.get("/products_by_id", (req, res) => {
    let type = req.query.type
    let productIds = req.query.id

    if (type === "array") {
        let ids = req.query.id.split(',');
        productIds = [];
        productIds = ids.map(item => {
            return item
        })
    }
    //we need to find the product information that belong to product Id 
    Product.find({ '_id': { $in: productIds } })
    .populate('writer')
    .exec((err, product) => {
        if(err) return req.status(400).send(err)
        return res.status(200).send(product)
    })
});

router.put("/products_by_id", (req, res) => {
    let productId = req.query.id
    const title = req.body.title;
    const author = req.body.author;
    const professor = req.body.professor;
    const code = req.body.code;
    const isbn = req.body.ISBN;
    const description = req.body.description;
    const price = req.body.price;
    const version = req.body.version;
    const condition = req.body.condition;
    const level = req.body.level;
    const department = req.body.department;
    const category = req.body.category;
    const images = req.body.images;
    const username = req.body.username;
    const usermajor = req.body.usermajor;
    const userphone = req.body.userphone;
    const userbio = req.body.userbio;
    const useraddr = req.body.useraddr;

    Product.findByIdAndUpdate(productId, { $set: {
        title: title,
        author: author,
        professor: professor,
        code: code,
        ISBN: isbn,
        description: description,
        price: price,
        version: version,
        condition: condition,
        level: level,
        department: department,
        category: category,
        images: images,
        username: username,
        usermajor: usermajor,
        userphone: userphone,
        userbio: userbio,
        useraddr: useraddr
    } }, { new: true }, function(err, updatedPost) {
        if (err) {
            return res.status(400).send(err);
        }
        updatedPost = updatedPost.toObject();
        delete updatedPost['_id'];
        delete updatedPost['__v'];
        res.status(200).json({success:true, updatedPost})
    })
});

router.delete("/products_by_id", (req, res) => {
    let productId = req.query.id
    Product.findByIdAndRemove(productId, function(err, post) {
      if (err) {
        return res.status(400).send(err)
      }
      if (!post) {
        return res.status(422).json({
          message: 'Error! The post with the given ID is not exist.'
        });
      }
      Comment.remove({ postId: post._id }, function(err) {
        if (err) {
            return res.status(400).send(err)
        }
      });
      res.json({success: true,
        message: 'The post has been deleted successfully!'
      });
    });
  });
  
module.exports = router;