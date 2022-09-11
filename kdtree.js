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

function generate_dot (node) {}

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
