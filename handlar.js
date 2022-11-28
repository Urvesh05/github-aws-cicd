'use strict';
const AWS = require('aws-sdk')
var request = require('request');
const s3 = new AWS.S3()


var getBaseTree;
var new_data;
// Step-1
const readS3File = async (event, context, callback) => {
  const Key = event.Records[0].s3.object.key;
  console.log(Key, "-------------S3 Key name ..>>>>>>>..");

  const data = await s3.getObject({
    Bucket: event.Records[0].s3.bucket.name,
    Key
  }).promise();
  const new_data = Buffer.from(data.Body.toString('base64')).toString('utf-8');
  return [new_data, Key];
};


//// Step:2
//// 1. Git Create Blobs
const createBlob = async (event) => {

  new_data = await readS3File(event);
  const getS3Data = new_data[0];
  console.log("get s3 in create blob..==>>>>>>>> Step-3");

  return new Promise((resolve, reject) => {
    var options = {
      'method': 'POST',
      'url': 'https://api.github.com/repos/Urvesh05/github-aws-cicd/git/blobs',
      'headers': {
        'Authorization': 'Basic dXJ2ZXNoZ2F5YWt3YWQyQGdtYWlsLmNvbTpnaHBfaFY1ZWVscnFNeTNNTUVMVURDTGNNamNCa21FN3pyMFhDQXhN',
        'Content-Type': 'application/json',
        'user-agent': 'node.js',
      },
      body: JSON.stringify({
        "content": getS3Data,
        "encoding": "base64"
      })
    };
    request(options, function (error, response) {
      if (error) throw new Error(error);
      var getBlob = JSON.parse(response.body);
      console.log(getBlob, "create & get blob sha...=========>>>>>>>> Step-1")
      resolve(getBlob);
    });
  });
}


//// Step:3
///  2. Git Get Reference.... 
const getReference = () => {
  return new Promise((resovle, reject) => {

    var request = require('request');
    var options = {
      'method': 'GET',
      'url': 'https://api.github.com/repos/Urvesh05/github-aws-cicd/git/refs/heads/S3Store',
      'headers': {
        'Authorization': 'Basic dXJ2ZXNoZ2F5YWt3YWQyQGdtYWlsLmNvbTpnaHBfaFY1ZWVscnFNeTNNTUVMVURDTGNNamNCa21FN3pyMFhDQXhN',
        'user-agent': 'node.js'
      }
    };
    request(options, function (error, response) {
      if (error) {
        console.log("Error", error)
        res({})
      }
      var result = JSON.parse(response.body)
      var getsha = result.object.sha
      console.log(getsha, "GET Refrence SHA Key.......=================>> Step-2222222222");
      resovle(getsha);
    });
    console.log("GET Refrence SHA Key.......=================>> Step-2");
  });
}

//// Step:4
/// 3. Git Create Tree....

const createTree = async (event) => {
  var getBlobs = await createBlob(event);
  var shaKey = getBlobs.sha;

  getBaseTree = await getReference();
  let getBaseTreedata = getBaseTree;

  let Key = new_data;
  let getS3Key = Key[1];
  console.log(getS3Key, "get s3 in create blob..==>>>>>>>>Step-3");

  return new Promise((resovle, reject) => {

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
            "path": "S3-Upload/" + getS3Key,
            "mode": "100644",
            "type": "blob",
            "sha": shaKey
          },
        ],
        "base_tree": getBaseTreedata
      })
    };
    request(options, function (error, response) {
      if (error) {
        console.log("Error");
        throw new Error(error);
      }
      var result = JSON.parse(response.body);
      resovle(result.sha);
    });
    console.log("tree sha key use in new commit..====>>>>>>> Step-4");
  });
}


//// Step:5
//// 4. Git Create Commit....
const createCommit = async (event) => {

  var getCreateTree = await createTree(event);
  let parents = getBaseTree;

  return new Promise((resove, reject) => {
    var options = {
      'method': 'POST',
      'url': 'https://api.github.com/repos/Urvesh05/github-aws-cicd/git/commits',
      'headers': {
        'Authorization': 'Basic dXJ2ZXNoZ2F5YWt3YWQyQGdtYWlsLmNvbTpnaHBfaFY1ZWVscnFNeTNNTUVMVURDTGNNamNCa21FN3pyMFhDQXhN',
        'Content-Type': 'application/json',
        'user-agent': 'node.js',
      },
      body: JSON.stringify({
        "tree": getCreateTree,
        "message": "text file commit message test lambda test..",
        "parents": [
          parents
        ]
      })
    };
    request(options, function (error, response) {
      if (error) throw new Error(error);
      let result = JSON.parse(response.body);
      console.log("get create commit sha key....======>>>>>>>>>> Step-5");
      resove(result.sha);
    });
  });
}

//// Step:6
// /// 5. Git Push Final..
exports.pushCommit = async (event) => {
  var getLastCommit = await createCommit(event)
  return new Promise((resolve, reject) => {
    var options = {
      'method': 'POST',
      'url': 'https://api.github.com/repos/Urvesh05/github-aws-cicd/git/refs/heads/S3Store',
      'headers': {
        'Authorization': 'Basic dXJ2ZXNoZ2F5YWt3YWQyQGdtYWlsLmNvbTpnaHBfaFY1ZWVscnFNeTNNTUVMVURDTGNNamNCa21FN3pyMFhDQXhN',
        'Content-Type': 'application/json',
        'user-agent': 'node.js',
      },
      body: JSON.stringify({
        "sha": getLastCommit,
        "force": true
      })
    };
    request(options, function (error, response) {
      if (error) throw new Error(error);
      console.log("push commit.>>>>>>>>>> Step-6");
      resolve(response);
    });
  });
}
