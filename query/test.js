 db.articles.find( { "writer": "Velopert" } ).pretty();

 db.articles.find( { writer: {$regex:"Velo"} } ).pretty();

 db.karforuinfos.find( { "driveInfo": { $elemMatch: { "route.waypoint": {$regex:"강원"} }  } });

 db.karforuinfos.find( {$and: [{ "driveInfo": { $elemMatch: { route.waypoint: {$regex:req.params.waypoint} }  } },{ "driveInfo": { $elemMatch: { route.destination: {$regex:req.params.waypoint} }  } }] };


 db.karforuinfos.find( {$or: [{ "driveInfo": { $elemMatch: { "route.waypoint": {$regex:"개봉"} }  } },{ "driveInfo": { $elemMatch: { "route.destination": {$regex:"개봉"} }  } }] });
