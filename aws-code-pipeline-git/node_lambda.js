
// exports.handler = async function(event, context, callback) {
//    let arrItems = [4,5,6,8,9,10,35,70,80,31];
//    function countevennumbers (items) {
//       return new Promise(resolve => {
//          setTimeout(() => {
//             let a = 0;
//             for (var i in items) {
//                if (items[i] % 2 == 0) {
//                   a++;
//                } 
//             }
//             resolve(a);
//          }, 2000);
//       });
//    }
//    let evennumber = await countevennumbers(arrItems);
//    callback(null,'even numbers equals ='+evennumber);
// };



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

