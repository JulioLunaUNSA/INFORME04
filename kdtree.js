class Node {
   constructor (point, axis, classifier = null) {
      this.point = point;
      this.left = null;
      this.right = null;
      this.axis = axis;
      this.classifier = classifier;
   }
}

class KdTree {
   constructor (k) {
      this.k = k;
      //this.k = 2;
   }

   // funcion de altura del punto numero 2 del informe 4
   getHeight (node) {
      // caso base: el árbol vacío tiene una altura de -1
      if (node == null) {
         return -1;
      }
   
      // recurre al subárbol izquierdo y derecho y considera la altura máxima
      return 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
   }

   dibujarIzquierda(node) {

      if (node.left == null) {
         return "";
      } else {
         let texto = "";
         if (node.left != null && node.right) {
            texto = '"' + node.point[0] +", "+ node.point[1] + '" -> "' + node.left.point[0] +", "+ node.left.point[1] + '"' + ";\n"
            texto += this.dibujarIzquierda(node.left);
            texto += this.dibujarDerecha(node.left);
         }
         return texto;
      }
   };

   dibujarDerecha(node) {

      if (node.right == null) {
         return "";
      } else {
         let texto = "";
         if (node.right != null && node.left) {
            texto = '"' + node.point[0] +", "+ node.point[1] + '" -> "' + node.right.point[0] +", "+ node.right.point[1] + '"' +";\n"
            texto += this.dibujarDerecha(node.right);
            texto += this.dibujarIzquierda(node.right);
         }
         return texto;
      }
   };

   generate_dot (node) {
      var texto = "digraph G\n"
                  +"{\n"
                     if (node.point != null) {
                        texto += this.dibujarIzquierda(node);
                        texto += this.dibujarDerecha(node);
                     }
                     texto += "\n}";

      //const doc = document.createElement("a");
      //const archivo = new Blob([texto], { type: 'application/msword' });
      //const url = URL.createObjectURL(archivo);
      //doc.href = url;
      //doc.download = "kd-tree.dot";
      //doc.click();
      //URL.revokeObjectURL(url);
      return texto;
   }

   build_kdtree (points, depth = 0) {
      var n = points.length;
      var axis = depth % this.k;

      if (n <= 0){
         return null;
      }
      if (n == 1){
         return new Node(points[0], axis)
      }

      var median = Math.floor(points.length / 2);

      // sort by the axis
      points.sort(function(a, b) {
         return a[axis] - b[axis];
      });
      //console.log(points);

      var left = points.slice(0, median);
      var right = points.slice(median + 1);

      //console.log(right);

      var node = new Node(points[median].slice(0, this.k), axis);
      node.left = this.build_kdtree(left, depth + 1);
      node.right = this.build_kdtree(right, depth + 1);

      return node;
   }

   distanceSquared (point1, point2) {
      var distance = 0;
      for (var i = 0; i < this.k; i ++)
         distance += Math.pow (( point1 [i] - point2 [i]) , 2) ;
      return Math.sqrt ( distance );
   }
      
   closest_point_brute_force(points, point) {
      var n = points.length;
      var d;
      var menor = -1;
      var pto = null;
      for(let i = 0; i < n; i++){
         d = this.distanceSquared(point,points[i]);
         if (menor >= 0){
               if (d < menor){
                  pto = points[i];
                  menor = d;
               }
         }else{
               menor = d;
               pto = points[i];
         }
      }
      return pto;
   }

   naive_closest_point (node, point, depth = 0, best = null ) {
      if (node == null) {
         return best;
      }
      var axis = depth % this.k;
      let dis1 = this.distanceSquared(node.point, point);
      let dis2;
      console.log(depth + ": ");
      if (best != null) {
         dis2 = this.distanceSquared(best, point);
         console.log(best + ": " + dis2);
         best = (dis1 < dis2)? node.point : best;
         console.log(node.point + ": " + dis1);
         console.log(best + ": " + ((dis1 < dis2)? dis1 : dis2));
      } else {
         best = node.point;
         console.log(best + ": " + dis1);
      }
      if (node.left == null && node.right == null) {
         return best;
      } else {
         if (point[axis] < node.point[axis]) {
            best = this.naive_closest_point(node.left, point, depth + 1, best);
         } else {
            best = this.naive_closest_point(node.right, point, depth + 1, best);
         }
      }
      return best;
   }

   closest_point(node , point , depth = 0) {
      if (node == null) {
         return null;
      }
      var axis = depth % this.k;
      let dis1 = this.distanceSquared(node.point, point);
      let disLeft;
      let disRight;
      let bestLeft;
      let bestRight;

      console.log(depth + ": ");
      console.log(depth + ": point => " + node.point);
      console.log(depth + ": dis1 => " + dis1);
      if (node.left == null && node.right == null) {
         console.log(depth + ": return => " + node.point);
         return node.point;
      } else {
         disLeft = (node.left != null)? this.distanceSquared(node.left.point, point) : null;
         console.log(depth + ": disLeft => " + disLeft);
         disRight = (node.right != null)? this.distanceSquared(node.right.point, point) : null;
         console.log(depth + ": disRight => " + disRight);
         if (point[axis] < node.point[axis]) {
            bestLeft = this.closest_point(node.left, point, depth + 1);
            bestRight = (disLeft != null && disLeft > dis1)? this.closest_point(node.right, point, depth + 1) : null;
         } else {
            bestRight = this.closest_point(node.right, point, depth + 1);
            bestLeft = (disRight != null && disRight > dis1)? this.closest_point(node.left, point, depth + 1) : null;
         }
      }
      console.log(depth + ": bestLeft => " + bestLeft);
      console.log(depth + ": bestRight => " + bestRight);
      if (bestLeft == null && bestRight == null) {
         console.log(depth + ": return => " + node.point);
         return node.point;
      } else if (bestLeft == null) {
         disRight = this.distanceSquared(bestRight, point);
         console.log(depth + ": disRight => " + disRight);
         return (dis1 < disRight)? node.point : bestRight;
      } else if (bestRight == null) {
         disLeft = this.distanceSquared(bestLeft, point);
         console.log(depth + ": disLeft => " + disLeft);
         return (dis1 < disLeft)? node.point : bestLeft;
      } else {
         disLeft = this.distanceSquared(bestLeft, point);
         console.log(depth + ": disLeft => " + disLeft);
         disRight = this.distanceSquared(bestRight, point);
         console.log(depth + ": disRight => " + disRight);
         if (disLeft < disRight) {
            return (dis1 < disLeft)? node.point : bestLeft;
         } else {
            return (dis1 < disRight)? node.point : bestRight;
         }
      }
   }

   range_query_circle(node, center, radio, queue, depth=0) {
      if(node != null)
      {
         var dist = this.distanceSquared(node.point, center);
         if (dist <= radio){
               queue.push(node.point);
         }
         this.range_query_circle(node.left, center, radio, queue, depth+1);
         this.range_query_circle(node.right, center, radio, queue, depth+1);
      }
   }

   range_query_rec(node, lefttop, rightbottom, queue, depth=0) {
      if(node != null)
      {
         var dentro = node.point[0]>=lefttop[0] && node.point[0]<=rightbottom[0] && node.point[1]<=lefttop[1] && node.point[1]>=rightbottom[1];
         if (dentro) {
            queue.push(node.point);
         }
         this.range_query_rec(node.left, center, radio, queue, depth+1);
         this.range_query_rec(node.right, center, radio, queue, depth+1);
      }
   }

   searchKNN(node, point, k) {
      
      var listNodeKNN = [];
      //var root = this.build_kdtree (node);
      var leafNode = this.searchLeaf(node, point);
      var nodeKNN = new Node();
      while (leafNode != node) {
         
         if (this.distanceSquared(point, leafNode.point) > this.distanceSquared(point, leafNode.parent.point)) {
               nodeKNN = leafNode.parent.point;
               nodeKNN.distance = this.distanceSquared(point, leafNode.parent.point);
               nodeKNN.classifier = leafNode.parent.classifier;
         } else {
               nodeKNN = leafNode.point;
               nodeKNN.distance = this.distanceSquared(point, leafNode.point);
               nodeKNN.classifier = leafNode.classifier;
         }

         if (!listNodeKNN.includes(nodeKNN)) {
            listNodeKNN.push(nodeKNN);   
         }
         leafNode = leafNode.parent;
      }
      return listNodeKNN.sort((a,b) => { return a.distance - b.distance }).slice(0, k);
   }

   searchLeaf(node, point) {
      var leaf = node;
      var next = null;
      var index = 0;

      while (leaf.left != null || leaf.right != null) {
         if (point[index] < leaf.point[index]) {
            next =  leaf.left;
            next.parent = leaf;
         } else if (point[index] > leaf.point[index]) {
            next =  leaf.right;
            next.parent = leaf;
         } else {
            if (this.distanceSquared(point, leaf.left) < this.distanceSquared(point, leaf.right)) {
               next = leaf.left;
               next.parent = leaf;
            } else {
               next = leaf.right;
               next.parent = leaf;
            }
         }
         if (next == null) {
            break;
         } else {
            leaf = next;
            if (++index >= node.point.length) {
               index = 0;
            }
         } 
      }
      leaf = next;
      return leaf;
   }

   build_kdtree_classifier(points, depth = 0) {
      var n = points.length;
      var axis = depth % this.k;

      if (n <= 0){
         return null;
      }
      if (n == 1){
         return new Node(points[0].vector, axis, points[0].classifier);
      }

      var median = Math.floor(points.length / 2);

      // sort by the axis
      points.sort(function(a, b) {
         return a.vector[axis] - b.vector[axis];
      });
      //console.log(points);

      var left = points.slice(0, median);
      var right = points.slice(median + 1);

      //console.log(right);

      var node = new Node(points[median].vector.slice(0, this.k), axis, points[median].classifier);
      node.left = this.build_kdtree_classifier(left, depth + 1);
      node.right = this.build_kdtree_classifier(right, depth + 1);

      return node;
   }

   classifierKNN(data, point) {
      var root = this.build_kdtree_classifier(data);
      let listKNN = this.searchKNN(root, point, 3);
      listKNN.sort(function(a, b) {
         return a.classifier - b.classifier;
      });
      console.log(listKNN);
      var max = 0;
      var count = 0;
      var classCurrent = listKNN[0].classifier;
      var classSelected = null;
      listKNN.forEach((key) => {
         if (key.classifier != classCurrent) {
            classSelected = (count > max)? classCurrent : classSelected;
            classCurrent = key.classifier;
            count = 0;
         }
         count++;
      });
      return classSelected;
   }
}
