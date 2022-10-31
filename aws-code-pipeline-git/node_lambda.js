exports.handler = async (event) =>
{
    const min=1;
    const max=6;
    
    const ramdomNumber = Math.floor(
        Math.random() * (max-min +1)
    )+min;
    const message = 'This is a Random Number ' + ramdomNumber;
    
    return message;
}

// exports.handler = async (event) => {     
//     const response = {
//         statusCode: 200,
//         body: JSON.stringify('Hello from Lambda!'),
//     };
//     return response;
// };