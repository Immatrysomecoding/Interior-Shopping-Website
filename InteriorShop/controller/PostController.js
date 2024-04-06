const Post = require("../models/Post");
const env = require("dotenv").config();
// Hàm để tạo bài đăng mới
exports.createPost = async (req, res) => {
  const {
    idPost,
    idAuthor,
    avatar,
    author,
    points,
    createAt,
    postTitle,
    content,
    listImg,
    listComments,
  } = req.body;

  try {
    // Tạo một bài đăng mới
    const newPost = new Post({
      idPost: idPost,
      idAuthor: idAuthor,
      avatar: avatar,
      points: points,
      createAt: createAt,
      postTitle: postTitle,
      content: content,
      author: author,
      listImg: listImg,
      listComments: listComments,
    });

    // Lưu bài đăng vào MongoDB
    await newPost.save();

    return res.status(201).json({
      status: "success",
      message: "Bài viết đã được tạo thành công",
      data: newPost,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "fail",
      message: "Đã xảy ra lỗi trong quá trình tạo bài viết",
      error: error.message,
    });
  }
};

// Hàm để lấy danh sách các bài đăng
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find();

    return res.status(200).json({
      status: "success",
      data: posts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "fail",
      message: "Đã xảy ra lỗi trong quá trình lấy danh sách bài viết",
      error: error.message,
    });
  }
};
