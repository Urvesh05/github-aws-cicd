exports.handler = async function(event, context, callback) {
   let arrItems = [4,5,6,8,9,10,35,70,80,31];
   function countevennumbers (items) {
      return new Promise(resolve => {
         setTimeout(() => {
            let a = 0;
            for (var i in items) {
               if (items[i] % 2 == 0) {
                  a++;
               } 
            }
            resolve(a);
         }, 2000);
      });
   }
   let evennumber = await countevennumbers(arrItems);
   callback(null,'even numbers equals ='+evennumber);
};
