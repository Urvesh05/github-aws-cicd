
///// Local Work.....
'use strict';
const AWS = require('aws-sdk');
var request = require('request');
const s3 = new AWS.S3();


//// S3 Bucket File Upload...Console Thrue...
//// Step:1
/// s3 Bucket uplaod file


var getReferenceSHA;
var S3Data;

const S3pushCommit = async () => {
  const bucket = "aws-test-laravel-16"  // S3 Bucket Name
  const Key = "layout.html" /// S3 file name
  var params = {
    Bucket: bucket,
    Key: Key
  }
  const data = await s3.getObject(params).promise();

  // let new_data = Buffer.from(data.Body.toString('utf-8')).toString('base64');
  let S3Data1 = Buffer.from(data.Body.toString('base64')).toString('utf-8');
  return [S3Data1,Key];
}

//// Step:2
//// 1. Git Create Blobs
const createBlob = async(Key)=>{

  S3Data = await S3pushCommit();
  let getS3Data = S3Data[0];
  console.log("get s3 in create blob..==>>>>>>>> Step-1");// work

    return new Promise((resolve, reject)=>{
    var options = {
		'method': 'POST',
		'url': 'https://api.github.com/repos/Urvesh05/github-aws-cicd/git/blobs',  
		'headers': {
				'Authorization': 'Basic dXJ2ZXNoZ2F5YWt3YWQyQGdtYWlsLmNvbTpnaHBfaFY1ZWVscnFNeTNNTUVMVURDTGNNamNCa21FN3pyMFhDQXhN',
				'Content-Type': 'application/json',
				'user-agent': 'node.js',
		},
		body: JSON.stringify({
		  // "content": "GitHub test local test",
		  "content": getS3Data,  /// S3 content ( S3 upload File Content)
		  // "encoding": "utf-8"  ///zip, image (text)
		  "encoding": "base64" ///  zip, image (View raw) Download 
		})
    };
    request(options, function (error, response) {
		if (error) throw new Error(error);
        var getBlob = JSON.parse(response.body);
        var blobSha = getBlob.sha;
        console.log(blobSha,"create & get blob sha...=========>>>>>>>> Step-2")
        resolve(getBlob);
        });
    });
}


//// Step:3
/// 2. Git Create Tree....

const createTree = async (event)=>{
  let getBlobs = await createBlob(event);
  let shaKey = getBlobs.sha
  console.log(shaKey,"get blobs...0000000000>>>>");

  getReferenceSHA = await getReference(); //last commit
  let getBaseTreedata = getReferenceSHA;
  console.log(getBaseTreedata,"Get Base-Tree  ====>>>>>>>  in Git Reference......");

  // let Key = await S3pushCommit();
  let Key = S3Data
  let GetS3 = Key[1];
  console.log(GetS3,"get s3 in create blob..==>>>>>>>>");

  return new Promise((resovle, reject)=>{

var options = {
    'method': 'POST',
    'url': 'https://api.github.com/repos/Urvesh05/github-aws-cicd/git/trees',
    'headers': {
        'Authorization': 'Basic dXJ2ZXNoZ2F5YWt3YWQyQGdtYWlsLmNvbTpnaHBfaFY1ZWVscnFNeTNNTUVMVURDTGNNamNCa21FN3pyMFhDQXhN',
        'Content-Type': 'application/json',
        'user-agent': 'node.js',
    },
    body: JSON.stringify({
      "tree": [
        {
          // "path": "S3-Upload/"+getS3Data,
          "path": "S3-Upload/"+GetS3, /// s3 key get and put (not work)
          "mode": "100644",
          "type": "blob",
        //   "sha": "425463f5806c7a13fef26869fc217912ba37e661"
          "sha": shaKey /// use sha key in create blob output
        },
      ],
      //   "base_tree": "953255f05577f80b7aabc2eeceb51a4d11bec8ce"
        "base_tree": getBaseTreedata /// use sha key in Reference Output
    })
  };
  request(options, function (error, response) {
    if (error) {
            console.log("Error");
            throw new Error(error);
        }
    // console.log(response.body);
        console.log(JSON.parse(response.body))

      let result = JSON.parse(response.body);
      let treesha = result.sha;
      console.log(treesha,"only show tree sha...====>>>>>>> Step-3");
      resovle(result.sha);
  });
});
}

//// Step:4
///  3. Git Get Reference.... 
const getReference = () => {
  return new Promise((resovle, reject)=>{

  var request = require('request');
  var options = {
      'method': 'GET',
      'url': 'https://api.github.com/repos/Urvesh05/github-aws-cicd/git/refs/heads/S3Store',
      'headers': {
          'Authorization': 'Basic dXJ2ZXNoZ2F5YWt3YWQyQGdtYWlsLmNvbTpnaHBfaFY1ZWVscnFNeTNNTUVMVURDTGNNamNCa21FN3pyMFhDQXhN',
          'user-agent': 'node.js'
      }
  };
  // console.log(options);
  request(options, function (error, response) {
    if (error)  
    {
      console.log("Error",error)
      // throw new Error(error);
      res({})
    }
    let result = JSON.parse(response.body)
    // console.log(result.object.sha,"result sha key") 
     let getsha = result.object.sha
     console.log("GET SHA Key.......=================>> Step-4");
     resovle(getsha);   /// use this sha key in create tree (base_tree) & create commit Parents Key sha
  })
});
}


//// Step:5
//// 4. Git Create Commit....
const createCommit = async(event)=>{
     
  let getCreateTree = await createTree(event);
  console.log(getCreateTree,"get Create Tree,, sha key....00000?>>>>>>>>>>>>>> ") 

    // let getsha = await getReference(event); /// get parent sha key on (get last commit)
    // // var parents = getBaseTreedata
    let parents = getReferenceSHA;
    console.log(parents,"Get Parent Tree......--->>>>>>>>>>>> ");

    return new Promise((resove, reject)=>{
    
  var options = {
      'method': 'POST',
      'url': 'https://api.github.com/repos/Urvesh05/github-aws-cicd/git/commits',
      'headers': {
          'Authorization': 'Basic dXJ2ZXNoZ2F5YWt3YWQyQGdtYWlsLmNvbTpnaHBfaFY1ZWVscnFNeTNNTUVMVURDTGNNamNCa21FN3pyMFhDQXhN',
          'Content-Type': 'application/json',
          'user-agent': 'node.js',
      },
      body: JSON.stringify({
      //   "tree": "f5abc0164bf213bcca63bd0cfdd8597c4521c760",
        "tree": getCreateTree, /// use this tree sha is create tree output (first show) sha key
        "message": "file Upload Local Tets",
        "parents": [
          // "fea1a38fd408a068e440b5d299ed4c463ab767b8"
          parents
        ]
  })
};
request(options, function (error, response) {
		if (error) throw new Error(error);
		// console.log(response.body);
		console.log("create commit.>>>>>>>>>>");
		console.log(JSON.parse(response.body));
        let result = JSON.parse(response.body);
        let createCommit = result.sha;
        console.log(createCommit,"get create commit sha key....======>>>>>>>>>> Step-5");
        resove(result.sha);  /// use this sha is Git push use sha key
    });
  }); 
}

//// Step:6
// /// 5. Git Push  Final..
const pushCommit = async(event, result)=>{

    let getLatCommit = await createCommit(event, result)
    console.log(getLatCommit,"get last commit....");

    return new Promise((resolve, reject)=>{
      var request = require('request');
      var options = {
          'method': 'PATCH',
          'url': 'https://api.github.com/repos/Urvesh05/github-aws-cicd/git/refs/heads/S3Store',
          'headers': {
              'Authorization': 'Basic dXJ2ZXNoZ2F5YWt3YWQyQGdtYWlsLmNvbTpnaHBfaFY1ZWVscnFNeTNNTUVMVURDTGNNamNCa21FN3pyMFhDQXhN',
              'Content-Type': 'application/json',
              'user-agent': 'node.js',
          },
              body: JSON.stringify({
                  // "sha": "462de653f71b24130ed8d30625304f071c5aaa81",
                  "sha": getLatCommit, /// this sha key is create tree output sha key..
                  "force": true
                  // "force": false
    })

};
request(options, function (error, response) {
		if (error) throw new Error(error);
		// console.log(response.body);
    console.log("push commit.>>>>>>>>>> Step-6");
		console.log(JSON.parse(response.body));
    resolve(response);
    // return response;
  });
 });
} 
module.exports = pushCommit();

///... s3 upload to git... stop




// // // //// TEST
// var data;
// const test1 = async ()=>{
//   // return new Promise((resolve, reject)=>{
//       const result = "Test data 1"
//       // resolve(result);
//       return result;   
//   // });
// }

//  const test2 = async ()=>{
//   data = await test1();
//  console.log(data,"data");
// //  return result;
// }

// const test3 = async ()=>{
//   await test2();
// let sss = data;
// // const sss = result 
// // console.log(result,"jjj>>>>>>>>>");
// // const sss = result;
// console.log(sss,"get fun1");
// }

// module.exports = test3();












//     console.log(options);
//     request(options, function (error, response) {
//       if (error)  
//       {
//         console.log("Error")
//         throw new Error(error);
//       }
// 		console.log(response.body,"get git sha key....");

//     // var body = JSON.parse(response["body"]);
//     console.log(".......=================>>");
        
//         // response = {
//         //     body: JSON.stringify(body)
//         // }
//         // console.log(response,"-----------");
//         console.log(JSON.stringify(body,"-----------"));
// //         callback(null,response);
//     return response


////
// var body = JSON.parse(response["body"]);
  
        // response = {
        //     body: JSON.stringify(body)
        // }
        // console.log(response,"-----------");

        // var body = JSON.parse(response["body"]);
        //  console.log(body, "=======");



////// test labda 

        // // /// 6..push commit ... post.url....https://api.github.com/repos/Urvesh05/github-aws-cicd/git/refs/heads/S3Store

// exports.getPushCommit = (event, context, callback) => {

//   console.log(event);
//   const body = event.body;

//   var options = {
//     'method': 'POST',
//     'url': 'https://api.github.com/repos/Urvesh05/github-aws-cicd/git/refs/heads/S3Store',
//     'headers': {
//       'Authorization': 'Basic dXJ2ZXNoZ2F5YWt3YWQyQGdtYWlsLmNvbTpnaHBfY3NhUlcyd2Jqb0tsNDFEUU1jVnRpOWRRSlJYZ3FFM0hXbVBv',
//       'Content-Type': 'application/json',
//       'user-agent': 'node.js',
//     },
//     body: JSON.stringify({
//       "sha": "462de653f71b24130ed8d30625304f071c5aaa81",
//       "force": true
//     })

//   };
//   request(options, function (error, response) {
//     if (error) throw new Error(error);
//     // console.log(response.body);
//     console.log("push commit.>>>>>>>>>>");
//     console.log(JSON.parse(response.body));

   // // callback(null, sendResponse(200, { message: 'push...commit.....!' }));
   // // return response;
//   });

// callback(null, sendResponse(200, { message: 'push...commit.....!' }));
//     return response;
// }




//// lambda test... postman body...
// var glob="";
// console.log(glob,"--------->>>>>...11111 ");

// /home/imagic99/Documents/urvesh/git-commit/git-commit Api.js   
//// show git sha key step...on this file....

// //  custom message use for lambda (define top)
// function sendResponse(statusCode, message) {
//   return {
//     statusCode: statusCode,
//     body: JSON.stringify(message)
//   };
// }

/// define function end
// callback(null, sendResponse(200, { message: 'push...commit.....!' }));
//     return response;
