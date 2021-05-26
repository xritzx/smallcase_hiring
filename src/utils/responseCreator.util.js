const responseType = {
    200: {
        httpstatus: 200,
        message: 'Successfully loaded data',
        type: 'OK',
        status: true
    },
    400: {
        httpstatus: 400,
        message: 'Bad request',
        type: 'Bad request',
        status: false,
    },
    401: {
        httpstatus: 401,
        message: 'Unauthorized',
        type: 'Unauthorized',
        status: false,
    },
    404: {
        httpstatus: 404,
        message: 'Request resource does not exist',
        type: 'Not Found',
        status: false,
    },
    422: {
        httpstatus: 422,
        message: 'Validation Error',
        type: 'Unprocessable Entity: Validation Error',
        status: false,
    },
    500: {
        httpstatus: 500,
        message: 'An unknown error occurred.',
        type: 'Server Error',
        status: false,
    },
};

class ResponseCreator {
    static generateResponse(res, code = 200, result = {}, message = '') {
        let newMessage = message;
        if (message === '') {
            newMessage = responseType[code].message;
        }
        return res.status(responseType[code].httpstatus).json({
            code,
            result,
            type: responseType[code].type,
            message: newMessage,
            status: responseType[code].status
        });
    }
}

module.exports = ResponseCreator;