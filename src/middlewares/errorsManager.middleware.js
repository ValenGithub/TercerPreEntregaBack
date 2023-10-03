import EErrors from "../utils/EErrors.js";

const handleError = (err, req, res, next) => {
    console.log(err.cause);
    let responseStatus = 500; 
    let responseMessage = err.message || 'Internal Server Error';
    let viewToRender = 'errorservidor';

    switch (err.code) {
        case EErrors.ROUTING_ERROR:
            responseStatus = 404;
            responseMessage = "Routing Error: The resource you're looking for couldn't be found.";
            viewToRender = 'routingerror';
            break;

        case EErrors.INVALID_TYPE:
            responseStatus = 400;
            responseMessage = "Invalid Input: The provided data type is incorrect.";
            viewToRender = 'dataerror';
            break;

        case EErrors.DATABASE_ERROR:
            responseStatus = 500;
            responseMessage = "Database Error: An error occurred while processing your request.";
            viewToRender = 'dberror';
            break;

        case EErrors.DESLOGUEO_ERROR:
            responseStatus = 401;
            responseMessage = "Logout Error: An error occurred while logging out.";
            viewToRender = 'logouterror';
            break;

        case EErrors.AUTENTICACION_ERROR:
            responseStatus = 403;
            responseMessage = "Authentication Error: You are not authorized.";
            viewToRender = 'autherror';
            break;

        case EErrors.ADMIN_NOAUTHORIZATION:
            responseStatus = 403;
            responseMessage = "Authorization Error: Admin privileges are required.";
            viewToRender = 'adminautherror';
            break;

        case EErrors.PRODUCT_ERROR:
            responseStatus = 400;
            responseMessage = "Product Error: There's an issue with the provided product data.";
            viewToRender = 'producterror';
            break;

        case EErrors.CART_ERROR:
            responseStatus = 400;
            responseMessage = "Cart Error: There's an issue with your shopping cart.";
            viewToRender = 'carterror';
            break;

        case EErrors.USER_ERROR:
            responseStatus = 400;
            responseMessage = "User Error: There's an issue with the user data.";
            viewToRender = 'usererror';
            break;

        case EErrors.TICKET_ERROR:
            responseStatus = 400;
            responseMessage = "Ticket Error: An issue occurred while processing your ticket.";
            viewToRender = 'ticketerror';
            break;

        default:
            
            break;
    }

    if (viewToRender) {
        res.status(responseStatus).render(viewToRender, { error: responseMessage });
    } else {
        res.status(responseStatus).json({ error: responseMessage });
    }
};

export default handleError;