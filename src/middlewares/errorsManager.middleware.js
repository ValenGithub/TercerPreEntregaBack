import ErrorCodes from "../utils/EErrors.js";

export default (err, req, res, next) => {
    console.log(err.cause);
    switch (err.code) {

        case ErrorCodes.INVALID_TYPE:
            res.render('dataerror')
            break;
        case ErrorCodes.ROUTING_ERROR:
            res.render('dataerror')
            break;
        case ErrorCodes.DESLOGUEO_ERROR:
            res.render('dataerror')
            break;
        case ErrorCodes.AUTENTICACION_ERROR:
            res.render('dataerror')
            break;
        case ErrorCodes.ADMIN_NOAUTHORIZATION:
            res.status(401)
            break;
        case ErrorCodes.PRODUCT_ERROR:
            res.status(400)
            break;
        case ErrorCodes.CART_ERROR:
            res.status(400)
            break;
        case ErrorCodes.TICKET_ERROR:
            res.status(400)
            break;
        default:
            res.render('errorservidor');
            break;
    }
};