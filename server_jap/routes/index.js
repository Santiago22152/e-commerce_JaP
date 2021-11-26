const express = require("express");
const router = express.Router();



router.get("/", (req,res) => {
   res.send('Conexión ok')
});

const cart = ( __dirname + '/data/cart/654.json')
router.get("/cart", (req,res) => {
    res.sendFile(cart);
 });

const categories = ( __dirname + '/data/category/all.json')
router.get("/categories", (req,res) => {
    res.sendFile(categories);
 });

const categories_info = ( __dirname + '/data/category/1234.json')
router.get("/categories_info", (req,res) => {
    res.sendFile(categories_info);
 });
 
const publish = ( __dirname + '/data/product/publish.json')
router.get("/publish", (req,res) => {
    res.sendFile(publish);
 });

const product_info = ( __dirname + '/data/product/5678.json')
router.get("/product_info", (req,res) => {
    res.sendFile(product_info);
 });

const products = ( __dirname + '/data/product/all.json')
router.get("/products", (req,res) => {
    res.sendFile(products);
 });

const comments = ( __dirname + '/data/product/5678-comments.json')
router.get("/comments", (req,res) => {
    res.sendFile(comments);
 });

const cart_info = ( __dirname + '/data/cart/987.json')
router.get("/cart_info", (req,res) => {
    res.sendFile(cart_info);
 });
 
const cart_buy = ( __dirname + '/data/cart/buy.json')
router.get("/cart_buy", (req,res) => {
    res.sendFile(cart_buy);
 });



module.exports = router;
