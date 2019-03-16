
function mergeVertexNormal(geom) {
    console.log('Generating vertex normals...');
    geom.computeVertexNormals();
    var verticesMap = {}; // Hashmap for looking up vertices by position coordinates (and making sure they are unique)
    var unique = [], changes = [];
    
    var v, key;
    var precisionPoints = 5; // number of decimal points, e.g. 4 for epsilon of 0.0001
    var precision = Math.pow( 10, precisionPoints );
    var i, il, face;var vn =[];var vr=[];
    for(f in geom.faces){
        vn[geom.faces[f].a] = geom.faces[f].vertexNormals[0].clone();
        vn[geom.faces[f].b] = geom.faces[f].vertexNormals[1].clone();
        vn[geom.faces[f].c] = geom.faces[f].vertexNormals[2].clone();
    }
    console.log(vn);
    var indices, j, jl;
    
    for ( i = 0, il = geom.vertices.length; i < il; i ++ ) {
    
        v = geom.vertices[ i ];
        key = Math.round( v.x * precision ) + '_' + Math.round( v.y * precision ) + '_' + Math.round( v.z * precision );
    
        if ( verticesMap[ key ] === undefined ) {
           
            verticesMap[ key ] = i; 
            var vt = [i]
            unique.push( geom.vertices[ i ] );
            vr.push( vt );
            changes[ i ] = unique.length - 1;
    
        } else {
    
            //console.log('Duplicate vertex found. ', i, ' could be using '+verticesMap[key], vn[verticesMap[key]]);
            
            changes[ i ] = changes[ verticesMap[ key ] ];
            vr[changes[ verticesMap[ key ]]].push(i); //console.log(vn[i])
        }
    
    }
    console.log(vr);
    var nvecs = [];
    for(j in vr){ 
        var vsum = vn[vr[j][0]]; var un = [vn[vr[j][0]]];//console.log(0,vn[vr[j][0]])
        for(t=1;t<vr[j].length ;t++){ 
            var co = 0;//console.log(t,vn[vr[j][t]])
            for(d in un){ 
               // if(t != d){//console.log(vn[vr[j][t]],vn[vr[j][d]])
                    if(vn[vr[j][t]].equals(un[d])){
                        co++;//console.log('equal',co);
                //    }
                }
            }
            if(co == 0){ un.push(vn[vr[j][t]])
          vsum.addVectors(vsum,vn[vr[j][t]])
          //console.log('sum ',vsum,t )
            }//else{console.log(vsum,'omitted '+t,vn[vr[j][t]])}
        } 
        //console.log('final sum ',vsum.normalize(),nvecs);
        nvecs.push(vsum.normalize()); 
    }
    //console.log(nvecs);
    for ( i = 0, il = geom.faces.length; i < il; i ++ ) {
    
    face = geom.faces[ i ];
    var nvn = new THREE.Vector3();
    //console.log(face.vertexNormals[0],vn[changes[face.a]])
    
    
    //nvn.addVectors(face.vertexNormals[0],vn[changes[face.a]]);//nvn.normalize();
    geom.faces[i].vertexNormals[0] = nvecs[changes[face.a]].clone();//nvn.clone();
    vn[changes[face.a]] = nvecs[changes[face.a]].clone();
    //vn[face.a] = nvn;
    // console.log(nvn,face.normal,face.vertexNormals[0]);
    // console.log(face.vertexNormals[1],vn[changes[face.b]])
    //nvn.addVectors(face.vertexNormals[1],vn[changes[face.b]]);//nvn.normalize();
    geom.faces[i].vertexNormals[1] = nvecs[changes[face.b]].clone();//nvn.clone();
    vn[changes[face.b]] = nvecs[changes[face.b]].clone();
    //vn[face.b] = nvn;
    var nvn = new THREE.Vector3();
    // console.log(nvn,face.normal,face.vertexNormals[0]);
    // console.log(face.vertexNormals[2],vn[changes[face.c]])
    //nvn.addVectors(face.vertexNormals[2],vn[changes[face.c]]);//nvn.normalize();
    geom.faces[i].vertexNormals[2] =  nvecs[changes[face.c]].clone();//nvn.clone();
    vn[changes[face.c]] = nvecs[changes[face.c]].clone();
    //vn[face.c] = nvn;
    
    //console.log(nvn,face.normal,face.vertexNormals[0],vn[changes[face.b]]);
    var nvn = new THREE.Vector3();
    // face.a = changes[ face.a ];
    // face.b = changes[ face.b ];
    // face.c = changes[ face.c ];
    
    //indices = [ face.a, face.b, face.c ];
    
    }
    console.log('c ',geom,vn);
    return vn;
    }
    
function checkedges(a,b){
    if((a[0] == b[0] && a[1] == b[1]) || (a[0] == b[1] && a[1] == b[0])){
        return true;
    }else{ return false;}
}

function arr_diff (a1, a2) {
var a = [], diff = [];
for (var i = 0; i < a1.length; i++) {
  a[a1[i]] = true;
}
for (var i = 0; i < a2.length; i++) {
  if (a[a2[i]]) {
      delete a[a2[i]];
  } else {
      a[a2[i]] = true;
  }
}
for (var k in a) {
  diff.push(k);
}
return diff;
}

function getFacerelations(geom,edgefaces){
  var fi={};
  for(var f in geom.faces){ //console.log(geom.faces[f])
      
      var fa,fb,fc; console.log('gernerating face map...',Math.round(f/geom.faces.length*100),' %');
      if(edgefaces[geom.faces[f].a+'-'+geom.faces[f].b].faces[1] == f){
        fa = edgefaces[geom.faces[f].a+'-'+geom.faces[f].b].faces[0]}else{ fa = edgefaces[geom.faces[f].a+'-'+geom.faces[f].b].faces[1]};
      if(edgefaces[geom.faces[f].b+'-'+geom.faces[f].c].faces[1] == f){
        fb = edgefaces[geom.faces[f].b+'-'+geom.faces[f].c].faces[0]}else{ fb = edgefaces[geom.faces[f].b+'-'+geom.faces[f].c].faces[1]};
      if(edgefaces[geom.faces[f].c+'-'+geom.faces[f].a].faces[1] == f){
        fc = edgefaces[geom.faces[f].c+'-'+geom.faces[f].a].faces[0]}else{ fc = edgefaces[geom.faces[f].c+'-'+geom.faces[f].a].faces[1]};
//console.log(fa,fb,fc)
      if(fa === undefined){fa=-2;}
      if(fb === undefined){fb=-2;}
      if(fc === undefined){fc=-2;}
    //  console.log(fa,fb,fc)
      fi[f]={'cfaces' : [fa,fb,fc],'mface':f,'shelln':0,'flipped':false};// 
  } 
  console.log(fi)
  return fi; 
}

function getEdges(geom){     
  var edgefaces=[],edges=[];  
  for(f in geom.faces){
      edges.push([geom.faces[f].a,geom.faces[f].b]);
      edges.push([geom.faces[f].b,geom.faces[f].c]);
      edges.push([geom.faces[f].c,geom.faces[f].a]);
      
      var key1a = geom.faces[f].a+'-'+geom.faces[f].b;
      var key2a = geom.faces[f].b+'-'+geom.faces[f].a; 
      if(edgefaces[key1a] === undefined && edgefaces[key2a] === undefined){
      edgefaces[key1a]={'faces' :[f]};
      edgefaces[key2a]={'faces' :[f]};
      }else{
          edgefaces[key1a].faces.push(f);
          edgefaces[key2a].faces.push(f);
      }
      var key1b = geom.faces[f].b+'-'+geom.faces[f].c;
      var key2b = geom.faces[f].c+'-'+geom.faces[f].b;
      if(edgefaces[key1b] === undefined && edgefaces[key2b] === undefined){
      edgefaces[key1b]={'faces' :[f]};
      edgefaces[key2b]={'faces' :[f]};
      }else{
          edgefaces[key1b].faces.push(f);
          edgefaces[key2b].faces.push(f);
      }
      var key1c = geom.faces[f].c+'-'+geom.faces[f].a;
      var key2c = geom.faces[f].a+'-'+geom.faces[f].c;
      if(edgefaces[key1c] === undefined && edgefaces[key2c] === undefined){
      edgefaces[key1c]={'faces' :[f]};
      edgefaces[key2c]={'faces' :[f]};
      }else{
          edgefaces[key1c].faces.push(f);
          edgefaces[key2c].faces.push(f);
      }
   
  }
  console.log(edgefaces)
  var Edge = {'edgefaces':edgefaces,'edges':edges}
   return Edge;
}

function nonManifoldEdge(geom,edges,edgefaces){
console.log('Checking Bad edges...');

  edgeMap = {},uniq=[],nmedge=[];freeEdge = [];
  var freeEdges = [],nonmanifolds=[],connectObjects=[],closeContours =[];
var key;
 for(er in edges){
  freeEdge[er] = 0;
  key = edges[er][0]+'-'+edges[er][1];
  key2 = edges[er][1]+'-'+edges[er][0];
  if(edgeMap[key] === undefined && edgeMap[key2] === undefined){
     // console.log('unique ',edgeMap[key],edgeMap[key2]);
      edgeMap[key] = parseInt(er);
      edgeMap[key2] = parseInt(er);
      uniq.push(er)
  }else{
      nmedge.push(er);
      if(edgeMap[key] !== undefined){freeEdge[edgeMap[key]]++;freeEdge[er]++;}else{freeEdge[edgeMap[key2]]++;};
   //   console.log('duplicate ',edgeMap[key],edgeMap[key2])
  }
      //console.log(key,key2)
     var c=0;
 
   console.log('Analysing Edges '+Math.round(er/edges.length*100)+' % ...');
 }
 var contours = [],nmfolds=[],congeo=[];var badedges =0;fre=0;nm=0;cng=0;
 for(et in edges){
      if(freeEdge[et] == 0){
          var lineg = new THREE.Geometry();var linemat = new THREE.LineBasicMaterial({ color: 0xff0000 });
           lineg.vertices.push(geom.vertices[edges[et][0]],geom.vertices[edges[et][1]]);// console.log(lineg)
          badedges++;fre++;
           contours.push(edges[et]);// console.log(lineg)
           freeEdges.push(lineg);
          // var linem = new THREE.Line( lineg, linemat ); scene.add(linem);//console.log(linem)
      }
      if(freeEdge[et] == 2){
          var lineg = new THREE.Geometry();var linemat = new THREE.LineBasicMaterial({ color: 0xffcc00 });
           lineg.vertices.push(geom.vertices[edges[et][0]],geom.vertices[edges[et][1]]);// console.log(lineg)
           badedges++;nm++;
           nmfolds.push(edges[et]);
           nonmanifolds.push(lineg);
          // var linem = new THREE.Line( lineg, linemat ); scene.add(linem);//console.log(linem)
      }
      if(freeEdge[et] == 3){
          var lineg = new THREE.Geometry();var linemat = new THREE.LineBasicMaterial({ color: 0x00cc00 });
           lineg.vertices.push(geom.vertices[edges[et][0]],geom.vertices[edges[et][1]]);// console.log(lineg)
           badedges++;cng++;
           congeo.push(edges[et]);
           connectObjects.push(lineg)
          // var linem = new THREE.Line( lineg, linemat ); scene.add(linem);//console.log(linem)
      }
  }
  //console.log(contours);
  var contourMap = {};ce =[];
  if(contours.length != 0){
  for(be in contours){ ce[be]=0;
      if(contourMap[contours[be][0]] === undefined){
          contourMap[contours[be][0]] = [];
     contourMap[contours[be][0]].push(be); 
      }else{contourMap[contours[be][0]].push(be);}
      if(contourMap[contours[be][1]] === undefined){
          contourMap[contours[be][1]] = [];
          contourMap[contours[be][1]].push(be); 
      }else{contourMap[contours[be][1]].push(be);}
      //console.log(contourMap[contours[be][0]],contourMap[contours[be][1]]);
  }
  // for(g in contours){
  //     console.log(edgefaces[contours[g][0]+'-'+contours[g][1]])
  // }
  var closeCurves=[];
  var closeCurve=[];
  var closec = [];
  closec.push(contours[0][0]);closec.push(contours[0][1]);
  ce[0] = 1;
  var cn =0;
  do{var f=0;
      var ecp = contourMap[closec[closec.length-1]];
     
      if(ce[ecp[0]] == 0){
              if(contours[ecp[0]][0] == closec[closec.length-1]){
                  closec.push(contours[ecp[0]][1]);
              }else{closec.push(contours[ecp[0]][0]);}
              ce[ecp[0]] = 1;f++;
      }else if(ce[ecp[1]] == 0){
          if(contours[ecp[1]][0] == closec[closec.length-1]){
                  closec.push(contours[ecp[1]][1]);
              }else{closec.push(contours[ecp[1]][0]);}
              ce[ecp[1]] = 1;f++;
      }
      if(f==0 ){ //console.log('ce ',ce,ecp);
      
      var s=0;
      var a=0;
          while(s < ce.length-1 && a==0){
           a=0;
              if(ce[s] == 0){//console.log('edge breaks at ',s);
              closeCurves.push(closec);
              closec=[];
              closec.push(contours[s][0]);closec.push(contours[s][1]);ce[s] = 1; f++;
              a=1;
              }
              s++;
              //console.log(s)
          }
          if(a==0){ closeCurves.push(closec); console.log('curve breaks here')}
      }
     // console.log(ce);
      // closeCurve.push(contourMap[closec[closec.length-1]+'-1'][0]);
      // closeCurve
      
  }
  while(f > 0);
  var cc = 0;
  
  for(c in closeCurves){
      if(closeCurves[c][0] == closeCurves[c][closeCurves[c].length-1]){closeContours.push(closeCurves[c]); console.log('%c  contour found','color:red');cc++; //check Close contours        
      }
  }
}else{var cc=0,badedges=0,fre=0,nm=0,cng=0;closeCurves=[];}console.log(contours.length);
  badEdges = badedges;contrs=closeCurves.length;holes=fre;
  console.log(closeCurves,closeCurves.length+' Contours found');
  console.log('%c  '+ cc +' close contour found','color:red');
  console.log('%c  '+ badedges +' Bad Edges found','color:red');
  console.log(fre +'%c Naked Edges found','color:red');
  console.log(nm +'%c Non manifold Edges found','color:orange');
  console.log(cng +'%c connect geometry Edges found','color:blue');
  var edgedata ={'freeEdgeds':freeEdges,'nonmanifolds':nonmanifolds,'connectedObjects':connectObjects,
      'contours':contours,'closeCurve':closeCurves,'closeContours':closeContours
      }
      console.log(edgedata)
  return edgedata;
}

function repairContoursFill(clsc,geom,mgeom){
  console.log('Repairing contours.. (filling)',clsc);var fillgeom = new THREE.Geometry()
  for(c in clsc){
      var contour = clsc[c];console.log(contour,geom);
  if(contour.length > 3){
     let sf = Math.round(contour.length/4);
     let pn = 0;
  //geting three coplainer points points 
  let v1 = geom.vertices[contour[pn]],v2 = geom.vertices[contour[pn+sf]],v3 = geom.vertices[contour[pn+2*sf]];
  var plane = new THREE.Plane;
  plane.setFromCoplanarPoints(v1,v2,v3);
  var normal = plane.normal;
  //console.log(plane,normal)
  var xy = new THREE.Vector3(0,0,1);
  var quaternion = new THREE.Quaternion;
  var rquaternion = new THREE.Quaternion;
  quaternion.setFromUnitVectors(normal,xy);
  rquaternion.setFromUnitVectors(xy,normal);
  trquat = rquaternion.inverse();
  rquat = trquat.inverse();
  //console.log(quaternion);
  var sgeom = new THREE.Geometry();var o = new THREE.Vector3();
  var shapepoints =[];orignalpoints=[];
  for(p in contour){var v = new THREE.Vector3();var o = new THREE.Vector3();
      v.copy(geom.vertices[contour[p]]);// console.log(v);
      o.copy(geom.vertices[contour[p]]);// console.log(o);
       sgeom.vertices.push(v);
       orignalpoints.push(o);
      }
  //console.log(sgeom);
  var matrix = new THREE.Matrix4(); //console.log(matrix);// create one and reuse it
  var rmatrix = new THREE.Matrix4();// console.log(matrix);// create one and reuse it
      matrix.makeRotationFromQuaternion(quaternion);
     // rmatrix.getInverse(matrix);
      rmatrix.makeRotationFromQuaternion(rquat);
      sgeom.applyMatrix(matrix);//console.log(sgeom);
      for(vv in sgeom.vertices){var vx = new THREE.Vector3();
          vx.copy(sgeom.vertices[vv]); //console.log(geom.vertices);
          shapepoints.push(vx);
      }
      
       var shape = new THREE.Shape(shapepoints);shape.autoClose = true;
       var sg = new THREE.ShapeGeometry( shape );//console.log(shape)
       var sgo = new THREE.ShapeGeometry( shape );//console.log(sg)
       sg.applyMatrix(rmatrix);
       var tr = new THREE.Vector3();
       tr.subVectors(orignalpoints[0],sg.vertices[0]);
       var trmatrix = new THREE.Matrix4();trmatrix.makeTranslation(tr.x,tr.y,tr.z);
      //  var rtrmatrix = new THREE.Matrix4();
      //  rtrmatrix.getInverse(trmatrix);
          sg.applyMatrix(trmatrix);
     
      for(fc in sg.faces){var el = geom.faces.length;
          //console.log(contour[sg.faces[fc].a]);
          if(mgeom){console.log('Mgeom defined');// mgeom.faces.push(new THREE.Face3(contour[sg.faces[fc].a],contour[sg.faces[fc].b],contour[sg.faces[fc].c]));
          //var fv = fillgeom.vertices.length;console.log('Fill geom',fv);
          var mv = mgeom.vertices.length;//console.log('Fill geom',mv);
          // fillgeom.faces.push(new THREE.Face3(fv,fv+1,fv+2));
          // fillgeom.vertices.push(geom.vertices[contour[sg.faces[fc].a]],geom.vertices[contour[sg.faces[fc].b]],geom.vertices[contour[sg.faces[fc].c]]);
          let vm1 = geom.vertices[contour[sg.faces[fc].a]].clone();
          let vm2 = geom.vertices[contour[sg.faces[fc].b]].clone();
          let vm3 = geom.vertices[contour[sg.faces[fc].c]].clone();
          mgeom.faces.push(new THREE.Face3(mv,mv+1,mv+2));
          mgeom.vertices.push(vm1,vm2,vm3);
         
         // console.log('Fill geom',fillgeom);
      }else{  var gv = geom.vertices.length;
          //geom.faces.push(new THREE.Face3(contour[sg.faces[fc].a],contour[sg.faces[fc].b],contour[sg.faces[fc].c]));}
          geom.faces.push(new THREE.Face3(gv+2,gv+1,gv));geom.vertices.push(sg.vertices[sg.faces[fc].a],sg.vertices[sg.faces[fc].b],sg.vertices[sg.faces[fc].c]);}
      }console.log('Single shell repaired',geom)
       var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
      // var smo = new THREE.Mesh( sgo, material1 ) ;       scene.add( smo );
       //flipNormals(sg)
      // var sm = new THREE.Mesh( sg, material3 ) ;  scene.add( sm );


  //    var linemat = new THREE.LineBasicMaterial({ color: 0x0000ff	 });
  //     var linec = new THREE.Line( sgeom, linemat );scene.add( linec );
      
     // console.log('changed ',mgeom,geom);
  }
  }
if(mgeom){mgeom.mergeVertices();}else{geom.mergeVertices()} 
//    var data = {'geom':geom}
//    return data;
}

function decideRepair(geom,edgeface,clsc){console.log(edgeface)
  console.log('deciding....')
  var pint=[];
  var rpint=[];
  for(c in clsc){
      if(clsc[c].length == 4){return 'fill';}
      if(clsc[c].length > 2){
  pint=[],rpint=[];
      //console.log(clsc)
      var contour = clsc[c];//console.log(contour,geom)
     let sf = Math.round(contour.length/4);
     let pn = 0;
     var edgref = clsc[c][0]+'-'+clsc[c][1];
     var face;
     if(edgeface[edgref].faces[0]){ face = parseInt(edgeface[edgref].faces[0]);console.log(face)}else{face = edgeface[edgref].faces[1];}
     //console.log('fjhfgjh',face);
     var fnorm = geom.faces[face].normal.clone();
     var norm = fnorm.clone();
  //geting three coplainer points points 
  let v1 = geom.vertices[contour[pn]],v2 = geom.vertices[contour[pn+sf]],v3 = geom.vertices[contour[pn+2*sf]]; console.log(v1,v2,v3)
  var plane = new THREE.Plane;var mp = new THREE.Vector3();var ep = new THREE.Vector3();var ep2 = new THREE.Vector3();
  plane.setFromCoplanarPoints(v1,v2,v3);
  var normal = plane.normal.clone();
  fnorm.negate();//console.log('fnorm ',fnorm)
  var triangle = new THREE.Triangle(geom.vertices[geom.faces[face].a],geom.vertices[geom.faces[face].b],geom.vertices[geom.faces[face].c]); console.log(triangle)
      triangle.getMidpoint(mp);
      
      ep.addVectors(mp,fnorm.multiplyScalar(10000));
      ep2.addVectors(mp,norm.multiplyScalar(10000));
     
  var iline = new THREE.Line3(mp,ep);
  var iline2 = new THREE.Line3(mp,ep2); //console.log(iline,iline2)
      for(f in geom.faces){
         
          var triangle2 = new THREE.Triangle(geom.vertices[geom.faces[f].a],geom.vertices[geom.faces[f].b],geom.vertices[geom.faces[f].c]);//console.log(triangle2);
          var plane2 = new THREE.Plane();//
          var n2 = geom.faces[f].normal;
          triangle2.getPlane(plane2);
          if(plane2.intersectsLine(iline)){
          var pt = new THREE.Vector3();
          plane2.intersectLine(iline,pt); 
          if(triangle2.containsPoint(pt)){//console.log(pt)
            //  var res = compareNormals(norm,n2);
                 // if(res.x < 0.2 && res.y < 0.2 && res.z < 0.2){
              pint.push(pt); //console.log(pint,iline,triangle2)
                //  }                       
          } 
          }
          if(plane2.intersectsLine(iline2)){
          var pt = new THREE.Vector3();
          plane2.intersectLine(iline2,pt); 
          if(triangle2.containsPoint(pt)){//console.log(pt)
            //  var res = compareNormals(norm,n2);
                 // if(res.x < 0.2 && res.y < 0.2 && res.z < 0.2){
              rpint.push(pt); console.log(mp,rpint)
                //  }                       
          } 
          }
     
      }
  console.log(plane,normal);
  }
}if(pint.length % 2==0 && rpint % 2==0){return 'shell'}else{return 'fill';}
}

function repairContoursShell(clsc,geom,mgeom){
  console.log('Repairing shell... Shelling ');
  var vn = mergeVertexNormal(geom); console.log(vn);
  for(f in geom.faces){
      shellf = -0.8;
      var v1 = new THREE.Vector3();
      var v2 = new THREE.Vector3();
      var v3 = new THREE.Vector3();
       v1.copy(geom.vertices[geom.faces[f].a]);
       v2.copy(geom.vertices[geom.faces[f].b]);
       v3.copy(geom.vertices[geom.faces[f].c]);
      // var s1 = new THREE.Vector3();s1.x = geom.faces[f].vertexNormals[0].x*shellf;s1.y = geom.faces[f].vertexNormals[0].y*shellf;s1.z = geom.faces[f].vertexNormals[0].z*shellf;
      // var s2 = new THREE.Vector3();s2.x = geom.faces[f].vertexNormals[1].x*shellf;s2.y = geom.faces[f].vertexNormals[1].y*shellf;s2.z = geom.faces[f].vertexNormals[1].z*shellf;
      // var s3 = new THREE.Vector3();s3.x = geom.faces[f].vertexNormals[2].x*shellf;s3.y = geom.faces[f].vertexNormals[2].y*shellf;s3.z = geom.faces[f].vertexNormals[2].z*shellf;
      // console.log(s1,s2,s3);
      // v1.add(vn[geom.faces[f].a].multiplyScalar( shellf));
      // v2.add(vn[geom.faces[f].b].multiplyScalar( shellf));
      // v3.add(vn[geom.faces[f].c].multiplyScalar( shellf));
      v1.add(geom.faces[f].vertexNormals[0].multiplyScalar( shellf));
      v2.add(geom.faces[f].vertexNormals[1].multiplyScalar( shellf));
      v3.add(geom.faces[f].vertexNormals[2].multiplyScalar( shellf));
      
      //console.log(v1,v2,v3)
      var lastv = mgeom.vertices.length;
    mgeom.vertices.push(v1,v2,v3);
    mgeom.faces.push(new THREE.Face3(lastv+2,lastv+1,lastv));
      
  }
  console.log('creating')
  for(c in clsc){ 
      var gg = new THREE.Geometry();var inpoints=[];
      var ve = new THREE.Vector3();console.log('clsc c',clsc[c])
      ve.copy(geom.vertices[clsc[c][0]])
      var vnt = vn[clsc[c][0]].clone();
      ve.add(vnt.multiplyScalar( shellf)); console.log('f v ',ve)
      inpoints.push(ve); console.log(inpoints)
     for(p=0; p < clsc[c].length; p++){
          var cp = p + 1;
         var pop = geom.vertices[clsc[c][p]];
         var pip = inpoints[p]; console.log(p,inpoints)
         if(cp != clsc[c].length){
         var cop = geom.vertices[clsc[c][cp]]; console.log('cop ',cp,clsc[c].length);
         var ve = new THREE.Vector3();
         ve.copy(geom.vertices[clsc[c][cp]]);
         vnt = vn[clsc[c][cp]].clone();
         ve.add(vn[clsc[c][cp]].multiplyScalar( shellf));
         inpoints.push(ve) ;console.log('cip ',ve);
         cip = ve;}else{cop = geom.vertices[clsc[c][0]];
          var ve = new THREE.Vector3();
         ve.copy(geom.vertices[clsc[c][0]]);console.log('ve ',ve)
         ve.add(vn[clsc[c][0]]);
          cip = ve.clone(); 
          }
         var lastv = mgeom.vertices.length;
          mgeom.vertices.push(pop,pip,cop);
          mgeom.faces.push(new THREE.Face3(lastv,lastv+1,lastv+2));
          mgeom.vertices.push(pip,cip,cop);
          mgeom.faces.push(new THREE.Face3(lastv+3,lastv+4,lastv+5));
          console.log(pop,pip,cop,cip);
         

      }
      console.log('curve '+c+' comlete')
  }
  mgeom.mergeVertices();
  console.log(geom)
}

function checkShell(geom){
  console.log('checking shells..')
  var shells = [],shell=[];var p=0,c=0;

var fi ={};
for(f in geom.faces){
  var fa,fb,fc; //console.log(edgefaces[geom.faces[f].a+'-'+geom.faces[f].b].faces[0])
  if(edgefaces[geom.faces[f].a+'-'+geom.faces[f].b].faces[1] == f){
    fa = edgefaces[geom.faces[f].a+'-'+geom.faces[f].b].faces[0]}else{ fa = edgefaces[geom.faces[f].a+'-'+geom.faces[f].b].faces[1]};
  if(edgefaces[geom.faces[f].b+'-'+geom.faces[f].c].faces[1] == f){
    fb = edgefaces[geom.faces[f].b+'-'+geom.faces[f].c].faces[0]}else{ fb = edgefaces[geom.faces[f].b+'-'+geom.faces[f].c].faces[1]};
  if(edgefaces[geom.faces[f].c+'-'+geom.faces[f].a].faces[1] == f){
    fc = edgefaces[geom.faces[f].c+'-'+geom.faces[f].a].faces[0]}else{ fc = edgefaces[geom.faces[f].c+'-'+geom.faces[f].a].faces[1]};
  //console.log(fa,fb,fc)
  
  fi[f]={'cfaces' : [fa,fb,fc],'mface':f,'shelln':0};// 
}
console.log(fi);
function getShell(){
 // console.log(fi);
var link =[],temp=[],j=0;
for(fc in geom.faces){//console.log(fi[fc].shelln);
if(fi[fc].shelln == 0){
    if(j == 0){link.push(fi[fc].mface);}
      if(link.indexOf(fc) != -1 || link.indexOf(fi[fc].cfaces[0]) != -1 || link.indexOf(fi[fc].cfaces[1]) != -1 || link.indexOf(fi[fc].cfaces[2]) != -1 ){//console.log('true');
          if(link.indexOf(fc) == -1 ){link.push(fc);}
          for(m=0;m<3;m++){
              if(link.indexOf(fi[fc].cfaces[m]) == -1){link.push(fi[fc].cfaces[m]);}
          }


          if(temp.indexOf(fc) != -1 || temp.indexOf(fi[fc].cfaces[0]) != -1 || temp.indexOf(fi[fc].cfaces[1]) != -1 || temp.indexOf(fi[fc].cfaces[2]) != -1 ){
              if(temp.indexOf(fc) != -1 ){
                  if(link.indexOf(fc) == -1 ){link.push(fc);}
                  temp.splice(temp.indexOf(fc),1)}
                  for(i=0;i<3;i++){
                      if(temp.indexOf(fi[fc].cfaces[i]) != -1){
                          if(link.indexOf(fi[fc].cfaces[i]) == -1){link.push(fi[fc].cfaces[i]);} temp.splice(temp.indexOf(fi[fc].cfaces[i]),1)}
                          for(k=0;k<3;k++){ let tf = fi[fc].cfaces[i];
                              if(link.indexOf(fi[tf].cfaces[k]) == -1){link.push(fi[tf].cfaces[k]);} if(temp.indexOf(fi[tf].cfaces[k]) != -1 ){temp.splice(temp.indexOf(fi[tf].cfaces[k]),1);}
                          }
                  
                      
                  }                
              }
             

      }else{//console.log('ssss');
          if(temp.indexOf(fc) == -1 ){temp.push(fc);}
          for(i=0;i<3;i++){
          if(temp.indexOf(fi[fc].cfaces[i]) == -1){temp.push(fi[fc].cfaces[i]);}
          }
          
      }
      j++;
  }
}
console.log(link,temp) 
console.log(' p ',p);
if(p>0){ var ff=0; console.log(p)// if more than 1 face links found
for(pp=0;pp<shells.length;pp++){ console.log(' pp ',pp)  //for all previous links
  for(t in link){    // for all the links in this pass
       if(shells[pp].indexOf(link[t]) != -1){ff++;console.log('found ',link[t])}  //if this value of found in any previous links
   }

   if(ff>0){  //if common faces found in any previous links
       
          for(f in link){             
           if(shells[pp].indexOf(link[f]) == -1){shells[pp].push(link[f]);fi[link[f]].shelln = 1;}
           }         console.log(p,pp,shells)
       shells.splice(p,1);p--; 
      
   }else{temp = link}
   console.log(shells) 
   }
}
//c++;
if(temp.length != 0){
  shells.push(link);p++;
   for(l in link){fi[link[l]].shelln = 1;}
  getShell();
}else{
   if(p==0 && shells.length == 0){
   shells.push(link)
   }
  }
}
getShell();
console.log(shells);
console.log(shells.length+' shells found')
}

function getShells(geom,edgefaces){
      console.log('Checking for Shells...',edgefaces);


      var link =[];shells=[];
      var fi ={},nl=[];
  for(var f in geom.faces){ //console.log(geom.faces[f])
      
      var fa,fb,fc; console.log('gernerating face map...',Math.round(f/geom.faces.length*100),' %');
      if(edgefaces[geom.faces[f].a+'-'+geom.faces[f].b].faces[1] == f){
        fa = edgefaces[geom.faces[f].a+'-'+geom.faces[f].b].faces[0]}else{ fa = edgefaces[geom.faces[f].a+'-'+geom.faces[f].b].faces[1]};
      if(edgefaces[geom.faces[f].b+'-'+geom.faces[f].c].faces[1] == f){
        fb = edgefaces[geom.faces[f].b+'-'+geom.faces[f].c].faces[0]}else{ fb = edgefaces[geom.faces[f].b+'-'+geom.faces[f].c].faces[1]};
      if(edgefaces[geom.faces[f].c+'-'+geom.faces[f].a].faces[1] == f){
        fc = edgefaces[geom.faces[f].c+'-'+geom.faces[f].a].faces[0]}else{ fc = edgefaces[geom.faces[f].c+'-'+geom.faces[f].a].faces[1]};
//console.log(fa,fb,fc)
      if(fa === undefined){fa=-2;}
      if(fb === undefined){fb=-2;}
      if(fc === undefined){fc=-2;}
    //  console.log(fa,fb,fc)
      fi[f]={'cfaces' : [fa,fb,fc],'mface':f,'shelln':0,'flipped':false};// 
  }
  //console.log(fi);
  link.push(fi[0].mface)
  for(i=0;i<3;i++){
  if(fi[0].cfaces[i] != -2){link.push(fi[0].cfaces[i]);//if( checkFaces(fi[0].mface,fi[0].cfaces[i]) ){fi[fi[0].cfaces[i]].flipped=true;} 
}
  
  }
  fi[0].shelln=1;//console.log(link);
  for(i=0;i<3;i++){if(fi[0].cfaces[i] != -2){fi[fi[0].cfaces[i]].shelln=1;}}//
  var tfaces = [];
  if(fi[0].cfaces[0] != -2){tfaces.push(fi[0].cfaces[0]);}
  if(fi[0].cfaces[1] != -2){tfaces.push(fi[0].cfaces[1]);}
  if(fi[0].cfaces[2] != -2){tfaces.push(fi[0].cfaces[2]);}
  //console.log(link,tfaces)
  function findLinks(){ var c=0;
      nl = [];
    for(e in tfaces){     
       
           
        if(tfaces[e] != -2){
      for(i=0;i<3;i++){ 
        fi[tfaces[e]].shelln = 1;
       if(link.indexOf(fi[tfaces[e]].cfaces[i]) == -1 && fi[tfaces[e]].cfaces[i] != -2){link.push(fi[tfaces[e]].cfaces[i]);nl.push(fi[tfaces[e]].cfaces[i]);c++; fi[fi[tfaces[e]].cfaces[i]].shelln=1;}
        //  if(fi[tfaces[e]].flipped == false){if(checkFaces(tfaces[e],fi[tfaces[e]].cfaces[i])){fi[tfaces[e]].cfaces[i].flipped = true;}} 
        }     
         }else{console.log('defined')} 
    }//console.log(link);
    tfaces = nl;  
    //console.log(nl,c);
    if(c != 0){findLinks();//}else{shells.push(link)}
      }else{ let ch=0,nf;
        for(fc in fi){if(fi[fc].shelln == 0){ch++;if(ch==1){nf=fc;}}} 
          if(ch > 0){ //console.log('push',ch)
              shells.push(link); 
              link=[];
               if(nf != -2){link.push(fi[nf].mface);fi[nf].shelln=1;
                  if(fi[nf].cfaces[0] != -2){link.push(fi[nf].cfaces[0]);}
                  if(fi[nf].cfaces[1] != -2){link.push(fi[nf].cfaces[1]);}
                  if(fi[nf].cfaces[2] != -2){link.push(fi[nf].cfaces[2]);}
                  }
               for(i=0;i<3;i++){if(fi[nf].cfaces[i] != -2){fi[fi[nf].cfaces[i]].shelln=1;}} 
               tfaces=[];
               for(i=0;i<3;i++){ if(fi[nf].cfaces[i] != -2){ tfaces.push(fi[nf].cfaces[i]);} }// = [fi[nf].cfaces[0],fi[nf].cfaces[1],fi[nf].cfaces[2]];
  
             //console.log('send back',fi)
             findLinks();
              }else{shells.push(link)}
          
    }
  }
  findLinks();
  nshells = shells.length;
  console.log(fi)
  console.log(shells,shells.length+' Shells found')
  return shells;
  }

function shellToGeoms(shells,geom){
  console.log('creating seperate geometries...')
  var geoms =[];var sverts=[];
  for(s in shells){var g = new THREE.Geometry();var svert=[];
      for(f in shells[s]){ //console.log(f); 
          var f1 = parseInt(f);           
          g.faces.push(new THREE.Face3(f1*3,f1*3+1,f1*3+2));
          g.vertices.push(geom.vertices[geom.faces[shells[s][f1]].a].clone(),
                          geom.vertices[geom.faces[shells[s][f1]].b].clone(),
                          geom.vertices[geom.faces[shells[s][f1]].c].clone()); 
                          svert.push(geom.faces[shells[s][f1]].a,geom.faces[shells[s][f1]].b,geom.faces[shells[s][f1]].c);
                          //
      }//g.mergeVertices();
      geoms.push(g);sverts.push(svert);//console.log(g,f1,sverts)
  }
//  console.log(geoms); 
  // for(gg in geoms){
  //     var tms = new THREE.Mesh(geoms[gg],materials[33+ parseInt(gg)]);tms.position.x = 2*wl*(gg)+wl;tms.material.side = THREE.DoubleSide; scene.add(tms);
  // }
  var data = {'geometries':geoms,'vertexReference':sverts}
  return data;
}

function deleteShell(geom,dshell){
  for(d in dshell){
      dface = dshell[d];
     console.log('deleting..'+dface); 
    
  //    geom.vertices.splice(geom.faces[dface].a,1); 
  //    geom.vertices.splice(geom.faces[dface].b,1); 
  //    geom.vertices.splice(geom.faces[dface].c,1); 
    
    geom.faces.splice(dface,1);
  }console.log(geom);
  return geom;
}

function checkNoisyShell(geom,contour){
console.log('Checking for noisy shell...',contour);
// ///////////Neglegible size shell////////////////////////
var box = geom.boundingBox;var size = box.min.distanceTo(box.max);// box.min.distanceTo(box.max);
if(size < 4){console.log('noisy shell with very small volume '+size); return true;}else{console.log('Volume is enough'+size)}

/////////////Same plane shell //////////////////////////////
  for(c in contour){ var cfaces = 0;console.log(contour[c])
      let pn = 0,sf = Math.round(contour[c].length/4);
      let v1 = geom.vertices[contour[c][pn]],v2 = geom.vertices[contour[c][pn+sf]],v3 = geom.vertices[contour[c][pn+2*sf]]; console.log(v1,v2,v3)
      var plane = new THREE.Plane();var rplane = new THREE.Plane;var mp = new THREE.Vector3();var ep = new THREE.Vector3();var ep2 = new THREE.Vector3();
      plane.setFromCoplanarPoints(v1,v2,v3);
     rplane.setFromCoplanarPoints(v3,v2,v1);
      console.log(plane,rplane)
      var normal = plane.normal.clone();
      var pfaces=0;
      for(f in geom.faces){ let face = geom.faces[f],vert = geom.vertices; console.log(plane.distanceToPoint(vert[face.a]),plane.distanceToPoint(vert[face.b]),plane.distanceToPoint(vert[face.b]))
          if(plane.distanceToPoint(vert[face.a]) >= -0.05 && plane.distanceToPoint(vert[face.a]) < 0.05 && plane.distanceToPoint(vert[face.b]) >= -0.05 && plane.distanceToPoint(vert[face.b]) < 0.05 && plane.distanceToPoint(vert[face.c]) >= -0.05 && plane.distanceToPoint(vert[face.c]) < 0.05){
            
              pfaces++; console.log('%c Same plane face!'+f,'background-color:lightblue');
          }else{console.log('%c face is okay!'+f,'background-color:green');}
      }
      if(pfaces == geom.faces.length ){return true;}else{ return false;}
  }

// 
//if(contour.length <= 1){   
  for(c in contour){ var cfaces = 0;console.log(contour[c])
      for(f in geom.faces){ let face = geom.faces[f],vert = geom.vertices; console.log(vert[face.b])
          if(contour[c].indexOf(face.a) != -1 && contour[c].indexOf(face.b) != -1 && contour[c].indexOf(face.c) != -1){
             cfaces++; console.log('%c Noisy face found!','background-color:blue');
          }else{console.log('%c face is okay!','background-color:green');}
      }
  }
//}
if(cfaces == geom.faces.length ){return true;}else{ return false;}
}
function checkSmallNoisyShells(geom){
  var box = geom.boundingBox;var size = box.min.distanceTo(box.max);// box.min.distanceTo(box.max);
if(size < 4){console.log('noisy shell with very small volume '+size); return true;}else{console.log('Volume is enough'+size);return false;}
}

function checkInvertedNormal(geom){
  var an =0,iv=0;
  console.log('Checking for Inverted Normals...');
  
  var chf = Math.round(geom.faces.length/4);
  for(fn = 0;fn < geom.faces.length;fn+=chf){
      var pint=[]; // console.log(fn)
      var norm = geom.faces[fn].normal;var mp = new THREE.Vector3();var ep = new THREE.Vector3();
      var triangle = new THREE.Triangle(geom.vertices[geom.faces[fn].a],geom.vertices[geom.faces[fn].b],geom.vertices[geom.faces[fn].c]);
      triangle.getMidpoint(mp);
      tnm = norm.clone()
      ep.addVectors(mp,tnm.multiplyScalar(10000));
      var iline = new THREE.Line3(mp,ep);
      // lineg = new THREE.Geometry();lineg.vertices.push(mp,ep);
      // var linemat = new THREE.LineBasicMaterial({ color: 0xff0000 });
      //   var linem = new THREE.Line( lineg, linemat ); scene.add(linem);
      for(f in geom.faces){
          if(f != fn){
          var triangle2 = new THREE.Triangle(geom.vertices[geom.faces[f].a],geom.vertices[geom.faces[f].b],geom.vertices[geom.faces[f].c]);//console.log(triangle2);
          var plane = new THREE.Plane();
          var n2 = geom.faces[f].normal;
          triangle2.getPlane(plane);
          if(plane.intersectsLine(iline)){
          var pt = new THREE.Vector3();
           plane.intersectLine(iline,pt);
          if(triangle2.containsPoint(pt)){
            //  var res = compareNormals(norm,n2);
                 // if(res.x < 0.2 && res.y < 0.2 && res.z < 0.2){
          if(pint.length >0){
          for(p in pint){
              if(!(pint[p].equals(pt))){
                  pint.push(pt); //console.log(pt,f,fn,triangle2,iline)
                    }
              }
           }else{ pint.push(pt)//console.log(pt,f,fn,triangle2,iline)
                  }
          }

          }
      }
      }//console.log(pint,triangle,triangle2,norm,n2)
     
      console.log(pint);
      if(pint.length % 2 != 0){
         console.log(pint.length % 2);
          an++;
        
     }else{iv++;}
  }
  //invertedNorms =0;
  if(an > 1){
      console.log('Inverted normals found!');
      return true;  
  }else{console.log('Normals are okay');return false;}
}
function flipNormals(geometry){
  console.log('fliping Normals..');
  for ( var i = 0; i < geometry.faces.length; i ++ ) {

var face = geometry.faces[ i ];
var temp = face.a;
face.a = face.c;
face.c = temp;

}

geometry.computeFaceNormals();
geometry.computeVertexNormals();

var faceVertexUvs = geometry.faceVertexUvs[ 0 ];
// for ( var i = 0; i < faceVertexUvs.length; i ++ ) {

// var temp = faceVertexUvs[ i ][ 0 ];
// faceVertexUvs[ i ][ 0 ] = faceVertexUvs[ i ][ 2 ];
// faceVertexUvs[ i ][ 2 ] = temp;

// }
console.log('flipped')
}

function checkFlippedNormals(shells,geom,edgefaces){
  console.log('Checking Flipped normals ...');
  var inverted =[];var fi={};
  function checkFaces(f1,f2){
      var invrt=0;
      if(geom.faces[f1].a == geom.faces[f2].b && geom.faces[f1].b == geom.faces[f2].c){
          if(inverted.indexOf(f2) == -1){invrt++;inverted.push(f2);}
      }//else if(geom.faces[f].a == geom.faces[fa].c && geom.faces[f].b == geom.faces[fa].b){console.log('opp')}
      if(geom.faces[f1].a == geom.faces[f2].c && geom.faces[f1].b == geom.faces[f2].a){//console.log('same a');
      if(inverted.indexOf(f2) == -1){invrt++;inverted.push(f2);}
      }//else if(geom.faces[f].a == geom.faces[fa].a && geom.faces[f].b == geom.faces[fa].c){console.log('opp')}
      if(geom.faces[f1].a == geom.faces[f2].a && geom.faces[f1].b == geom.faces[f2].b){//console.log('same a');
      if(inverted.indexOf(f2) == -1){invrt++;inverted.push(f2);}
      }
      if(geom.faces[f1].b == geom.faces[f2].b && geom.faces[f1].c == geom.faces[f2].c){//console.log('same b');
      if(inverted.indexOf(f2) == -1){invrt++;inverted.push(f2);}
      }//else if(geom.faces[f].a == geom.faces[fa].c && geom.faces[f].b == geom.faces[fa].b){console.log('opp')}
      if(geom.faces[f1].b == geom.faces[f2].c && geom.faces[f1].c == geom.faces[f2].a){//console.log('same b');
      if(inverted.indexOf(f2) == -1){invrt++;inverted.push(f2);}
      }//else if(geom.faces[f].a == geom.faces[fa].a && geom.faces[f].b == geom.faces[fa].c){console.log('opp')}
      if(geom.faces[f1].b == geom.faces[f2].a && geom.faces[f1].c == geom.faces[f2].b){//console.log('same b');
      if(inverted.indexOf(f2) == -1){invrt++;inverted.push(f2);}
      }
      if(geom.faces[f1].c == geom.faces[f2].b && geom.faces[f1].a == geom.faces[f2].c){//console.log('same c');
      if(inverted.indexOf(f2) == -1){invrt++;inverted.push(f2);}
      }//else if(geom.faces[f].a == geom.faces[fa].c && geom.faces[f].b == geom.faces[fa].b){console.log('opp')}
      if(geom.faces[f1].c == geom.faces[f2].c && geom.faces[f1].a == geom.faces[f2].a){//console.log('same c');
      if(inverted.indexOf(f2) == -1){invrt++;inverted.push(f2);}
      }//else if(geom.faces[f].a == geom.faces[fa].a && geom.faces[f].b == geom.faces[fa].c){console.log('opp')}
      if(geom.faces[f1].c == geom.faces[f2].a && geom.faces[f1].a == geom.faces[f2].b){//console.log('same c');
      if(inverted.indexOf(f2) == -1){invrt++;inverted.push(f2);}
      }
  if(invrt > 0){return true;}else{return false;}
  }
  for(f in geom.faces){ //console.log(f)
  var fa,fb,fc; //console.log(edgefaces[geom.faces[f].a+'-'+geom.faces[f].b].faces[0])
  if(edgefaces[geom.faces[f].a+'-'+geom.faces[f].b].faces[1] == f){
    fa = edgefaces[geom.faces[f].a+'-'+geom.faces[f].b].faces[0];}else{ fa = edgefaces[geom.faces[f].a+'-'+geom.faces[f].b].faces[1];};
  if(edgefaces[geom.faces[f].b+'-'+geom.faces[f].c].faces[1] == f){
    fb = edgefaces[geom.faces[f].b+'-'+geom.faces[f].c].faces[0]}else{ fb = edgefaces[geom.faces[f].b+'-'+geom.faces[f].c].faces[1]};
  if(edgefaces[geom.faces[f].c+'-'+geom.faces[f].a].faces[1] == f){
    fc = edgefaces[geom.faces[f].c+'-'+geom.faces[f].a].faces[0]}else{ fc = edgefaces[geom.faces[f].c+'-'+geom.faces[f].a].faces[1]};


  // if(fa === undefined){console.log('fa ',fa);fa=-2;}
  // if(fb === undefined){console.log('fb ',fb);fb=-2;}
  // if(fc === undefined){console.log('fc ',fc);fc=-2;}
 
  fi[f]={'cfaces' : [fa,fb,fc],'mface':f,'shelln':0,'flipped':false}; 
}
//console.log(fi);
for(s in shells){var shell = shells[s];//console.log(shell,shells)
  

//----------------------------------------
var link =[];
var y = shell[0];//console.log(fi[y].mface);
link.push(fi[y].mface)
for(i=0;i<3;i++){
  if(fi[y].cfaces[i] != -2){link.push(fi[y].cfaces[i]);}//if( checkFaces(fi[0].mface,fi[0].cfaces[i]) ){fi[fi[0].cfaces[i]].flipped=true;} 
}

fi[y].shelln=1;//console.log(fi[y]);
  
  var tfaces = [];
for(i=0;i<3;i++){if(fi[y].cfaces[i] != -2){fi[fi[y].cfaces[i]].shelln=1;tfaces.push(fi[y].cfaces[i]);}//
}
  // if(fi[0].cfaces[1] != -2){tfaces.push(fi[0].cfaces[1]);}
  // if(fi[0].cfaces[2] != -2){tfaces.push(fi[0].cfaces[2]);}
 // console.log(tfaces)
  function findLinks(){ var c=0;
      nl = [];
    for(e in tfaces){     
       
           
  if(tfaces[e] != -2){
      for(i=0;i<3;i++){ 
        fi[tfaces[e]].shelln = 1;
       if(link.indexOf(fi[tfaces[e]].cfaces[i]) == -1 && fi[tfaces[e]].cfaces[i] != -2){link.push(fi[tfaces[e]].cfaces[i]);nl.push(fi[tfaces[e]].cfaces[i]);c++; fi[fi[tfaces[e]].cfaces[i]].shelln=1;}
      // console.log(fi[tfaces[e]].flipped)
       if(fi[tfaces[e]].flipped == false){if(checkFaces(tfaces[e],fi[tfaces[e]].cfaces[i])){fi[fi[tfaces[e]].cfaces[i]].flipped = true;}
         }else{console.log('defined');if( !(checkFaces(tfaces[e],fi[tfaces[e]].cfaces[i])) ){fi[fi[tfaces[e]].cfaces[i]].flipped = true;}}
         // console.log(fi[fi[tfaces[e]].cfaces[i]].flipped);
        }     
      }
    }//console.log(link,fi);
    tfaces = nl;  
    //console.log(nl,c);
    if(c != 0){findLinks();//}else{shells.push(link)}
      }
  }
  findLinks();
  //nshells = shells.length;
  //console.log(fi)
  //console.log(shells,inverted.length+' Shells found')
 //return shells
//---------------------------------------------
//console.log(fi);
}
inverted=[];
for(f in geom.faces){
  if(fi[f].flipped){inverted.push(f)}
}
if(inverted.length > 0){flippedn= inverted.length}else{flippedn = 0;} ;
return inverted;

}
function fixFlipped(faces,geom){
  console.log('Fixing normals...');
  for ( var i = 0; i < faces.length; i ++ ) {

var face = geom.faces[ faces[i] ];console.log(face,i,faces[i])
var temp = face.a;
face.a = face.c;
face.c = temp;

}
}

function stichTriangles(precision,vert,tri,edg,geom){
  //console.log('stiching triangles...')
  var lines=[];trits=[],delface=0;pr = precision;
  for(f in geom.faces){trits.push(f);}
  var t1 = geom.vertices[geom.faces[tri].a];
  var t2 = geom.vertices[geom.faces[tri].b];
  var t3 = geom.vertices[geom.faces[tri].c]; //
  var e1  = geom.vertices[edg[0]],e2 = geom.vertices[edg[1]]; //console.log(e1,e2);console.log('triangle ',t1,t2,t3,tri);
 // lines.push(new THREE.Line3(t1,t2), new THREE.Line3(t2,t3),new THREE.Line3(t3,t1));
 if(geom.faces[tri].a != edg[0] && geom.faces[tri].a != edg[1]){opf = t1;}
 if(geom.faces[tri].b != edg[0] && geom.faces[tri].b != edg[1]){opf = t2;}
 if(geom.faces[tri].c != edg[0] && geom.faces[tri].c != edg[1]){opf = t3;}
 lines.push(new THREE.Line3(e1,e2));
for(i in lines){ //console.log('line '+i,lines[i]);
  var divline =[lines[i].start];var tdist = Math.round(10000*lines[i].start.distanceTo(lines[i].end))/10000;
  var sortdist=[];var pd ={};var opf; 
//  for(t in trits){ //console.log('trd ',trits[t],tri,opf);
for(v in vert){
   //   if(trits[t] != tri && trits[t] != fi[tri].cfaces[0] && trits[t] != fi[tri].cfaces[1] && trits[t] != fi[tri].cfaces[2]){
       if(vert[v] != t1 && vert[v] != t2 && vert[v] != t3 ){
        //console.log(vert[v]);
          // var v1 = geom.vertices[geom.faces[trits[t]].a];
          // var v2 = geom.vertices[geom.faces[trits[t]].b];
          // var v3 = geom.vertices[geom.faces[trits[t]].c];
          var v1 = vert[v]
          var cv1 = new THREE.Vector3();
          // var cv2 = new THREE.Vector3();
          // var cv3 = new THREE.Vector3();
          lines[i].closestPointToPoint(v1,false,cv1);
          // lines[i].closestPointToPoint(v2,false,cv2);
          // lines[i].closestPointToPoint(v3,false,cv3);
          
          var dist1 = Math.round(10000*cv1.distanceTo(v1))/10000; 
          var ld1 = Math.round(10000*lines[i].start.distanceTo(cv1))/10000;
        //  console.log(ld1,dist1) 
           var lde1 = Math.round(10000*lines[i].end.distanceTo(cv1))/10000; 
        
          if(dist1 < pr){
              if(ld1 < tdist && lde1 < tdist && ld1 != 0 && ld1 != tdist){ pd[ld1] = v1;sortdist.push(ld1);}
             }
          
      }
}
//console.log('ddd',divline);


sortdist.sort(function(a, b){return a - b});
//console.log(sortdist);
if(sortdist.length > 0){
  for(sd in sortdist){var rp=0;
      for(dv in divline){if(pd[sortdist[sd]].equals(divline[dv])){rp++;}}
      if(rp == 0){divline.push(pd[sortdist[sd]]);}
  }
  divline.push(lines[i].end);
 // console.log(lines[i].end,sortdist,pd,divline);
  
  for(d=0;d<divline.length-1;d++){
      //geom.faces[tri] = 
     // delface.push(tri);
    // console.log(divline[d],opf,divline[d+1]);
      lastv = geom.vertices.length;
      var tngl = new THREE.Triangle(divline[d],opf,divline[d+1]);var area = tngl.getArea();//console.log('area ',area);
     // if(area < 0.001){alert('zero area triangle')}else{
      geom.vertices.push(divline[d],opf,divline[d+1]);
      geom.faces.push(new THREE.Face3(lastv+2,lastv+1,lastv));
      delface++;
     // }
  }

}
}




//ghhghg.push(frte);
if(delface > 0){return true;}else{return false}
}


function compareNormals(nor1,nor2){
  nor1.normalize();
  nor2.normalize();
  var tnor = nor1.clone();
  //console.log(nor1,nor2)
  tnor.add(nor2);
  return new THREE.Vector3(Math.abs(tnor.x),Math.abs(tnor.y),Math.abs(tnor.z));
}

function mergeVerticesz(geom,p) {

var verticesMap = {}; // Hashmap for looking up vertices by position coordinates (and making sure they are unique)
var unique = [], changes = [];

var v, key;
var precisionPoints = p; // number of decimal points, e.g. 4 for epsilon of 0.0001
var precision = Math.pow( 10, precisionPoints );
var i, il, face;
var indices, j, jl;

for ( i = 0, il = geom.vertices.length; i < il; i ++ ) {

  v = geom.vertices[ i ];
  key = Math.round( v.x * precision ) + '_' + Math.round( v.y * precision ) + '_' + Math.round( v.z * precision );

  if ( verticesMap[ key ] === undefined ) {

      verticesMap[ key ] = i;
      unique.push( geom.vertices[ i ] );
      changes[ i ] = unique.length - 1;

  } else {

      //console.log('Duplicate vertex found. ', i, ' could be using ', verticesMap[key]);
      changes[ i ] = changes[ verticesMap[ key ] ];

  }

}


// if faces are completely degenerate after merging vertices, we
// have to remove them from the geometry.
var faceIndicesToRemove = [];

for ( i = 0, il = geom.faces.length; i < il; i ++ ) {

  face = geom.faces[ i ];

  face.a = changes[ face.a ];
  face.b = changes[ face.b ];
  face.c = changes[ face.c ];

  indices = [ face.a, face.b, face.c ];

  // if any duplicate vertices are found in a Face3
  // we have to remove the face as nothing can be saved
  for ( var n = 0; n < 3; n ++ ) {

      if ( indices[ n ] === indices[ ( n + 1 ) % 3 ] ) {

          faceIndicesToRemove.push( i );
          break;

      }

  }

}

for ( i = faceIndicesToRemove.length - 1; i >= 0; i -- ) {

  var idx = faceIndicesToRemove[ i ];

  geom.faces.splice( idx, 1 );

  for ( j = 0, jl = geom.faceVertexUvs.length; j < jl; j ++ ) {

      geom.faceVertexUvs[ j ].splice( idx, 1 );

  }

}

// Use unique set of vertices

var diff = geom.vertices.length - unique.length;
geom.vertices = unique;
return diff;

}
function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
      vars[key] = value;
  });
  return vars;
}