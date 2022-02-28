// module.exports = (err, req, res, next) => {
//     res.status(500).send('something failed. ')
// }

module.exports = function (handler) {
    return async (req, res, next) => {
        try{
            await handler(req, res)
        }catch(err){
            console.log(err)
            res.status(500).send('something failed. ');
            next()
        }
    }
}