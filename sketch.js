function setup() {
   var width = 250;
   var height = 200;
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
   
   //PUNTO 03
   /*
   var data = [];
   for ( let i = 0; i < 12; i ++) {
      var x = Math.floor ( Math.random () * height );
      var y = Math.floor ( Math.random () * height );
      data.push ([x, y]) ;
   
      fill (255 , 255 , 255) ;
      circle (x, height - y, 7) ; // 200 -y para q se dibuje apropiadamente
      textSize (8) ;
      text (x + ',' + y, x + 5, height - y);// 200 -y para q se dibuje apropiadamente
   }
   
   var root = build_kdtree ( data ) ;
   console.log ( root );
   */
   
   //PUNTO 05
   /*
   var data = [
      [40 ,70] ,
      [70 ,130] ,
      [90 ,40] ,
      [110 , 100] ,
      [140 ,110] ,
      [160 , 100]
   ];
   var point = [140 ,90]; // query
   for ( let i = 0; i < 6; i ++) {
      fill (255 , 255 , 255) ;
      circle (data[i][0], height - data[i][1], 7) ; // 200 -y para q se dibuje apropiadamente
      textSize (8) ;
      text (data[i][0] + ',' + data[i][1], data[i][0] + 5, height - data[i][1]);// 200 -y para q se dibuje apropiadamente
   }
   var root = build_kdtree ( data ) ;
   console.log ( root );
   
   var pto1 = closest_point_brute_force(data, point);
   console.log("FzaBruta : " + pto1);
   
   let best = null;
   best = naive_closest_point(root, point, 0, best);
   console.log(best);
   */
   
   //PUNTO 06
   var data = [
      [40 ,70] ,
      [70 ,130] ,
      [90 ,40] ,
      [110 , 100] ,
      [140 ,110] ,
      [160 , 100] ,
      [150 , 30] ,
      [150 , 20] ,
      [160 , 10] ,
      [140 , 61] ,
      [140 , 62] ,
      [140 , 63] ,
      [140 , 64] ,
      [140 , 65] ,
      [140 , 66] 
   ];

   var point = [140 ,90]; // query
   for ( let i = 0; i < data.length; i ++) {
      fill (255 , 255 , 255) ;
      circle (data[i][0], height - data[i][1], 7) ; // 200 -y para q se dibuje apropiadamente
      textSize (8) ;
      text (data[i][0] + ',' + data[i][1], data[i][0] + 5, height - data[i][1]);// 200 -y para q se dibuje apropiadamente
   }
   var root = build_kdtree ( data ) ;
   console.log ( root );
   
   //var pto1 = closest_point_brute_force(data, point);
   //console.log("FzaBruta : " + pto1);
   
   console.log("INICIO - Best naive closest " + point);
   let best = null;
   best = naive_closest_point(root, point, 0, best);
   console.log("Best naive closest: " + best);
   console.log("INICIO - Best closest " + point);
   best = null;
   best = closest_point(root, point, 0);
   console.log("Best closest: " + best);

   //PUNTO 08 subsección 2
   //Comentar para que no descargue el archivo dot
   //let dot = generate_dot(root);
   //console.log(dot);

   //PUNTO 08
   let nodeKNN = searchKNN(data, point, 3)
   console.log(nodeKNN);
}
