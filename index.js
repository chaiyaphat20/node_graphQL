function hasPermission(permissionsToCheck, userPermissions) {
  userPermissions.map(e=>{
    permissionsToCheck.map(i=>{
      if(e === i){
        return true
      }
    })  
  })
}

hasPermission(["view", "edit"],["login", "view", "edit" ,"delete"])
