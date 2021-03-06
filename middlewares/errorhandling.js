function errorHandling(err,req,res,next){
  console.log(',.,.,.',err);
  
    if (err.name == 'SequelizeValidationError') {
        const errors = err.errors.map(el => {
          return {
            message: el.message
          };
        });
        return res.status(400).json({
          errors
        });
      } else if (err.name == 'SequelizeUniqueConstraintError') {
        const errors = err.errors.map(el => {
          return {
            message: el.message
          };
        });
        return res.status(400).json({
          errors
        });
      } else if (err.name == 'SequelizeForeignKeyConstraintError') {    
        return res.status(403).json({
          message: "Delete on table violates foreign key constraint "
        });
      }else if (err.name == 'error_manual') {
        return res.status(400).json({
          message:err.message
        })
      }else if (err.name == 'SequelizeDatabaseError'){
        return res.status(500).json({message:'Internal Server error'});
      } else {
        console.log("error",err);
        
        return res.status(500).json({message:'Internal Server error'});
      }
}
module.exports=errorHandling