k = 2;

class Node {
   constructor (point, axis) {
   this.point = point;
   this.left = null;
   this.right = null;
   this.axis = axis;
   }
}

function getHeight (node) {
   // caso base: el árbol vacío tiene una altura de -1
   if (node == null) {
      return -1;
    }
 
    // recurre al subárbol izquierdo y derecho y considera la altura máxima
    return 1 + Math.max(getHeight(node.left), getHeight(node.right));
}

function dibujarIzquierda(node) {

   if (node.left == null) {
      return "";
   } else {
       let texto = "";
       if (node.left != null && node.right) {
           texto = node.point[0] +", "+ node.point[1] + "-> " + node.left.point[0] +", "+ node.left.point[1] +";\n"
           texto += dibujarIzquierda(node.left);
           texto += dibujarDerecha(node.left);
       }
      return texto;
   }
};

function dibujarDerecha(node) {

   if (node.right == null) {
      return "";
   } else {
       let texto = "";
       if (node.right != null && node.left) {
           texto = node.point[0] +", "+ node.point[1] + "-> " + node.right.point[0] +", "+ node.right.point[1] +";\n"
           texto += dibujarDerecha(node.right);
           texto += dibujarIzquierda(node.right);
       }
      return texto;
   }
};

function generate_dot (node) {
   var texto = "digraph G\n"
               +"{\n"
                  if (node.point != null) {
                     texto += dibujarIzquierda(node);
                     texto += dibujarDerecha(node);
                  }
                  texto += "\n}";

   const doc = document.createElement("a");
   const archivo = new Blob([texto], { type: 'application/msword' });
   const url = URL.createObjectURL(archivo);
   doc.href = url;
   doc.download = "kd-tree.dot";
   doc.click();
   URL.revokeObjectURL(url);
   return texto;
}

function build_kdtree (points, depth = 0) {
   var n = points.length;
   var axis = depth % k;

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

   var node = new Node(points[median].slice(0, k), axis);
   node.left = build_kdtree(left, depth + 1);
   node.right = build_kdtree(right, depth + 1);

   return node;
}

function distanceSquared (point1, point2) {
   var distance = 0;
   for (var i = 0; i < k; i ++)
      distance += Math.pow (( point1 [i] - point2 [i]) , 2) ;
   return Math.sqrt ( distance );
}
   
function closest_point_brute_force(points, point) {
    var n = points.length;
    var d;
    var menor = -1;
    var pto = null;
    for(let i = 0; i < n; i++){
        d = distanceSquared(point,points[i]);
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

function naive_closest_point (node, point, depth = 0, best = null ) {
   if (node == null) {
      return best;
   }
   var axis = depth % k;
   let dis1 = distanceSquared(node.point, point);
   let dis2;
   console.log(depth + ": ");
   if (best != null) {
      dis2 = distanceSquared(best, point);
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
         best = naive_closest_point(node.left, point, depth + 1, best);
      } else {
         best = naive_closest_point(node.right, point, depth + 1, best);
      }
   }
   return best;
}

function closest_point(node , point , depth = 0) {
   if (node == null) {
      return null;
   }
   var axis = depth % k;
   let dis1 = distanceSquared(node.point, point);
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
      disLeft = (node.left != null)? distanceSquared(node.left.point, point) : null;
      console.log(depth + ": disLeft => " + disLeft);
      disRight = (node.right != null)? distanceSquared(node.right.point, point) : null;
      console.log(depth + ": disRight => " + disRight);
      if (point[axis] < node.point[axis]) {
         bestLeft = closest_point(node.left, point, depth + 1);
         bestRight = (disLeft != null && disLeft > dis1)? closest_point(node.right, point, depth + 1) : null;
      } else {
         bestRight = closest_point(node.right, point, depth + 1);
         bestLeft = (disRight != null && disRight > dis1)? closest_point(node.left, point, depth + 1) : null;
      }
   }
   console.log(depth + ": bestLeft => " + bestLeft);
   console.log(depth + ": bestRight => " + bestRight);
   if (bestLeft == null && bestRight == null) {
      console.log(depth + ": return => " + node.point);
      return node.point;
   } else if (bestLeft == null) {
      disRight = distanceSquared(bestRight, point);
      console.log(depth + ": disRight => " + disRight);
      return (dis1 < disRight)? node.point : bestRight;
   } else if (bestRight == null) {
      disLeft = distanceSquared(bestLeft, point);
      console.log(depth + ": disLeft => " + disLeft);
      return (dis1 < disLeft)? node.point : bestLeft;
   } else {
      disLeft = distanceSquared(bestLeft, point);
      console.log(depth + ": disLeft => " + disLeft);
      disRight = distanceSquared(bestRight, point);
      console.log(depth + ": disRight => " + disRight);
      if (disLeft < disRight) {
         return (dis1 < disLeft)? node.point : bestLeft;
      } else {
         return (dis1 < disRight)? node.point : bestRight;
      }
   }
}

function range_query_circle(node, center, radio, queue, depth=0) {
    if(node != null)
    {
        var dist = distanceSquared(node.point, center);
        if (dist <= radio){
            queue.push(node.point);
        }
        range_query_circle(node.left, center, radio, queue, depth+1);
        range_query_circle(node.right, center, radio, queue, depth+1);
    }
}

function range_query_rec(node, lefttop, rightbottom, queue, depth=0) {
   if(node != null)
   {
       var dentro = node.point[0]>=lefttop[0] && node.point[0]<=rightbottom[0] && node.point[1]<=lefttop[1] && node.point[1]>=rightbottom[1];
       if (dentro) {
           queue.push(node.point);
       }
       range_query_rec(node.left, center, radio, queue, depth+1);
       range_query_rec(node.right, center, radio, queue, depth+1);
   }
}

function searchKNN(node, point, k) {
   
   var listNodeKNN = [];
   var root = build_kdtree (node);
   var leafNode = searchLeaf(root, point);
   var nodeKNN = new Node();
   while (leafNode != root) {
      
      if (distanceSquared(point, leafNode.point) > distanceSquared(point, leafNode.parent.point)) {
            nodeKNN = leafNode.parent.point;
            nodeKNN.distance = distanceSquared(point, leafNode.parent.point);
      } else {
            nodeKNN = leafNode.point;
            nodeKNN.distance = distanceSquared(point, leafNode.point);
      }

      if (!listNodeKNN.includes(nodeKNN)) {
         listNodeKNN.push(nodeKNN);   
      }
      leafNode = leafNode.parent;
   }
   return listNodeKNN.sort((a,b) => { return a.distance - b.distance }).slice(0, k);
}

function searchLeaf(node, point) {
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
            if (distanceSquared(point, leaf.left) < distanceSquared(point, leaf.right)) {
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
