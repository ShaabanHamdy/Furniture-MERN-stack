
export const  paginate = (page,size)=>{
   
 
    if (!page || page<=0) {
        
      return  page = 1 
    }
    if (!size || size<=0) {
        
      return  size = 3 
    }
    const skip = (parseInt(page) - 1) * parseInt(size)

    return {skip,limit: parseInt(size)}
}