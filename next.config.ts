import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output:'standalone',
  experimental:{
    
  },
  devIndicators:{buildActivity:false}
  
};


export default nextConfig;
