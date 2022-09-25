let tokenize=(text)=>{
   const punctuation = ['!', '#', '"', '%', '$', "'", '&', ')', '(', '+', '*', '-', ',', '/', '.', ';', ':', '=', '<', '?', '>', '@', '[', ']', '\\', '_', '^', '`', '{', '}', '|', '~'];
   punctuation.forEach((e) => {
      text = String(text.replaceAll(e, ""));
   });
   return text.toLowerCase().split(/\s+/g);
}
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
         var rowContent = lines[count].split("|");
         obj.text = String(rowContent[1]);
         obj.classifier = String(rowContent[0]);
         review.push(obj);
      }
      construccionVectores();
      construccionKdTree();
   };
   reader.onerror = function() {
      console.log(reader.error);
   };
}
//Construccion de Vextores
function construccionVectores() {
   console.table("review");
   atk = review.map((ele, index)=>{
      const obj = [];
      let dTokens = tokenize(ele.text);
      dict=dictionary(dTokens,dict);
      dTokens.forEach((e, i) => {
         obj[i] = e;
      });
      return obj;
   });

   console.log(dict);

   const adVms = [];
   adtfidf = review.map((ele, index)=>{
      const obj = [];
      let dTokens = tokenize(ele.text);
      let dVsm = vsm(dTokens,dict);
      adVms[index] = dVsm;
      let dtf = tf(dVsm,atk[index].length);
      let didf = idf(atk,dict);
      let dtfidf = tfidf(dtf,didf);
      dtfidf.forEach((e, i) => {
         obj[i] = e;
      });
      return obj;
   });

   console.table("adVms");
   console.table("adtfidf");

   review.map((ele, index) => {
      ele.vector = adtfidf[index];
   });
   console.table("review");
}

function construccionKdTree() {
   var oKdTree = new KdTree(adtfidf[0].length);
   var root = oKdTree.build_kdtree_classifier(review);
   console.log(root);

   let querys = ["this is an amazing food, but is my personal opinion", "FREE Account... for three months. Dont miss out!"];
   querys.forEach((query) => {
      let queryTokens = tokenize(query);
      let queryVsm = vsm(queryTokens,dict);
      let querytf = tf(queryVsm,queryTokens.length);
      let didf = idf(atk,dict);
      let querytfidf = tfidf(querytf,didf);

      console.log(querytfidf);

      console.log("Consulta: ", query);
      console.log("Resultado: ", oKdTree.classifierKNN(review, querytfidf, 3));
   });
   
}
