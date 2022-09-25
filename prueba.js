/*
var body = document.getElementById("myBody");
var canvas = document.getElementById("myCanvas");

var ctx = canvas.getContext("2d");

var img = new Image();
img.src = "imagenes/GFG35.png";

img.onload = function() {
   ctx.drawImage(img, 0, 0);
}
*/

//let imgcv = cv.imread(canvas);
//console.log(imgcv);
//cv.imshow(canvasOutput, img);
//img.delete();

/*
if (cv.getBuildInformation)
{
   console.log(cv.getBuildInformation());
   onloadCallback();
}
else
{
   // WASM
   cv['onRuntimeInitialized']=()=>{
      //console.log(cv.getBuildInformation());
      let imgcv = cv.imread(canvas, 1);
      console.log(imgcv);
      console.log(imgcv.shape);
   }
}
*/

let tokenize=(text)=>text.toLowerCase().split(/\s+/g);
let dictionary=(tokens,dict)=>{
   tokens.forEach((token)=>{
      if(!dict.includes(token)){
         dict.push(token);
      }
   })
   return dict;
};
let vsm=(tokens,dict)=>dict.map((token)=>tokens.reduce((acc,curr)=>curr== token?acc +1:acc,0));
let tf=(vsm,numberOfTokens)=>vsm.map((token)=>token/numberOfTokens);
let idf = (documentTokens,dict)=>dict.map((word)=>Math.log(documentTokens.length/documentTokens.reduce((acc,curr)=>curr.includes(word)?acc +1:acc,0)));
let tfidf=(tf,idf)=>tf.map((element,index)=>element*idf[index]);
let cosine=(tfIdf1,tfIdf2)=>tfIdf1.reduce((acc,curr,index)=>acc+curr*tfIdf2[index],0) / (Math.sqrt(tfIdf1.reduce((acc,curr)=>acc+curr*curr,0))*Math.sqrt(tfIdf2.reduce((acc,curr)=>acc+curr*curr,0)));
let dict = [];
let review = [];
let adtfidf = [];
let atk = [];
function readFile(input) {
   let file = input.files[0];
   let reader = new FileReader();
   reader.readAsText(file);
   reader.onload = function() {
      var content = reader.result;
      var lines = content.split("\r\n");
      for (var count = 1; count < lines.length; count++) {
         const obj = {};
         //split each row content
         var rowContent = lines[count].split("|");
         //loop throw all columns of a row
         //console.log(rowContent[1]);
         //console.log(typeof(rowContent[1]));
         obj.text = String(rowContent[1]);
         obj.classifier = String(rowContent[0]);
         //console.log(obj);
         review.push(obj);
      }
      //console.log(reader.result);
      construccionVectores();
      construccionKdTree();
   };
   reader.onerror = function() {
      console.log(reader.error);
   };
}

function construccionVectores() {
   /*
   const review = [
      { text: "this product is amazing", classifier: 1 },
      { text: "this product is great", classifier: 1 },
      { text: "this product is horrible", classifier: 0 },
      { text: "this product is bad", classifier: 0 },
      { text: "this is amazing and tasty food", classifier: 1 },
      { text: "this food is fabulus", classifier: 1 },
      { text: "this product is tasteless", classifier: 0 },
      { text: "this smells bad", classifier: 0 },
   ];
   */
   /*
   const review = [
      { text: "how are you", classifier: 1 },
      { text: "where do you live", classifier: 1 },
   ];
   */
   const punctuation = ['!', '#', '"', '%', '$', "'", '&', ')', '(', '+', '*', '-', ',', '/', '.', ';', ':', '=', '<', '?', '>', '@', '[', ']', '\\', '_', '^', '`', '{', '}', '|', '~'];
   review.map((element, index) => {
   //   element.text = String(element.text);
      //element.text = String(element.text.replace("'", ""));
   //   element.classifier = String(element.classifier);
      //element.classifier = String(element.classifier.replace("'", ""));
      punctuation.forEach((e) => {
         element.text = String(element.text.replaceAll(e, ""));
      });
   });
   //console.table(review)
   console.table("review");

   /*
   //const stopwords = ["is", "this", "are"];
   const stopwords = [];
   // step 1 
   const totalWords = [
   ...new Set(
      review.flatMap((a) =>
         a.text.split(" ").filter((a) => stopwords.indexOf(a) === -1)
      )
   ),
   ];
   console.log(totalWords);

   const bagOfWords = review.map((a) => {
      const obj = {};
      totalWords.forEach((key) => {
      //obj[key] = a.text.includes(key) ? 1 : 0;
      obj[key] = a.text.split(" ").indexOf(key) === -1 ? 0 : 1;
      });
      return obj;
   });
   //console.table(bagOfWords)
   console.table("bagOfWords")

   const WordsWithSentences = [
      ...new Set(
      totalWords.map((a) => {
         return {
            word: a,
            //reviews: review.filter((b) => b.text.includes(a)).length,
            reviews: review.filter((b) => b.text.split(" ").indexOf(a) != -1).length,
         };
      })
      ),
   ];
   console.log('WordsWithSentences', WordsWithSentences);

   const atfidf = review.map((a) => {
      const obj = {};
      const totalWordsInReview = a.text.split(" ").length;
      const numberOfReviews = review.length;
      totalWords.forEach((key) => {
         const numberOfSentenceswithTheWord = WordsWithSentences.find(
            (b) => b.word == key
         );
         
         // calculate Tf 
         //const tf = (a.text.includes(key) ? 1 : 0) / totalWordsInReview;
         const tf = (a.text.split(" ").indexOf(key) === -1 ? 0 : 1) / totalWordsInReview;

         // calculate IDF
         const idf = Math.log(
            numberOfReviews / numberOfSentenceswithTheWord.reviews
         );

         //console.log("key ", key, " tf ", tf, " idf ", idf, " numberOfReviews ", numberOfReviews, " reviews ", numberOfSentenceswithTheWord.reviews);

         // multiple both to get weight of word on score 
         obj[key] = tf * idf;
      });
      obj.output = a.classifier;
      return obj;
   });

   console.table(atfidf);
   */

   //let d1 = "how are you";
   //let d2 = "where do you live";
   
   /*
   let d1Tokens = tokenize(d1);
   let d2Tokens = tokenize(d2);
   console.log("d1t ", d1Tokens, " d2t ", d2Tokens);
   dict=dictionary(d1Tokens,dict);
   dict=dictionary(d2Tokens,dict);
   console.log(dict);
   let d1Vsm = vsm(d1Tokens,dict);
   let d2Vsm = vsm(d2Tokens,dict);
   console.log("d1V ", d1Vsm, " d2V ", d2Vsm);
   let d1tf = tf(d1Vsm,d1Tokens.length);
   let d2tf = tf(d2Vsm,d2Tokens.length);
   console.log("d1tf ", d1tf, " d2tf ", d2tf);
   let didf = idf([d1Tokens,d2Tokens],dict);
   console.log("didf ", didf);
   let d1tfidf = tfidf(d1tf,didf);
   let d2tfidf = tfidf(d2tf,didf);
   console.log("d1tfidf ", d1tfidf, " d2tfidf ", d2tfidf);

   let query = "which place you live";
   let queryTokens = tokenize(query);
   let queryVsm = vsm(queryTokens,dict);
   let querytf = tf(queryVsm,queryTokens.length);
   let querytfidf = tfidf(querytf,didf);
   let cosineSim1 = cosine(d1tfidf,querytfidf);
   let cosineSim2 = cosine(d2tfidf,querytfidf);
   console.log("cosineSim1 ", cosineSim1, " cosineSim2 ", cosineSim2);
   console.log(cosineSim1>cosineSim2?"I'm fine":"Krypton");
   */

   atk = review.map((ele, index)=>{
      const obj = [];
      let dTokens = tokenize(ele.text);
      dict=dictionary(dTokens,dict);
      //console.log(dTokens);
      dTokens.forEach((e, i) => {
         obj[i] = e;
      });
      //obj[index] = dTokens;
      return obj;
   });

   //console.log("aaa");
   //console.table(atk);
   //console.log("bbb");

   console.log(dict);

   const adVms = [];
   adtfidf = review.map((ele, index)=>{
      //console.log(ele.text);
      //console.log(index);
      //console.log(atk[index]);
      const obj = [];
      let dTokens = tokenize(ele.text);
      let dVsm = vsm(dTokens,dict);
      //dVsm.forEach((e, i) => {
      //   adVms[index][i] = e;
      //});
      adVms[index] = dVsm;
      let dtf = tf(dVsm,atk[index].length);
      //console.log(atk.length);
      //console.log(atk.reduce((acc,curr)=>curr.includes("this")?acc +1:acc,0));
      let didf = idf(atk,dict);
      let dtfidf = tfidf(dtf,didf);
      //console.log(dtfidf);
      dtfidf.forEach((e, i) => {
         obj[i] = e;
      });
      //console.log(obj);
      //obj[index] = dtfidf;
      return obj;
   });

   //console.table(adVms);
   console.table("adVms");
   //console.table(adtfidf);
   console.table("adtfidf");

   review.map((ele, index) => {
      ele.vector = adtfidf[index];
   });
   console.log("======================================");
   //console.table(review);
   console.table("review");

   /*
   const atf = review.map((a) => {
      console.log(ele.text);
      const obj = {};
      totalWords.forEach((key) => {
      obj[key] = a.text.includes(key) ? 1 : 0;
      });
      
      let dTokens = tokenize(ele.text);
      dict=dictionary(dTokens,dict);
      let dVsm = vsm(dTokens,dict);
      let dtf = tf(dVsm,dTokens.length);
      return obj;
   });
   */
   
}

function construccionKdTree() {
   var oKdTree = new KdTree(adtfidf[0].length);
   //var root = oKdTree.build_kdtree(adtfidf);
   var root = oKdTree.build_kdtree_classifier(review);
   console.log(root);

   let dot = oKdTree.generate_dot(root);
   console.log(dot);

   let querys = ["this amazing food", "FREE Account for three months"];
   querys.forEach((query) => {
      //let query = "this amazing food";
      let queryTokens = tokenize(query);
      let queryVsm = vsm(queryTokens,dict);
      let querytf = tf(queryVsm,queryTokens.length);
      let didf = idf(atk,dict);
      let querytfidf = tfidf(querytf,didf);

      console.log(querytfidf);

      let nodeKNN = oKdTree.searchKNN(root, querytfidf, 3)
      console.log(nodeKNN);
      console.log("Consulta: ", query);
      console.log("Resultado: ", oKdTree.classifierKNN(review, querytfidf));
   });
   
}

function setup() {
   var width = 625;
   var height = 500;
   createCanvas(width, height);

   background(0);
   for (var x = 0; x < width; x += width / 10) {
      for (var y = 0; y < height; y += height / 5) {
         stroke (125 , 125 , 125) ;
         strokeWeight (1) ;
         line (x, 0, x, height );
         line (0 , y, width , y);
      }
   }

   //console.table(adtfidf.length);

   /*
   var data = [
      [40 ,70] ,
      [70 ,130] ,
      [90 ,40] ,
      [110 , 100] ,
      [140 ,110] ,
      [160 , 100] ,
      [150 , 30] ,
   ];
   */

   //for ( let i = 0; i < data.length; i ++) {
   //   fill (255 , 255 , 255) ;
   //   circle (data[i][0], height - data[i][1], 7) ; // 200 -y para q se dibuje apropiadamente
   //   textSize (8) ;
   //   text (data[i][0] + ',' + data[i][1], data[i][0] + 5, height - data[i][1]);// 200 -y para q se dibuje apropiadamente
   //}
}

/*
pruebaDot = [
   {vector: [15, 6, 19], classifier: "ham"},
   {vector: [10, 10, 16], classifier: "ham"},
   {vector: [1, 19, 13], classifier: "spam"},
   {vector: [19, 1, 8], classifier: "spam"},
   {vector: [6, 15, 1], classifier: "ham"},
]
console.table(pruebaDot);
pruebaDot.sort(function(a, b) {
   return a.vector[2] - b.vector[2];
});
console.table(pruebaDot);
console.table(pruebaDot.length);
*/