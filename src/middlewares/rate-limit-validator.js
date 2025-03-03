/*
  En este middleware uso 'express-rate-limit' para limitar la cantidad
  de requests que pueden hacerse desde una misma IP en un lapso de tiempo.
*/

import rateLimit from "express-rate-limit";

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50, 
})

export default apiLimiter
